<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="120" style="margin-left: 3%">
        <el-menu
            default-active="accountSecurityView"
            router
            :default-openeds="['4']"
            @select="handleSelect"
        >
          <el-menu-item index="personalCenterView">
            <span>个人中心</span>
          </el-menu-item>
          <el-sub-menu index="2">
            <template #title>
              <span>订单中心</span>
            </template>
            <el-menu-item index="busOrderView">车票订单</el-menu-item>
            <el-menu-item index="candidateOrderView">候补订单</el-menu-item>
          </el-sub-menu>
          <el-menu-item index="personalTicketView">
            <span>本人车票</span>
          </el-menu-item>
          <el-sub-menu index="4">
            <template #title>
              <span>个人信息</span>
            </template>
            <el-menu-item index="personalInformationView">查看信息</el-menu-item>
            <el-menu-item index="accountSecurityView">账号安全</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="5">
            <template #title>
              <span>投诉与建议</span>
            </template>
            <el-menu-item index="5-1">投诉</el-menu-item>
            <el-menu-item index="5-2">建议</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="6">
            <template #title>
              <span>客户服务</span>
            </template>
            <el-menu-item index="customerService">人工客服</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <el-main>
        <el-card shadow="never" style="width: 82%; margin: auto;">
          <template #header>
            密码修改
          </template>
          <el-form
              ref="ruleFormRef"
              :model="modification"
              :rules="rules"
              style="width: 62%; margin: auto;"
              label-width="80px"
          >
            <el-form-item label="原密码" prop="oldPassword">
              <el-input type="password" v-model="modification.oldPassword" clearable style="width: 200px;"/>
              <el-text>&nbsp;请输入原始密码</el-text>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
              <el-input type="password" v-model="modification.newPassword" clearable style="width: 200px;"/>
              <el-text>&nbsp;6-20字母、数字或下划线</el-text>
            </el-form-item>
            <el-form-item label="密码确认" prop="checkPassword">
              <el-input type="password" v-model="modification.checkPassword" clearable style="width: 200px;"/>
              <el-text>&nbsp;请再次输入密码</el-text>
            </el-form-item>
            <el-form-item label="验证码" prop="code">
              <el-input v-model="modification.code" clearable placeholder="请填写手机验证码" style="width: 200px;"/>&nbsp;&nbsp;
              <el-button
                  @click="getPhoneCode"
                  :disabled="disabled"
                  type="primary"
              >
                {{codeButtonText}}
                <b v-if="time !== 60000">（{{moment(time).format("ss")}}）</b>
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-button @click="cancel">取消</el-button>
              <el-button @click="submit(ruleFormRef)" type="primary">确认</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import {useStore} from "vuex";
import {onMounted, onUnmounted, reactive, ref} from "vue";
import axios from "axios";
import moment from "moment";
import router from "@/router";
import {ElMessage, FormInstance, FormRules} from "element-plus";
const store = useStore()
const disabled = ref(false)
const ruleFormRef = ref<FormInstance>()
const codeButtonText = ref('获取手机验证码')
const time = ref(60000)
let timer = null as any
const modification = reactive({
  oldPassword: '',
  newPassword: '',
  checkPassword: '',
  code: '',
})
const getPhoneCode = () => {
  disabled.value = true
  codeButtonText.value = '重新发送'
  axios.get('http://localhost:8081/user/phoneCode',{
    params:{
      account: store.state.account
    }
  }).then((res)=>{
    if(res.data == 1){
      ElMessage({
        message: "验证码已发送！",
        type: "success"
      })
      timer = setInterval(() => {
        time.value -= 1000
        console.log(moment(time.value).format("mm:ss"))
        if(time.value <= 0){
          clearInterval(timer)
          time.value = 60000
          disabled.value = false
        }
      },1000)
    }else{
      ElMessage({
        message: "验证码发送失败，请重试！",
        type: "error"
      })
    }
  })

}
const cancel = () => {
  router.push('/accountSecurityView')
}
const submit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      axios.get('http://localhost:8081/user/checkCodeAndUpdateUser',{
        params:{
          code: modification.code,
          data: JSON.stringify({account: store.state.account, password: modification.newPassword})
        }
      }).then((res)=>{
        if(res.data == 1){
          ElMessage({
            message: "密码修改成功！",
            type: "success"
          })
          clearInterval(timer)
          router.push('/accountSecurityView')
        }else if(res.data == 0){
          ElMessage({
            message: "修改失败，请重试！",
            type: "error"
          })
        }else if(res.data == -1){
          ElMessage({
            message: "验证码错误，请重试！",
            type: "error"
          })
        }else{
          ElMessage({
            message: "验证码过期，请重新获取验证码",
            type: "error"
          })
        }
      })
    } else {
      console.log('提交失败!')
      return false
    }
  })
}
const validateOldPassword = (rule: any, value: any, callback: any) => {
  if(value == ''){
    callback()
  }else{
    axios.get('http://localhost:8081/user/checkPass',{
      params:{
        account: store.state.account,
        password: modification.oldPassword
      }
    }).then((res)=>{
      // console.log('pass ',res.data)
      if(!res.data){
        console.log('密码错误')
        callback(new Error('密码错误！'))
      }else{
        callback()
      }
    })
  }
}
const validateCheckPass = (rule:any, value: any, callback: any) => {
  let regex = /^\w{6,20}$/
  if(!regex.test(value)){
    callback(new Error('6-20字母、数字或下划线'))
  }else if(value != modification.newPassword){
    callback(new Error('两次密码不相同！'))
  }
  callback()
}
const rules = reactive<FormRules>({
  oldPassword:[
    { required: true, message: '请输入原始密码', trigger: 'change'},
    { validator: validateOldPassword, trigger: 'blur'}

  ],
  newPassword:[
    { required: true, message: '请输入新密码', trigger: 'change'},
    { len: 6, pattern: /^\w{6,20}$/, message: '6-20字母、数字或下划线', trigger: 'blur'}
  ],
  checkPassword:[
    { required: true, message: '请确认密码', trigger: 'change'},
    { validator: validateCheckPass, trigger: 'change'}
  ],
  code:[
    { required: true, message: '请输入验证码', trigger: 'change'}
  ]
})
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key)
  // router.push(store.state.route[key])
}
onUnmounted(()=>{
  clearInterval(timer)
})
</script>

<style scoped>

</style>

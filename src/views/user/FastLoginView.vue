<template>
  <div class="common-layout">
    <el-container>
      <el-main>
        <el-card shadow="never" style="width: 45%; margin: auto;">
          <template #header>
            快捷登录
          </template>
          <el-form
              ref="ruleFormRef"
              :model="modification"
              :rules="rules"
              style="width: 62%; margin: auto;"
              label-width="80px"
          >
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="modification.phone" placeholder="请输入手机号" clearable style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="验证码" prop="code">
              <el-input v-model="modification.code" clearable placeholder="请填写手机验证码" style="width: 200px;"/>&nbsp;&nbsp;
              <el-button
                  @click="getPhoneCode"
                  :disabled="modification.isClick"
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
  phone: '',
  code: '',
  isClick: true
})
const getPhoneCode = () => {
  modification.isClick = true
  codeButtonText.value = '重新发送'
  axios.get('http://localhost:8081/user/newPhoneCode',{
    params:{
      phone: modification.phone
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
          modification.isClick = false
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
  router.push('/login')
}
const submit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      axios.get('http://localhost:8081/user/loginPhoneCodeCheck',{
        params:{
          code: modification.code,
          phone: modification.phone
        }
      }).then((res)=>{
        if(res.data == 1){
          ElMessage({
            message: "验证成功！",
            type: "success"
          })
          clearInterval(timer)
          login()
        }else if(res.data == 0){
          ElMessage({
            message: "验证失败，请重试！",
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
const login = () => {
  axios.get('http://localhost:8081/login/login',{
    params:{
      account: modification.phone,
    }
  }).then((res)=>{
    // console.log(res.data)
    if(res.data != null){
      ElMessage({
        showClose: true,
        message: '登录成功!',
        type: 'success',
      })
      store.commit('changeAccount',res.data.account)
      store.commit('changeUsername',res.data.username)
      store.commit('changeLogin',res.data.username)
      store.commit('changeRegister','退出')
      router.push('/')
    }else{
      ElMessage({
        showClose: true,
        message: '登录失败，请重试！',
        type: 'error',
      })
    }
  })
}
const validateCheckPhone = (rule:any, value: any, callback: any) => {
  let regex = /^1[3-9]\d{9}$/
  if(!regex.test(value)){
    callback(new Error('手机号码格式错误'))
  }else {
    axios.get('http://localhost:8081/login/checkPhoneTrue',{
      params:{
        phone: modification.phone
      }
    }).then((res)=>{
      console.log(res.data)
      if(!res.data){
        console.log('该手机号未注册')
        callback(new Error('该手机号未注册！'))
      }else{
        modification.isClick = false
        callback()
      }
    })
  }
}
const rules = reactive<FormRules>({
  phone:[
    { required: true, message: '请输入手机号', trigger: 'change'},
    { validator: validateCheckPhone, trigger: 'change'}
  ],
  code:[
    { required: true, message: '请输入验证码', trigger: 'change'},
    { len: 4, pattern: /^\d{4}$/, message: '验证码格式错误', trigger: 'blur'}
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

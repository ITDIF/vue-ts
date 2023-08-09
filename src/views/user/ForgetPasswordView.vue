<template>
  <el-card shadow="never" style="width: 82%; margin: auto;">
    <template #header>
      忘记密码
    </template>
    <el-form
        ref="ruleFormRef"
        :model="modification"
        :rules="rules"
        style="width: 62%; margin: auto;"
        label-width="80px"
    >
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="modification.phone" clearable style="width: 200px;"/>
        <el-text>&nbsp;请输入绑定的手机号</el-text>
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
  newPassword: '',
  checkPassword: '',
  phone: '',
  code: '',
})
const getPhoneCode = () => {
  disabled.value = true
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
  window.history.back()
}
const submit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      axios.get('http://localhost:8081/user/checkCodeAndUpdateUserByPhone',{
        params:{
          code: modification.code,
          data: JSON.stringify({password: modification.newPassword, phone_number: modification.phone})
        }
      }).then((res)=>{
        if(res.data == 1){
          ElMessage({
            message: "密码修改成功！",
            type: "success"
          })
          clearInterval(timer)
          // router.push('/accountSecurityView')
          router.go(-1)
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
const validateCheckPass = (rule:any, value: any, callback: any) => {
  let regex = /^\w{6,20}$/
  if(!regex.test(value)){
    callback(new Error('6-20字母、数字或下划线'))
  }else if(value != modification.newPassword){
    callback(new Error('两次密码不相同！'))
  }
  callback()
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
        callback()
      }
    })
  }
}
const rules = reactive<FormRules>({
  newPassword:[
    { required: true, message: '请输入新密码', trigger: 'change'},
    { len: 6, pattern: /^\w{6,20}$/, message: '6-20字母、数字或下划线', trigger: 'blur'}
  ],
  checkPassword:[
    { required: true, message: '请确认密码', trigger: 'change'},
    { validator: validateCheckPass, trigger: 'change'}
  ],
  phone:[
    { required: true, message: '请输入手机号', trigger: 'change'},
    { validator: validateCheckPhone, trigger: 'change'}
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

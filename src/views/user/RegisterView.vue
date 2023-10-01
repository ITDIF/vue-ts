<template>
  <div>
    <el-container>
      <el-header height="20px">账户信息</el-header>
      <el-main style="width: 40%;margin: auto">
        <el-form
            ref="ruleFormRef"
            :model="ruleForm"
            :rules="rules"
            label-width="120px"
            class="demo-ruleForm"
            status-icon
        >
          <el-form-item label="用 户 名：" prop="account">
            <el-input v-model="ruleForm.account" clearable placeholder="用户名设置成功后不可更改"/>
          </el-form-item>
          <el-form-item label="登录密码：" prop="password">
            <el-input v-model="ruleForm.password" type="password" show-password clearable placeholder="6-20字母、数字或下划线" />
          </el-form-item>
          <el-form-item label="确认密码：" prop="checkPass">
            <el-input v-model="ruleForm.checkPass" type="password" clearable placeholder="再次输入您的密码" />
          </el-form-item>
          <el-form-item label="证件类型：" prop="id_type">
            <el-select v-model="ruleForm.id_type">
              <el-option label="中国居民身份证" value="中国居民身份证"/>
              <el-option label="港澳台居民居住证" value="港澳台居民居住证" />
            </el-select>
          </el-form-item>
          <el-form-item label="姓 名：" prop="username">
            <el-input v-model="ruleForm.username" clearable placeholder="请输入证件上的中文姓名"/>
          </el-form-item>
          <el-form-item label="证件号码：" prop="id_number">
            <el-input v-model="ruleForm.id_number" clearable placeholder="请输入证件号码"/>
          </el-form-item>
          <el-form-item label="邮 箱：" prop="email">
            <el-input v-model="ruleForm.email" clearable placeholder="请正确填写邮箱"/>
          </el-form-item>
          <el-form-item label="手机号码：" prop="phone_number">
            <el-input v-model="ruleForm.phone_number" clearable placeholder="手机号码"/>
          </el-form-item>
          <el-form-item>
            <el-button @click="cancel">取消</el-button>
            <el-button type="primary" @click="submitForm(ruleFormRef)">
              注册
            </el-button>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import axios from "axios";
import {useRouter} from 'vue-router'

import {ElMessage} from "element-plus";

const router = useRouter()
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
  account: '',
  password:'',
  checkPass:'',
  id_type:'中国居民身份证',
  username:'',
  id_number:'',
  email:'',
  phone_number:'',
})
const validateAccount = (rule: any, value: any, callback: any) => {
  let regex = /^[A-Za-z][A_Za-z\d]{5,20}$/
  if(!regex.test(value)){
    callback(new Error('6-20位字母或数字,字母开头'))
  }else{
    axios.get('http://localhost:8081/register/queryAccount',{
      params:{
        account: ruleForm.account
      }
    }).then((res)=>{
      console.log(res.data)
      if(res.data){
        console.log('该用户已存在')
        callback(new Error('该用户已存在！'))
      }else{
        callback()
      }
    })
  }
}
const validatePass = (rule:any, value: any, callback: any) => {
  let regex = /^\w{6,20}$/
  if(!regex.test(value)){
    callback(new Error('6-20字母、数字或下划线'))
  }else {
    if(ruleForm.checkPass != ''){
      if(!ruleFormRef.value) return
      ruleFormRef.value.validateField('checkPass',() => null)
    }
    callback()
  }
}
const validateCheckPass = (rule:any, value: any, callback: any) => {
  let regex = /^\w{6,20}$/
  if(!regex.test(value)){
    callback(new Error('6-20字母、数字或下划线'))
  }else if(value != ruleForm.password){
    callback(new Error('两次密码不相同！'))
  }
  callback()
}
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      let data = JSON.stringify(ruleForm)
      axios.get('http://localhost:8081/register/addUser',{
        params:{
          data: data
        }
      }).then((res)=>{
        console.log(res.data)
        if(res.data==1){
          ElMessage({
            message: "注册成功！",
            type: "success"
          })
          router.push('/');
        }else{
          ElMessage.error("注册失败！")
        }
      })
    } else {
      console.log('提交失败!')
      return false
    }
  })
}
const cancel = () => {
  window.history.back()
}
const rules = reactive<FormRules>({
  account: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { validator: validateAccount, trigger: 'change'},
  ],
  password:[
    { required: true, message: '请输入密码', trigger: 'blur'},
    { validator: validatePass, trigger: 'change'},
  ],
  checkPass:[
    { required: true, message: '请确认密码', trigger: 'blur'},
    { validator: validateCheckPass, trigger: 'change'},
  ],
  username:[
    { required: true, message: '请输入姓名', trigger: 'blur'},
  ],
  id_number:[
    { required: true, message: '请输入证件号码', trigger: 'blur'},
    { min:18, max:18, message: '证件号码格式错误！', trigger: 'blur'}
  ],
  phone_number:[
    { required: true, message: '请输入手机号码', trigger: 'blur'},
    { len: 11, pattern: /^1[3-9]\d{9}$/, message: '手机号码格式错误', trigger: 'blur'}
  ]
})


</script>

<style scoped>

</style>

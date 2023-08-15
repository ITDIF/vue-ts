<template>
<div id="app">
  <div class="w">
    <div class="logo">
<!--               <a href="">网 上 购 票 系 统</a>-->
    </div>
  </div>
  <div class="content">
    <div class="login-box">
      <el-card shadow="never" style="width: 80%;padding-bottom: 20px">
        <h1>登 录 <el-text><a style="cursor: pointer;" @click="router.push('/fastLogin')">验证码登录</a></el-text></h1>
        <el-form>
          <el-form-item>
            <el-input v-model="form.account" size="large" clearable placeholder="用户名/手机号" :prefix-icon="User"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="form.password" type="password" show-password clearable size="large" placeholder="密码" :prefix-icon="Lock"></el-input>
          </el-form-item>
          <el-form-item style="margin-top: 25px">
            <el-button type="primary" size="large" @click="onSubmit" round style="width: 90%;margin: 0 auto">登录</el-button>
          </el-form-item>
        </el-form>

        <a style="float: left;cursor: pointer;" @click="register">立即注册</a>
        <a style="float: right;cursor: pointer;" @click="router.push('/forgetPassword')">忘记密码</a>
      </el-card>

    </div>
  </div>
</div>
</template>

<script lang="ts" setup>
import { ref,reactive,getCurrentInstance } from 'vue'
import axios from 'axios'
import {useRouter} from 'vue-router'
import { User,Lock } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import {useStore} from "vuex";
const form = reactive({
  account: '',
  password: '',
  error: ''
})
const store = useStore()
const router = useRouter()
//登录
const onSubmit = () => {
  console.log('submit!')
  if(form.account == '' || form.password == '') {
    ElMessage({
      showClose: true,
      message: '账户不能为空!',
      type: 'warning',
    })
    return
  }

  axios.get('http://localhost:8081/login/loginCheck',{
    params:{
      account: form.account,
      password: form.password
    }
  }).then((res)=>{
    // console.log(res.data)
    if(res.data.code == 1){
      ElMessage({
        showClose: true,
        message: '登录成功!',
        type: 'success',
      })
      store.commit('changeAccount',res.data.account)
      store.commit('changeUsername',res.data.username)
      store.commit('changeLogin',res.data.username)
      store.commit('changeRegister','退出')
      window.history.back()
    }else if(res.data.code == -1){
      ElMessage({
        showClose: true,
        message: '密码错误！',
        type: 'error',
      })
    }else{
      ElMessage({
        showClose: true,
        message: '账户不存在！',
        type: 'error',
      })
    }
  })
}
const register = () => {
  router.push('/register')
}
</script>

<style scoped>
#app{
  width: 40%;
  margin: 0 auto;
  /*border: 1px solid #d2d3d2;*/
  /*border-radius: 4px;*/
  /*padding: 0 4em 4em 4em;*/
}
.login-box a{
  text-decoration: none;
  color: #6c6c6c;
}
.login-box a:hover{
  color: red;
}
</style>

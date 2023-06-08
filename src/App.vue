<template>
  <nav>
    <router-link to="/personalCenterView">PersonalCenter</router-link> |
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/user">User</router-link> |
    <router-link to="/t2">t222</router-link> |
    <router-link to="/test">test</router-link> |
    <router-link to="/register">Register</router-link> |
    <router-link to="/candidate">candidate</router-link> |
  </nav>
  <el-container>
    <el-header style="background-color: #F8F8F8;width: 90%;height: 40px;line-height: 40px;margin: auto">
      <div style="float: right;margin-right: 20px">
        <el-link :underline="false" @click="onLogin">{{ store.state.login }}</el-link> |
        <el-link :underline="false" @click="onRegister">{{ store.state.register }}</el-link>
      </div>
    </el-header>
  </el-container>

  <router-view/>

</template>
<script lang="ts" setup>
import {useRoute, useRouter} from "vue-router";
import {ref, reactive, onMounted} from 'vue'
import {useStore} from "vuex";
import {setup} from "vue-class-component";
import { ElMessage, ElMessageBox } from 'element-plus'

let account = null

const route = useRoute()
const router = useRouter()
const store = useStore()
const onLogin = () => {
  if(store.state.login == '登录'){
    router.push('/login')
  }else{
    router.push('/personalCenterView')
  }
}
const onRegister = () => {
  if(store.state.register == '注册') {
    router.push('/register')
  }else{
    ElMessageBox.confirm(
        '是否退出账户',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
    ).then(() => {
          store.commit('changeLogin','登录')
          store.commit('changeAccount','000')
          store.commit('changeUsername','000')
          store.commit('changeRegister','注册')
          ElMessage({
            type: 'success',
            message: '成功退出',
          })
        }).catch(() => {
          ElMessage({
            type: 'info',
            message: '操作取消',
          })
        })
  }
}

</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>

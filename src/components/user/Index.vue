<template>
  <el-container style="margin: 15px 0;">
    <el-header style="background-color: #F8F8F8;width: 90%;height: 40px;line-height: 40px;margin: auto">
      <el-row
          justify="end"
      >
        <el-col :span="6" :pull="7">
          <el-input style="width: 300px;" placeholder="搜索">
            <template #append>
              <el-button>
                <el-icon><Search /></el-icon>
              </el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-link :underline="false" @click="onLogin">{{ store.state.login }}</el-link> |
          <el-link :underline="false" @click="onRegister">{{ store.state.register }}</el-link>
        </el-col>
      </el-row>
    </el-header>
  </el-container>
  <el-menu
      mode="horizontal"
      router
      background-color="#3B99FC"
      text-color="#FFF"
      active-text-color="#FFD04B"
      style="margin-bottom: 10px; padding-left: 200px"
  >
    <el-menu-item></el-menu-item>
    <el-menu-item index="/">首页</el-menu-item>
    <el-sub-menu index="2">
      <template #title>订单中心</template>
      <el-menu-item index="busOrderView">车票订单</el-menu-item>
      <el-menu-item index="candidateOrderView">候补订单</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="personalTicketView">车票</el-menu-item>
    <el-menu-item>团购服务</el-menu-item>
    <el-menu-item>包车服务</el-menu-item>
    <el-menu-item>客户服务</el-menu-item>
  </el-menu>
  <router-view/>
</template>

<script lang="ts" setup>

import {ElMessage, ElMessageBox} from "element-plus";
import {useRoute, useRouter} from "vue-router/dist/vue-router";
import {useStore} from "vuex";
const route = useRoute()
const router = useRouter()
const store = useStore()

const onLogin = () => {
  if(store.state.login === '登录'){
    router.push('/login')
  }else{
    router.push('/personalCenterView')
  }
}
const onRegister = () => {
  if(store.state.register === '注册') {
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
      router.push('/')
    }).catch(() => {
      ElMessage({
        type: 'info',
        message: '操作取消',
      })
    })
  }
}
</script>

<style scoped>

</style>

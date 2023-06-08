<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="120" style="margin-left: 3%">
        <el-menu
            default-active="personalTicketView"
            router
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
        </el-menu>
      </el-aside>
      <el-main>
        <el-text size="large" tag="b">{{store.state.username}}</el-text>
        {{user.gender}}，{{user.dt}}好！
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import {useStore} from "vuex";
import {onMounted, reactive, ref} from "vue";
import axios from "axios";
import moment from "moment";
import router from "@/router";

const store = useStore()
const user = reactive({
  gender: '先生',
  dt: moment().format('a')
})
onMounted(()=>{
  axios.get('http://localhost:8081/login/gender',{
    params:{
      account: store.state.account
    }
  }).then((res)=>{
    if(res.data == 0){
      user.gender = '女士'
    }
  })
})
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key)
  // router.push(store.state.route[key])
}
</script>

<style scoped>

</style>

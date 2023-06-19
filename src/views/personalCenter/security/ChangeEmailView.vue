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
        </el-menu>
      </el-aside>
      <el-main>
        <el-card shadow="never" style="width: 90%;">
          <el-row style="margin: auto;">
            <el-col :span="4" style="margin: auto">
              <el-text size="large" tag="b"><el-icon size="large" color="#3b99fc"><Lock /></el-icon> 登录密码</el-text>
            </el-col>
            <el-col :span="16" style="margin: auto"><el-text>建议您定期更改密码以保护账户安全</el-text></el-col>
            <el-col :span="4" style="margin: auto"><el-button @click="dialogVisible=true">修改</el-button></el-col>
          </el-row>
          <el-divider/>
          <el-row style="margin: auto;">
            <el-col :span="4" style="margin: auto">
              <el-text size="large" tag="b"><el-icon size="large" color="#3b99fc"><Iphone /></el-icon> 手机核验</el-text>
            </el-col>
            <el-col :span="16" style="margin: auto"><el-text>使用手机接收相关服务信息</el-text></el-col>
            <el-col :span="4" style="margin: auto"><el-button>修改</el-button></el-col>
          </el-row>
          <el-divider/>
          <el-row style="margin: auto;">
            <el-col :span="4" style="margin: auto">
              <el-text size="large" tag="b"><el-icon size="large" color="#3b99fc"><Message /></el-icon> 安全邮箱</el-text>
            </el-col>
            <el-col :span="16" style="margin: auto"><el-text>使用邮箱接收相关服务信息</el-text></el-col>
            <el-col :span="4" style="margin: auto"><el-button>修改</el-button></el-col>
          </el-row>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import {useStore} from "vuex";
import {onMounted, reactive, ref} from "vue";
import axios from "axios";
import moment from "moment";
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

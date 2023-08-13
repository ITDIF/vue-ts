<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="120" style="margin-left: 3%">
        <el-menu
            default-active="myCharteredBusView"
            router
            :default-openeds="['5']"
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
              <span>团购服务</span>
            </template>
            <el-menu-item index="charteredBusView">包车服务</el-menu-item>
            <el-menu-item index="myCharteredBusView">我的</el-menu-item>
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
        <el-breadcrumb separator="/" style="margin-bottom: 10px">
          <el-breadcrumb-item><b>团购服务</b></el-breadcrumb-item>
          <el-breadcrumb-item>我的</el-breadcrumb-item>
        </el-breadcrumb>
        <el-empty v-if="myCharteredBus.data.length === 0" description="您还没有包车哦～" />
        <div v-for="e in myCharteredBus.data">
          <el-row>
            <el-col :span="8">
              <el-text>{{e.start_time}} 至 {{e.end_time}}（{{moment(e.end_time).diff(moment(e.start_time),'days')+1}}天）</el-text>
            </el-col>
          </el-row>
          <el-card style="margin-bottom: 20px">
            <el-row>
              <el-col :span="4">
                <el-text>车辆编号：</el-text>{{e.car_number}}
              </el-col>
              <el-col :span="2">{{e.car_type}}</el-col>
              <el-col :span="2">{{e.seat_type}}</el-col>
              <el-col :span="2">核载{{e.passenger_capacity}}人</el-col>
              <el-col :span="2">{{e.cost}}元</el-col>
              <el-col :span="10">
                <el-text>用途：</el-text>{{e.notes}}
              </el-col>
              <el-col :span="2">
                <el-popconfirm title="确定要删除吗？" @confirm="del(e.car_number)">
                  <template #reference>
                    <el-button type="danger">删除</el-button>
                  </template>
                </el-popconfirm>
              </el-col>
            </el-row>
          </el-card>
        </div>

      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import {useStore} from "vuex";
import {onBeforeMount, onMounted, reactive, ref} from "vue";
import axios from "axios";
import moment from "moment";
import router from "@/router";
import {ElMessage, ElNotification} from "element-plus";

const store = useStore()
const myCharteredBus = reactive({
  data: [] as any
})
onMounted(()=>{
  if(!loginCheck()) return
  myCharteredBusInit()
})
const myCharteredBusInit = () => {
  axios.get('http://localhost:8081/car/queryCharteredBusInfo',{
    params:{
      account: store.state.account
    }
  }).then((res)=>{
    console.log(res.data)
    myCharteredBus.data = res.data
  })
}

const del = (carNumber: string) => {
  axios.get('http://localhost:8081/car/delCharteredBus',{
    params:{
      carNumber: carNumber
    }
  }).then((res)=>{
    if(res.data == 1){
      ElNotification({
        title: '删除成功',
        type: 'success',
      })
      myCharteredBusInit()
    }else{
      ElNotification({
        title: '删除失败',
        message: '请重新尝试',
        type: 'error',
      })
    }
  })
}

const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key)
  // router.push(store.state.route[key])
}
const loginCheck = () => {
  if(store.state.account == '000'){
    ElMessage({
      message: '请先登录！',
      type: 'warning',
    })
    router.push('/login')
    return false
  }
  return true
}
</script>

<style scoped>
.el-main{
  padding-top: 2px;
}
</style>

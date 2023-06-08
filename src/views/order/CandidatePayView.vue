<template>
  <div class="common-layout">
    <el-container>
      <!--      <el-header>Header</el-header>-->
      <el-main style="width: 90%; margin: auto">
        <el-card class="card-header">
          <el-text><el-icon size="large" color="blue"><Lock /></el-icon>请支付预付款， 支付剩余时间：
            <b style="color: red">{{moment(countdown.time).format("mm")}}</b> 分
            <b style="color: red">{{moment(countdown.time).format("ss")}}</b> 秒
          </el-text>
        </el-card>
        <el-card>
          <template #header>
            <el-text class="card-header">订单信息</el-text>
          </template>
          <div class="card-header">
            <el-text><b>{{carInfo.date}}</b>（{{carInfo.week}}）</el-text>
            <el-text><b>{{routeInfo.route_number}}</b>次</el-text>
            <el-text><b>{{routeInfo.from_station}}</b>（<b>{{routeInfo.departure_time}}</b>开）</el-text>
            <el-text>——</el-text>
            <el-text><b>{{routeInfo.to_station}}</b></el-text>
          </div>
        </el-card>
        <el-card style="margin-bottom: 20px">
          <el-table
              border
              :data="orderInfo.user"
              :header-cell-style="{textAlign: 'center'}"
              :cell-style="{ textAlign: 'center' }"
          >
            <el-table-column type="index" label="序号"/>
            <el-table-column prop="username" label="姓名"/>
            <el-table-column prop="id_type" label="证件类型"/>
            <el-table-column prop="id_number" label="证件号码"/>
            <el-table-column prop="phone_number" label="电话号码"/>
            <el-table-column prop="seat" label="席别"/>
            <el-table-column prop="price" label="票价(元)"/>
          </el-table>
        </el-card>
        <el-button
            type="info"
            style="width: 100px;margin-right: 40px"
            @click="dialogVisible = true"
        >取消订单</el-button>
        <el-button
            type="warning"
            style="width: 100px"
            @click="onlinePayment"
        >网上支付</el-button>
      </el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </div>
  <el-dialog
      v-model="dialogVisible"
      title="取消订单"
      width="30%"
      center
      align-center
  >
    <span>确定取消订单吗？</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false; cancelOrder()">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {onBeforeMount, onMounted, onUnmounted, reactive, ref} from "vue";
import type { FormInstance, FormRules } from 'element-plus'
import {useRoute, useRouter} from "vue-router";
import moment from "moment";
import axios from "axios";
import {ElMessage, ElMessageBox} from "element-plus";
const route = useRoute()
const router = useRouter()
const formRef = ref<FormInstance>()
const routeInfo = JSON.parse(route.query.routeInfo as string)
const account = route.query.account
const orderId = route.query.orderId
const carInfo = JSON.parse(route.query.carInfo as string)
let orderTime = ""
const dialogVisible = ref(false)


const orderInfo = reactive({
  user: [] as any
})

let timer = null as any
const countdown = reactive({
  time: 600000
})
onBeforeMount(()=>{
  timer = setInterval(() => {
    countdown.time -= 1000
    console.log(moment(countdown.time).format("mm:ss"))
    if(countdown.time <= 0){
      countdown.time = 0
      clearInterval(timer)
      window.history.back()
    }
  },1000)
})
onMounted(() => {
  axios.get('http://localhost:8081/login/login',{
    params:{
      account: account
    }
  }).then((res)=>{
    console.log(res.data)
    res.data.seat = routeInfo.seat_type
    res.data.price = routeInfo.price+'元'
    orderInfo.user.push(res.data)
  })
  axios.get('http://localhost:8081/order/queryOrderTimeByOrderNumber',{
    params:{
      order_number: orderId
    }
  }).then((res)=>{
    orderTime = res.data
    countdown.time -= moment().diff(moment(res.data))
    console.log('orderTimeDiffs',moment().diff(moment(res.data)))
  })
})

onUnmounted(()=>{
  clearInterval(timer)
})

const cancelOrder = () => {
  console.log('取消订单！')
  axios.get('http://localhost:8081/order/deleteOrderTemporaryAndCandidate',{
    params:{
      order_number: orderId
    }
  }).then((res)=>{
    console.log(res.data)
    if(res.data == '1'){
      ElMessage({
        showClose: true,
        message: '订单成功取消！',
        type: 'success',
      })
      window.history.back()
    }else{
      ElMessage({
        showClose: true,
        message: '订单取消失败，请重新尝试！',
        type: 'error',
      })
    }
  })
}
//支付
const onlinePayment = () => {
  console.log('网上支付！')
  axios.get('http://localhost:8081/order/candidateSuccess',{
    params:{
      order_number: orderId
    }
  }).then((res)=>{
    console.log(res.data)
    if(res.data == '1'){
      ElMessage({
        showClose: true,
        message: '支付成功！',
        type: 'success',
      })
      window.history.back()
    }else{
      ElMessage({
        showClose: true,
        message: '支付失败，请重新尝试！',
        type: 'error',
      })
    }
  })
}
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

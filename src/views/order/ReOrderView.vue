<template>
  <div class="common-layout">
    <el-container>
      <el-main style="width: 90%; margin: auto">
        <el-card style="margin-bottom: 10px">
          <template #header>
            <el-text class="card-header">客车信息（以下余票信息仅供参考）</el-text>
          </template>
          <div class="card-header">
            <el-text><b>{{carInfo.date}}</b>（{{carInfo.week}}）</el-text>
            <el-text><b>{{routeInfo.data.route_number}}</b>次</el-text>
            <el-text><b>{{routeInfo.data.from_station}}</b>（<b>{{routeInfo.data.departure_time}}</b>开）</el-text>
            <el-text>——</el-text>
            <el-text><b>{{routeInfo.data.to_station}}</b></el-text>
          </div>
          <el-divider border-style="dashed" />
          <div class="card-header" style="width: 30%">
            <el-text><b>{{routeInfo.data.seat_type}}</b>（￥<b>{{routeInfo.data.price}}</b>）</el-text>
            <el-text>余票：<b>{{routeInfo.data.remaining_tickets}}</b> 张</el-text>
          </div>
        </el-card>
        <el-card style="margin-bottom: 10px">
          <template #header>
            <el-text class="card-header">原票信息</el-text>
          </template>
          <el-table
              border
              :data="order.info"
              :header-cell-style="{textAlign: 'center'}"
              :cell-style="{ textAlign: 'center' }"
          >
            <el-table-column type="index" label="NO"/>
            <el-table-column prop="routeInfo" label="车次"/>
            <el-table-column prop="departure_time" label="出发时间"/>
            <el-table-column prop="type" label="席别信息"/>
            <el-table-column prop="userInfo" label="旅客信息"/>
            <el-table-column prop="price" label="票款金额"/>
          </el-table>
        </el-card>
        <el-card style="margin-bottom: 20px">
          <template #header>
            <el-text class="card-header">乘客信息</el-text>
          </template>
          <el-table
              border
              :data="userInfo.user"
              :header-cell-style="{textAlign: 'center'}"
              :cell-style="{ textAlign: 'center' }"
          >
            <el-table-column type="index" label="NO"/>
            <el-table-column prop="type" label="席别"/>
            <el-table-column prop="username" label="姓名"/>
            <el-table-column prop="id_type" label="证件类型"/>
            <el-table-column prop="id_number" label="证件号码"/>
            <el-table-column prop="phone_number" label="电话号码"/>
            <el-table-column>
              <template #default="scope">
                <el-checkbox v-model="userInfo.checked[scope.$index]" label="改签" />
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <el-button
            type="info"
            style="width: 100px;margin-right: 40px"
            @click="back"
        >上一步</el-button>
        <el-button type="warning" style="width: 100px" @click="toOrder()">提交订单</el-button>
      </el-main>
      <el-footer></el-footer>
    </el-container>
  </div>
  <el-dialog
      v-model="dialogVisible"
      title="请核对以下信息"
      width="60%"
      :before-close="handleClose"
      center
      align-center
      lock-scroll
  >
    <el-card>
      <div class="card-header">
        <el-text><b>{{carInfo.date}}</b>（{{carInfo.week}}）</el-text>
        <el-text><b>{{routeInfo.data.route_number}}</b>次</el-text>
        <el-text><b>{{routeInfo.data.from_station}}</b>（<b>{{routeInfo.data.departure_time}}</b>开）</el-text>
        <el-text>前往</el-text>
        <el-text><b>{{routeInfo.data.to_station}}</b></el-text>
      </div>
    </el-card>
    <el-card>
      <el-table
          border
          :data="userInfo.rebookUser"
          :header-cell-style="{textAlign: 'center'}"
          :cell-style="{ textAlign: 'center' }"
      >
        <el-table-column type="index" label="序号"/>
        <el-table-column prop="type" label="席别"/>
        <el-table-column prop="username" label="姓名"/>
        <el-table-column prop="id_type" label="证件类型"/>
        <el-table-column prop="id_number" label="证件号码"/>
        <el-table-column prop="phone_number" label="电话号码"/>
      </el-table>
    </el-card>
    <el-text>本次还剩余票：<b style="color: red">{{routeInfo.data.remaining_tickets}}</b> 张</el-text>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">返回修改</el-button>
        <el-button type="primary" @click="dialogVisible = false; submit()">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref} from "vue";
import type { FormInstance, FormRules } from 'element-plus'
import {useRoute, useRouter} from "vue-router";
import moment from "moment";
import axios from "axios";
import {ElMessage, ElMessageBox} from "element-plus";
import {useStore} from "vuex";
const route = useRoute()
const router = useRouter()
const store = useStore()
const formRef = ref<FormInstance>()
const time = route?.query.time
const dialogVisible = ref(false)
const handleClose = (done: () => void) => {
  ElMessageBox.confirm('是否返回修改?')
      .then(() => {
        done()
      })
      .catch(() => {
        // catch error
      })
}

const carInfo = reactive({
  date: time?.toString(),
  week: moment(time?.toString()).format('dddd'),
})
const routeInfo = reactive({
  data: JSON.parse(route?.query.routeInfo as any)
})
const userInfo = reactive({
  user: [] as any,
  checked: [] as any,
  rebookUser: [] as any
})
const order = reactive({
  info: [] as any,
  money: 0
})
const toOrder = () => {
  userInfo.rebookUser = [] as any
  for(let i in userInfo.checked){
    if(userInfo.checked[i]){
      userInfo.rebookUser.push(userInfo.user[i])
    }
  }
  if(userInfo.rebookUser.length == 0){
    ElMessage({
      showClose: true,
      message: '请选择要改签的乘客',
      type: 'error',
    })
    return
  }
  dialogVisible.value= true
}
onMounted(() => {
  // console.log('tttt',store.state.account)
  axios.get('http://localhost:8081/login/login',{
    params:{
      account: store.state.account
    }
  }).then((res)=>{
    console.log(res.data)
    res.data.type = routeInfo.data.seat_type+'（￥'+routeInfo.data.price+'）'
    userInfo.user.push(res.data)
    for(let i in userInfo.user){
      userInfo.checked.push(true)
    }
  })
  axios.get('http://localhost:8081/ticket/queryRemainingTicket',{
    params:{
      route_number: routeInfo.data.route_number,
      route_date: time
    }
  }).then((res)=>{
    // console.log(1,res.data)
    routeInfo.data.remaining_tickets = res.data
    // console.log(2,routeInfo.data.remaining_tickets)
  })
  axios.get('http://localhost:8081/order/queryOrder',{
    params:{
      orderNumber: route.query.rebookNumber
    }
  }).then((res)=>{
    // console.log(res.data)
    let o = {} as any
    let start = res.data.from_station.slice(res.data.from_station.indexOf('市')+1,-1)
    let end = res.data.to_station.slice(res.data.to_station.indexOf('市')+1,-1)
    o.routeInfo = res.data.route_number+' '+start+'-'+end
    o.departure_time = moment(res.data.departure_time).format('yyyy-MM-DD hh:mm')
    o.type = res.data.seat_type+'('+res.data.seat_id+'号)'
    o.userInfo = res.data.username+'('+res.data.id_number+')'
    o.price = res.data.price+'元'
    order.money = routeInfo.data.price - res.data.price
    order.info.push(o)
    // order.info = res.data
  })
})
//下单
const submit = () => {
  console.log('submit')
  axios.get('http://localhost:8081/order/temporary',{
    params:{
      route_number: routeInfo.data.route_number,
      route_date: time,
      account: store.state.account,
      oldOrderNumber: route.query.rebookNumber
    }
  }).then((res)=>{
    console.log(res.data)
    if(res.data == -1){
      ElMessage({
        showClose: true,
        message: '票已售完！请购买其他车次',
        type: 'error',
      })
    }else{
      router.push({
        path: '/rebookPayView',
        query: {
          routeInfo: JSON.stringify(routeInfo.data),
          carInfo: JSON.stringify(carInfo),
          orderId: res.data,
          rebookNumber: route.query.rebookNumber,
          money: order.money
        }
      })
    }

  })

}

//回退
const back = () => {
  window.history.back()
}
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

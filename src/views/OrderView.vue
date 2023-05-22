<template>
  <div class="common-layout">
    <el-container>
      <el-header>Header</el-header>
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
            <el-table-column type="index" label="序号"/>
            <el-table-column prop="name" label="席别"/>
            <el-table-column prop="username" label="姓名"/>
            <el-table-column prop="id_type" label="证件类型"/>
            <el-table-column prop="id_number" label="证件号码"/>
            <el-table-column prop="phone_number" label="电话号码"/>
          </el-table>
        </el-card>
        <el-button
            type="info"
            style="width: 100px;margin-right: 40px"
            @click="back"
        >上一步</el-button>
        <el-button type="warning" style="width: 100px" @click="dialogVisible = true">提交订单</el-button>
      </el-main>
      <el-footer>Footer</el-footer>
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
          :data="userInfo.user"
          :header-cell-style="{textAlign: 'center'}"
          :cell-style="{ textAlign: 'center' }"
      >
        <el-table-column type="index" label="序号"/>
        <el-table-column prop="name" label="席别"/>
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
const route = useRoute()
const router = useRouter()
const formRef = ref<FormInstance>()
const account = route.query.account
const time = route.query.time
// const routeInfo = JSON.parse(route.query.routeInfo as string)
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
  data: JSON.parse(route.query.routeInfo as any)
})
const userInfo = reactive({
  user: [] as any
})


onMounted(() => {
  axios.get('http://localhost:8081/login/login',{
    params:{
      account: account
    }
  }).then((res)=>{
    // console.log(res.data)
    res.data.name = routeInfo.data.seat_type+'（￥'+routeInfo.data.price+'）'
    userInfo.user.push(res.data)
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
})
const submit = () => {
  console.log('submit')
  router.push({
    path: '/pay',
    query: {
      routeInfo: JSON.stringify(routeInfo.data),
      carInfo: JSON.stringify(carInfo),
      account: account,
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

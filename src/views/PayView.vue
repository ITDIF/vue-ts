<template>
  <div class="common-layout">
    <el-container>
      <el-header>Header</el-header>
      <el-main style="width: 90%; margin: auto">
        <el-card class="card-header">
          <el-text>座位已锁定，请在提示时间内尽快完成支付，完成网上购票。 支付剩余时间：</el-text>
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
            <el-table-column prop="seat" label="座位号"/>
            <el-table-column prop="price" label="票价(元)"/>
          </el-table>
        </el-card>
        <el-button
            type="info"
            style="width: 100px;margin-right: 40px"
        >取消订单</el-button>
        <el-button type="warning" style="width: 100px">网上支付</el-button>
      </el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </div>
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
const routeInfo = JSON.parse(route.query.routeInfo as string)
const account = route.query.account
const carInfo = JSON.parse(route.query.carInfo as string)

const orderInfo = reactive({
  user: [] as any
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
})

</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

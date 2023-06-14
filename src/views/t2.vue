<template xmlns="http://www.w3.org/1999/html">
  <el-card>
    <template #header>
      <el-row>
        <el-col :span="7">车次信息</el-col>
        <el-col :span="5">旅客信息</el-col>
        <el-col :span="4">座位信息</el-col>
        <el-col :span="4">票价</el-col>
        <el-col :span="4">车票状态</el-col>
      </el-row>
    </template>
    <el-empty v-if="userInfo.user.length === 0" description="您没有未完成的订单哦～" />
    <div v-for="e in userInfo.user" :key="e"
         style="border: #acd1f9 solid 1px;padding: 12px 0 12px 0;margin-bottom: 20px">
      <el-row>
        <el-col :span="7">订票日期：{{moment(e.order_time).format("YYYY-MM-DD")}}
        订单号：{{e.order_number}}
        </el-col>
      </el-row>
      <el-divider style="margin: 12px 0 12px 0" />
      <el-row>
        <el-col :span="7">
          <el-text tag="b">{{e.from_station.slice(e.from_station.indexOf('市')+1)}}<el-icon><Right /></el-icon>
            {{e.to_station.slice(e.to_station.indexOf('市')+1)}} {{e.route_number}}
          </el-text><br>
          <el-text>{{moment(e.departure_time).format("YYYY-MM-DD")}}&nbsp;&nbsp;&nbsp;
            {{moment(e.departure_time).format("hh:mm")}} 开</el-text>
        </el-col>
        <el-col :span="5">
          <el-text tag="b">{{e.username}}</el-text><br>
          <el-text tag="b">{{e.id_number}}</el-text>
        </el-col>
        <el-col :span="4">
          <el-text tag="b">{{e.seat}}</el-text>
          <el-text tag="b">{{e.seat_id}}</el-text>
        </el-col>
        <el-col :span="4">
          <el-text tag="b">{{e.price}}元</el-text>
        </el-col>
        <el-col :span="4">
          <el-text tag="b">{{e.state}}</el-text>
        </el-col>
      </el-row>
      <el-divider style="margin: 12px 0 12px 0" />
      <el-row>
        <el-col :span="6" :offset="18">
          <el-button
              type="info"
              style="width: 80px;margin-right: 20px"
              @click="dialogVisible = true;cancelOrderNumber = e.order_number"
          >取消订单</el-button>
          <el-button
              type="warning"
              style="width: 80px"
              @click="onlinePayment(e.order_number)"
          >去支付</el-button>
        </el-col>
      </el-row>
    </div>
    <el-row>
      <el-col :span="10" :offset="7">
        <el-pagination
            v-model:current-page="currentPage"
            background
            layout="prev, pager, next, total"
            :total="total"
            @click="pageChange"
        />
      </el-col>
    </el-row>
  </el-card>
</template>

<script lang="ts" setup>
import {onBeforeMount, onMounted, reactive, ref} from "vue";
import type { FormInstance, FormRules } from 'element-plus'
import {useRoute, useRouter} from "vue-router";
import moment from "moment";
import axios from "axios";
import {ElMessage, ElMessageBox} from "element-plus";
import {useStore} from "vuex";
const route = useRoute()
const router = useRouter()
const store = useStore()
const dialogVisible = ref(false)
const cancelOrderNumber = ref()
const total = ref(0)
const currentPage = ref(1)
const userInfo = reactive({
  user: [] as any
})

const pageChange = () =>{
  console.log('currentPage ',currentPage.value)
  axios.get('http://localhost:8081/order/queryHistoricalOrderPaging',{
    params:{
      account: store.state.account,
      start: (currentPage.value - 1) * 10,
      count: 10
    }
  }).then((res)=>{
    // console.log(res.data)
    userInfo.user = res.data
  })
}

onBeforeMount(()=>{
  axios.get('http://localhost:8081/order/queryHistoricalOrderCount',{
    params:{
      account: store.state.account,
    }
  }).then((res)=>{
    console.log(res.data)
    total.value = res.data
  })
  axios.get('http://localhost:8081/order/queryHistoricalOrderPaging',{
    params:{
      account: store.state.account,
      start: currentPage.value - 1,
      count: 10
    }
  }).then((res)=>{
    // console.log(res.data)
    userInfo.user = res.data
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

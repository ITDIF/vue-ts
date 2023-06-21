<template>
  <div class="common-layout">
    <el-container>
      <el-header>Header</el-header>
      <el-main style="width: 90%; margin: auto">
        <el-card style="margin-bottom: 10px">
          <template #header>
            <el-text class="card-header" tag="b">候补客车信息</el-text>
          </template>
          <div class="card-header" style="width: 80%;">
            <el-text><b>{{carInfo.date}}</b>（{{carInfo.week}}）</el-text>
            <el-text><b>{{routeInfo.data.route_number}}</b>次</el-text>
            <el-text><b>{{routeInfo.data.from_station}}</b>（<b>{{routeInfo.data.departure_time}}</b>开）</el-text>
            <el-text>——</el-text>
            <el-text><b>{{routeInfo.data.to_station}}</b></el-text>
          </div>
          <el-divider border-style="dashed" />
          <div class="card-header" style="width: 80%">
            <el-text><b>{{routeInfo.data.seat_type}}</b>（￥<b>{{routeInfo.data.price}}</b>）</el-text>
            <el-text>当前候补人数：<b>{{routeInfo.candidate}}</b> 人</el-text>
            <el-text>截止兑换时间：
              <el-select v-model="selectValue" placeholder="请选择" style="width: 150px">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled"
                />
              </el-select>
            </el-text>
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
            style="width: 120px;margin-right: 40px"
            @click="back"
        >上一步</el-button>
        <el-button type="warning" style="width: 120px" @click="submit">提交候补订单</el-button>
      </el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </div>
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
const formRef = ref<FormInstance>()
// const account = route.query.account
const time = route.query.time
// const routeInfo = JSON.parse(route.query.routeInfo as string)


const carInfo = reactive({
  date: time?.toString(),
  week: moment(time?.toString()).format('dddd'),
})
const routeInfo = reactive({
  data: JSON.parse(route.query.routeInfo as any),
  candidate: 0
})
const userInfo = reactive({
  user: [] as any
})
const selectValue = ref('')
const options = []
onBeforeMount(()=>{
  let h = moment(time+' '+routeInfo.data.departure_time).diff(moment())/1000/3600
  let t = 2
  while(t < h){
    if(t < 24){
      options.push({value: t,label: '开车前'+t+'小时'})
    }else{
      options.push({value: t,label: '开车前'+t/24+'天'})
    }
    if(t == 2){
      t = 3;
    }else if(t == 3){
      t = 6;
    }else if(t == 6){
      t = 12;
    }else if(t == 12){
      t = 24;
    }else{
      t += 24;
    }
  }
})

onMounted(() => {
  // console.log('tttt',store.state.account)
  axios.get('http://localhost:8081/login/login',{
    params:{
      account: store.state.account
    }
  }).then((res)=>{
    // console.log(res.data)
    res.data.name = routeInfo.data.seat_type+'（￥'+routeInfo.data.price+'）'
    userInfo.user.push(res.data)
  })
  //获取候补数量
  axios.get('http://localhost:8081/order/existCandidate',{
    params:{
      route_number: routeInfo.data.route_number,
      departure_time: time+' '+routeInfo.data.departure_time+':00'
    }
  }).then((res)=>{
    // console.log('existCandidate',res.data)
    routeInfo.candidate = res.data
  })
})
//下单
const submit = () => {
  console.log('submit',selectValue.value)
  if(selectValue.value == ''){
    ElMessageBox.alert('请选择截止兑换日期',{
      center:true,
      callback: () => {},
    })
  }else{
    axios.get('http://localhost:8081/order/candidate',{
      params:{
        route_number: routeInfo.data.route_number,
        route_date: time,
        account: store.state.account,
        deadline: selectValue.value
      }
    }).then((res)=>{
      console.log(res.data)
      if(res.data == -1){
        ElMessage({
          showClose: true,
          message: '名额已售完！请购买其他车次',
          type: 'error',
        })
      }else{
        router.push({
          path: '/candidatePayView',
          query: {
            routeInfo: JSON.stringify(routeInfo.data),
            carInfo: JSON.stringify(carInfo),
            account: store.state.account,
            orderId: res.data,
            deadline: selectValue.value
          }
        })
      }
    })
  }
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

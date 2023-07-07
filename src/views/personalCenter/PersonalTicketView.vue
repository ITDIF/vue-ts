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
        <el-row style="margin: 0 0 20px 0">
          <el-col :span="10">
            乘车日期
            <el-date-picker
                v-model="date"
                type="daterange"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                :disabled-date="disabledDate"
                value-format="YYYY-MM-DD"
                style="width: 200px;"
            />
          </el-col>
          <el-col :span="3">
            <el-button type="primary" :disabled="date == null" @click="selTicket">查询</el-button>
          </el-col>
        </el-row>
        <el-empty v-if="tickets.total === 0" description="您没有本人未完成的车票哦～" />
        <div v-for="e in tickets.pageData">
          <el-row>
            <el-col :span="4">
              <el-text>{{moment(e.departure_time).format('YYYY-MM-DD ddd')}}</el-text>
            </el-col>
            <el-col :span="6" :offset="14">
              <el-text>订单号：{{e.order_number}}</el-text>
            </el-col>
          </el-row>
          <el-card style="margin-bottom: 15px">
            <el-row>
              <el-col :span="3" style="margin: auto;">
                {{e.from_station.slice(e.from_station.indexOf('市')+1)}}
              </el-col>
              <el-col :span="3">
                {{e.route_number}}<br>
                ------------>
              </el-col>
              <el-col :span="3" style="margin: auto;">
                {{e.to_station.slice(e.to_station.indexOf('市')+1)}}
              </el-col>
              <el-col :span="4">
                {{moment(e.departure_time).format('HH:mm')}} 开<br>
                <el-text>车票当日当次有效</el-text>
              </el-col>
              <el-col :span="3">
                {{e.seat_type}}<br>
                {{e.seat_id}}号
              </el-col>
              <el-col :span="2" style="margin: auto">
                <el-text style="color:#ee7118;">￥{{e.price}}</el-text>
              </el-col>
              <el-col :span="4" style="margin: auto">
                <el-text>订票日期：{{moment(e.ticket_issuance_time).format('YYYY-MM-DD')}}</el-text>
              </el-col>
              <el-col :span="2" style="margin: auto">
                <el-link type="primary" @click="cancelTicket(e.order_number,e.departure_time)">退票</el-link>
              </el-col>
            </el-row>
            <el-divider style="margin: 12px 0 12px 0"/>
            <el-row>
              <el-col :span="3" :offset="18">
                <el-button @click="rebook(e)">改签</el-button>
              </el-col>
              <el-col :span="3">
                <el-button type="warning" @click="printInfo(e)">打印信息单</el-button>
              </el-col>
            </el-row>
          </el-card>
        </div>
        <el-row>
          <el-col :span="10" :offset="7">
            <el-pagination
                v-model:current-page="tickets.currentPage"
                background
                layout="prev, pager, next, total"
                :total="tickets.total"
                :page-size="tickets.pageSize"
                @click="pageChange"
                hide-on-single-page
            />
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import {useStore} from "vuex";
import {onMounted, reactive, ref} from "vue";
import axios from "axios";
import moment from "moment";
import {ElMessage, ElMessageBox} from "element-plus";
import {useRouter} from "vue-router";

const store = useStore()
const router = useRouter()
const date = ref([moment().format('YYYY-MM-DD'),moment().add(10,'days').format('YYYY-MM-DD')])
const tickets = reactive({
  data: [] as any,
  total : 0,
  currentPage: 1,
  pageSize: 5,
  pageData: [] as any
})
onMounted(()=>{
  selTicket()
})
const selTicket = () => {
  axios.get('http://localhost:8081/ticket/queryTicket',{
    params:{
      date: moment().format('YYYYMMDD'),
      account: store.state.account,
      start: moment(date.value[0]).format('YYYYMMDD'),
      end: moment(date.value[1]).format('YYYYMMDD')
    }
  }).then((res)=>{
    tickets.data = res.data
    tickets.total = res.data.length
    pageChange()
  })
}
const pageChange = () => {
  if(tickets.total != 0 && tickets.data.slice((tickets.currentPage-1)*tickets.pageSize,
      tickets.currentPage*tickets.pageSize).length == 0){
    tickets.currentPage --
  }
  tickets.pageData = tickets.data.slice((tickets.currentPage-1)*tickets.pageSize,
      tickets.currentPage*tickets.pageSize)
}
//改签
const rebook = (e : any) => {
  console.log('改签')
  router.push({
    path: '/ticket',
    query:{
      rebookNumber: e.order_number,
      date: moment(e.departure_time).format("YYYY-MM-DD"),
      start: [e.from_station.slice(0,e.from_station.indexOf('省')+1),
        e.from_station.slice(e.from_station.indexOf('省')+1,e.from_station.indexOf('市')+1)],
      end: [e.to_station.slice(0,e.to_station.indexOf('省')+1),
        e.to_station.slice(e.to_station.indexOf('省')+1,e.to_station.indexOf('市')+1)],
      account: store.state.account
    }
  })
}
//退票
const cancelTicket = (orderNumber: string, time: string) => {
  // console.log(orderNumber)
  ElMessageBox.confirm(
      '确定要求退票吗？',
      '退票',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(()=>{
        axios.get('http://localhost:8081/order/upOrderAndDelTicket',{
          params:{
            order_number: orderNumber,
            date: moment(time).format("YYYY-MM-DD")
          }
        }).then((res)=>{
          if(res.data == '1'){
            ElMessage({
              showClose: true,
              message: '退票成功！',
              type: 'success',
            })
            selTicket()
          }else{
            ElMessage({
              showClose: true,
              message: '退票失败，请重新尝试！',
              type: 'error',
            })
          }
        })
      })
      .catch(()=>{
        ElMessage({
          type: 'info',
          message: '操作取消',
        })
      })
}

const printInfo = (order: any) => {
  router.push({
    path: '/ticketNoticeView',
    query: {
      order: JSON.stringify(order)
    }
  })
}

//限制可选日期
const disabledDate = (time: Date) => {
  return time.getTime() < Date.now()-86400000 || time.getTime() > Date.now()+86400000*10
}

const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key)
  // router.push(store.state.route[key])
}
</script>

<style scoped>

</style>

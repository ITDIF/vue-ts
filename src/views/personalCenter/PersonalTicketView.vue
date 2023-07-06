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
        <el-row style="margin: 0 0 10px 0">
          <el-col :span="10">
            乘车日期
            <el-date-picker
                v-model="date"
                type="daterange"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="YYYY-MM-DD"
                style="width: 200px;"
            />
          </el-col>
          <el-col :span="3">
            <el-button type="primary" :disabled="date==null">查询</el-button>
          </el-col>
        </el-row>
        <el-empty v-if="user.tickets.length === 0" description="您没有本人未完成的车票哦～" />
        <div v-for="e in user.tickets">
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
                {{moment(e.departure_time).format('hh:mm')}} 开<br>
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
                <el-link type="primary">退票</el-link>
              </el-col>
            </el-row>
            <el-divider/>
            <el-row>
              <el-col :span="3" :offset="18">
                <el-button>改签</el-button>
              </el-col>
              <el-col :span="3">
                <el-button type="warning">打印信息单</el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10" :offset="7">
                <el-pagination
                    v-model:current-page="currentPage"
                    background
                    layout="prev, pager, next, total"
                    :total="total"
                    :page-size="pageSize"
                    @click="pageFunction"
                    hide-on-single-page
                />
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
import {onMounted, reactive, ref} from "vue";
import axios from "axios";
import moment from "moment";
import router from "@/router";

const store = useStore()
const date = ref()
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(5)
const user = reactive({
  tickets: [] as any
})
onMounted(()=>{
  console.log(moment().format('YYYYMMDD'))
  axios.get('http://localhost:8081/ticket/queryTicket',{
    params:{
      date: moment().format('YYYYMMDD'),
      account: store.state.account
    }
  }).then((res)=>{
    console.log(res.data)
    user.tickets = res.data
  })
})
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key)
  // router.push(store.state.route[key])
}
</script>

<style scoped>

</style>

<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="120" style="margin-left: 3%">
        <el-menu
            default-active="candidateOrderView"
            router
            :default-openeds="['2']"
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
          <el-sub-menu index="6">
            <template #title>
              <span>客户服务</span>
            </template>
            <el-menu-item index="customerService">人工客服</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <el-main
          style="box-shadow: var(--el-box-shadow)"
      >
        <el-tabs type="border-card" class="demo-tabs" v-model="tabName" @tab-change="tabChange" >
          <el-tab-pane label="待支付订单">
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
              <el-empty v-if="userInfo.user.length === 0" description="您没有的订单哦～" />
              <div v-for="e in userInfo.user" :key="e"
                   style="border: #acd1f9 solid 1px;padding: 12px 0 12px 0;margin-bottom: 20px">
                <el-row>
                  <el-col :span="6"><el-text>候补单号：</el-text>{{e.order_number}}</el-col>
                  <el-col :span="5">
                    <el-text>下单日期：</el-text>{{moment(e.order_time).format("YYYY-MM-DD")}}&nbsp;
                  </el-col>
                </el-row>
                <el-divider style="margin: 12px 0 12px 0" />
                <el-row>
                  <el-col :span="7">
                    <el-text tag="b">{{e.from_station.slice(e.from_station.indexOf('市')+1)}}<el-icon><Right /></el-icon>
                      {{e.to_station.slice(e.to_station.indexOf('市')+1)}} {{e.route_number}}
                    </el-text><br>
                    <el-text>{{moment(e.departure_time).format("YYYY-MM-DD")}}&nbsp;&nbsp;&nbsp;
                      {{moment(e.departure_time).format("HH:mm")}} 开</el-text>
                  </el-col>
                  <el-col :span="5">
                    <el-text tag="b">{{e.username}}</el-text><br>
                    <el-text tag="b">{{e.id_number.slice(0,3)}}*****{{e.id_number.slice(15)}}</el-text>
                  </el-col>
                  <el-col :span="4" style="margin: auto">
                    <el-text tag="b">（候补）</el-text>
                  </el-col>
                  <el-col :span="4" style="margin: auto">
                    <el-text tag="b">{{e.price}}元</el-text>
                  </el-col>
                  <el-col :span="4" style="margin: auto;">
                    <el-text tag="b">{{e.state}}</el-text>
                  </el-col>
                </el-row>
                <el-divider style="margin: 12px 0 12px 0" />
                <el-row>
                  <el-col :span="12" :offset="12">
                    <el-button
                        type="info"
                        style="width: 80px;margin-right: 20px"
                        @click="dialogVisible = true;
                        currentOrderNumber = e.order_number;
                        cancelDate = e.departure_time"
                    >取消订单</el-button>
                    <el-button
                        type="warning"
                        @click="dialogVisible3 = true;
                        queryDeadline(e.order_number);
                        currentOrderNumber = e.order_number;
                        selDeadline(e.departure_time)"
                    >修改截止兑换时间</el-button>
                    <el-button
                        type="warning"
                        @click="onlinePayment(e.order_number)"
                    >继续支付</el-button>
                  </el-col>
                </el-row>
              </div>
            </el-card>
          </el-tab-pane>
          <el-tab-pane label="待兑现订单">
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
              <el-empty v-if="userInfo.user.length === 0" description="您没有待兑现的订单哦～" />
              <div v-for="e in userInfo.user" :key="e"
                   style="border: #acd1f9 solid 1px;padding: 12px 0 12px 0;margin-bottom: 20px">
                <el-row>
                  <el-col :span="10">
                    <el-text>下单日期：</el-text>{{moment(e.order_time).format("YYYY-MM-DD")}}&nbsp;
                    <el-text>订单号：</el-text>{{e.order_number}}
                  </el-col>
                </el-row>
                <el-divider style="margin: 12px 0 12px 0" />
                <el-row>
                  <el-col :span="7">
                    <el-text tag="b">{{e.from_station.slice(e.from_station.indexOf('市')+1)}}<el-icon><Right /></el-icon>
                      {{e.to_station.slice(e.to_station.indexOf('市')+1)}} {{e.route_number}}
                    </el-text><br>
                    <el-text>{{moment(e.departure_time).format("YYYY-MM-DD")}}&nbsp;&nbsp;&nbsp;
                      {{moment(e.departure_time).format("HH:mm")}} 开</el-text>
                  </el-col>
                  <el-col :span="5">
                    <el-text tag="b">{{e.username}}</el-text><br>
                    <el-text tag="b">{{e.id_number.slice(0,3)}}*****{{e.id_number.slice(15)}}</el-text>
                  </el-col>
                  <el-col :span="4" style="margin: auto">
                    <el-text tag="b">（候补）</el-text>
                  </el-col>
                  <el-col :span="4" style="margin: auto">
                    <el-text tag="b">{{e.price}}元</el-text>
                  </el-col>
                  <el-col :span="4" style="margin: auto;">
                    <el-text tag="b">{{e.state}}</el-text>
                  </el-col>
                </el-row>
                <el-divider style="margin: 12px 0 12px 0" />
                <el-row>
                  <el-col :span="8" :offset="16">
                    <el-button
                        type="info"
                        style="width: 80px;margin-right: 20px"
                        @click="dialogVisible2 = true;
                        currentOrderNumber = e.order_number;
                        cancelDate = e.departure_time"
                    >取消</el-button>
                    <el-button
                        type="warning"
                        style="width: 80px"
                    >修改</el-button>
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
                      :page-size="pageSize"
                      @click="pageFunction"
                      hide-on-single-page
                  />
                </el-col>
              </el-row>
            </el-card>
          </el-tab-pane>
          <el-tab-pane label="全部订单">
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
              <el-col :span="7">
                <el-input v-model="input" clearable  placeholder="订单号/车次/姓名" />
              </el-col>
              <el-col :span="3">
                <el-button type="primary" @click="selClick">查询</el-button>
              </el-col>
            </el-row>
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
              <el-empty v-if="userInfo.user.length === 0" description="您没有历史订单哦～" />
              <div v-for="e in userInfo.user" :key="e"
                   style="border: #acd1f9 solid 1px;padding: 12px 0 12px 0;margin-bottom: 20px">
                <el-row>
                  <el-col :span="10">
                    <el-text>下单日期：</el-text>{{moment(e.order_time).format("YYYY-MM-DD")}}&nbsp;
                    <el-text>订单号：</el-text>{{e.order_number}}
                  </el-col>
                </el-row>
                <el-divider style="margin: 12px 0 12px 0" />
                <el-row>
                  <el-col :span="7">
                    <el-text tag="b">{{e.from_station.slice(e.from_station.indexOf('市')+1)}}<el-icon><Right /></el-icon>
                      {{e.to_station.slice(e.to_station.indexOf('市')+1)}} {{e.route_number}}
                    </el-text><br>
                    <el-text>{{moment(e.departure_time).format("YYYY-MM-DD")}}&nbsp;&nbsp;&nbsp;
                      {{moment(e.departure_time).format("HH:mm")}} 开</el-text>
                  </el-col>
                  <el-col :span="5">
                    <el-text tag="b">{{e.username}}</el-text><br>
                    <el-text tag="b">{{e.id_number.slice(0,3)}}*****{{e.id_number.slice(15)}}</el-text>
                  </el-col>
                  <el-col :span="4" style="margin: auto">
                    <template v-if="e.seat_id != null">
                      <el-text tag="b">{{e.seat_type}}</el-text><br>
                      <el-text tag="b">{{e.seat_id}}</el-text><el-text>号</el-text>
                    </template>
                    <template v-if="e.seat_id == null">
                      <el-text tag="b">（候补）</el-text><br>
                    </template>
                  </el-col>
                  <el-col :span="4" style="margin: auto">
                    <el-text tag="b">{{e.price}}元</el-text>
                  </el-col>
                  <el-col :span="4" style="margin: auto;">
                    <el-text tag="b">{{e.state}}</el-text>
                  </el-col>
                </el-row>
                <el-divider style="margin: 12px 0 12px 0" />
              </div>
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
          </el-tab-pane>
        </el-tabs>
      </el-main>
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
        <el-button
            type="primary"
            @click="dialogVisible = false;
            cancelOrder('http://localhost:8081/order/deleteOrderTemporaryAndCandidate')">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog
      v-model="dialogVisible2"
      title="订单取消"
      width="30%"
      center
      align-center
  >
    <span>确定要取消候补订单吗？</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取消</el-button>
        <el-button
            type="primary"
            @click="dialogVisible2 = false;
            cancelOrder('http://localhost:8081/candidate/delCandidateAndOrder')">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog
      v-model="dialogVisible3"
      title="提示"
      width="34%"
      center
      align-center
  >
    <el-text tag="b"><el-icon><InfoFilled /></el-icon>截止兑现时间提示</el-text><br>
    <el-text>到期后如未能兑现车票，将自动返还票款至付款账号。</el-text><br>
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
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible3 = false">取消</el-button>
        <el-button
            type="primary"
            @click="dialogVisible3 = false;
            changeDeadline()">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {useStore} from "vuex";
import {onBeforeMount, onMounted, reactive, ref} from "vue";
import axios from "axios";
import moment from "moment";
import router from "@/router";
import {ElMessage} from "element-plus";
const tabName = ref('0')
const dialogVisible = ref(false)
const dialogVisible2 = ref(false)
const dialogVisible3 = ref(false)
const currentOrderNumber = ref()
const cancelDate = ref()
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(5)
const selClicked = ref(false)
const selUrl = ref()
const conUrl = ref()
const date = ref()
const input = ref('')
const selectValue = ref('')
const options = []
const deadline = ref('')
const userInfo = reactive({
  user: [] as any
})

const store = useStore()
onBeforeMount(()=>{
  loginCheck()
  tabOne()
})
const cancelOrder = (url: string) => {
  console.log('取消订单！',currentOrderNumber.value,url)
  axios.get(url,{
    params:{
      order_number: currentOrderNumber.value,
    }
  }).then((res)=>{
    if(res.data == '1'){
      ElMessage({
        showClose: true,
        message: '订单成功取消！',
        type: 'success',
      })
      if(tabName.value == '0'){
        tabOne()
      }else if(tabName.value == '1'){
        selUrl.value = 'http://localhost:8081/candidate/queryNotTravelCandidateByPaging'
        pageCount('http://localhost:8081/candidate/queryNotTravelCandidateCount')
        pageChange()
      }
    }else{
      ElMessage({
        showClose: true,
        message: '订单取消失败，请重新尝试！',
        type: 'error',
      })
    }
  })
}
//标签改变
const tabChange = () =>{
  // console.log('tab' , tabName.value)
  currentPage.value = 1
  selClicked.value = false
  pageFunction.value = pageChange
  if(tabName.value == '0'){
    tabOne()
  }else if(tabName.value == '1'){
    selUrl.value = 'http://localhost:8081/candidate/queryNotTravelCandidateByPaging'
    pageCount('http://localhost:8081/candidate/queryNotTravelCandidateCount')
    pageChange()
  }else{
    selUrl.value = 'http://localhost:8081/candidate/queryHistoricalCandidatePaging'
    pageCount('http://localhost:8081/candidate/queryHistoricalCandidateCount')
    pageChange()
  }
}
//查询
const selClick = () => {
  if(date.value == undefined) return
  selClicked.value = true
  currentPage.value = 1
  // console.log(date.value[0],moment(date.value[1]).add(1,'days').format("YYYY-MM-DD"),input.value)
  conUrl.value = 'http://localhost:8081/candidate/queryHistoricalCandidateConditionalPaging'
  selPageCount('http://localhost:8081/candidate/queryHistoricalCandidateConditionalCount')
  pageFunction.value = selPageChange
  selPageChange()
  // selUrl.value = 'http://localhost:8081/order/queryHistoricalOrderConditional'
}
//候补订单
const tabOne = () => {
  axios.get('http://localhost:8081/candidate/queryOrderTemporaryByAccount',{
    params:{
      account: store.state.account
    }
  }).then((res)=>{
    // console.log(res.data)
    userInfo.user = res.data
  })
}
//订单数量
const pageCount = (url: string) => {
  axios.get(url,{
    params:{
      account: store.state.account,
    }
  }).then((res)=>{
    // console.log(res.data)
    total.value = res.data
  })
}
//条件订单数量
const selPageCount = (url: string) => {
  axios.get(url,{
    params:{
      account: store.state.account,
      startDate: date.value[0],
      endDate: moment(date.value[1]).add(1,'days').format("YYYY-MM-DD"),
      key: input.value
    }
  }).then((res)=>{
    // console.log(res.data)
    total.value = res.data
  })
}
//
const selPageChange = () => {
  // console.log('selPageChange')
  axios.get(conUrl.value,{
    params:{
      account: store.state.account,
      startDate: date.value[0],
      endDate: moment(date.value[1]).add(1,'days').format("YYYY-MM-DD"),
      key: input.value,
      start: (currentPage.value - 1) * pageSize.value,
      count: pageSize.value
    }
  }).then((res)=>{
    // console.log(res.data)
    userInfo.user = res.data
  })
}
//分页
const pageChange = () =>{
  // console.log('第 ',currentPage.value,'页')
  axios.get(selUrl.value,{
    params:{
      account: store.state.account,
      start: (currentPage.value - 1) * pageSize.value,
      count: pageSize.value
    }
  }).then((res)=>{
    // console.log(res.data)
    userInfo.user = res.data
  })
}
//网上支付
const onlinePayment = (orderNumber: string) => {
  console.log('网上支付！')
  axios.get('http://localhost:8081/order/candidateSuccess',{
    params:{
      order_number: orderNumber
    }
  }).then((res)=>{
    console.log(res.data)
    if(res.data == '1'){
      ElMessage({
        showClose: true,
        message: '支付成功！',
        type: 'success',
      })
      tabOne()
    }else{
      ElMessage({
        showClose: true,
        message: '支付失败，请重新尝试！',
        type: 'error',
      })
    }
  })
}
const queryDeadline = (orderNumber: String) => {
  axios.get('http://localhost:8081/candidate/queryDeadlineOrderNumber',{
    params:{
      orderNumber: orderNumber
    }
  }).then((res)=>{
    // console.log('deadline',res.data)
    deadline.value = res.data
    selectValue.value = deadline.value
  })
}
const selDeadline = (date: string) => {
  let h = moment(date).diff(moment())/1000/3600
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
}
const changeDeadline = () => {
  axios.get('http://localhost:8081/candidate/updateCandidateDeadline',{
    params:{
      orderNumber: currentOrderNumber.value,
      deadline: selectValue.value
    }
  }).then((res)=>{
    console.log(res.data)
    if(res.data == '1'){
      ElMessage({
        showClose: true,
        message: '修改成功！',
        type: 'success',
      })
      tabOne()
    }else{
      ElMessage({
        showClose: true,
        message: '修改失败，请重新尝试！',
        type: 'error',
      })
    }
  })
}

const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key)
}
const loginCheck = () => {
  if(store.state.account == '000'){
    ElMessage({
      message: '请先登录！',
      type: 'warning',
    })
    router.push('/login')
    return
  }
}
const pageFunction = ref(pageChange as any)
</script>

<style scoped>



</style>

<template>
  <div class="common-layout">
    <el-container>
      <el-header style="height: 10px;"></el-header>
      <el-main style="margin: auto; border: 1px solid #979a9a; width: 90%;">
        <el-form label-width="70px" :inline="true">
          <el-form-item label="出发地" style="margin-bottom: 0">
            <el-cascader :options='form.options' filterable v-model='form.start' :show-all-levels="false" style="width: 200px;"></el-cascader>
          </el-form-item>
          <el-form-item label="到达地" style="margin-bottom: 0">
            <el-cascader :options='form.options' filterable v-model='form.end' :show-all-levels="false" style="width: 200px;"></el-cascader>
          </el-form-item>
          <el-form-item label="出发日期" style="margin-bottom: 0">
            <el-date-picker v-model="form.now" value-format="MM-DD" type="date" placeholder="选择出发日期" :disabled-date="disabledDate" style="width: 140px"/>
          </el-form-item>
          <el-form-item label-width="0" style="margin-bottom: 0">
            <el-button type="warning" style="margin: auto" @click="tabClick">查询</el-button>
          </el-form-item>
        </el-form>
      </el-main>
      <el-main style="width: 93%;margin: auto">
        <el-tabs type="border-card" @tab-change="tabClick" v-model="form.now" stretch>
          <el-tab-pane v-for="item in form.days" :name="item" :label="item"></el-tab-pane>
          <el-table
              border
              :data="tickets.pageData"
              :default-sort="{prop: 'departure_time'}"
              :header-cell-style="{textAlign: 'center'}"
              :cell-style="{ textAlign: 'center' }"
          >
            <el-table-column prop="route_number" label="车次"/>
            <el-table-column prop="from_station" label="出发地点" />
            <el-table-column prop="to_station" label="到达地点" />
            <el-table-column prop="departure_time" sortable label="出发时间" />
            <el-table-column prop="seat_type" label="类型" width="80"/>
            <el-table-column prop="remaining_tickets" label="余票" width="80"/>
            <el-table-column prop="price" label="票价" width="80"/>
            <el-table-column label="备注">
              <template #default="scope">
                <el-button type="primary" :disabled="isClick(scope.row.remaining_tickets)" @click="submit(scope.row)" style="margin: auto">预订</el-button>
                <el-button type="warning" :disabled="!isClick(scope.row.remaining_tickets)" @click="candidate(scope.row)" style="margin: auto">候补</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tabs>
      </el-main>
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
      <el-footer></el-footer>
    </el-container>
  </div>
</template>


<script lang="ts" setup>
import {onBeforeMount, reactive, ref} from "vue";
import { pcaTextArr, pcTextArr } from 'element-china-area-data'
import type { FormInstance, FormRules } from 'element-plus'
import {useRoute, useRouter} from "vue-router";
import moment from "moment";
import axios from "axios";
import {ElMessage} from "element-plus";
import {useStore} from "vuex";
const route = useRoute()
const router = useRouter()
const formRef = ref<FormInstance>()
const store = useStore()
let time = route?.query.date
const rebookNumber = route.query?.rebookNumber
const form = reactive({
  options: pcTextArr,
  start: route.query.start,
  end: route.query.end,
  date: time,
  days: [] as any,
  now: time?.slice(5),
  tableData: []
})
const tickets = reactive({
  total : 0,
  currentPage: 1,
  pageSize: 10,
  pageData: [] as any
})
onBeforeMount(()=>{
  // console.log(isRebook,route.query.start,route.query.end)
  for (let i = 0; i <= 10; i++) {
    form.days.push(moment().add(i, 'days').format("MM-DD"))
  }
  axios.get('http://localhost:8081/route/queryCarRouteBySED',{
    params:{
      start: form.start![0]!.concat(form.start![1]!),
      end: form.end![0]!.concat(form.end![1]!),
      date: moment().year()+"-"+form.now!.toString()
    }
  }).then((res)=>{
    form.tableData = res.data
    tickets.total = res.data.length
    pageChange()
    // ElMessage(res.data);
  })
})
//预订，候补按钮是否可以点击
const isClick = (rt: any) => {
  // console.log('isClick',rt)
  return rt == 0
}
const tabClick = () =>{
  // console.log('click: ',form.now,form.now)
  time = moment().year()+"-"+form.now!.toString()
  axios.get('http://localhost:8081/route/queryCarRouteBySED',{
    params:{
      start: form.start![0]!.concat(form.start![1]!),
      end: form.end![0]!.concat(form.end![1]!),
      date: time
    }
  }).then((res)=>{
    // console.log(res.data)
    form.tableData = res.data
    tickets.total = res.data.length
    pageChange()
  })
}
const pageChange = () => {
  if(tickets.total != 0 && form.tableData.slice((tickets.currentPage-1)*tickets.pageSize,
      tickets.currentPage*tickets.pageSize).length == 0){
    tickets.currentPage --
  }
  tickets.pageData = form.tableData.slice((tickets.currentPage-1)*tickets.pageSize,
      tickets.currentPage*tickets.pageSize)
}

interface routeInfo {
  route_number: string
  from_station: string
  to_station: string
  departure_time: string
  remaining_tickets: string
  price: number
  seat_type: string
}
//预订
const submit = (row: routeInfo) => {
  // console.log(codeToText[form.start[0]],codeToText[form.start[1]],codeToText[form.end[0]],codeToText[form.end[1]])
  // console.log('submit:',row)
  if(store.state.account == '000'){
    ElMessage({
      message: '请先登录！',
      type: 'warning',
    })
    router.push('/login')
    return
  }
  if(row.remaining_tickets == '0'){
    ElMessage({
      showClose: true,
      message: '票已售完！请购买其他车次',
      type: 'error',
    })
    return
  }
  if(rebookNumber == null){
    router.push({
      path: '/order',
      query: {
        time: time,
        routeInfo: JSON.stringify(row),
        account: store.state.account
      }
    })
  }else{
    router.push({
      path: '/reOrder',
      query: {
        rebookNumber: rebookNumber,
        time: time,
        routeInfo: JSON.stringify(row),
        account: store.state.account
      }
    })
  }

}
//候补
const candidate = (row : routeInfo) =>{
  // console.log('candidate:',row)
  if(store.state.account == '000'){
    ElMessage({
      message: '请先登录！',
      type: 'warning',
    })
    router.push('/login')
    return
  }
  router.push({
    path: '/candidate',
    query: {
      time: time,
      routeInfo: JSON.stringify(row),
      account: store.state.account
    }
  })
}

//限制可选日期
const disabledDate = (time: Date) => {
  return time.getTime() < Date.now()-86400000 || time.getTime() > Date.now()+86400000*10
}

</script>


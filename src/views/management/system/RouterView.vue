<template>
  <el-row>
    <el-col :span="10" :offset="7">
      <el-input
          v-model="condition.input"
          placeholder="关键字"
          class="input-with-select"
          clearable
          style="margin-bottom: 10px"
      >
        <template #prepend>
          <el-select v-model="condition.select" placeholder="请选择" style="width: 85px" clearable>
            <el-option label="车次" value="route_number" />
            <el-option label="车辆编号" value="car_number" />
            <el-option label="起点" value="from_station" />
            <el-option label="终点" value="to_station" />
            <el-option label="班次" value="shift" />
          </el-select>
        </template>
        <template #append>
          <el-button
              :icon="Search"
              @click="conditionalSel"
              style="background-color: #409EFF;color: white"/>
        </template>
      </el-input>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="2">
      <el-button type="danger">批量删除</el-button>
    </el-col>
    <el-col :span="2">
      <el-button type="success">添加</el-button>
    </el-col>
    <el-col :span="1">
      <el-button type="info" @click="refresh">刷新</el-button>
    </el-col>
  </el-row>
  <el-table
      highlight-current-row
      :data="carRoute.data"
      border
      :header-cell-style="{textAlign: 'center'}"
      :cell-style="{ textAlign: 'center' }"
      style="margin-top: 10px"
      v-loading="carRoute.load"
  >
    <el-table-column type="selection" width="35" />
    <el-table-column label="车次" prop="route_number"/>
    <el-table-column label="车辆编号" prop="car_number" width="100"/>
    <el-table-column label="起点" prop="from_station" width="200"/>
    <el-table-column label="终点" prop="to_station" width="200"/>
    <el-table-column label="时间" prop="departure_time"/>
    <el-table-column label="里程(KM)" prop="mileage" width="100"/>
    <el-table-column label="价格(元)" prop="price"/>
    <el-table-column label="班次" prop="shift" width="100"/>
    <el-table-column label="操作" fixed="right" width="140">
      <template #default="scope">
        <el-button size="small">编辑</el-button>
        <el-button size="small" type="danger">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-row style="margin: 20px;">
    <el-col :span="10" :offset="6">
      <el-pagination
          v-model:current-page="pagination.currentPage"
          background
          layout="prev, pager, next, total"
          :total="pagination.total"
          :page-size="pagination.pageSize"
          hide-on-single-page
          @click="pageChange"
      />
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref} from "vue";
import axios from "axios";
import moment from "moment";
import { Search } from '@element-plus/icons-vue'
import router from "@/router";
const carRoute = reactive({
  data: [],
  load: true
})
const pagination = reactive({
  currentPage: 1,
  total: 0,
  pageSize: 10
})
const condition = reactive({
  input: '',
  select: ''
})

onMounted(()=>{
  pageCount()
  pageChange()
})
//订单数量
const pageCount = () => {
  axios.get('http://localhost:8081/route/queryCarRouteCount',{
    params:{
      key: condition.select,
      value: condition.input
    }
  }).then((res)=>{
    // console.log(res.data)
    pagination.total = res.data
  })
}

//分页
const pageChange = () =>{
  axios.get('http://localhost:8081/route/queryCarRoutePaging',{
    params:{
      start: (pagination.currentPage - 1) * pagination.pageSize,
      count: pagination.pageSize,
      key: condition.select,
      value: condition.input
    }
  }).then((res)=>{
    // console.log(res.data)
    carRoute.data = res.data
    carRoute.load = false
  })
}
//条件查询
const conditionalSel = () => {
  // console.log(condition.select,condition.input)
  carRoute.load = true
  pageCount()
  pageChange()
}
const filterState = (value: string, row: any) => {
  return row.state === value
}
//刷新
const refresh = () => {
  router.go(0)
}
</script>

<style scoped>
.input-with-select .el-input-group__prepend {
  background-color: var(--el-fill-color-blank);
}
</style>

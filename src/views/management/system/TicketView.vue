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
            <el-option label="订单号" value="order_number" />
            <el-option label="身份证" value="id_number" />
            <el-option label="姓名" value="username" />
            <el-option label="车次" value="route_number" />
            <el-option label="起点" value="from_station" />
            <el-option label="终点" value="to_station" />
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
      <el-popconfirm title="确定要批量删除选中的订单吗？" @confirm="batchDel">
        <template #reference>
          <el-button type="danger" :disabled="multipleSelection.length === 0">批量删除</el-button>
        </template>
      </el-popconfirm>
    </el-col>
    <el-col :span="2">
      <el-button type="success" @click="dialogVisible2=true;dialogDate2={}">添加</el-button>
    </el-col>
    <el-col :span="1">
      <el-button type="info" @click="refresh">刷新</el-button>
    </el-col>
  </el-row>
  <el-table
      highlight-current-row
      :data="order.data"
      border
      :header-cell-style="{textAlign: 'center'}"
      :cell-style="{ textAlign: 'center' }"
      style="margin-top: 10px"
      v-loading="order.load"
      @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="35" />
    <el-table-column label="订单号" prop="order_number" width="130"/>
    <el-table-column label="姓名" prop="username"/>
    <el-table-column label="身份证" prop="id_number" width="170"/>
    <el-table-column label="车次" prop="route_number"/>
    <el-table-column label="时间" prop="departure_time" width="140" :formatter="timeFormatter"/>
    <el-table-column label="起点" prop="from_station" width="200"/>
    <el-table-column label="终点" prop="to_station" width="200"/>
    <el-table-column label="席别" prop="seat_type"/>
    <el-table-column label="座位" prop="seat_id"/>
    <el-table-column label="价格(元)" prop="price"/>
    <el-table-column label="下单时间" prop="order_time" width="160" :formatter="timeFormatter2"/>
    <el-table-column
        label="状态"
        prop="state"
        :filters="[
            {text: '已取消', value: '已取消'},
            {text: '已付款', value: '已付款'},
            {text: '已改签', value: '已改签'},
        ]"
        :filter-method="filterState"
        width="120"
    />
    <el-table-column label="支付时间" prop="pay_time" width="160" :formatter="timeFormatter2"/>
    <el-table-column label="操作" fixed="right" width="140">
      <template #default="scope">
        <el-button size="small" @click="dialogVisible=true;dialogDate={...scope.row};currentDate=scope.row.departure_time">编辑</el-button>
        <el-popconfirm title="确定要删除该订单吗？" @confirm="del(scope.row)">
          <template #reference>
            <el-button size="small" type="danger">删除</el-button>
          </template>
        </el-popconfirm>
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
  <el-dialog
      v-model="dialogVisible"
      title="修改"
      width="40%"
      center
      align-center
  >
    <el-form
        :model="dialogDate"
        label-width="70px"
    >
      <el-form-item label="订单号">
        <el-input v-model="dialogDate.order_number"/>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="dialogDate.username" clearable/>
      </el-form-item>
      <el-form-item label="身份证">
        <el-input v-model="dialogDate.route_number" clearable/>
      </el-form-item>
      <el-form-item label="车次">
        <el-input v-model="dialogDate.id_number" clearable/>
      </el-form-item>
      <el-form-item label="发车时间" prop="departure_time">
        <el-input v-model="dialogDate.departure_time" clearable/>
      </el-form-item>
      <el-form-item label="起点">
        <el-input v-model="dialogDate.from_station" clearable/>
      </el-form-item>
      <el-form-item label="终点">
        <el-input v-model="dialogDate.to_station" clearable/>
      </el-form-item>
      <el-form-item label="席别">
        <el-input v-model="dialogDate.seat_type" clearable/>
      </el-form-item>
      <el-form-item label="座位">
        <el-input v-model="dialogDate.seat_id" clearable/>
      </el-form-item>
      <el-form-item label="金额">
        <el-input v-model="dialogDate.price" clearable/>
      </el-form-item>
      <el-form-item label="下单时间">
        <el-input v-model="dialogDate.order_time" clearable/>
      </el-form-item>
      <el-form-item label="支付时间">
        <el-input v-model="dialogDate.pay_time" clearable/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="edit">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog
      v-model="dialogVisible2"
      title="添加"
      width="40%"
      center
      align-center
  >
    <el-form
        ref="ruleFormRef"
        :rules="rules"
        :model="dialogDate2"
        label-width="78px"
    >
      <el-form-item label="订单号">
        <el-input v-model="dialogDate2.order_number"/>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="dialogDate2.username" clearable/>
      </el-form-item>
      <el-form-item label="身份证">
        <el-input v-model="dialogDate2.route_number" clearable/>
      </el-form-item>
      <el-form-item label="车次">
        <el-input v-model="dialogDate2.id_number" clearable/>
      </el-form-item>
      <el-form-item label="发车时间" prop="departure_time">
        <el-input v-model="dialogDate2.departure_time" clearable/>
      </el-form-item>
      <el-form-item label="起点">
        <el-input v-model="dialogDate2.from_station" clearable/>
      </el-form-item>
      <el-form-item label="终点">
        <el-input v-model="dialogDate2.to_station" clearable/>
      </el-form-item>
      <el-form-item label="席别">
        <el-input v-model="dialogDate2.seat_type" clearable/>
      </el-form-item>
      <el-form-item label="座位">
        <el-input v-model="dialogDate2.seat_id" clearable/>
      </el-form-item>
      <el-form-item label="金额">
        <el-input v-model="dialogDate2.price" clearable/>
      </el-form-item>
      <el-form-item label="下单时间">
        <el-input v-model="dialogDate.order_time" clearable/>
      </el-form-item>
      <el-form-item label="状态">
        <el-input v-model="dialogDate2.state" clearable/>
      </el-form-item>
      <el-form-item label="支付时间">
        <el-input v-model="dialogDate2.pay_time" clearable/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取消</el-button>
        <el-button type="primary" @click="add(ruleFormRef)">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref} from "vue";
import axios from "axios";
import moment from "moment";
import { Search } from '@element-plus/icons-vue'
import {ElNotification, FormInstance, FormRules, TableInstance} from "element-plus";
import router from "@/router";
const multipleSelection = ref([] as any)
const ruleFormRef = ref<FormInstance>()
const dialogVisible = ref(false)
const dialogVisible2 = ref(false)
const dialogDate = ref({})
const dialogDate2 = ref({} as any)
const currentDate = ref('')
const order = reactive({
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
  axios.get('http://localhost:8081/ticket/queryTicketCount',{
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
  // console.log('第 ',currentPage.value,'页')
  axios.get('http://localhost:8081/ticket/queryTicketListPaging',{
    params:{
      start: (pagination.currentPage - 1) * pagination.pageSize,
      count: pagination.pageSize,
      key: condition.select,
      value: condition.input
    }
  }).then((res)=>{
    // console.log(res.data)
    order.data = res.data
    if(pagination.currentPage != 0 && order.data.length == 0){
      pagination.currentPage--
      pageChange()
    }
    order.load = false
  })
}
const handleSelectionChange = (val: []) => {
  multipleSelection.value = val
}
//批量删除
const batchDel = () =>{
  let accounts = []
  for (const e in multipleSelection.value) {
    accounts.push(multipleSelection.value[e].account)
  }
  console.log(accounts,typeof accounts)
  axios.get('http://localhost:8081/manage/batchDelUser',{
    params:{
      accounts: JSON.stringify(accounts)
    }
  }).then((res)=>{
    console.log(res.data)
    if(res.data >= 1){
      ElNotification({
        title: '删除成功',
        type: 'success',
      })
      pageCount()
      pageChange()
    }else{
      ElNotification({
        title: '删除失败',
        message: '请重新尝试',
        type: 'error',
      })
    }
  })
}
//条件查询
const conditionalSel = () => {
  // console.log(condition.select,condition.input)
  order.load = true
  pageCount()
  pageChange()
}
const filterState = (value: string, row: any) => {
  return row.state === value
}
//添加
const add = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      axios.get('http://localhost:8081/register/addUser',{
        params:{
          data: JSON.stringify(dialogDate2.value)
        }
      }).then((res)=>{
        if(res.data == 1){
          ElNotification({
            title: '添加成功',
            type: 'success',
          })
          dialogVisible2.value = false
          pageCount()
          pageChange()
        }else{
          ElNotification({
            title: '添加失败',
            message: '请重新尝试',
            type: 'error',
          })
        }
      })
    }else{
      console.log('提交失败!')
      return false
    }
  })
}
//编辑
const edit = () => {
  axios.get('http://localhost:8081/ticket/update',{
    params:{
      data: JSON.stringify(dialogDate.value),
      date: moment(currentDate.value).format("YYYY-MM-DD")
    }
  }).then((res)=>{
    if(res.data == 1){
      ElNotification({
        title: '编辑成功',
        type: 'success',
      })
      dialogVisible.value = false
      pageCount()
      pageChange()
    }else{
      ElNotification({
        title: '编辑失败',
        message: '请重新尝试！',
        type: 'error',
      })
    }
  })
}

//删除
const del = (order: any) =>{
  axios.get('http://localhost:8081/order/upOrderAndDelTicket',{
    params:{
      order_number: order.order_number,
      date: moment(order.departure_time).format("YYYY-MM-DD")
    }
  }).then((res)=>{
    if(res.data == 1){
      ElNotification({
        title: '删除成功',
        type: 'success',
      })
      pageCount()
      pageChange()
    }else{
      ElNotification({
        title: '删除失败',
        message: '请重新尝试',
        type: 'error',
      })
    }
  })
}
//刷新
const refresh = () => {
  router.go(0)
}
//时间格式化
function timeFormatter(row:string, column:string, cellValue:string, index:string){
  return moment(cellValue).format('yyyy-MM-DD HH:mm')
}
function timeFormatter2(row:string, column:string, cellValue:string, index:string){
  return moment(cellValue).format('yyyy-MM-DD HH:mm:ss')
}
const rules = reactive<FormRules>({
  car_number: [
    { required: true, message: '请输入车辆编号', trigger: 'blur' },
  ],
  car_type:[
    { required: true, message: '请输入车辆类型', trigger: 'blur'},
  ],
  seat_type:[
    { required: true, message: '请输入席别', trigger: 'blur'},
  ],
  passenger_capacity:[
    { required: true, message: '请输入载客量', trigger: 'blur'},
  ],
})
</script>

<style scoped>
.input-with-select .el-input-group__prepend {
  background-color: var(--el-fill-color-blank);
}
</style>

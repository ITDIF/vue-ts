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
      <el-popconfirm title="确定要批量删除选中的车次吗？" @confirm="batchDel">
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
      :data="carRoute.data"
      border
      :header-cell-style="{textAlign: 'center'}"
      :cell-style="{ textAlign: 'center' }"
      style="margin-top: 10px"
      v-loading="carRoute.load"
      @selection-change="handleSelectionChange"
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
        <el-button size="small" @click="dialogVisible=true;dialogDate={...scope.row}">编辑</el-button>
        <el-popconfirm title="确定要删除该车次吗？" @confirm="del(scope.row.route_number)">
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
        label-width="76px"
    >
      <el-form-item label="车次">
        <el-input v-model="dialogDate.route_number" clearable/>
      </el-form-item>
      <el-form-item label="车辆编号">
        <el-input v-model="dialogDate.car_number" clearable/>
      </el-form-item>
      <el-form-item label="起点">
        <el-input v-model="dialogDate.from_station" clearable/>
      </el-form-item>
      <el-form-item label="终点">
        <el-input v-model="dialogDate.to_station" clearable/>
      </el-form-item>
      <el-form-item label="时间">
        <el-input v-model="dialogDate.departure_time" clearable/>
      </el-form-item>
      <el-form-item label="里程(KM)">
        <el-input v-model="dialogDate.mileage" clearable/>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input v-model="dialogDate.price" clearable/>
      </el-form-item>
      <el-form-item label="班次">
        <el-input v-model="dialogDate.shift" clearable/>
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
        label-width="80px"
    >
      <el-form-item label="车次" prop="route_number">
        <el-input v-model="dialogDate2.route_number" clearable/>
      </el-form-item>
      <el-form-item label="车辆编号" prop="car_number">
        <el-input v-model="dialogDate2.car_number" clearable/>
      </el-form-item>
      <el-form-item label="起点" prop="from_station">
        <el-input v-model="dialogDate2.from_station" clearable/>
      </el-form-item>
      <el-form-item label="终点" prop="to_station">
        <el-input v-model="dialogDate2.to_station" clearable/>
      </el-form-item>
      <el-form-item label="时间" prop="departure_time">
        <el-input v-model="dialogDate2.departure_time" clearable/>
      </el-form-item>
      <el-form-item label="里程(KM)" prop="mileage">
        <el-input v-model="dialogDate2.mileage" clearable/>
      </el-form-item>
      <el-form-item label="价格(元)" prop="price">
        <el-input v-model="dialogDate2.price" clearable/>
      </el-form-item>
      <el-form-item label="班次" prop="shift">
        <el-input v-model="dialogDate2.shift" clearable/>
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
import router from "@/router";
import {ElNotification, FormInstance, FormRules} from "element-plus";
const multipleSelection = ref([] as any)
const ruleFormRef = ref<FormInstance>()
const dialogVisible = ref(false)
const dialogVisible2 = ref(false)
const dialogDate = ref({})
const dialogDate2 = ref({} as any)
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
//数量
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
    if(pagination.currentPage != 0 && carRoute.data.length == 0){
      pagination.currentPage--
      pageChange()
    }
    carRoute.load = false
  })
}
const handleSelectionChange = (val: []) => {
  multipleSelection.value = val
}
//批量删除
const batchDel = () =>{
  let routeNumbers = []
  for (const e in multipleSelection.value) {
    routeNumbers.push(multipleSelection.value[e].route_number)
  }
  console.log(routeNumbers)
  axios.get('http://localhost:8081/route/batchDel',{
    params:{
      routeNumbers: JSON.stringify(routeNumbers)
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
  carRoute.load = true
  pageCount()
  pageChange()
}
//添加
const add = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      axios.get('http://localhost:8081/route/add',{
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
  axios.get('http://localhost:8081/route/update',{
    params:{
      data: JSON.stringify(dialogDate.value)
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
const del = (routeNumber: string) =>{
  axios.get('http://localhost:8081/route/del',{
    params:{
      routeNumber: routeNumber
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
const filterState = (value: string, row: any) => {
  return row.state === value
}
//刷新
const refresh = () => {
  router.go(0)
}
const rules = reactive<FormRules>({
  route_number: [
    { required: true, message: '请输入线路编号', trigger: 'blur' },
  ],
  car_number:[
    { required: true, message: '请输入车辆编号', trigger: 'blur'},
  ],
  from_station:[
    { required: true, message: '请输入起点', trigger: 'blur'},
  ],
  to_station:[
    { required: true, message: '请输入终点', trigger: 'blur'},
  ],
  departure_time:[
    { required: true, message: '请输入出发时间', trigger: 'blur'},
  ],
  mileage:[
    { required: true, message: '请输入里程', trigger: 'blur'},
  ],
  price:[
    { required: true, message: '请输入价格(元)', trigger: 'blur'},
  ],
  shift:[
    { required: true, message: '请输入班次', trigger: 'blur'},
  ],
})
</script>

<style scoped>
.input-with-select .el-input-group__prepend {
  background-color: var(--el-fill-color-blank);
}
</style>

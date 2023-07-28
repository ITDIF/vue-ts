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
            <el-option label="车辆编号" value="car_number" />
            <el-option label="类型" value="car_type" />
            <el-option label="席别" value="seat_type" />
            <el-option label="载客量" value="passenger_capacity" />
            <el-option label="状态" value="state" />
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
      <el-popconfirm title="确定要批量删除选中的车辆吗？" @confirm="batchDel">
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
      :data="car.data"
      border
      :header-cell-style="{textAlign: 'center'}"
      :cell-style="{ textAlign: 'center' }"
      style="margin-top: 10px"
      v-loading="car.load"
      @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="35" />
    <el-table-column label="车辆编号" prop="car_number"/>
    <el-table-column label="类型" prop="car_type"/>
    <el-table-column label="席别" prop="seat_type"/>
    <el-table-column label="载客量" prop="passenger_capacity"/>
    <el-table-column label="状态" prop="state"/>
    <el-table-column label="操作" fixed="right" width="140">
      <template #default="scope">
        <el-button size="small" @click="dialogVisible=true;dialogDate={...scope.row}">编辑</el-button>
        <el-popconfirm title="确定要删除该车辆吗？" @confirm="del(scope.row.car_number)">
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
      <el-form-item label="车辆编号">
        <el-input v-model="dialogDate.car_number" clearable/>
      </el-form-item>
      <el-form-item label="类型">
        <el-input v-model="dialogDate.car_type" clearable/>
      </el-form-item>
      <el-form-item label="席别">
        <el-input v-model="dialogDate.seat_type" clearable/>
      </el-form-item>
      <el-form-item label="载客量">
        <el-input v-model="dialogDate.passenger_capacity" clearable/>
      </el-form-item>
      <el-form-item label="状态">
        <el-input v-model="dialogDate.state" clearable/>
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
      <el-form-item label="车辆编号" prop="car_number">
        <el-input v-model="dialogDate2.car_number" clearable/>
      </el-form-item>
      <el-form-item label="类型" prop="car_type">
        <el-input v-model="dialogDate2.car_type" clearable/>
      </el-form-item>
      <el-form-item label="席别" prop="seat_type">
        <el-input v-model="dialogDate2.seat_type" clearable/>
      </el-form-item>
      <el-form-item label="载客量" prop="passenger_capacity">
        <el-input v-model="dialogDate2.passenger_capacity" clearable/>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-input v-model="dialogDate2.state" clearable/>
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
const car = reactive({
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
  axios.get('http://localhost:8081/manage/queryCarCount',{
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
  axios.get('http://localhost:8081/manage/queryCarPaging',{
    params:{
      start: (pagination.currentPage - 1) * pagination.pageSize,
      count: pagination.pageSize,
      key: condition.select,
      value: condition.input
    }
  }).then((res)=>{
    // console.log(res.data)
    car.data = res.data
    if(pagination.currentPage != 0 && car.data.length == 0){
      pagination.currentPage--
      pageChange()
    }
    car.load = false
  })
}
const handleSelectionChange = (val: []) => {
  multipleSelection.value = val
}
//批量删除
const batchDel = () =>{
  let carNumbers = []
  for (const e in multipleSelection.value) {
    carNumbers.push(multipleSelection.value[e].car_number)
  }
  console.log(carNumbers)
  axios.get('http://localhost:8081/manage/batchDelCar',{
    params:{
      carNumbers: JSON.stringify(carNumbers)
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
  car.load = true
  pageCount()
  pageChange()
}
//添加
const add = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      axios.get('http://localhost:8081/manage/addCar',{
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
  axios.get('http://localhost:8081/manage/updateCar',{
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
const del = (carNumber: string) =>{
  axios.get('http://localhost:8081/manage/delCar',{
    params:{
      carNumber: carNumber
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

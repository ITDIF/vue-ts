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
            <el-option label="账号" value="account" />
            <el-option label="身份证" value="id_number" />
            <el-option label="姓名" value="username" />
            <el-option label="电话" value="phone_number" />
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
      <el-popconfirm title="确定要批量删除选中的用户吗？" @confirm="batchDel">
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
      :data="user.data"
      border
      :header-cell-style="{textAlign: 'center'}"
      :cell-style="{ textAlign: 'center' }"
      style="margin-top: 10px"
      v-loading="user.load"
      @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="35" />
    <el-table-column label="账号" prop="account" width="100"/>
<!--    <el-table-column label="密码" prop="password" width="100"/>-->
    <el-table-column label="姓名" prop="username"/>
    <el-table-column label="电话" prop="phone_number" width="120"/>
    <el-table-column label="证件类型" prop="id_type" width="150"/>
    <el-table-column label="证件号" prop="id_number" width="180"/>
    <el-table-column label="地区" prop="district" width="100"/>
    <el-table-column label="注册时间" prop="registration_time" width="150" :formatter="timeFormatter"/>
    <el-table-column label="邮箱" prop="email" width="200"/>
    <el-table-column label="状态" prop="state"/>
    <el-table-column label="操作" fixed="right" width="140">
      <template #default="scope">
        <el-button size="small" @click="dialogVisible=true;dialogDate={...scope.row}">编辑</el-button>
        <el-popconfirm title="确定要删除该用户吗？" @confirm="del(scope.row.account)">
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
      <el-form-item label="账号">
        <el-input disabled v-model="dialogDate.account"/>
      </el-form-item>
<!--      <el-form-item label="密码">-->
<!--        <el-input v-model="dialogDate.password" clearable/>-->
<!--      </el-form-item>-->
      <el-form-item label="姓名">
        <el-input v-model="dialogDate.username" clearable/>
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="dialogDate.phone_number" clearable/>
      </el-form-item>
      <el-form-item label="证件类型" prop="id_type">
        <el-select v-model="dialogDate.id_type">
          <el-option label="中国居民身份证" value="中国居民身份证"/>
          <el-option label="港澳台居民居住证" value="港澳台居民居住证" />
        </el-select>
      </el-form-item>
      <el-form-item label="证件号">
        <el-input v-model="dialogDate.id_number" clearable/>
      </el-form-item>
      <el-form-item label="地区">
        <el-input v-model="dialogDate.district" clearable/>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="dialogDate.email" clearable/>
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
      <el-form-item label="账号" prop="account">
        <el-input v-model="dialogDate2.account"/>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="dialogDate2.password" clearable/>
      </el-form-item>
      <el-form-item label="姓名" prop="username">
        <el-input v-model="dialogDate2.username" clearable/>
      </el-form-item>
      <el-form-item label="证件类型" prop="id_type">
        <el-select v-model="dialogDate2.id_type">
          <el-option label="中国居民身份证" value="中国居民身份证"/>
          <el-option label="港澳台居民居住证" value="港澳台居民居住证" />
        </el-select>
      </el-form-item>
      <el-form-item label="证件号" prop="id_number">
        <el-input v-model="dialogDate2.id_number" clearable/>
      </el-form-item>
      <el-form-item label="地区" prop="district">
        <el-input v-model="dialogDate2.district" clearable/>
      </el-form-item>
      <el-form-item label="电话" prop="phone_number">
        <el-input v-model="dialogDate2.phone_number" clearable/>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="dialogDate2.email" clearable/>
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
import {ElNotification, ElTable, FormInstance, FormRules, TableInstance} from "element-plus";
import router from "@/router";
const multipleSelection = ref([] as any)
const ruleFormRef = ref<FormInstance>()
const dialogVisible = ref(false)
const dialogVisible2 = ref(false)
const dialogDate = ref({})
const dialogDate2 = ref({} as any)
const user = reactive({
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
  axios.get('http://localhost:8081/user/queryUserCount',{
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
  axios.get('http://localhost:8081/user/queryUserPaging',{
    params:{
      start: (pagination.currentPage - 1) * pagination.pageSize,
      count: pagination.pageSize,
      key: condition.select,
      value: condition.input
    }
  }).then((res)=>{
    // console.log(res.data)
    user.data = res.data
    if(pagination.currentPage != 1 && user.data.length == 0){
      pagination.currentPage--
      pageChange()
    }
    user.load = false
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
  user.load = true
  pageCount()
  pageChange()
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
  axios.get('http://localhost:8081/user/updateUser',{
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
const del = (account: string) =>{
  console.log(account)
  axios.get('http://localhost:8081/user/delUser',{
    params:{
      account: account
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
const validateAccount = (rule: any, value: any, callback: any) => {
  let regex = /^[A-Za-z][A_Za-z\d]{5,20}$/
  if(!regex.test(value)){
    callback(new Error('6-20位字母或数字,字母开头'))
  }else{
    axios.get('http://localhost:8081/register/queryAccount',{
      params:{
        account: dialogDate2.value.account
      }
    }).then((res)=>{
      if(res.data){
        console.log('该用户已存在')
        callback(new Error('该用户已存在！'))
      }else{
        callback()
      }
    })
  }
}
const validatePass = (rule:any, value: any, callback: any) => {
  let regex = /^\w{6,20}$/
  if(!regex.test(value)){
    callback(new Error('6-20字母、数字或下划线'))
  }else {
    callback()
  }
}
const rules = reactive<FormRules>({
  account: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { validator: validateAccount, trigger: 'change'},
  ],
  password:[
    { required: true, message: '请输入密码', trigger: 'blur'},
    { validator: validatePass, trigger: 'change'},
  ],
  username:[
    { required: true, message: '请输入姓名', trigger: 'blur'},
  ],
  id_type:[
    { required: true, message: '请选择证件类型', trigger: 'change'},
  ],
  id_number:[
    { required: true, message: '请输入证件号码', trigger: 'blur'},
    { min:1, max:18, message: '证件号码格式错误！', trigger: 'blur'}
  ],
  phone_number:[
    { required: true, message: '请输入手机号码', trigger: 'blur'},
    { len: 11, pattern: /^1[3-9]\d{9}$/, message: '手机号码格式错误', trigger: 'blur'}
  ]
})
</script>

<style scoped>
.input-with-select .el-input-group__prepend {
  background-color: var(--el-fill-color-blank);
}
</style>

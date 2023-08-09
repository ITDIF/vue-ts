<template>
  <el-card style="width: 80%; margin: auto">
    <el-descriptions title="基本信息">
      <el-descriptions-item label="用户名">{{user.info.account}}</el-descriptions-item>
      <el-descriptions-item label="姓名">{{user.info.username}}</el-descriptions-item>
      <el-descriptions-item label="国家/地区">中国China</el-descriptions-item>
      <el-descriptions-item label="证件类型">{{user.info.id_type}}</el-descriptions-item>
      <el-descriptions-item label="证件号码">
        {{user.info.id_number?.slice(0,3)}}****{{user.info.id_number?.slice(15)}}
      </el-descriptions-item>
      <el-descriptions-item label="等级">
        <el-tag size="small">{{user.info.grade}}</el-tag>
      </el-descriptions-item>
    </el-descriptions>
    <el-divider/>
    <el-descriptions title="联系方式">
      <template #extra>
        <el-button type="primary" @click="dialogVisible = true">修改</el-button>
      </template>
      <el-descriptions-item label="手机号">
        {{user.info.phone_number?.slice(0,3)}}****{{user.info.phone_number?.slice(7)}}
      </el-descriptions-item>
      <el-descriptions-item label="邮箱">
        {{user.info.email?.slice(0,3)}}****{{user.info.email?.slice(user.info.email.indexOf('@')-3)}}
      </el-descriptions-item>
      <el-descriptions-item label="地址">{{user.info.district}}</el-descriptions-item>
    </el-descriptions>
  </el-card>
  <el-dialog
      v-model="dialogVisible"
      title="修改"
      width="40%"
      center
      align-center
      @open="openDialog"
      @close="handleClose(ruleFormRef)"
  >
    <el-form
        ref="ruleFormRef"
        :model="contact"
        :rules="rules"
        label-width="100px"
    >
      <el-form-item label="手机号" prop="phone_number">
        <el-input v-model="contact.phone_number" style="width: 60%;" />&nbsp;
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="contact.email"  style="width: 60%;" />&nbsp;
      </el-form-item>
      <el-form-item label="地址" prop="district">
        <el-input v-model="contact.district"  style="width: 60%;" clearable />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :disabled="isClick()" @click="modify(ruleFormRef)">
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
import {ElMessage, FormInstance, FormRules} from "element-plus";
const dialogVisible = ref(false)
const store = useStore()
const ruleFormRef = ref<FormInstance>()
const user = reactive({
  info: {} as any
})
const contact = reactive({
  account: '',
  phone_number: '',
  email: '',
  district: ''
})
onMounted(()=>{
  axios.get('http://localhost:8081/login/adminLogin',{
    params:{
      account: store.state.admin
    }
  }).then((res)=>{
    console.log(store.state.admin,res.data)
    user.info = res.data
  })
})
const modify = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      contact.account = user.info.account
      axios.get('http://localhost:8081/login/updateAdmin',{
        params:{
          data: JSON.stringify(contact)
        }
      }).then((res)=>{
        if(res.data == 1){
          user.info.phone_number = contact.phone_number
          user.info.email = contact.email
          user.info.district = contact.district
          ElMessage({
            message: "信息修改成功！",
            type: "success"
          })
        }else{
          ElMessage({
            message: "修改失败，请重试！",
            type: "error"
          })
        }
      })
      dialogVisible.value = false
    } else {
      return false
    }
  })
}
const rules = reactive<FormRules>({
  phone_number:[
    { required: true, message: '请输入手机号码', trigger: 'blur'},
    { len: 11, pattern: /^1[3-9]\d{9}$/, message: '手机号码格式错误', trigger: 'blur'}
  ]
})
const isClick = () => {
  return contact.phone_number == user.info.phone_number &&
  contact.email == user.info.email &&
  contact.district == user.info.district
}
//dialog打开时
const openDialog = () =>{
  contact.phone_number = user.info.phone_number
  contact.email = user.info.email
  contact.district = user.info.district
}
const handleClose = (formEl: FormInstance | undefined) => {
  formEl?.clearValidate('phone_number')
}
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key)
  // router.push(store.state.route[key])
}
</script>

<style scoped>

</style>

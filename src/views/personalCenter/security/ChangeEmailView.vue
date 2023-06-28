<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="120" style="margin-left: 3%">
        <el-menu
            default-active="accountSecurityView"
            router
            :default-openeds="['4']"
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
        <el-card shadow="never" style="width: 82%; margin: auto;">
          <template #header>
            安全邮箱
          </template>
          <el-form
              ref="ruleFormRef"
              :model="user"
              :rules="rules"
              style="width: 62%; margin: auto;"
              label-width="100px"
          >
            <el-form-item label="原电子邮箱" prop="email">
              <el-input :disabled="true" v-model="user.phone" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="新电子邮箱" prop="newEmail">
              <el-input v-model="user.newEmail" clearable style="width: 200px;"/>
              <el-text>&nbsp;请输入新电子邮箱</el-text>
            </el-form-item>
            <el-form-item label="登录密码" prop="password">
              <el-input v-model="user.password" clearable style="width: 200px;"/>
              <el-text>&nbsp;正确输入密码才能修改</el-text>
            </el-form-item>
            <el-form-item label="验证码" prop="code">
              <el-input v-model="user.code" clearable placeholder="请填写邮箱验证码" style="width: 200px;"/>&nbsp;&nbsp;
              <el-button
                  @click="getPhoneCode"
                  :disabled="disabled"
                  type="primary"
              >
                {{codeButtonText}}
                <b v-if="time !== 60000">（{{moment(time).format("ss")}}）</b>
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-button @click="cancel">取消</el-button>
              <el-button type="primary">确认</el-button>
            </el-form-item>
          </el-form>
        </el-card>
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
import {ElMessage, FormInstance, FormRules} from "element-plus";
const store = useStore()
const disabled = ref(false)
const ruleFormRef = ref<FormInstance>()
const codeButtonText = ref('获取邮箱验证码')
const time = ref(60000)
let timer = null as any
const user = reactive({
  email: '',
  newEmail: '',
  code: '',
  password: '',
})

const getPhoneCode = () => {
  disabled.value = true
  codeButtonText.value = '重新发送'
  axios.get('http://localhost:8081/user/phoneCode',{
    params:{
      account: store.state.account
    }
  }).then((res)=>{
    if(res.data == 1){
      ElMessage({
        message: "验证码已发送！",
        type: "success"
      })
    }else{
      ElMessage({
        message: "验证码发送失败，请重试！",
        type: "error"
      })
    }
  })
  timer = setInterval(() => {
    time.value -= 1000
    console.log(moment(time.value).format("mm:ss"))
    if(time.value <= 0){
      clearInterval(timer)
      time.value = 60000
      disabled.value = false
    }
  },1000)
}
const cancel = () => {
  router.push('/accountSecurityView')
}
const rules = reactive<FormRules>({
  phone:[
    { required: true, message: '请输入原始密码', trigger: 'change'},
    { len: 11, pattern: /^1[3-9]\d{9}$/, message: '手机号码格式错误', trigger: 'blur'}
  ],
  newPhone:[
    { required: true, message: '请输入原始密码', trigger: 'change'},
    { len: 11, pattern: /^1[3-9]\d{9}$/, message: '手机号码格式错误', trigger: 'blur'}
  ],
  password:[
    { required: true, message: '请输入新密码', trigger: 'change'},
    { len: 6, pattern: /^\w{6,20}$/, message: '6-20字母、数字或下划线', trigger: 'blur'}
  ],
  code:[
    { required: true, message: '请输入验证码', trigger: 'change'}
  ]
})
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key)
  // router.push(store.state.route[key])
}
</script>

<style scoped>

</style>

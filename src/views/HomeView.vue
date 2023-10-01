<template>
  <div class="common-layout">
    <el-container>
      <el-main>
        <el-carousel :interval="5000" arrow="never" style="position: relative;">
          <el-carousel-item v-for="item in images.data" :key="item">
<!--            <h3 text="2xl" justify="center">{{ item }}</h3>-->
            <el-image :src="item" style="height: 350px;"/>
          </el-carousel-item>
          <el-card
              style="background-color: #ffffff;
              width: 30%;
              position: absolute;
              z-index: 1;
              top: 20px;
              left: 20px"
          >
            <div style="margin-bottom: 10px"><b style="font-size: 20px">车票</b></div>
            <el-form
                ref="formRef"
                :model="form"
                :rules="rules"
                label-width="80px"
                class="demo-ruleForm"
                status-icon
            >
              <el-form-item label="出发地" prop="start">
                <el-cascader :options='form.options' filterable :show-all-levels="false" v-model='form.start'></el-cascader>
              </el-form-item>
              <el-form-item label="到达地" prop="end">
                <el-cascader :options='form.options' filterable :show-all-levels="false" v-model='form.end'></el-cascader>
              </el-form-item>
              <el-form-item label="出发日期" prop="date">
                <el-date-picker v-model="form.date" value-format="YYYY-MM-DD" type="date" :disabled-date="disabledDate" placeholder="选择出发日期" />
              </el-form-item>
              <el-form-item label-width="0">
                <el-button type="primary" style="margin: auto" @click="submit(formRef)">查询</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-carousel>
        <el-row style="margin-top: 40px">
          <el-col :span="4" :offset="1" class="row-col" @click=submit(formRef)>
            <div class="div-icon">
              <el-icon style="margin: auto" size="40px"><Ticket /></el-icon>
              <el-text style="font-size: 16px">车票预订</el-text>
            </div>
          </el-col>
          <el-col :span="4" :offset="2" class="row-col" @click="router.push('/personalTicketView')">
            <div class="div-icon">
              <el-icon style="margin: auto" size="40px"><Tickets /></el-icon>
              <el-text style="font-size: 16px">我的车票</el-text>
            </div>
          </el-col>
          <el-col :span="4" :offset="2" class="row-col" @click="router.push('/customerService')">
            <div class="div-icon">
              <el-icon style="margin: auto" size="40px"><ChatDotRound /></el-icon>
              <el-text style="font-size: 16px">人工客服</el-text>
            </div>
          </el-col>
          <el-col :span="4" :offset="2" class="row-col" @click="router.push('/personalCenterView')">
            <div class="div-icon">
              <el-icon style="margin: auto" size="40px"><UserFilled /></el-icon>
              <el-text style="font-size: 16px">个人中心</el-text>
            </div>
          </el-col>
        </el-row>
      </el-main>
      <el-footer></el-footer>
    </el-container>
  </div>
</template>


<script lang="ts" setup>
import {reactive, ref, onMounted, defineComponent} from "vue";
import moment from "moment";
import Layout from "../layout/custom/Index.vue"
import {pcaTextArr, pcTextArr} from 'element-china-area-data'
import type { FormInstance, FormRules } from 'element-plus'
import {useRouter,useRoute} from "vue-router";
import {ElMessage} from "element-plus";
import {useStore} from "vuex";
import Admin from "@/components/admin/Index.vue";
import User from "@/components/user/Index.vue";
const router = useRouter()
const route = useRoute()
const formRef = ref<FormInstance>()
const store = useStore()
const account = store.state.account

const images = reactive({
  data:['https://www.12306.cn/index/images/pic/banner20201223.jpg',
    'https://www.12306.cn/index/images/pic/banner20201223.jpg',
    'https://www.12306.cn/index/images/pic/banner20201223.jpg']
})
defineComponent({
  components: {
    Layout
  }
});
const form = reactive({
  options: pcTextArr,
  start: [""],
  end: [""],
  date: moment().format("YYYY-MM-DD"),
})


const submit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  // console.log(pcTextArr)
  // console.log(form.start[0],form.start[1],form.end[0],form.end[1])
  // console.log(codeToText[form.start[0]],codeToText[form.start[1]],codeToText[form.end[0]],
  //     codeToText[form.end[1]],form.date)
  formEl.validate((valid) => {
    if (valid) {
      // console.log('submit!')
      router.push({
        path: '/ticket',
        query:{
          date: form.date,
          start: form.start,
          end: form.end,
          account: store.state.account
        }
      })
    } else {
      ElMessage.error("查询失败！")
      return false
    }
  })
}

const rules = reactive<FormRules>({
  start: [
    { required: true, message: '请输入出发地', trigger: 'change' },
  ],
  end: [
    { required: true, message: '请输入到达地', trigger: 'change' },
  ],
  date: [
    { required: true, message: '请输入出发日期', trigger: 'change' },
  ]
})


//限制可选日期
const disabledDate = (time: Date) => {
  return time.getTime() < Date.now()-86400000 || time.getTime() > Date.now()+86400000*10
}


//test
onMounted(()=>{
  form.start = ["江西省","新余市"]
  form.end = ["江西省","赣州市"]
})

</script>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.div-icon{
  background-color: #F5F5F5;
  height: 130px;
  margin: auto;
  display: grid;
  border-radius: 5px;
}
.row-col :hover{
  background-color: #5ca4e7;
  cursor: pointer;
}
</style>

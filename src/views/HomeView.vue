<template>
  <div class="common-layout">
    <el-container>
      <el-main style="margin: auto;">
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
      </el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </div>
</template>


<script lang="ts" setup>
import {reactive, ref, onMounted} from "vue";
import moment from "moment";
import { regionData,provinceAndCityData, codeToText } from 'element-china-area-data'
import type { FormInstance, FormRules } from 'element-plus'
import {useRouter,useRoute} from "vue-router";
import {ElMessage} from "element-plus";
const router = useRouter()
const route = useRoute()
const formRef = ref<FormInstance>()
const account = route.query.account
const form = reactive({
  options: provinceAndCityData,
  start: [''],
  end: [''],
  date: moment().format("YYYY-MM-DD"),
})


const submit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  // console.log(codeToText[form.start[0]],codeToText[form.start[1]],codeToText[form.end[0]],
  //     codeToText[form.end[1]],form.date)
  formEl.validate((valid) => {
    if (valid) {
      console.log('submit!')
      router.push({
        path: '/ticket',
        query:{
          date: form.date,
          start: form.start,
          end: form.end,
          account: account
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
  form.start = ["13","1301"]
  form.end = ["13","1301"]
})

</script>

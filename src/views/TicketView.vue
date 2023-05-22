<template>
  <div class="common-layout">
    <el-container>
      <el-header>Header</el-header>
      <el-main style="margin: auto; border: 1px solid #979a9a">
        <el-form label-width="70px" :inline="true">
          <el-form-item label="出发地">
            <el-cascader :options='form.options' v-model='form.start' :show-all-levels="false" style="width: 200px;"></el-cascader>
          </el-form-item>
          <el-form-item label="到达地">
            <el-cascader :options='form.options' v-model='form.end' :show-all-levels="false" style="width: 200px;"></el-cascader>
          </el-form-item>
          <el-form-item label="出发日期">
            <el-date-picker v-model="form.date" value-format="YYYY-MM-DD" type="date" placeholder="选择出发日期" style="width: 140px"/>
          </el-form-item>
          <el-form-item label-width="0">
            <el-button type="warning" style="margin: auto" @click="submit">查询</el-button>
          </el-form-item>
        </el-form>
      </el-main>
      <el-main>

      </el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </div>
</template>


<script lang="ts" setup>
import {reactive, ref} from "vue";
import { provinceAndCityData, codeToText } from 'element-china-area-data'
import type { FormInstance, FormRules } from 'element-plus'

const formRef = ref<FormInstance>()
const form = reactive({
  options: provinceAndCityData,
  start: ['110000', '110100'],
  end: ['110000', '110100'],
  date: ""
})


const submit = () => {

  console.log(codeToText[form.start[0]],codeToText[form.start[1]],codeToText[form.end[0]],codeToText[form.end[1]])
  console.log(form.date)
}

</script>
<style>
  .el-form-item{
    margin-bottom: 0;
  }
</style>

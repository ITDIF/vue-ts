<template xmlns="http://www.w3.org/1999/html">
  <div class="demo-date-picker">
    <div class="block">
      <span class="demonstration">乘车日期：</span>
      <el-date-picker
          v-model="value1"
          type="daterange"
          start-placeholder="Start date"
          end-placeholder="End date"
          value-format="YYYY-MM-DD"
      />

    </div>
    <el-button @click="clicked">查询</el-button>
  </div>

</template>

<script lang="ts" setup>
import {onBeforeMount, onMounted, reactive, ref} from "vue";
import type { FormInstance, FormRules } from 'element-plus'
import {useRoute, useRouter} from "vue-router";
import moment from "moment";
import axios from "axios";
import {ElMessage, ElMessageBox} from "element-plus";
import {useStore} from "vuex";
const route = useRoute()
const router = useRouter()
const store = useStore()
const value1 = ref()

const click = () => {
  if(value1.value == undefined) return
  console.log(value1.value[0],value1.value[1])
}
const clicked = ref(click)

</script>

<style scoped>

.demo-date-picker {
  display: flex;
  width: 100%;
  padding: 0;
  flex-wrap: wrap;
}
.demo-date-picker .block {
  padding: 30px 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  flex: 1;
}
.demo-date-picker .block:last-child {
  border-right: none;
}
</style>

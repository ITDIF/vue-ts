<template>
  <el-tabs type="border-card" @click="tabClick" v-model="date.now">
    <el-input/>
    <el-tab-pane v-for="item in date.day" :name="item" :label="item">{{item}}</el-tab-pane>

  </el-tabs>

</template>
<script lang="ts" setup>
import {reactive, ref} from "vue";
import moment from "moment";

const date = reactive({
  day: ['1','2','3','4','5','6','7','8','9'],
  now: "3"
})

const tabClick = () =>{
  console.log('click: ',date)
}
</script>

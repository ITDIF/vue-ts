<template>
  <el-menu
      :default-active="data"
      mode="horizontal"
      router
      background-color="#3B99FC"
      text-color="#FFF"
      active-text-color="#FFD04B"
      style="margin-bottom: 10px; padding-left: 200px"
  >
    <el-menu-item></el-menu-item>
    <el-menu-item index="/">首页</el-menu-item>
    <el-sub-menu index="2">
      <template #title>订单中心</template>
      <el-menu-item index="busOrderView">车票订单</el-menu-item>
      <el-menu-item index="candidateOrderView">候补订单</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="personalTicketView">车票</el-menu-item>
    <el-menu-item>团购服务</el-menu-item>
    <el-menu-item>包车服务</el-menu-item>
    <el-menu-item>客户服务</el-menu-item>
  </el-menu>
</template>

<script lang="ts">
import {defineComponent, watch} from 'vue';
import moment from "moment";
export default defineComponent({
  name: 'user-menu',
  props: {
    data: {
      type: String,
    }
  },
  setup(props) {
    // watch(()=>props.data,(value, oldValue, onCleanup)=>{
    //   console.log('组件',value,moment().valueOf())
    // })
    // console.log('组件',props.data,moment().valueOf())
    return {
      data: props.data
    };
  }
});
</script>

<style scoped>

</style>

<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>Card name</span>
        <el-button class="button" text>Operation button</el-button>
      </div>
    </template>
    <div v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</div>
  </el-card>
</template>

<script lang="ts" setup>

import {onMounted, onUnmounted} from "vue";
import {setup} from "vue-class-component";
let ws = null as any

console.log()
onMounted(()=>{
  if('WebSocket' in window){
    console.log('浏览器支持WebSocket')
    ws = new WebSocket('ws://localhost:8081/websocket/2')
    ws.onopen = function() {
      console.log("Connection open ...");
      ws.send("Hello WebSockets!");
    };
    ws.onmessage = function (res: any) {
      console.log('------')
      console.log(res.data)
    }
  }else{
    alert('浏览器不支持WebSocket！')
  }
})



onUnmounted(() => {
  ws.close();
});
</script>
<style>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 480px;
}
</style>

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

import { io, Socket} from 'socket.io-client'
import {onBeforeUnmount, onMounted} from "vue";
import {DefaultEventsMap} from "socket.io/dist/typed-events";

let socket = null
// onMounted(() => {
//   // 创建客户端 websocket 的实例
//   socket = io('ws://localhost:8087/webSocket/1')
// })
// 组件被销毁之前，清空 sock 对象
// onBeforeUnmount(() => {
//   // 关闭连接
//   socket.close()
//
//   // 销毁 websocket 实例对象
//   socket = null
// })


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

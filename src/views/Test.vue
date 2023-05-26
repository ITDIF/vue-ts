<template>
  <el-text>
  {{store.state.count}}
  </el-text>
  <el-button @click="dj">
    +10
  </el-button>
</template>

<script lang="ts" setup>

import {onMounted, onUnmounted} from "vue";
import {setup} from "vue-class-component";
import {useStore} from "vuex";
let ws = null as any
const store = useStore()
console.log('account:',store.state.account)

const dj = () => {
  // store.commit('increment')
  // store.state.count = 100
  store.commit('changeAccount','1011100')
  console.log('account:',store.state.account)
}
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

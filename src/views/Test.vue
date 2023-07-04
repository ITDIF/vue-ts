<template>
  <el-text>
  {{store.state.count}}
  </el-text>
  <el-button @click="dj">
    +10
  </el-button>
  <el-button @click="buy">
    买票
  </el-button>
  <el-button @click="post">
    传参
  </el-button>
</template>

<script lang="ts" setup>

import {onMounted, onUnmounted} from "vue";
import {setup} from "vue-class-component";
import {useStore} from "vuex";
import axios from "axios";
import {ElMessage} from "element-plus";
import {useRoute, useRouter} from "vue-router";
const route = useRoute()
const router = useRouter()
let ws = null as any
const store = useStore()
console.log('account:',store.state.account)
const post = () => {
  router.push({
    path: 't2',
    params: {
      op: 'post'
    }
  })
}

const dj = () => {
  // store.commit('increment')
  // store.state.count = 100
  // store.commit('changeAccount','1011100')
  // console.log('account:',store.state.account)
  axios.get('http://localhost:8081/webSocket/w2',).then((res)=>{
    console.log(res.data)
  })
}
const buy = () => {
  axios.get('http://localhost:8081/ticket').then((res)=>{
    console.log(res.data)
  })
}

onMounted(()=>{
  if('WebSocket' in window){
    console.log('浏览器支持WebSocket')
    ws = new WebSocket('ws://localhost:8081/ticket/2')
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

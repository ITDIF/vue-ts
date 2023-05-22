<template>
  <section>
      <el-text><b style="color: red">{{moment(countdown.time).format("mm")}}</b>分
        <b style="color: red">{{moment(countdown.time).format("ss")}}</b>秒</el-text>
  </section>
</template>
<script lang="ts" setup>
import {onMounted,onUnmounted,reactive,onBeforeMount} from "vue"
import moment from "moment";
import {setup} from "vue-class-component";
let timer = null as any
const countdown = reactive({
  time: 90000
})
onBeforeMount(()=>{
  timer = setInterval(() => {
    countdown.time -= 1000
    console.log(moment(countdown.time).format("hh:mm:ss"))
    if(countdown.time == 0){
      clearInterval(timer)
    }
  },1000)
})

onUnmounted(()=>{
  clearInterval(timer)
})
</script>

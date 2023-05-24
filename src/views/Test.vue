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



import axios from "axios";

let jsonStr = [{name:'ji' , id:20} , {name:'king' , id:26},{name:'jge' , id:30}]
axios.get('http://localhost:8081/order/temporary',{
  params:{
    data: JSON.stringify(jsonStr)
  }
}).then((res)=>{
  console.log(res.data)
})


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

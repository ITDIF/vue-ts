<template>
  <el-empty v-if="user.list.length === 0" description="暂无用户"/>
  <div v-for="i in user.list" :key="i">
    <el-card>
      <el-row justify="space-between">
        <el-col :span="6"><div style="line-height: 2;float: left">用户：{{i.account}}</div></el-col>
        <el-col :span="13">
          <el-text truncated v-if="i.message != null" style="line-height: 2; float: left">
            <b>上条消息 </b>
            <el-text v-if="i.message.belong==='staff'">我：</el-text>
            <el-text v-if="i.message.belong==='user'">用户：</el-text>
            <el-text>{{i.message.text}}</el-text>
            <el-text v-if="i.message.url!=''">图片</el-text>
          </el-text>
        </el-col>
        <el-col :span="3"><el-button type="primary" @click="click(i.account)">接待</el-button></el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script lang="ts" setup>

import {onMounted, reactive} from "vue";
import axios from "axios";
import {useRouter} from "vue-router";

const router = useRouter()
const user = reactive({
  list: []
})
onMounted(()=>{
  axios.get('http://localhost:8081/utils/userOnlineAndMessage').then((res)=>{
    console.log(res.data)
    user.list = res.data
  })
})
const click = (account: string) => {
  router.push({
    path: 'customerServices',
    query:{
      account: account
    }
  })
}
</script>

<style scoped>

</style>

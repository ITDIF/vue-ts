<template>
  <div>
    <h1>这是User</h1>
    <h1>{{n}}</h1>
    <h1>m:{{m}}</h1>
    <el-button>我是element plus</el-button>
  </div>
  <div>
    <ul>
      <li v-for="user in users">{{user.username}}</li>
    </ul>
  </div>
</template>
<script>
import axios from 'axios'
export default {

  name: "User",
  data(){
    return{
      n : 1000,
      m :"",
      users:[]
    }
  },
  mounted() {
    axios.get("http://localhost:8081/Test/msg").then((res)=>{
      console.log(res.data);
      this.m = res.data;
    }),
    axios.get("http://localhost:8081/Test/queryList").then((res)=>{
      console.log(res.data);
      this.users = res.data
    })
  }
}
</script>

<style scoped>

</style>
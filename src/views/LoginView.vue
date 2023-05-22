<template>
<div id="app">
  <div class="w">
    <div class="logo">
      <!--         <a href="">网 上 购 票 系 统</a>-->
    </div>
  </div>
  <div class="content">
    <div class="login-box">
      <h1>登 录</h1>
      <form action="">
        <input type="text" name="username" placeholder="请输入手机号" accesskey="n">
        <input type="password" name="password" id="" placeholder="请输入密码" accesskey="p">
        <p></p>
        <input type="submit" id="submit"  value="登录" accesskey="s" >
      </form>
      <a href="#" style="float: left">立即注册</a>
      <a href="#" style="float: right;">忘记密码</a>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: "LoginView.vue"
}
</script>

<style scoped>
#app{
  height: 1200px;
  background: url(../assets/images/login/b.jpeg) no-repeat;
  background-size: 100% 100%;
}
.w{
  width: 100%;
  height: 100px;
  margin: 0 auto;
}
.logo{
  position: relative;
  width: 300px;
  margin: 10px 0;
  height: 60px;
  float: left;
  line-height: 60px;
}
.logo a {
  /* color: #666; */
  color: black;
  text-decoration: none;
  font-size: 80px;
}
.content{
  width: 100%;

  /* background: url(img/login/b.jpeg) no-repeat; */
  background-size: 100% 100%;
}
.login-box {
  width: 600px;
  height: 800px;
  margin: 0 auto 0;
  background-color: #fff;
  padding: 40px 140px 120px 140px;
  position: relative;
  border-radius: 20px;
}
.login-box h1{
  text-align: center;
  padding-bottom: 40px;
  font-size: 60px;
}
.login-box input{
  width: 600px;
  height: 100px;
  line-height: 100px;
  margin: 0 0 40px 0;
  font-size: 40px;
  border: none;
  outline: none;
}
.login-box form input:nth-of-type(1){
  width: 540px;
  padding: 0 0 0 48px;
  background: url(../assets/images/login/user.png) no-repeat;
  background-size: 36px;
  background-position: 0px;
  font-size: 40px;
  border-bottom: 1px solid #666;
}
.login-box form input:nth-of-type(2){
  width: 540px;
  padding: 0 0 0 48px;
  margin-bottom: 0;
  background: url(../assets/images/login/lock.png) no-repeat;
  background-size: 28px;
  background-position: 0px;
  font-size: 40px;
  border-bottom: 1px solid #666;
}
.login-box form input:last-of-type{
  margin-top: 80px;
  color: white;
  background-color: #2491F2;
  border: none;
  border-radius: 60px;
  margin-bottom: 80px;
}
.login-box form input:last-of-type:hover{
  background-color: #2b11ee;
}
.login-box a{
  text-decoration: none;
  color: #6c6c6c;
  font-size: 40px;
}
.login-box a:hover{
  color: red;
}
</style>
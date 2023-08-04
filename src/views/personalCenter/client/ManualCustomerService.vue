<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="120" style="margin-left: 3%">
        <el-menu
            default-active="customerService"
            router
            :default-openeds="['6']"
            @select="handleSelect"
        >
          <el-menu-item index="personalCenterView">
            <span>个人中心</span>
          </el-menu-item>
          <el-sub-menu index="2">
            <template #title>
              <span>订单中心</span>
            </template>
            <el-menu-item index="busOrderView">车票订单</el-menu-item>
            <el-menu-item index="candidateOrderView">候补订单</el-menu-item>
          </el-sub-menu>
          <el-menu-item index="personalTicketView">
            <span>本人车票</span>
          </el-menu-item>
          <el-sub-menu index="4">
            <template #title>
              <span>个人信息</span>
            </template>
            <el-menu-item index="personalInformationView">查看信息</el-menu-item>
            <el-menu-item index="accountSecurityView">账号安全</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="5">
            <template #title>
              <span>投诉与建议</span>
            </template>
            <el-menu-item index="5-1">投诉</el-menu-item>
            <el-menu-item index="5-2">建议</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="6">
            <template #title>
              <span>客户服务</span>
            </template>
            <el-menu-item index="customerService">人工客服</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <el-main>
        <el-text style="float: left">
          人工客服
          <el-icon v-if="!staff.online" class="is-loading"><Loading/></el-icon>
        </el-text>
        <el-divider/>
        <div style="height: 300px">
          <el-scrollbar ref="scrollbar" max-height="300px" always>
            <div v-for="i in msg.list" :key="i">
              <div v-if="isShowDate()" class="message-time">
                {{i.time}}
              </div>
              <div v-if="i.belong === 'user'" class="message">
                <div style="float: right">
                  <el-avatar size="small" :src="image.user"/>
                </div>
                <div class="user-message">
                  <template v-if="i.text != ''">
                    {{ i.text }}
                  </template>
                  <template v-if="i.url != ''">
                    <img :src="i.url">
                  </template>
                </div>
              </div>
              <div v-if="i.belong === 'staff'" class="message">
                <div style="float: left">
                  <el-avatar size="small" :src="image.user"/>
                </div>
                <div class="staff-message">
                  <template v-if="i.text != ''">
                    {{ i.text }}
                  </template>
                  <template v-if="i.url != ''">
                    <img :src="i.url">
                  </template>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </div>
        <el-divider style="margin: 12px 0 2px 0"/>
        <div style="float: left;" >
          <el-upload
              style="float: left"
              :show-file-list="false"
              list-type="picture"
              accept="#"
              :on-change="fileChange"
              :auto-upload="false"
          >
            <el-icon class="tool"><PictureFilled /></el-icon>
          </el-upload>
          <el-icon class="tool"><Microphone /></el-icon>
        </div>
        <el-input
            v-model="msg.now"
            type="textarea"
            resize="none"
            autofocus
            :autosize="{minRows: 3, maxRows: 8}"
            ref="msgInput"
            @keydown.enter.prevent="sendMsg()"
        />
        <el-button
            style="float: right"
            type="primary"
            :disabled="msg.now.length===0"
            @click="sendMsg();msgInput.focus()"
        >发送
        </el-button>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import {nextTick, onMounted, onUnmounted, reactive, ref} from "vue";
import moment from "moment";
import {useStore} from "vuex";
import type { UploadFile } from 'element-plus'
import axios from "axios";
const msgInput = ref()
const scrollbar = ref()
const store = useStore()
let ws = null as any
let connected = false;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 10; // 最大重连次数
const RECONNECT_INTERVAL = 5000; // 重连间隔时间，单位为毫秒

const image = reactive({
  user: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
  upload: ''
})
const msg = reactive({
  list: [{text: '1',url: '',time: moment().format('YYYY-MM-DD HH:mm:ss'),belong: 'user'},
    {text: 2,url: '',time: moment().format('YYYY-MM-DD HH:mm:ss'),belong: 'user'},
    {text: 3,url: '',time: moment().format('YYYY-MM-DD HH:mm:ss'),belong: 'staff'}],
  now: '',
  lastDate: ''
})
const staff = reactive({
  online: false
})

onMounted(()=>{
  if('WebSocket' in window){
    console.log('浏览器支持WebSocket')
    connectWebSocket()
  }else{
    alert('浏览器不支持WebSocket！')
  }
})
//ws连接
const connectWebSocket = () => {
  if(connected) return
  ws = new WebSocket('ws://localhost:8081/customerService/'+store.state.account)
  ws.onopen = () => {
    connected = true;
    reconnectAttempts = 0;
    heartCheck.reset().start()
    console.log("WS 连接成功"+moment().format('YYYY-MM-DD HH:mm:ss'));
  };
  ws.onerror =()=>{
    console.log('WS error!')
  }
  ws.onmessage = (res: any) => {
    heartCheck.reset().start()
    if(res.data == 'pong'){
      // console.log('pong')
      return
    }
    console.log(res.data)
    const obj = JSON.parse(res.data)
    msg.list.push({text: obj.text, url: obj.url, time: obj.time,belong: obj.belong})
    setTimeout(callback, 1);
  }
  ws.onclose = () => {
    console.log('断线')
    heartCheck.reset()
    connected = false;
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      setTimeout(connectWebSocket, RECONNECT_INTERVAL);
      reconnectAttempts++;
    }
  }
}

onUnmounted(() => {
  ws.close();
  heartCheck.reset()
});

const sendMsg = () => {
  // console.log('state',ws.readyState)
  if(msg.now == '') return
  msg.list.push({text: msg.now, url: '',time: moment().format('YYYY-MM-DD HH:mm:ss'),belong: 'user'})
  ws.send(JSON.stringify({text: msg.now, url: '' as string, time: moment().format('YYYY-MM-DD HH:mm:ss'),
    belong: 'user',account:store.state.account,toPeo: 'admin'}));
  msg.now = ''
  setTimeout(callback, 1);
}
const callback = () =>{
  scrollbar.value.setScrollTop(99999)
}

const isShowDate = (nowDate: string) => {
  // console.log('is ',moment('2023-08-03 14:48:00').diff(moment(),"seconds"))
  let flag;
  if(msg.lastDate === ''){
    flag = true
  }else{
      if(moment(nowDate).diff(moment(msg.lastDate),"seconds") > 120){
        flag = true
      }else{
        flag = false
      }
  }
  msg.lastDate = nowDate
  return true
}
const fileChange = async (uploadFile: any) => {
  const formData = new FormData();
  formData.append('file', uploadFile.raw);
  const response = await axios.post('http://localhost:8081/utils/upload', formData);
  msg.list.push({text: '', url: response.data, time: moment().format('YYYY-MM-DD HH:mm:ss'), belong: 'user'})
  ws.send(JSON.stringify({text: '', url: response.data, time: moment().format('YYYY-MM-DD HH:mm:ss'),
    belong: 'user',account:store.state.account,toPeo: 'admin'}));
  setTimeout(callback, 500);
}


// 心跳检测
const heartCheck = {
  timeout: 5000,
  timeoutObj: null as any,
  serverTimeoutObj: null as any,
  reset: function () {
    clearTimeout(this.timeoutObj);
    clearTimeout(this.serverTimeoutObj);
    return this;
  },
  start: function () {
    const self = this;
    this.timeoutObj = setTimeout(function () {
      //这里发送一个心跳，后端收到后，返回一个心跳消息，
      //onmessage拿到返回的心跳就说明连接正常
      ws.send("ping");
      // console.log("ping!")
      //如果超过一定时间还没重置，说明后端主动断开了
      self.serverTimeoutObj = setTimeout(function () {
        //如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
        ws.close();
      }, self.timeout)
    }, this.timeout)
  }
};
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key)
  // router.push(store.state.route[key])
}
</script>

<style scoped>
/*:deep(.el-textarea__inner) {*/
/*  box-shadow: 0 0 0 0px;*/
/*}*/
/*:deep(.el-textarea__inner:hover) {*/
/*  box-shadow: 0 0 0 0px;*/
/*}*/
/*:deep(.el-textarea__inner:focus) {*/
/*  box-shadow: 0 0 0 0px;*/
/*}*/

.user-message{
  float: right;
  background-color: #d0e9ff;
  padding: 5px 10px;
  margin-right: 10px;
  border-radius: 4px;
  max-width: 80%;
  white-space: normal;
  word-break: break-all;
  text-align: initial;
}
.staff-message{
  float: left;
  background-color: #d0e9ff;
  padding: 5px 10px;
  margin-left: 10px;
  border-radius: 4px;
  max-width: 80%;
  white-space: normal;
  word-break: break-all;
  text-align: initial;
}
.message-time{
  font-size: 13px;
  color: #a1a6af;
  text-align: center;
  margin-bottom: 13px;
}
.message{
  margin-bottom: 20px;
}
.message img{
  width: 100px;
}
.tool{
  font-size: 23px;
  margin-left: 10px;
}
.tool :hover{
  background-color: #F1F1F1;
  cursor: pointer;
}

div:after, div:before {
  display: table;
  content: " ";
}
div:after {
  clear: both;
}
</style>

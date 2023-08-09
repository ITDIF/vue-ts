<template>
  <el-text style="float: left">
    用户
    <el-icon v-if="!staff.online" class="is-loading"><Loading/></el-icon>
  </el-text>
  <el-divider/>
  <div style="height: 300px">
    <el-scrollbar ref="scrollbar" max-height="300px" always>
      <div v-for="i in msg.list" :key="i">
        <div v-if="i.isShow" class="message-time">
          {{i.time}}
        </div>
        <div v-if="i.belong === 'staff'" class="message">
          <div style="float: right">
            <el-avatar size="small" :src="image.user"/>
          </div>
          <div class="user-message">
            <template v-if="i.text != ''">
              {{ i.text }}
            </template>
            <template v-if="i.url != ''">
              <el-image style="width: 100px;" :src="i.url" :preview-src-list="[i.url]" fit="cover"/>
            </template>
          </div>
        </div>
        <div v-if="i.belong === 'user'" class="message">
          <div style="float: left">
            <el-avatar size="small" :src="image.user"/>
          </div>
          <div class="staff-message">
            <template v-if="i.text != ''">
              {{ i.text }}
            </template>
            <template v-if="i.url != ''">
              <el-image style="width: 100px;" :src="i.url" :preview-src-list="[i.url]" fit="cover"/>
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
</template>

<script lang="ts" setup>
import {onMounted, onUnmounted, reactive, ref} from "vue";
import moment from "moment";
import {useStore} from "vuex";
import axios from "axios";
import {icons} from "@element-plus/icons-vue/dist/types/global";
import {useRoute} from "vue-router";
const msgInput = ref()
const scrollbar = ref()
const store = useStore()
let ws = null as any
let connected = false;
let reconnectAttempts = 0;
const route = useRoute()
const account = route.query.account
const MAX_RECONNECT_ATTEMPTS = 10; // 最大重连次数
const RECONNECT_INTERVAL = 5000; // 重连间隔时间，单位为毫秒
const image = reactive({
  user: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
})
const msg = reactive({
  list: [{text: '请问您有什么问题？', url: '',time: moment().format('YYYY-MM-DD HH:mm:ss'),belong: 'staff',isShow: true}],
  now: '',
  lastDate: '',
  url: ''
})
const staff = reactive({
  online: false
})

onMounted(()=>{
  axios.get('http://localhost:8081/utils/userMessage',{
    params:{
      listName: 'message-'+account
    }
  }).then((res)=>{
    // console.log(res.data)
    msg.list = res.data
    for (const i in msg.list) {
      msg.list[i].isShow = isShowDate(msg.list[i].time)
    }
    setTimeout(callback, 10);
  })
  if('WebSocket' in window){
    console.log('浏览器支持WebSocket')
    connectWebSocket()
  }else{
    alert('浏览器不支持WebSocket！')
  }
})
const connectWebSocket = () => {
  if(connected) return
  ws = new WebSocket('ws://localhost:8081/customerService/'+store.state.admin)
  ws.onopen = () => {
    connected = true;
    reconnectAttempts = 0;
    heartCheck.reset().start()
    console.log("WS连接成功"+moment().format('YYYY-MM-DD HH:mm:ss'));
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
    const obj = JSON.parse(res.data)
    msg.list.push({text: obj.text, url: obj.url, time: obj.time,belong: obj.belong,isShow: isShowDate(obj.time)})
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
  reconnectAttempts = 10
});
const sendMsg = () => {
  if(msg.now == '') return
  msg.list.push({text: msg.now, url: '', time: moment().format('YYYY-MM-DD HH:mm:ss'),
    belong: 'staff',isShow: isShowDate(moment().format('YYYY-MM-DD HH:mm:ss'))})
  ws.send(JSON.stringify({text: msg.now, url: '',time: moment().format('YYYY-MM-DD HH:mm:ss'),
    belong: 'staff',account:store.state.admin,toPeo: account}));
  msg.now = ''
  setTimeout(callback, 1);
}
const callback = () =>{
  scrollbar.value.setScrollTop(99999)
}

const isShowDate = (nowDate: string) => {
  // console.log('is ',moment().format('YYYY-MM-DD HH:mm:ss'))
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
  return flag
}
const fileChange = async (uploadFile: any) => {
  const formData = new FormData();
  formData.append('file', uploadFile.raw);
  const response = await axios.post('http://localhost:8081/utils/upload', formData);
  msg.list.push({text: '', url: response.data, time: moment().format('YYYY-MM-DD HH:mm:ss'),
    belong: 'staff',isShow: isShowDate(moment().format('YYYY-MM-DD HH:mm:ss'))})
  ws.send(JSON.stringify({text: '', url: response.data,time: moment().format('YYYY-MM-DD HH:mm:ss'),
    belong: 'staff',account:store.state.admin,toPeo: account}));
  setTimeout(callback, 250);
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

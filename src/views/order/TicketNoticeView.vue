<template>
  <el-card style="width: 50%; margin: auto;" v-for="e in orderInfo.data" id="pdfDom" v-loading="loading">
    <el-text size="large" style="color: black">行程信息提示</el-text><br>
    <el-text size="small">Trip Information Reminders</el-text>
    <el-divider border-style="dashed"/>
    <el-row>
      <el-col :span="3">
        <el-text size="small">开车时间</el-text>
      </el-col>
      <el-col :span="5">
        <el-text>
          {{moment(e.departure_time).format('YYYY')}}年
          <b>{{moment(e.departure_time).format('MM')}}</b>月
          <b>{{moment(e.departure_time).format('DD')}}</b>日
        </el-text>
      </el-col>
      <el-col :span="3">
        <el-text style="font-size: large">
          <b>{{moment(e.departure_time).format('HH:mm')}}</b>
        </el-text>
      </el-col>
    </el-row>
    <el-row style="margin-top: 10px;">
      <el-col :span="3" style="margin: auto 0;">
        <el-text style="font-size: large;color: black">{{e.from_station.slice(e.from_station.indexOf('市')+1)}}</el-text>
      </el-col>
      <el-col :span="4">
        {{e.route_number}}<br>
        <el-text>------------></el-text>
      </el-col>
      <el-col :span="3" style="margin: auto 0;">
        <el-text style="font-size: large;color: black">{{e.to_station.slice(e.to_station.indexOf('市')+1)}}</el-text>
      </el-col>
      <el-col :span="3" style="margin: auto 0;">
        <el-text size="large"><b>{{e.seat_id}}</b>号</el-text>
      </el-col>
      <el-col :span="2" style="margin: auto 0;">
        <el-text size="large">{{e.seat_type}}</el-text>
      </el-col>
    </el-row>
<!--    <el-row style="margin-top: 14px;">-->
<!--      <el-col :span="3">-->
<!--        <el-text size="large"><b>{{e.seat_id}}</b>号</el-text>-->
<!--      </el-col>-->
<!--      <el-col :span="2">-->
<!--        <el-text size="large">{{e.seat_type}}</el-text>-->
<!--      </el-col>-->
<!--    </el-row>-->
    <el-row style="margin-top: 14px;">
      <el-col :span="5">
        <el-text><b>限乘当日当次车</b></el-text>
      </el-col>
    </el-row>
    <el-row style="margin-top: 14px;">
      <el-col :span="2">
        <el-text><b>{{e.username}}</b></el-text>
      </el-col>
      <el-col :span="6">
        <el-text><b>{{e.id_number.slice(0,3)}}*****{{e.id_number.slice(15)}}</b></el-text>
      </el-col>
      <el-col :span="7">
        <el-text><b>订单号：{{e.order_number}}</b></el-text>
      </el-col>
      <el-col :span="5">
        <el-text>票价：{{e.price}} 元</el-text>
      </el-col>
    </el-row>
<!--    <el-row style="margin-top: 14px;">-->
<!--      <el-col :span="7">-->
<!--        <el-text><b>订单号：{{e.order_number}}</b></el-text>-->
<!--      </el-col>-->
<!--      <el-col :span="5">-->
<!--        <el-text>票价：{{e.price}} 元</el-text>-->
<!--      </el-col>-->
<!--    </el-row>-->
    <el-divider/>
    <el-text style="color: black;">温馨提示</el-text><br>
    <ul style="text-align: left; font-size: small; list-style-type: decimal;">
      <li>请持本人有效身份证件原件乘车，行程信息提示不作为乘车凭证使用，如改签、变更到站或退票 请 提 前办理。票、证、人不一致的，客运部门有权拒绝进站乘车。</li>
      <li>开车前提前停止检票，请提前到车站指定场所候车。</li>
      <li>需要报销的旅客，可在开车前或乘车日期之日起30日内，凭购票时使用的有效身份证件到车站指 定窗 口或自动售/取票机换取报销凭证。</li>
      <li>对无票乘车、冒用身份信息购票及使用伪造身份证件乘车、冒用优惠（待）身份证件乘车的，客运部门保留限制购票等权利。</li>
      <li>遇运行图调整导致已购车票汽车运行时刻变动的，客运部门免费提供改签和退票服务。</li>
      <li>遇灾害险情等特殊情况，须听从工作人员指挥安排。</li>
      <li>免费携带品上限为成人20千克、儿童10千克，长、宽、高之和不超过160厘米，超过规定请办理托运。不得携带可能威胁公共安全的禁止或限制运输物品、造成人身伤害的大件硬质物品、妨碍公共卫生及损坏污染车辆的物品。</li>
    </ul>
    <el-divider/>
    <el-text style="font-size: large;color: black;">请按行程信息提示乘车，祝您旅途愉快！</el-text><br>
    <el-text>
      打印时间：{{moment().format('YYYY-MM-DD HH:mm:ss')}}
    </el-text>
  </el-card>
  <el-card>
    <el-button type="primary" @click="printContent">打印</el-button>
    <el-button type="primary" @click="downloadPDF" >下载</el-button>
  </el-card>
</template>

<script lang="ts" setup>
import {onBeforeUpdate, onMounted, onUpdated, reactive, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import axios from "axios";
import moment from "moment";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const orderInfo = reactive({
  data: [] as any,
})
onMounted(()=>{
  orderInfo.data = [JSON.parse(route.query.order as string)]
})

async function downloadPDF() {
  loading.value = true
  const contentToDownload = document.getElementById('pdfDom') as HTMLElement;
  const canvas = await html2canvas(contentToDownload,{
    scale: 3
  });
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  const width = pdf.internal.pageSize.getWidth();
  const height = pdf.internal.pageSize.getHeight();
  pdf.addImage(imgData, 'PNG', 0, 0, width, height);
  const randomNum = Math.random().toString().slice(2, 20);
  pdf.save(randomNum+'.pdf');
  loading.value = false
}
async function printContent() {
  loading.value = true
  const contentToPrint = document.getElementById('pdfDom') as HTMLElement
  const canvas = await html2canvas(contentToPrint);
  const dataURL = canvas.toDataURL();
  const printWindow = window.open('', '_blank') as any;
  printWindow.document.write('<img src="' + dataURL + '" onload="window.print();window.close()" />');
  printWindow.document.close();
  loading.value = false
}

</script>

<style scoped>
ul li{
  margin-bottom: 10px;
}
</style>

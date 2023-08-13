<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="120" style="margin-left: 3%">
        <el-menu
            default-active="charteredBusView"
            router
            :default-openeds="['5']"
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
              <span>团购服务</span>
            </template>
            <el-menu-item index="charteredBusView">包车服务</el-menu-item>
            <el-menu-item index="myCharteredBusView">我的</el-menu-item>
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
        <el-breadcrumb separator="/" style="margin-bottom: 10px">
          <el-breadcrumb-item><b>团购服务</b></el-breadcrumb-item>
          <el-breadcrumb-item>包车服务</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card style="width: 90%;">
          <el-form
              ref="ruleFormRef"
              :rules="rules"
              :model="form"
              style="width: 40%;margin: auto;"
              label-width="80px"
          >
            <el-form-item label="车辆类型" prop="type">
              <el-select v-model="car.type">
                <el-option
                  v-for="e in car.options"
                  :key="e"
                  :label="e.label"
                  :value="e.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="车辆编号" prop="car_number">
              <el-select v-model="form.car_number">
                <el-option
                    v-for="e in options"
                    :key="e"
                    :label="e.label"
                    :value="e.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="租用日期" prop="date">
              <el-date-picker
                  v-model="date"
                  type="daterange"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  :disabled-date="disabledDate"
                  value-format="YYYY-MM-DD"
              />
            </el-form-item>
            <el-form-item label="租用天数">
              <el-input disabled v-model="form.day"/>
            </el-form-item>
            <el-form-item label="费用(元)">
              <el-input disabled v-model="form.cost"/>
            </el-form-item>
            <el-form-item label="用途" prop="notes">
              <el-input v-model="form.notes" placeholder="请简要概括用途"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :disabled="!isTrue()" @click="submit(ruleFormRef)">支付</el-button>
            </el-form-item>
          </el-form>
          <el-divider/>

        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import {useStore} from "vuex";
import {onMounted, reactive, ref, watch} from "vue";
import axios from "axios";
import moment from "moment";
import router from "@/router";
import {ElMessage, FormInstance, FormRules} from "element-plus";
const ruleFormRef = ref<FormInstance>()
const store = useStore()
const date = ref([])
const options = ref([] as any)
const car = reactive({
  options: [{label: '1',value: '2'}],
  type: '',
  price: 0,

})
const form = reactive({
  car_number: '',
  day: 0,
  cost: 0,
  notes: '',
  start_time: date.value[0],
  end_time: date.value[1]
})
watch(()=>car.type,(newV,oldV)=>{
  if(newV == '小型客车'){
    car.price = 600
  }else if(newV == '中型客车'){
    car.price = 1200
  }else if(newV == '大型客车'){
    car.price = 1800
  }
  form.cost = form.day * car.price
  notUseCar()
})
watch(date,(newV, oldV)=>{
  if(newV == null) {
    form.day = 0
    form.cost = 0
    return
  }
  form.start_time = date.value[0]
  form.end_time = date.value[1]
  form.day = moment(date.value[1]).diff(moment(date.value[0]),'days')+1
  form.cost = form.day * car.price
})
onMounted(()=>{
  // notUseCar()
  carRentalFees()
  axios.get('http://localhost:8081/login/gender',{
    params:{
      account: store.state.account
    }
  }).then((res)=>{

  })
})
const submit = (formEl: FormInstance | undefined) =>{
  console.log(form)
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      let data = JSON.stringify(form)
      axios.get('http://localhost:8081/car/addCharteredBus',{
        params:{
          data: data,
          account: store.state.account,
        }
      }).then((res)=>{
        console.log(res.data)
        if(res.data==1){
          ElMessage({
            message: "操作成功！",
            type: "success"
          })
          router.push('/myCharteredBusView');
        }else{
          ElMessage.error("操作失败！")
        }
      })
    } else {
      console.log('提交失败!')
      return false
    }
  })
}
const carRentalFees = () => {
  car.options = []
  axios.get('http://localhost:8081/car/queryCarRentalFees').then((res)=>{
    for (const i in res.data) {
      let e = res.data[i]
      let label = e.car_type+'('+e.busload+','+e.price+'元/天)'
      car.options.push({label: label, value: e.car_type});
    }
  })
  // console.log('car  ',car.options)
}
//未使用车辆
const notUseCar = () =>{
  options.value = []
  axios.get('http://localhost:8081/car/notUseCarByType',{
    params:{
      carType: car.type
    }
  }).then((res)=>{
    for (const i in res.data) {
      let e = res.data[i]
      let label = e.car_number+' (核载'+e.passenger_capacity+'人,'+e.seat_type+')'
      options.value.push({label: label, value: e.car_number});
    }
  })
  // console.log(options.value)
}
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key)
  // router.push(store.state.route[key])
}
//限制可选日期
const disabledDate = (time: Date) => {
  return time.getTime() < Date.now()-86400000
}
const isTrue = () => {
  return car.type != '' && form.car_number != '' && form.notes != ''
}
const rules = reactive<FormRules>({
  car_number:[
    { required: true, message: '请选择车辆编号', trigger: 'blur'},
  ],
  notes:[
    { required: true, message: '请输入用途', trigger: 'blur'},
  ],
})
</script>

<style scoped>
.el-main{
  padding-top: 2px;
}
</style>

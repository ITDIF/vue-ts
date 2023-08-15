<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <el-menu
            mode="horizontal"
            :ellipsis="false"
            active-text-color="none"
            router
        >
          <el-menu-item style="font-size: 20px" @click="router.go(0)"><b>后台管理系统</b></el-menu-item>
          <div class="flex-grow" />
          <el-menu-item style="height: auto;">
            <el-tooltip  content="全屏" placement="bottom">
              <el-icon style="margin: 0;"><FullScreen /></el-icon>
            </el-tooltip>
          </el-menu-item>
          <el-sub-menu index="sys">
            <template #title>个人中心</template>
            <el-menu-item index="adminInformation"><el-icon><User /></el-icon>用户信息</el-menu-item>
<!--            <el-menu-item><el-icon><Setting /></el-icon>用户设置</el-menu-item>-->
            <el-menu-item @click="quit"><el-icon><CloseBold /></el-icon>退出登录</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-header>
      <el-container>
        <el-aside width="{{isCollapse?0:'150px'}}">
          <el-menu
              default-active="defaultActive"
              class="el-menu-vertical-demo"
              router
              :collapse="isCollapse"
              @select="handleSelect"
          >
            <el-menu-item index="homes">
              <el-icon><location /></el-icon>
              <template #title>
                <span>首页</span>
              </template>
            </el-menu-item>
            <el-sub-menu index="sys">
              <template #title>
                <el-icon><setting /></el-icon>
                <span>系统管理</span>
              </template>
              <el-sub-menu index="4">
                <template #title><el-icon><List /></el-icon>订单管理</template>
                <el-menu-item index="orders"><el-icon><Tickets /></el-icon>订单</el-menu-item>
                <el-menu-item index="orderTem"><el-icon><Memo /></el-icon>临时订单</el-menu-item>
                <el-menu-item index="candidates"><el-icon><Document /></el-icon>候补订单</el-menu-item>
              </el-sub-menu>
<!--              <el-menu-item index="orders"><el-icon><Tickets /></el-icon>订单管理</el-menu-item>-->
              <el-menu-item index="tickets"><el-icon><Ticket /></el-icon>车票管理</el-menu-item>
              <el-menu-item index="routers"><el-icon><Guide /></el-icon>车次管理</el-menu-item>
              <el-menu-item index="cars"><el-icon><Van /></el-icon>车辆管理</el-menu-item>
              <el-menu-item index="users"><el-icon><User /></el-icon>用户管理</el-menu-item>
              <el-menu-item index="admins"><el-icon><Avatar /></el-icon>管理员</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="5">
              <template #title>
                <el-icon><Management /></el-icon>
                <span>客户服务</span>
              </template>
              <el-menu-item index="customerLists"><el-icon><Connection /></el-icon>接待列表</el-menu-item>
              <el-menu-item index="customerServices"><el-icon><ChatLineSquare /></el-icon>接待</el-menu-item>
            </el-sub-menu>
          </el-menu>
          <el-affix>
            <el-button @click="isCollapse = !isCollapse">
              <el-icon v-if="!isCollapse" size="large"><Fold /></el-icon>
              <el-icon v-if="isCollapse" size="large"><Expand /></el-icon>
            </el-button>
          </el-affix>
        </el-aside>
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref, watch} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {useStore} from "vuex";
import {useRouter} from "vue-router";
import {Plus} from "@element-plus/icons-vue";
const store = useStore()
const router = useRouter()
const isCollapse = ref(false)
const defaultActive = ref()
const handle = ref()
const quit = () => {
  ElMessageBox.confirm(
      '是否退出账户',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
  ).then(() => {
    store.commit('changeAdmin','000')
    ElMessage({
      type: 'success',
      message: '成功退出',
    })
    router.push('/')
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '操作取消',
    })
  })
}
watch(defaultActive,(newValue, oldValue)=>{
  console.log('watch ',oldValue,newValue)
})
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key,handle.value)
  defaultActive.value = key

  // router.push(key)
}
</script>

<style>
.flex-grow {
  flex-grow: 1;
}
.el-menu--collapse .el-menu .el-submenu, .el-menu--popup{
  min-width: 100px!important;
}

</style>

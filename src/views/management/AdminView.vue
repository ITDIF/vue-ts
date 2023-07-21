<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <el-menu
            mode="horizontal"
            :ellipsis="false"
            active-text-color="none"
        >
          <el-menu-item index="0">后台管理系统</el-menu-item>
          <div class="flex-grow" />
          <el-menu-item index="1" style="height: auto;">
            <el-tooltip  content="全屏" placement="bottom">
              <el-icon style="margin: 0;"><FullScreen /></el-icon>
            </el-tooltip>
          </el-menu-item>
          <el-sub-menu index="2">
            <template #title>个人中心</template>
            <el-menu-item index="2-1"><el-icon><User /></el-icon>用户信息</el-menu-item>
            <el-menu-item index="2-2"><el-icon><Setting /></el-icon>用户设置</el-menu-item>
            <el-menu-item @click="quit"><el-icon><CloseBold /></el-icon>退出登录</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-header>
      <el-container>
        <el-aside width="{{isCollapse?0:'150px'}}">
          <el-menu
              default-active="sys/order"
              class="el-menu-vertical-demo"
              router
              :collapse="isCollapse"
          >
            <el-menu-item>
              <el-icon><location /></el-icon>
              <template #title>
                <span>Navigator One</span>
              </template>
            </el-menu-item>
            <el-menu-item index="3">
              <el-icon><document /></el-icon>
              <template #title>Navigator</template>
            </el-menu-item>
            <el-sub-menu index="sys">
              <template #title>
                <el-icon><setting /></el-icon>
                <span>系统管理</span>
              </template>
              <el-menu-item index="orders"><el-icon><Tickets /></el-icon>订单管理</el-menu-item>
              <el-menu-item index="tickets"><el-icon><Ticket /></el-icon>车票管理</el-menu-item>
              <el-menu-item index="routers"><el-icon><Guide /></el-icon>车次管理</el-menu-item>
              <el-menu-item index="cars"><el-icon><Van /></el-icon>车辆管理</el-menu-item>
              <el-menu-item index="users"><el-icon><User /></el-icon>用户管理</el-menu-item>
              <el-menu-item index="admins"><el-icon><Avatar /></el-icon>管理员</el-menu-item>
            </el-sub-menu>
          </el-menu>
          <el-affix>
            <el-button @click="click">
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
import {ref} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {useStore} from "vuex";
import {useRouter} from "vue-router";
const store = useStore()
const router = useRouter()
const isCollapse = ref(false)

const click = () => {
  isCollapse.value = !isCollapse.value
}

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

</script>

<style>
.flex-grow {
  flex-grow: 1;
}
.el-menu--collapse .el-menu .el-submenu, .el-menu--popup{
  min-width: 100px!important;
}

</style>

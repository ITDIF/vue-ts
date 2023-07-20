<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <el-menu
            mode="horizontal"
            :ellipsis="false"
            active-text-color="none"
        >
          <el-menu-item index="0">客运售票系统</el-menu-item>
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
            <el-menu-item index="2-3"><el-icon><CloseBold /></el-icon>退出登录</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-header>
      <el-container>
        <el-aside width="180px">
          <el-menu
              default-active="2"
              class="el-menu-vertical-demo"
          >
            <el-menu-item index="1">
              <template #title>
                <el-icon><location /></el-icon>
                <span>Navigator One</span>
              </template>
            </el-menu-item>
            <el-menu-item index="3" disabled>
              <el-icon><document /></el-icon>
              <template #title>Navigator Three</template>
            </el-menu-item>
            <el-sub-menu index="4">
              <template #title>
                <el-icon><setting /></el-icon>系统管理
              </template>
              <el-menu-item index="order"><el-icon><Tickets /></el-icon>订单管理</el-menu-item>
              <el-menu-item><el-icon><Ticket /></el-icon>车票管理</el-menu-item>
              <el-menu-item>用户管理</el-menu-item>
              <el-menu-item>管理员</el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>


</script>

<style>
.flex-grow {
  flex-grow: 1;
}
.el-menu--collapse .el-menu .el-submenu, .el-menu--popup{
  min-width: 100px!important;
}

</style>

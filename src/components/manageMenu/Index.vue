<template>
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
    <el-menu-item index="2">
      <el-icon><icon-menu /></el-icon>
      <template #title>Navigator Two</template>
    </el-menu-item>
    <el-menu-item index="3" disabled>
      <el-icon><document /></el-icon>
      <template #title>Navigator Three</template>
    </el-menu-item>
    <el-sub-menu index="4">
      <template #title>
        <el-icon><setting /></el-icon>系统管理
      </template>
      <el-menu-item><el-icon><Tickets /></el-icon>订单管理</el-menu-item>
      <el-menu-item><el-icon><Ticket /></el-icon>车票管理</el-menu-item>
      <el-menu-item>用户管理</el-menu-item>
      <el-menu-item>管理员</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script>
export default {
  name: "index"
}
</script>

<style scoped>
.el-menu--collapse .el-menu .el-submenu, .el-menu--popup{
  min-width: 100px!important;
}
</style>

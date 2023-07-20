<template>
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
</template>

<script>
export default {
  name: "index"
}
</script>

<style scoped>
.flex-grow {
  flex-grow: 1;
}
</style>

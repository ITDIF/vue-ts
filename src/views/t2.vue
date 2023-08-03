<template>
  <el-upload action="#" list-type="picture-card" :auto-upload="false" :on-change="change">
    <el-icon><Plus /></el-icon>

    <template #file="{ file }">
      <div>
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
      </div>
    </template>
  </el-upload>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { Delete, Download, Plus, ZoomIn } from '@element-plus/icons-vue'

import type { UploadFile } from 'element-plus'


const change = (uploadFile: any) =>{
  console.log('change',uploadFile)
}
</script>

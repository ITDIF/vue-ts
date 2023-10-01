<template>
  <div>
    <el-upload
        action="#"
        :before-upload="handleBeforeUpload"
        :on-change="handleUpload"
        :auto-upload="false"
    >
      <el-button slot="trigger" size="small" type="primary">点击上传</el-button>
    </el-upload>
  </div>
</template>

<script lang="ts" setup>
import { read, readFile, utils } from 'xlsx';
import * as XLSX from 'xlsx';

const handleBeforeUpload = (file: any) => {
  const allowedExtensions = ['.xlsx', '.xls'];
  const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

  if (!allowedExtensions.includes(extension)) {
    // this.message.error('只允许上传Excel文件');
    return false;
  }
  return true;
}
const handleUpload = (file: any) => {
  const reader = new FileReader()
  // reader.readAsBinaryString(file)
  const data = new Uint8Array(file);
  const workbook = XLSX.read(data, { type: 'array' });

  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  console.log(jsonData); // 数据在这里
}
const handleFileUpload = (file: any) => {
  const reader = new FileReader();

  reader.onload = (e) => {
    const data = new Uint8Array((e.target as FileReader).result as ArrayBuffer);
    const workbook = XLSX.read(data, { type: 'array' });

    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    console.log(jsonData); // 数据在这里
  };

  reader.readAsArrayBuffer(file);
};
</script>

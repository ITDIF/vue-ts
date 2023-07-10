<template>
  <div>
    <div id="content-to-print">
      <h1>这是一个将被打印和下载的标题</h1>
      <p>这是一段将被打印和下载的文本内容。</p>
    </div>
    <button @click="printContent">打印内容</button>
    <button @click="downloadContent">下载内容为PDF</button>
  </div>
</template>

<script>
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default {
  methods: {
    async printContent() {
      const contentToPrint = document.getElementById('content-to-print');
      const canvas = await html2canvas(contentToPrint);
      const dataURL = canvas.toDataURL();
      const printWindow = window.open('', '_blank');
      printWindow.document.write('<img src="' + dataURL + '" onload="window.print();window.close()" />');
      printWindow.document.close();
    },

    async downloadContent() {
      const contentToDownload = document.getElementById('content-to-print');
      const canvas = await html2canvas(contentToDownload);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      pdf.save('content.pdf');
    },
  },
};
</script>

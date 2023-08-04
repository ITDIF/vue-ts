<template>
  <div class="chat-box" ref="chatBox" @scroll="handleScroll">
    <el-scrollbar>
      <div class="chat-content">
        1
        <!-- 聊天内容 -->
      </div>
    </el-scrollbar>
  </div>
</template>

<script>

export default {
  methods: {
    handleScroll() {
      const chatBox = this.$refs.chatBox;
      const contentHeight = chatBox.scrollHeight;
      const scrollTop = chatBox.scrollTop;
      const clientHeight = chatBox.clientHeight;
      if (scrollTop + clientHeight >= contentHeight) {
        // 滚动到底部
        chatBox.scrollTop = contentHeight - clientHeight;
      }
    }
  }
}
</script>

<template>
  <div>
    <button @mousedown="startSpeechRecognition">开始语音识别</button>
    <p>{{ transcript }}</p>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const transcript = ref('');

    const startSpeechRecognition = () => {
      const recognition = new window.webkitSpeechRecognition();

      recognition.onresult = (event) => {
        const result = event.results[0][0].transcript;
        transcript.value = result;
      };
      console.log(recognition)
      recognition.start();
    };
    return {
      transcript,
      startSpeechRecognition
    };
  }
};
</script>

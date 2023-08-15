<template>
  <div>
    <button @click="startRecording" :disabled="isRecording">开始录音</button>
    <button @click="stopRecording" :disabled="!isRecording">停止录音</button>
    <button @click="playRecording" :disabled="isPlaying">播放录音</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      mediaRecorder: null as MediaRecorder | null,
      audioChunks: [] as Blob[],
      isRecording: false,
      isPlaying: false,
    };
  },
  methods: {
    startRecording() {
      navigator.mediaDevices.getUserMedia({ audio: true })
          .then((stream) => {
            this.mediaRecorder = new MediaRecorder(stream);
            this.mediaRecorder.addEventListener('dataavailable', (event) => {
              if (event.data.size > 0) {
                this.audioChunks.push(event.data);
              }
            });
            this.mediaRecorder.start();
            this.isRecording = true;
          })
          .catch((error) => {
            console.error('Error accessing microphone:', error);
          });
    },
    stopRecording() {
      if (this.mediaRecorder) {
        this.mediaRecorder.stop();
        this.mediaRecorder = null;
        this.isRecording = false;
      }
    },
    playRecording() {
      if (this.audioChunks.length === 0) {
        console.warn('No recording available');
        return;
      }

      const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);

      const audio = new Audio(audioUrl);
      audio.play();
      audio.addEventListener('ended', () => {
        URL.revokeObjectURL(audioUrl);
        this.isPlaying = false;
      });

      this.isPlaying = true;
    },
  },
});
</script>

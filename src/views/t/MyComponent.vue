// MyComponent.vue
<template>
  <div>
    <h1>{{ message }}</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MyComponent',
  props: {
    message: {
      type: String,
      required: true
    }
  },
  setup(props) {
    return {
      message: props.message
    };
  }
});
</script>

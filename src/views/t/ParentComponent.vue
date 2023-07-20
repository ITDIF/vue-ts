// ParentComponent.vue
<template>
  <div>
    <my-component :message="'Hello from parent'"></my-component>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent } from 'vue';
import MyComponent from './MyComponent.vue';

defineComponent({
  components: {
    'my-component': MyComponent
  }
});
</script>

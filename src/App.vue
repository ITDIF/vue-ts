<template>
  <div v-if="store.state.admin === '000'"><user/></div>
<!--  <div v-if="store.state.account === '000'"><admin/></div>-->
  <div v-if="store.state.admin !== '000'"><router-view/></div>
</template>
<script lang="ts" setup>
import {defineComponent, onBeforeMount, ref} from 'vue';
import Admin from '@/components/admin/Index.vue'
import User from '@/components/user/Index.vue'
import {useStore} from "vuex";
const store = useStore()
defineComponent({
  components: {
    Admin,
    User
  }
});
// store.commit('changeAdmin','000')
// store.commit('changeAccount','000')
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>

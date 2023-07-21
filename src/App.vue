<template>
  <div v-if="store.state.admin === '000'"><user/></div>
<!--  <div v-if="store.state.admin !== '000'"><admin/></div>-->
  <div v-if="store.state.admin !== '000'"><router-view/></div>
<!--  <router-view/>-->
</template>
<script lang="ts" setup>
import {defineComponent, onBeforeMount, onUnmounted, ref} from 'vue';
import Admin from '@/components/admin/Index.vue'
import User from '@/components/user/Index.vue'
import {useStore} from "vuex";
import router from "@/router";
import {useRoute} from "vue-router";
const store = useStore()
const route = useRoute()
defineComponent({
  components: {
    Admin,
    User
  }
});
console.log('admin',store.state.admin)
console.log('account',store.state.account)

onBeforeMount(()=>{
  // if(store.state.admin !== '000'){
  //   router.push('/sys')
  // }
})


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

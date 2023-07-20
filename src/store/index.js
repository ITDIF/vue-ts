import { createStore } from 'vuex'
import createVuexAlong from 'vuex-along' //导入插件
export default createStore({
  state: {
    account: '000',
    admin: '000',
    password: '000',
    username: '000',
    login: '登录',
    register: '注册',
    count: 0
  },
  getters: {
  },
  mutations: {
    increment(state) {
      state.count += 10;
    },
    changeAccount(state,account){
      state.account = account
    },
    changeAdmin(state,admin){
      state.admin = admin
    },
    changePassword(state,password){
      state.password = password
    },
    changeUsername(state,username){
      state.username = username
    },
    changeLogin(state,login){
      state.login = login
    },
    changeRegister(state,register){
      state.register = register
    }
  },
  actions: {

  },
  modules: {
  },
  plugins: [createVuexAlong()]

})




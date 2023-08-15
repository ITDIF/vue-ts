import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import store from "@/store";

const backgroundFiles = require.context('./backgroundModules', true, /\.ts$/)
let backgroundModules: Array<RouteRecordRaw> = []
backgroundFiles.keys().forEach((key) => {
  if (key === './index.ts') return
  backgroundModules = backgroundModules.concat(backgroundFiles(key).default)
})
// const customFiles = require.context('./customModules', true, /\.ts$/)
// let customModules: Array<RouteRecordRaw> = []
// customFiles.keys().forEach((key) => {
//   if (key === './index.ts') return
//   customModules = customModules.concat(customFiles(key).default)
// })
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    beforeEnter: (to: any, from: any, next: any) => {
      if(store.state.admin != '000'){
        next('/sys/orders')
      }else{
        next()
      }
    }
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path:'/user',
    name:'About',
    component: () => import('../views/user/User.vue')
  },
  {
    path:'/login',
    name:'login',
    component: () => import('../views/user/LoginView.vue')
  },
  {
    path:'/fastLogin',
    name:'fastLogin',
    component: () => import('../views/user/FastLoginView.vue')
  },
  {
    path:'/test',
    name:'test',
    component: () => import('../views/Test.vue')
  },
  {
    path:'/register',
    name:'register',
    component: () => import('../views/user/RegisterView.vue')
  },
  {
    path:'/t2',
    name:'t2',
    component: () => import('../views/t2.vue')
  },
  {
    path:'/ticket',
    name:'ticket',
    component: () => import('../views/order/TicketView.vue')
  },
  {
    path:'/ticketShow',
    name:'ticketShow',
    component: () => import('../views/TicketShowView.vue')
  },
  {
    path:'/order',
    name:'order',
    component: () => import('../views/order/OrderView.vue')
  },
  {
    path:'/reOrder',
    name:'reOrder',
    component: () => import('../views/order/ReOrderView.vue')
  },
  {
    path:'/pay',
    name:'pay',
    component: () => import('../views/order/PayView.vue')
  },
  {
    path:'/rebookPayView',
    name:'rebookPayView',
    component: () => import('../views/order/RebookPayView.vue')
  },
  {
    path:'/candidate',
    name:'CandidateView',
    component: () => import('../views/order/CandidateView.vue')
  },
  {
    path:'/ticketNoticeView',
    name:'TicketNoticeView',
    component: () => import('../views/order/TicketNoticeView.vue')
  },
  {
    path:'/personalCenterView',
    name:'PersonalCenterView',
    component: () => import('../views/personalCenter/PersonalCenterView.vue')
  },
  {
    path:'/busOrderView',
    name:'BusOrderView',
    component: () => import('../views/personalCenter/BusOrderView.vue')
  },
  {
    path:'/candidatePayView',
    name:'CandidatePayView',
    component: () => import('../views/order/CandidatePayView.vue')
  },
  {
    path:'/candidateOrderView',
    name:'CandidateOrderView',
    component: () => import('../views/personalCenter/CandidateOrderView.vue')
  },
  {
    path:'/personalTicketView',
    name:'PersonalTicketView',
    component: () => import('../views/personalCenter/PersonalTicketView.vue')
  },
  {
    path:'/personalInformationView',
    name:'PersonalInformationView',
    component: () => import('../views/personalCenter/PersonalInformationView.vue')
  },
  {
    path:'/accountSecurityView',
    name:'AccountSecurityView',
    component: () => import('../views/personalCenter/AccountSecurityView.vue')
  },
  {
    path:'/charteredBusView',
    name:'CharteredBusView',
    component: () => import('../views/personalCenter/groupBuying/CharteredBusView.vue')
  },
  {
    path:'/myCharteredBusView',
    name:'MyCharteredBusView',
    component: () => import('../views/personalCenter/groupBuying/MyCharteredBusView.vue')
  },
  {
    path:'/changeEmailView',
    name:'ChangeEmailView',
    component: () => import('../views/personalCenter/security/ChangeEmailView.vue')
  },
  {
    path:'/forgetPassword',
    name:'ForgetPassword',
    component: () => import('../views/user/ForgetPasswordView.vue')
  },
  {
    path:'/changePasswordView',
    name:'ChangePasswordView',
    component: () => import('../views/personalCenter/security/ChangePasswordView.vue')
  },
  {
    path:'/changePhoneView',
    name:'ChangePhoneView',
    component: () => import('../views/personalCenter/security/ChangePhoneView.vue')
  },
  {
    path: '/customerService',
    name: 'customerService',
    component: () => import('../views/personalCenter/client/ManualCustomerService.vue'),
  },
    ...backgroundModules,
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  // const token = localStorage.getItem('token');
  // const isAuthenticated = token && jwt.verify(token, 'your-secret-key'); // replace 'your-secret-key' with your actual secret key
  //
  // if (to.meta.requiresAuth && !isAuthenticated) {
  //   next({ name: 'Login' });
  // } else if (to.meta.guestOnly && isAuthenticated) {
  //   next({ name: 'Home' });
  // } else {
  //   next();
  // }
  next()
  // console.log('route ',to.path,store.state.admin)
});


export default router



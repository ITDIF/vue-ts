import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
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
    path:'/pay',
    name:'pay',
    component: () => import('../views/order/PayView.vue')
  },
  {
    path:'/candidate',
    name:'CandidateView',
    component: () => import('../views/order/CandidateView.vue')
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
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router



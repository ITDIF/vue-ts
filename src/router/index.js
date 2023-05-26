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
    component: () => import('../views/User.vue')
  },
  {
    path:'/login',
    name:'login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path:'/test',
    name:'test',
    component: () => import('../views/Test.vue')
  },
  {
    path:'/register',
    name:'register',
    component: () => import('../views/RegisterView.vue')
  },
  {
    path:'/t2',
    name:'t2',
    component: () => import('../views/t2.vue')
  },
  {
    path:'/ticket',
    name:'ticket',
    component: () => import('../views/TicketView.vue')
  },
  {
    path:'/ticketShow',
    name:'ticketShow',
    component: () => import('../views/TicketShowView.vue')
  },
  {
    path:'/order',
    name:'order',
    component: () => import('../views/OrderView.vue')
  },
  {
    path:'/pay',
    name:'pay',
    component: () => import('../views/PayView.vue')
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router



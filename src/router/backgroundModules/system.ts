import { RouteRecordRaw } from 'vue-router'
const System: Array<RouteRecordRaw> = [
    {
        path: '/sys',
        name: 'sys',
        component: () => import('@/views/management/AdminView.vue'),
        children: [
            {
                path: 'orders',
                name: 'orders',
                component: () => import('@/views/management/system/OrderView.vue')
            },
            {
                path: 'candidates',
                name: 'candidates',
                component: () => import('@/views/management/system/CandidateView.vue')
            },
            {
                path: 'orderTem',
                name: 'orderTem',
                component: () => import('@/views/management/system/OrderTemView.vue')
            },
            {
                path: 'tickets',
                name: 'tickets',
                component: () => import('@/views/management/system/TicketView.vue')
            },
            {
                path: 'cars',
                name: 'cars',
                component: () => import('@/views/management/system/CarView.vue')
            },
            {
                path: 'routers',
                name: 'routers',
                component: () => import('@/views/management/system/RouterView.vue')
            },
            {
                path: 'users',
                name: 'users',
                component: () => import('@/views/management/system/UserView.vue')
            },
            {
                path: 'admins',
                name: 'admins',
                component: () => import('@/views/management/system/AdminView.vue')
            },
            {
                path: 'customerServices',
                name: 'customerServices',
                component: () => import('@/views/management/customerService/CustomerService.vue')
            },
        ]
    },
]
export default System

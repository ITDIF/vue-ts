import { RouteRecordRaw } from 'vue-router'
const System: Array<RouteRecordRaw> = [
    {
        path: '/sys',
        name: 'sys',
        component: () => import('@/views/management/AdminView.vue'),
        children: [
            {
                path: 'order',
                name: 'order',
                component: () => import('@/views/management/system/OrderView.vue')
            },
            {
                path: 'ticket',
                name: 'ticket',
                component: () => import('@/views/management/system/TicketView.vue')
            },
            {
                path: 'user',
                name: 'user',
                component: () => import('@/views/management/system/UserView.vue')
            },
            {
                path: 'admin',
                name: 'admin',
                component: () => import('@/views/management/system/AdminView.vue')
            },
        ]
    },
]
export default System

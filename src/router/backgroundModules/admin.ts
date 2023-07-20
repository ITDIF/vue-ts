import { RouteRecordRaw } from 'vue-router'
const Admin: Array<RouteRecordRaw> = [
    {
        path: '/admin',
        name: 'Admin',
        component: () => import('@/views/management/AdminView.vue')
    },
    {
        path: '/sysOrder',
        name: 'sysOrder',
        component: () => import('@/views/management/system/OrderView.vue')
    },
    {
        path: '/sysTicket',
        name: 'sysTicket',
        component: () => import('@/views/management/system/TicketView.vue')
    },
    {
        path: '/sysUser',
        name: 'sysUser',
        component: () => import('@/views/management/system/UserView.vue')
    },
    {
        path: '/sysAdmin',
        name: 'sysAdmin',
        component: () => import('@/views/management/system/AdminView.vue')
    },
]
export default Admin

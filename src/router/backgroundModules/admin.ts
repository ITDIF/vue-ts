import { RouteRecordRaw } from 'vue-router'
const Admin: Array<RouteRecordRaw> = [
    {
        path: '/admin',
        name: 'Admin',
        component: () => import('@/views/management/AdminView.vue')
    },
    {
        path: '/adminLogin',
        name: 'adminLogin',
        component: () => import('@/views/management/admin/LoginView.vue')
    },

]
export default Admin

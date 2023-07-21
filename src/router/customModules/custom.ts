import { RouteRecordRaw } from 'vue-router'
const Custom: Array<RouteRecordRaw> = [
    {
        path: '/custom',
        name: 'custom',
        component: () => import('@/layout/custom/Index.vue'),
        children:[
            {
                path:'/homes',
                name:'homes',
                component: () => import('@/views/HomeView.vue')
            },
            {
                path:'/logins',
                name:'logins',
                component: () => import('@/views/user/LoginView.vue')
            },
            {
                path:'/registers',
                name:'registers',
                component: () => import('@/views/user/RegisterView.vue')
            },
            {
                path:'/tickets',
                name:'tickets',
                component: () => import('@/views/order/TicketView.vue')
            },
            {
                path:'/ticketShows',
                name:'ticketShows',
                component: () => import('@/views/TicketShowView.vue')
            },
            {
                path:'/orders',
                name:'orders',
                component: () => import('@/views/order/OrderView.vue')
            },
            {
                path:'/reOrders',
                name:'reOrders',
                component: () => import('@/views/order/ReOrderView.vue')
            },
            {
                path:'/pays',
                name:'pays',
                component: () => import('@/views/order/PayView.vue')
            },
            {
                path:'/rebookPayViews',
                name:'rebookPayViews',
                component: () => import('@/views/order/RebookPayView.vue')
            },
            {
                path:'/candidates',
                name:'CandidateViews',
                component: () => import('@/views/order/CandidateView.vue')
            },
            {
                path:'/ticketNoticeViews',
                name:'TicketNoticeViews',
                component: () => import('@/views/order/TicketNoticeView.vue')
            },
            {
                path:'/personalCenterViews',
                name:'PersonalCenterViews',
                component: () => import('@/views/personalCenter/PersonalCenterView.vue')
            },
            {
                path:'/busOrderViews',
                name:'BusOrderViews',
                component: () => import('@/views/personalCenter/BusOrderView.vue')
            },
            {
                path:'/candidatePayViews',
                name:'CandidatePayViews',
                component: () => import('@/views/order/CandidatePayView.vue')
            },
            {
                path:'/candidateOrderViews',
                name:'CandidateOrderViews',
                component: () => import('@/views/personalCenter/CandidateOrderView.vue')
            },
            {
                path:'/personalTicketViews',
                name:'PersonalTicketViews',
                component: () => import('@/views/personalCenter/PersonalTicketView.vue')
            },
            {
                path:'/personalInformationViews',
                name:'PersonalInformationViews',
                component: () => import('@/views/personalCenter/PersonalInformationView.vue')
            },
            {
                path:'/accountSecurityViews',
                name:'AccountSecurityViews',
                component: () => import('@/views/personalCenter/AccountSecurityView.vue')
            },
            {
                path:'/changeEmailViews',
                name:'ChangeEmailViews',
                component: () => import('@/views/personalCenter/security/ChangeEmailView.vue')
            },
            {
                path:'/changePasswordViews',
                name:'ChangePasswordViews',
                component: () => import('@/views/personalCenter/security/ChangePasswordView.vue')
            },
            {
                path:'/changePhoneViews',
                name:'ChangePhoneViews',
                component: () => import('@/views/personalCenter/security/ChangePhoneView.vue')
            },
        ]
    }
]
export default Custom

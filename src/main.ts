import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 设定moment区域为中国
import moment from "moment";
import 'moment/locale/zh-cn'
moment.locale('zh-cn');
import { ElCollapseTransition } from 'element-plus'

// @ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

import axios from "axios";
const app = createApp(App)
app.config.globalProperties.$axios = axios
app.use(store)
app.use(router)
// app.use(ElementPlus)
app.use(ElementPlus, {
    locale: zhCn,
})
// 从 @element-plus/icons-vue 中导入所有图标并进行全局注册
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.mount('#app')



//element-ui-plus 一个动画帧内，ResizeObserver不能处理所有的observations，
// 导致ResizeObserver loop limit exceeded
const debounce = (fn :any,delay:any,...value:any) => {
    let timer:any= null;
    return ()=> {
        let context= this;
        let args = value;
        clearTimeout(timer);
        timer = setTimeout(function () {
            fn.apply(context, args);
        }, delay);
    }
}
const _ResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends _ResizeObserver{
    constructor(callback:any) {
        callback = debounce(callback, 16);
        super(callback);
    }
}



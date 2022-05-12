import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import request from './utils/request'
import useElementImport from './utils/elementPlusImport'
import useMyDirective from './utils/directive'

// elmentui样式
import 'element-plus/dist/index.css'
// 全局样式
import "./assets/style/globalStyle.css"
// icon图标
import "./assets/iconfont/iconfont.css"


const app = createApp(App)
app.config.globalProperties.$axios = request
// 封装的按需导入elment plus
useElementImport(app)
// 注册自定义指令
useMyDirective(app)


app.use(router)
app.mount('#app')

// createApp(App).use(router).use(ElementPlus).mount('#app')

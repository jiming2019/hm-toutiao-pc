// main.js是我们的入口文件，主要作用是初始化vue实例，并引入所需要的插件
import Vue from 'vue'

// 配置element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import App from './App.vue'
// 导入某一个目录，默认会去找索引文件(index.js inde.vue index.json)) 基于webpack
// @是起的别名，指的是/src路径
import router from '@/router'

// 配置axios
import axios from '@/api'

// 全局注册面包屑组件(弃用)，封装了面包屑插件，所以不用在这里引入
// import BreadCrumb from '@/components/common/bread-crumb'
// Vue.component('my-bread', BreadCrumb)

// 全局注册插件
import plugin from '@/components/plugin'
Vue.use(plugin)

Vue.prototype.$http = axios
Vue.use(ElementUI)
Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

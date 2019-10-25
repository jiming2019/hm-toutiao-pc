import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
// 导入某一个目录，默认会去找索引文件(index.js inde.vue index.json)) 基于webpack
// @是起的别名，指的是/src路径
import router from '@/router'
Vue.use(ElementUI)
Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

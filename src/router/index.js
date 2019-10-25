import Vue from 'vue'
import VueRouter from 'vue-router'

// 路由组件
import Login from '@/views/login'
Vue.use(VueRouter)

export default new VueRouter({
  routes: [{ path: '/login', component: Login }]
})

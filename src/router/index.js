import Vue from 'vue'
import VueRouter from 'vue-router'

// 路由组件
import Login from '@/views/login'
// 首页组件
import Home from '@/views/home'
// 欢迎页面组件
import Welcome from '@/views/welcome'
// 404页面组件
import NotFound from '@/views/404'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    // 登录
    { path: '/login', component: Login },
    // 404处理
    { path: '*', component: NotFound },
    // 首页
    {
      path: '/',
      component: Home,
      children: [
        // 欢迎页面
        { path: '/', component: Welcome }
      ]
    }
  ]
})

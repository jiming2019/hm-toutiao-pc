import Vue from 'vue'
import VueRouter from 'vue-router'
// 工具类
import local from '@/utils/local'

// 引入模块
import nprogress from 'nprogress'
// 引入css
import 'nprogress/nprogress.css'

// // 路由组件
// import Login from '@/views/login'
// // 首页组件
// import Home from '@/views/home'
// // 欢迎页面组件
// import Welcome from '@/views/welcome'
// // 404页面组件
// import NotFound from '@/views/404'
// // 内容管理组件
// import Article from '@/views/article'
// // 素材管理组件
// import Image from '@/views/image'
// // 发布文章组件
// import Publish from '@/views/publish'
// // 评论管理组件
// import Comment from '@/views/comment'
// // 个人设置组件
// import Setting from '@/views/setting'
// // 粉丝管理组件
// import Fans from '@/views/fans'

// 使用路由懒加载进行优化
const Login = () => import('@/views/login')
const Home = () => import('@/views/home')
const Welcome = () => import('@/views/welcome')
const NotFound = () => import('@/views/404')
const Article = () => import('@/views/article')
const Image = () => import('@/views/image')
const Publish = () => import('@/views/publish')
const Comment = () => import('@/views/comment')
const Setting = () => import('@/views/setting')
const Fans = () => import('@/views/fans')

// 进度条nprogress简单配置
nprogress.inc(0.2)
nprogress.configure({ easing: 'ease', speed: 500, showSpinner: false })

Vue.use(VueRouter)

const router = new VueRouter({
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
        { path: '/', component: Welcome },
        // 内容管理
        { path: '/article', component: Article },
        // 素材管理
        { path: '/image', component: Image },
        // 发布文章
        { path: '/publish', component: Publish },
        // 评论管理
        { path: '/comment', component: Comment },
        // 个人设置
        { path: '/setting', component: Setting },
        // 粉丝管理
        { path: '/fans', component: Fans }
      ]
    }
  ]
})

// 路由导航守卫（前置导航守卫）
router.beforeEach(function (to, from, next) {
  nprogress.start() // 开启进度条
  const user = local.getUser()
  if (to.path !== '/login' && !user) return next('/login')
  next()
})

// 全局后置守卫
router.afterEach(function () {
  // 关闭进度条
  nprogress.done()
})

export default router

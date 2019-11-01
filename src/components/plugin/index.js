// 封装一个插件  注册所有的全局组件
import BreadCrumb from '@/components/common/bread-crumb'
import Channel from '@/components/common/channel'
export default {
  install (Vue) {
    // 基于Vue做任何事情（注册全局组件，指令，过滤器，挂载原型函数）
    Vue.component(BreadCrumb.name, BreadCrumb)
    Vue.component(Channel.name, Channel)
  }
}

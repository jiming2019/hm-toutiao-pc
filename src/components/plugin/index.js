// 封装一个插件  注册所有的全局组件
// 面包屑组件
import BreadCrumb from '@/components/common/bread-crumb'
// 频道组件
import Channel from '@/components/common/channel'
// 富文本组件
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 图片上传组件
import CoverImages from '@/components/common/cover-images'

export default {
  install (Vue) {
    // 基于Vue做任何事情（注册全局组件，指令，过滤器，挂载原型函数）
    Vue.component(BreadCrumb.name, BreadCrumb) // 全局注册面包屑组件
    Vue.component(Channel.name, Channel) // 全局注册频道屑组件
    Vue.component('quill-editor', quillEditor) // 全局注册富文本组件
    Vue.component(CoverImages.name, CoverImages) // 全局注册富文本组件
  }
}

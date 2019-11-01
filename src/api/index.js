// 导出一个配置好的axios提供给main挂载
import axios from 'axios'
import local from '@/utils/local'
import router from '@/router'
import { Message } from 'element-ui'
import jsonBig from 'json-bigint'
// 对axios进行配置
// baseURL  作用：设置基准地址（前面一段相同的地址）
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
axios.defaults.transformResponse = [(data) => {
  try {
    return jsonBig.parse(data)
  } catch (error) {
    return data
  }
}]
// 请求拦截器
axios.interceptors.request.use(config => {
  // 1. 获取token
  const user = local.getUser() || {}
  // 2. 头部设置token
  config.headers.Authorization = `Bearer ${user.token}`
  return config
}, err => {
  return Promise.reject(err)
})

// 响应拦截器
axios.interceptors.response.use(res => res, error => {
  let status = error.response.status // 获取失败的状态码
  let message = '未知错误'
  switch (status) {
    case 400:
      message = '请求参数错误(400)'
      break
    case 401:
      message = 'token过期或未出(401)'
      local.delUser() // 清空token
      router.push('/login')
      break
    case 500:
      message = '服务器错误(500)'
      break
    default:
      break
  }
  // duration显示时间, 毫秒。设为 0 则不会自动关闭
  // showClose是否显示关闭按钮
  // center文字是否居中
  Message({ message, type: 'warning', showClose: 'true', duration: '3000' })
  return Promise.reject(error)
})
export default axios

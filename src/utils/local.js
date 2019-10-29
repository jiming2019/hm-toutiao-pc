// 导出一个本地操作用户信息的模块(设置用户，获取用户，清除用户)
const KEY = 'user_key'
const local = {
  setUser (user) {
    // 存储 setItem(key,value) key将来获取时候需要使用  value json字符串格式
    const userInfo = JSON.stringify(user)
    window.sessionStorage.setItem(KEY, userInfo)
  },
  getUser () {
    const userInfo = window.sessionStorage.getItem(KEY)
    return JSON.parse(userInfo)
  },
  delUser () {
    // clear() 清除所有的数据  不建议使用
    window.sessionStorage.removeItem(KEY)
  }
}

export default local

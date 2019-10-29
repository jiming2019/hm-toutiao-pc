<template>
  <!-- 全屏容器 -->
  <div class='container'>
    <!-- 卡片容器  el-card是一个element组件，根元素上默认添加一个类和组件的名称一致 -->
    <el-card>
      <img src="../../assets/img/logo_index.png" alt="">
        <el-form :model="loginForm" ref="loginForm" status-icon :rules="loginRules">
          <el-form-item prop="mobile">
            <el-input v-model="loginForm.mobile" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item prop="code">
            <el-input v-model="loginForm.code" placeholder="请输入验证码" style="width:240px;margin-right:8px"></el-input>
            <el-button>发送验证码</el-button>
          </el-form-item>
          <el-form-item prop="agree">
            <el-checkbox v-model="loginForm.agree">我已阅读并同意用户协议和隐私条款</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="login" style="width:100%;">登录</el-button>
          </el-form-item>
        </el-form>
    </el-card>
  </div>
</template>

<script>
import local from '@/utils/local'
export default {
  data () {
    // const isAgree = function (rule, value, callBack)
    const isAgree = (rule, value, callBack) => {
      // rule当前规则 value当前表单项的值 callback 回调函数
      // 正常写法
      // if (value) {
      //   // 正确 勾选了协议
      //   callBack() // 一切OK请继续
      // } else {
      //   // 不对 没勾选协议
      //   callBack(new Error('您必须同意用户协议'))
      // }
      value ? callBack() : callBack(new Error('您必须同意用户协议'))
    }
    return {
      loginForm: {
        mobile: '15999999999',
        code: '246810',
        agree: false
      },
      loginRules: {
        mobile: [
          // type 选项：指定内容的格式  date|email|...  不包含手机号类型
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入合法的手机号' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { len: 6, message: '验证码为6位数字', trigger: 'blur' }
        ],
        agree: [{ validator: isAgree }] // 自定义校验规则
      }
    }
  },
  methods: {
    // login () {
    //   // 对整个表单进行校验
    //   this.$refs.loginForm.validate((valid) => {
    //     if (valid) {
    //       // 校验成功  进行登录（发请求）
    //       // post(url,参数对象)
    //       // get(url,{params:参数对象})
    //       this.$http.post('authorizations', this.loginForm).then(result => {
    //         // 将后台返回的token令牌存储到前端缓存中
    //         // window.localStorage.setItem('user-token', result.data.token)
    //         // 保存用户token
    //         console.log(result)
    //         local.setUser(result.data.data)
    //         this.$router.push('/')
    //       }).catch(() => {
    //         this.$message.error('手机号或验证码错误')
    //       })
    //     }
    //   })
    // }

    login () {
      // 对整个表单进行校验
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          try {
            const { data: { data } } = await this.$http.post('authorizations', this.loginForm)
            local.setUser(data)
            this.$router.push('/')
          } catch (error) {
            this.$message.error('手机号或验证码错误')
          }
        }
      })
    }
  }
}
</script>

<style scoped lang='less'>
.container {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background:url(../../assets/img/login_bg.jpg) no-repeat center / cover;
.el-card {
   width: 400px;
    height: 350px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    img {
        display: block;
        width: 200px;
        margin: 0 auto 30px;
    }
}
}
</style>

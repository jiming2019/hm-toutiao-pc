<template>
  <!-- 全屏容器 -->
  <div class='container'>
    <!-- 卡片容器  el-card是一个element组件，根元素上默认添加一个类和组件的名称一致 -->
    <el-card>
      <img src="../../assets/img/logo_index.png" alt="">
            <el-form :model="LoginForm">
        <el-form-item>
          <el-input v-model="LoginForm.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="LoginForm.code" placeholder="请输入验证码" style="width:240px;margin-right:8px"></el-input>
          <el-button>发送验证码</el-button>
        </el-form-item>
        <el-form-item>
          <el-checkbox :value="true">我已阅读并同意用户协议和隐私条款</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" style="width:100%;">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      LoginForm: {
        mobile: '',
        code: ''
      }
    }
  },
  methods: {
    onSubmit () {

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

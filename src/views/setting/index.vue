<template>
  <div class="container-setting">
    <el-card v-loading="loading">
      <div slot="header">
        <bread-crumb>账户信息</bread-crumb>
      </div>
      <!-- 栅格 -->
      <el-row>
        <el-col :span="12">
          <!-- 表单 -->
          <el-form label-width="120px">
            <el-form-item label="编号：">{{userInfo.id}}</el-form-item>
            <el-form-item label="手机：">{{userInfo.mobile}}</el-form-item>
            <el-form-item label="用户名：">
              <el-input v-model="userInfo.name"></el-input>
            </el-form-item>
            <el-form-item label="简介：">
              <el-input v-model="userInfo.intro" type="textarea" :rows="3"></el-input>
            </el-form-item>
            <el-form-item label="邮箱：">
              <el-input v-model="userInfo.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveUser">确认修改</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <!-- 上传组件 -->
          <el-upload
            class="avatar-uploader"
            action
            :http-request="uploadImg"
            :show-file-list="false"
          >
            <img v-if="userInfo.photo" :src="userInfo.photo" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <p style="text-align:center">点击上面修改头像</p>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import local from '@/utils/local'
import eventBus from '@/utils/eventBus' // 实际上Vue实例
export default {
  data () {
    return {
      userInfo: {
        name: null,
        intro: null,
        email: null,
        photo: null
      },
      imageUrl: null,
      loading: false
    }
  },
  methods: {
    // 获取用户的个人信息
    async getUserInfo () {
      this.loading = true
      const {
        data: { data }
      } = await this.$http.get('user/profile')
      this.userInfo = data
      this.loading = false
    },

    // 上传头像图片
    async uploadImg (result) {
      // 1. 获取文件对象
      const file = result.file
      // 2. 使用 formData 追加文件数据
      const formData = new FormData()
      formData.append('photo', file)
      // 3. 使用axios发请求
      const { data: { data } } = await this.$http.patch('user/photo', formData)
      this.userInfo.photo = data.photo
      this.$message.success('修改头像成功')
      // 更新本地存储
      const user = local.getUser()
      user.photo = data.photo
      local.setUser(user)
      // 更新home组件
      eventBus.$emit('updatePhoto', data.photo) // 抛出一个事件
    },

    // 修改用户信息 patch局部修改 post完整修改
    async saveUser () {
      await this.$http.patch('user/profile', {
        name: this.userInfo.name,
        intro: this.userInfo.intro,
        email: this.userInfo.email
      })
      // 成功提示
      this.$message.success('修改信息成功')
      // 更新home组件
      eventBus.$emit('updateName', this.userInfo.name) // 抛出一个事件
      // 更新本地存储
      const user = local.getUser()
      user.name = this.userInfo.name
      local.setUser(user)
    }
  },
  created () {
    this.getUserInfo()
  }
}
</script>

<style scoped lang='less'>
.el-card {
  border-top: 2px solid #409eff;
}
</style>

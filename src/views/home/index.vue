<template>
  <el-container class="home-container">
    <el-aside :width="isOpen?'200px':'64px'">
      <!-- logo -->
      <div class="logo" :class="{smallLogo:!isOpen}"></div>
      <!-- 导航菜单 -->
      <el-menu
        :default-active="$route.path"
        background-color="#002033"
        text-color="#fff"
        active-text-color="#ffd04b"
        style="border-right:none"
        :collapse="!isOpen"
        :collapse-transition="false"
        router
      >
        <!-- 首页 -->
        <el-menu-item index="/">
          <!-- 图标 -->
          <i class="el-icon-s-home"></i>
          <span slot="title">首页</span>
        </el-menu-item>

        <!-- 内容管理 二级菜单-->
        <el-submenu index="1">
          <!-- el-submenu 插槽 title =>  一级显示内容 -->
          <template slot="title">
            <i class="el-icon-tickets"></i>
            <span>内容管理</span>
          </template>
          <!-- 二级内容 -->
          <el-menu-item index="/article">
            <i class="el-icon-document"></i>
            <span slot="title">内容管理</span>
          </el-menu-item>
          <el-menu-item index="/image">
            <i class="el-icon-picture"></i>
            <span slot="title">素材管理</span>
          </el-menu-item>
          <el-menu-item index="/publish">
            <i class="el-icon-s-promotion"></i>
            <span slot="title">发布文章</span>
          </el-menu-item>
          <el-menu-item index="/comment">
            <i class="el-icon-chat-dot-round"></i>
            <span slot="title">评论管理</span>
          </el-menu-item>
        </el-submenu>

        <!-- 粉丝管理 二级菜单 -->
        <el-submenu index="2">
          <!-- title插槽时submenu 中显示的一级内容 -->
          <template slot="title">
            <i class="el-icon-present"></i>
            <span>粉丝管理</span>
          </template>
          <!-- 二级内容 -->
          <el-menu-item index="/fans">
            <i class="el-icon-star-on"></i>
            <span slot="title">粉丝管理</span>
          </el-menu-item>
        </el-submenu>

        <el-submenu index="3">
          <!-- title插槽时submenu 中显示的一级内容 -->
          <template slot="title">
            <i class="el-icon-s-custom"></i>
            <span>账户信息</span>
          </template>
          <!-- 二级内容 -->
          <el-menu-item index="/setting">
            <i class="el-icon-setting"></i>
            <span slot="title">个人设置</span>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <!-- 图标 -->
        <span class="el-icon-s-fold icon" @click="toggleMenu"></span>
        <!-- 文字 -->
        <span class="text">Coding</span>
        <!-- 下拉菜单组件 -->
        <el-dropdown trigger="click" class="dropdown" @command="handleClick">
          <span class="el-dropdown-link">
            <img class="headIcon" :src="photo" alt />
            <span class="userName">{{name}}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-setting" command="setting">个人设置</el-dropdown-item>
            <el-dropdown-item icon="el-icon-unlock" command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>

      <el-main>
        <!-- 二级路由容器 -->
        <router-view></router-view>
      </el-main>

    </el-container>
  </el-container>
</template>

<script>
import local from '@/utils/local'
export default {
  data () {
    return {
      // 是不是展开
      isOpen: true,
      // 用户头像
      photo: '',
      name: ''
    }
  },
  methods: {
    toggleMenu () {
      // 切换侧边栏  展开与收起
      this.isOpen = !this.isOpen
    },
    setting () {
      this.$router.push('/setting')
    },
    logout () {
      local.delUser()
      this.$router.push('/login')
    },
    handleClick (command) {
      // command  值  setting | logout
      // 根据 command 值去执行不同的业务

      this[command]()
      // this.setting() === command setting
      // this.logout() === command logout
    }
  },
  created () {
    const { photo, name } = local.getUser() || {}
    this.photo = photo
    this.name = name
  }
}
</script>

<style scoped lang='less'>
.home-container {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  .el-aside {
    background: #002033;
    .logo {
      width: 100%;
      height: 60px;
      background: #002244 url(../../assets/img/logo_admin.png) no-repeat center /
        140px auto;
    }

    // 覆盖大图成小图
    .smallLogo {
      background-image: url(../../assets/img/logo_admin_01.png);
      background-size: 36px auto;
    }
  }
  .el-header {
    border-bottom: 1px solid #ddd;
    line-height: 60px;
    .icon {
      font-size: 30px;
      vertical-align: middle;
    }
    .text {
      margin-left: 10px;
      vertical-align: middle;
    }
    .dropdown {
      float: right;
      .headIcon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        vertical-align: middle;
      }
      .userName {
        margin-left: 5px;
        font-weight: bold;
        vertical-align: middle;
      }
    }
  }
}
</style>

<template>
  <el-container class="home-container">
    <el-aside :width="isOpen?'200px':'64px'" style="overflow:hidden;">
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
        <!-- 全屏显示 -->
        <span class="btn-fullscreen" @click="handleFullScreen">
          <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
            <i class="el-icon-rank"></i>
          </el-tooltip>
        </span>
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
        <transition name="move" mode="out-in">
          <router-view></router-view>
          </transition>
      </el-main>

    </el-container>
  </el-container>
</template>

<script>
import local from '@/utils/local'
import eventBus from '@/utils/eventBus' // 总线
export default {
  data () {
    return {
      // 是不是展开
      isOpen: true,
      // 用户头像
      photo: '',
      name: '',
      // 是否全屏显示
      fullscreen: false,
      dfdf: ''
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
    },
    // 全屏事件
    handleFullScreen () {
      let element = document.documentElement
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen()
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen()
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen()
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen()
        }
      }
      this.fullscreen = !this.fullscreen
    }
  },
  created () {
    const { photo, name } = local.getUser() || {}
    this.photo = photo
    this.name = name

    // 一旦监听到事件 就会执行后面的函数，更换用户名
    // eventBus.$emit('updateName', this.userInfo.name) // 抛出一个事件
    eventBus.$on('updateName', (name) => {
      this.name = name
    })

    // 一旦监听到事件 就会执行后面的函数，更换头像
    // eventBus.$emit('updatePhoto', data.photo) // 抛出一个事件
    eventBus.$on('updatePhoto', (photo) => {
      this.photo = photo
    })
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
      cursor: pointer;
    }
    .text {
      margin-left: 10px;
      vertical-align: middle;
    }
    // 全屏按钮
    .btn-fullscreen {
      display: inline-block;
      transform: rotate(45deg);
      vertical-align: middle;
      font-size: 24px;
      margin-left: 10px;
      cursor: pointer;
      color: black;
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
        margin-left: 10px;
        font-weight: bold;
        vertical-align: middle;
      }
    }
  }

}
</style>

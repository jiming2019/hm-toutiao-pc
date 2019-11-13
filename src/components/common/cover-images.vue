<template>
  <div class="cover-image">
    <!-- 按钮 -->
    <div class="btn_box" @click="open">
      <!-- 如果value有图片传入的地址，使用默认图的地址 -->
      <img :src="value || defaultImage"/>
    </div>
    <!-- 卡片 -->
    <el-dialog :visible.sync="dialogVisible" width="950px">
      <el-tabs v-model="activeName" @tab-click="changeTab">
        <!-- 全部素材 -->
        <el-tab-pane label="全部素材" name="allImages">
          <div class="img-list">
            <el-card
              class="img-item"
              :class="{selected:selectedImageUrl===item.url}"
              @click.native="selectedImage(item.url)"
              v-for="item in images"
              :key="item.id"
            >
              <img :src="item.url" />
              <div class="operate"></div>
            </el-card>
          </div>
          <!-- 分页 -->
          <el-row type="flex" justify="center">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="total"
              :current-page="reqParams.page"
              :page-size="reqParams.per_page"
              @current-change="changePage"
            ></el-pagination>
          </el-row>
        </el-tab-pane>
        <!-- 收藏素材 -->
        <el-tab-pane label="收藏素材" name="collect">
          <div class="img-list">
            <el-card
              class="img-item"
               :class="{selected:selectedImageUrl===item.url}"
              @click.native="selectedImage(item.url)"
              v-for="item in images"
              :key="item.id"
            >
              <img :src="item.url" />
              <div class="operate"></div>
            </el-card>
          </div>
          <el-row type="flex" justify="center">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="total"
              :current-page="reqParams.page"
              :page-size="reqParams.per_page"
              @current-change="changePage"
            ></el-pagination>
          </el-row>
        </el-tab-pane>
        <!-- 上传组件 -->
         <el-tab-pane label="上传图片" name="upload">
          <el-upload
            class="avatar-uploader"
            action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
            :headers="headers"
            name="image"
            ref="uploadImg"
            :on-success="handleSuccess"
            :show-file-list="false"
          >
            <img v-if="uploadImageUrl" :src="uploadImageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmImage">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import local from '@/utils/local'
import defaultImage from '../../assets/img/default.png'
export default {
  name: 'cover-images',
  // 接受父组件传过来的值
  props: ['value'],
  data () {
    return {
      // 提交的筛选参数
      reqParams: {
        collect: false,
        // 当前页currentPage相当于
        page: 1,
        // 每页大小相当于pageSize
        per_page: 4
      },
      // 当前选中的图片地址
      selectedImageUrl: null,
      // 当前上传的图片地址
      uploadImageUrl: null,
      // 请求头
      headers: {
        Authorization: `Bearer ${local.getUser().token}`
      },
      // 默认选中全部
      activeName: 'allImages',
      // 素材列表
      images: [],
      // 总条数
      total: 0,
      // 控制对话框 显示与隐藏
      dialogVisible: false,
      loading: false,
      // 按钮的默认图片
      defaultImage
    }
  },
  methods: {
    // 打开对话框
    open () {
      this.dialogVisible = true
      // 获取素材列表
      this.getImages()
    },
    // 确认图片
    confirmImage () {
      if (this.activeName === 'allImages') {
        // 素材库
        if (!this.selectedImageUrl) {
          return this.$message.warning('请选中一张图片')
        }
        // 给img的src赋值图片地址
        // this.defaultImage = this.selectedImageUrl
        // 提交图片地址给父组件
        this.$emit('input', this.selectedImageUrl)
        this.dialogVisible = false
      } else if (this.activeName === 'collect') {
        if (!this.selectedImageUrl) {
          return this.$message.warning('请选中一张图片')
        }
        // 给img的src赋值图片地址
        // this.defaultImage = this.selectedImageUrl
        // 提交图片地址给父组件
        this.$emit('input', this.selectedImageUrl)
        this.dialogVisible = false
      } else {
        // 上传图片
        if (!this.uploadImageUrl) {
          return this.$message.warning('请上传一张图片')
        }
        // 给img的src赋值图片地址
        // this.defaultImage = this.uploadImageUrl
        // 提交图片地址给父组件
        this.$emit('input', this.uploadImageUrl)
        this.dialogVisible = false
        this.uploadImageUrl = null
      }
    },

    // 选中图片
    selectedImage (url) {
      this.selectedImageUrl = url
      // console.log(url)
    },
    // 获取素材数据
    async getImages () {
      this.loading = true
      // this.activeName === 'collect' 相当于去找收藏的数据
      // collect = true 为收藏数据
      // 如果不等于collect 相等于去找全部的数据
      if (this.activeName === 'collect') {
        this.reqParams.collect = true
      } else {
        this.reqParams.collect = false
      }
      // 获取数据
      const {
        data: { data }
      } = await this.$http.get('user/images', { params: this.reqParams })
      // 赋值给images
      this.images = data.results
      // 总条数赋值
      this.total = data.total_count
      this.loading = false
    },

    // 切换Tabs标签页 全部素材和收藏素材
    changeTab () {
      // 首先要把页码归1
      this.reqParams.page = 1
      this.getImages()
      this.selectedImageUrl = null
    },

    // 当页码改变时传入新页码参数
    changePage (newPage) {
      this.reqParams.page = newPage // 将最新页码赋值给currentPage
      this.getImages() // 获取最新数据
    },

    // 切换  添加收藏 取消收藏
    async toggleStatus (item) {
      const {
        data: { data }
      } = await this.$http.put(`user/images/${item.id}`, {
        collect: !item.is_collected
      })
      // 成功（改当前图片的状态，提示）
      item.is_collected = data.collect
      this.$message.success(data.collect ? '添加收藏成功' : '取消收藏成功')
    },

    // // 上传素材图片
    // uploadImg (params) {
    //   const data = new FormData() // 声明一个新的表单
    //   data.append('image', params.file)
    //   // 上传文件
    //   this.$http({
    //     url: '/user/images',
    //     method: 'post',
    //     data
    //   }).then(() => {
    //     this.dialogVisible = false
    //     // 清空原来上传的图片，只需要在组件上绑定ref，在提交成功后的方法里调用this.$refs.upload.clearFiles()
    //     this.$refs.uploadImg.clearFiles()
    //     this.$message({ type: 'success', message: '上传成功!' })
    //     this.getImages()
    //   })
    // },
    handleSuccess (res) {
      // 预览
      this.uploadImageUrl = res.data.url
      this.defaultImage = res.data.url
      this.$message({ type: 'success', message: '上传成功!' })
      // 清空原来上传的图片，只需要在组件上绑定ref，在提交成功后的方法里调用this.$refs.upload.clearFiles()
      // this.$refs.uploadImg.clearFiles()
      // 更新列表
      this.getImages()
    }
  },
  created () {
    this.getImages()
  }
}
</script>

<style scoped lang='less'>
.cover-image{
  display: inline-block;
  margin-right: 20px;
}
.btn_box {
  width: 150px;
  height: 150px;
  border: 1px dashed #ddd;
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}
.el-card {
  position: relative;
  .add-image {
    z-index: 999;
    position: absolute;
    right: 20px;
    margin-top: -10px;
  }
  .img-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    .img-item {
      width: 200px;
      height: 180px;
      border-radius: 10px;
      margin: 10px;
      position: relative;
      img {
        width: 100%;
        height: 100%;
      }
      &.selected::after {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.3) url(../../assets/img/selected.png)
          no-repeat center / 50px 50px;
      }
      .operate {
        background-color: #f4f5f6;
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 35px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        cursor: pointer;
        i {
          font-size: 18px;
        }
      }
    }
  }
}
</style>

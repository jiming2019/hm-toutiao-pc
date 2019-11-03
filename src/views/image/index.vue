<template>
  <!-- 卡片 -->
  <el-card style="border-top: 2px solid #409eff;">
    <div slot="header">
      <!-- 使用自己封装的面包屑组件 -->
      <bread-crumb>素材管理：</bread-crumb>
    </div>
    <el-button @click="dialogVisible=true" class="add-image" type="primary" size="small">添加素材</el-button>
    <el-tabs v-model="activeName" @tab-click="changeTab">
      <!-- 全部素材 -->
      <el-tab-pane label="全部素材" name="allImages">
        <div class="img-list">
          <el-card class="img-item" v-for="item in images" :key="item.id">
            <img :src="item.url" />
            <div class="operate">
              <!-- 收藏和取消收藏 -->
              <i
                @click="toggleStatus(item)"
                :style="{color: item.is_collected ? 'red' : '#000'}"
                class="el-icon-star-off"
              ></i>
              <!-- 删除 传入id -->
              <i @click="deleteImage(item.id)" class="el-icon-delete-solid"></i>
            </div>
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

      <!-- 收藏素材 -->
      <el-tab-pane label="收藏素材" name="collect">
        <div class="img-list">
          <el-card class="img-item" v-for="item in images" :key="item.id">
            <img :src="item.url" alt />
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
    </el-tabs>

    <!-- 上传素材图片 -->
    <el-dialog title="上传素材" :visible.sync="dialogVisible" width="400px">
      <el-upload
        class="upload-demo"
        drag
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        list-type="picture"
        ref="uploadImg"
        name="image"
        :on-success="handleSuccess"
        :headers="headers"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </el-dialog>
  </el-card>
</template>

<script>
import local from '@/utils/local'
export default {
  data () {
    return {
      // 提交的筛选参数
      reqParams: {
        collect: false,
        // 当前页currentPage相当于
        page: 1,
        // 每页大小相当于pageSize
        per_page: 12
      },
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
      loading: false
    }
  },
  methods: {
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

    // 删除素材图片
    deleteImage (id) {
      // 显示确认框
      this.$confirm('此操作将删除该图片, 是否继续?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // 点击了确认
          // 1. 发请求
          await this.$http.delete(`user/images/${id}`)
          // 2. 提示
          this.$message({ type: 'success', message: '删除成功!' })
          // 3. 更新列表
          this.getImages()
        })
        .catch(() => {
          this.$message({ type: 'warning', message: '已取消删除' })
        })
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
      this.$message({ type: 'success', message: '上传成功!' })
      window.setTimeout(() => {
        // 关闭
        this.dialogVisible = false
        // 清空原来上传的图片，只需要在组件上绑定ref，在提交成功后的方法里调用this.$refs.upload.clearFiles()
        this.$refs.uploadImg.clearFiles()
        // 更新列表
        this.getImages()
      }, 1000)
    }
  },
  created () {
    this.getImages()
  }
}
</script>

<style scoped lang='less'>
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
      width: 250px;
      height: 200px;
      border-radius: 10px;
      margin: 10px;
      position: relative;
      img {
        width: 100%;
        height: 100%;
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

<template>
  <div class="container-comments">
    <!-- 筛选条件布局 -->
    <el-card>
      <div slot="header">
        <!-- 使用自己封装的面包屑组件 -->
        <bread-crumb>评论管理：</bread-crumb>
      </div>

      <!-- 表格 -->
      <el-table :data="comments" >
        <el-table-column align="center" sortable prop="title" label="标题"></el-table-column>
        <el-table-column align="center" sortable prop="total_comment_count" label="总评论数"></el-table-column>
        <el-table-column align="center" sortable prop="fans_comment_count" label="粉丝评论数"></el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">{{scope.row.comment_status?'正常':'关闭'}}</template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template slot-scope="scope">
            <el-button @click="toggleStatus(scope.row)" v-if="scope.row.comment_status" type="danger" size="small">关闭评论</el-button>
            <el-button @click="toggleStatus(scope.row)" v-else type="success" size="small">打开评论</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <!-- @current-change 作用：当页码发生改变触发  默认传入当前新的页码 -->
      <el-row type="flex" justify="center">
        <el-pagination
          style="margin-top:20px"
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="formData.per_page"
          :current-page="formData.page"
          @current-change="pager"
        ></el-pagination>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      formData: {
        response_type: 'comment',
        page: 1,
        per_page: 10
      },
      total: 0, // 总条数
      comments: []
    }
  },
  methods: {
    // 获取评论列表数据
    async getComments () {
      const {
        data: { data }
      } = await this.$http.get('articles', { params: this.formData })
      this.comments = data.results
      // 总条数数据赋值
      this.total = data.total_count
    },

    // 分页函数
    pager (newPage) {
      // 修改当前的页码为新的页码
      this.formData.page = newPage
      // 重新获取数据
      this.getComments()
    },
    // 切换 评论状态  正常  关闭
    toggleStatus (row) {
    // row 有 id  comment_status
    // comment_status为true显示关闭评论  为false显示打开评论
      const text = row.comment_status ? '您确认关闭评论吗？' : '您确认打开评论吗？'
      // 打开对话框
      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
      // 发修改状态的请求
        const { data: { data } } = await this.$http.put(`comments/status?article_id=${row.id}`, {
          allow_comment: !row.comment_status
        })
        // 成功
        this.$message.success(data.allow_comment ? '打开评论成功' : '关闭评论成功')
        // 更新当前文章的状态
        row.comment_status = data.allow_comment
      }).catch(() => {})
    }

  },
  created () {
    // 获取文章列表数据
    this.getComments()
  }
}
</script>

<style scoped lang="less">
.el-card {
  border-top: 2px solid #409eff;
}
</style>

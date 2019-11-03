<template>
  <div class="container-article">
    <!-- 筛选条件布局 -->
    <el-card>
      <div slot="header">
        <!-- 使用自己封装的面包屑组件 -->
        <bread-crumb>内容管理：</bread-crumb>
      </div>

      <el-form label-width="80px" size="small">
        <el-form-item label="状态：">
          <el-radio-group v-model="formData.status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="频道：">
          <!-- 使用自己封装的频道组件 -->
          <!-- v-model是:value和@input的合写  第一 :value  第二  @input -->
          <channel v-model="formData.channel_id"></channel>
        </el-form-item>

        <el-form-item label="日期：">
          <el-date-picker
            v-model="dateArr"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changeDate"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 筛选结果布局 -->
    <el-card style="margin-top:20px">
      <div slot="header">根据筛选条件共查询到 {{total}} 条结果：</div>
      <!-- 表格 -->
      <el-table :data="articles">
        <el-table-column align="center" sortable prop="date" label="封面">
          <template slot-scope="scope">
            <el-image :src="scope.row.cover.images[0]" lazy style="width:100px;height:80px">
              <div slot="error">
                <img src="../../assets/img/error.gif" width="100" height="80" />
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column align="center" sortable prop="title" label="标题"></el-table-column>
        <el-table-column align="center" sortable prop="address" label="状态">
          <template slot-scope="scope">
            <!-- 使用过滤器实现 -->
            <el-tag :type="scope.row.status | statusType">{{scope.row.status | statusText}}</el-tag>
            <!-- 使用v-if实现
            <el-tag v-if="scope.row.status===0" type="info">草稿</el-tag>
            <el-tag v-if="scope.row.status===1">待审核</el-tag>
            <el-tag v-if="scope.row.status===2" type="success">审核通过</el-tag>
            <el-tag v-if="scope.row.status===3" type="warning">审核失败</el-tag>
            <el-tag v-if="scope.row.status===4" type="danger">已删除</el-tag>-->
          </template>
        </el-table-column>
        <el-table-column align="center" sortable prop="pubdate" label="发布时间"></el-table-column>
        <el-table-column align="center" prop="tag" label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              plain
              @click="editArticle(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              plain
              @click="delArticle(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <!-- @current-change 作用：当页码发生改变触发  默认传入当前新的页码 -->
      <el-pagination
        style="margin-top:20px"
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="formData.per_page"
        :current-page="formData.page"
        @current-change="pager"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      formData: {
        status: null, // 文章状态 0-草稿，1-待审核，2-审核通过，3-审核失败，4-已删除
        channel_id: null, // 频道id
        begin_pubdate: null, // 开始日期
        end_pubdate: null, // 结束日期
        page: 1, // 当前页码
        per_page: 20 // 每页多少条
      },

      // channels: [], // 频道选项数组 移到频道组件中
      dateArr: [], // 日期范围
      articles: [], // 文章列表数据
      total: 0 // 总条数
    }
  },
  methods: {
    // 获取频道选项数据 移到频道组件中
    // async getChannels () {
    //   const {
    //     data: { data }
    //   } = await this.$http.get('channels')
    //   this.channels = data.channels
    // },

    // 获取文章列表数据
    async getArticles () {
      const {
        data: { data }
      } = await this.$http.get('articles', { params: this.formData })
      this.articles = data.results
      // 总条数数据赋值
      this.total = data.total_count
    },

    // 分页函数
    pager (newPage) {
      // 修改当前的页码为新的页码
      this.formData.page = newPage
      // 重新获取数据
      this.getArticles()
    },

    // 筛选
    search () {
      // 判断频道的ID是否为"", 如果是值改成null
      if (this.formData.channel_id === '') this.formData.channel_id = null
      // 把页码换成1
      this.formData.page = 1
      this.getArticles()
    },
    // 编辑
    editArticle (id) {
      // 第一种  query传参方式
      // this.$router.push(`/publish?id=${id}`)
      // 第二种  query传参方式
      this.$router.push({ path: 'publish', query: { id } })
    },

    // 删除
    delArticle (id) {
      this.$confirm('此操作将删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$http.delete(`articles/${id}`)
        this.$message({ type: 'success', message: '删除成功!'
        })
        this.getArticles()
      }).catch(() => {
        this.$message({ type: 'warning', message: '已取消删除'
        })
      })
    },

    // 选择日期
    changeDate (dateArr) {
      // dateArr是数组[起始日期，结束日期]
      // value-form="yyyy-MM-dd" 将格式转换为yyyy-MM-dd保存到数组中
      // 注意：清空日期之后，dateArr是null  对应的 begin end 值也该为null,因为这是axios的传参规则
      if (dateArr) {
        this.formData.begin_pubdate = dateArr[0]
        this.formData.end_pubdate = dateArr[1]
      } else {
        this.formData.begin_pubdate = null
        this.formData.end_pubdate = null
      }
    }
  },
  created () {
    // 获取频道选项数据 移到频道组件中
    // this.getChannels()
    // 获取文章列表数据
    this.getArticles()
  },
  filters: {
    // 处理状态的显示文字
    statusText (value) {
      switch (value) {
        case 0:
          return '草稿'
        case 1:
          return '待审核'
        case 2:
          return '已发表'
        case 3:
          return '审核失败'
        case 4:
          return '已删除'
      }
    },
    // 处理状态的显示样式
    statusType (value) {
      switch (value) {
        case 0:
          return 'info'
        case 1:
          return ''
        case 2:
          return 'success'
        case 3:
          return 'warning'
        case 4:
          return 'danger'
      }
    }
  }
}
</script>

<style scoped lang="less">
.el-card {
  border-top: 2px solid #409eff;
}
</style>

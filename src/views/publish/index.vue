<template>
  <div class="container-publish">
    <el-card>
      <div slot="header">
        <bread-crumb>{{$route.query.id?'修改':'发布'}}文章</bread-crumb>
      </div>
      <!-- 表单 -->
      <el-form label-width="120px" :model="articleForm" :rules="publishRules" ref="publishForm">
        <el-form-item prop="title" label="标题：">
          <el-input v-model="articleForm.title" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item prop="content" label="内容：">
          <!-- 富文本组件 -->
          <quill-editor v-model="articleForm.content" :options="editorOption"></quill-editor>
        </el-form-item>
        <el-form-item label="封面：">
          <el-radio-group v-model="articleForm.cover.type" @change="articleForm.cover.images=[]">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <!-- 封装的封面图组件 -->
          <div v-if="articleForm.cover.type===1">
            <cover-images v-model="articleForm.cover.images[0]"></cover-images>
          </div>
          <div v-if="articleForm.cover.type===3">
            <cover-images v-for="i in 3" :key="i" v-model="articleForm.cover.images[i-1]"></cover-images>
          </div>
        </el-form-item>
        <el-form-item prop="channel_id" label="频道：">
          <channel v-model="articleForm.channel_id"></channel>
        </el-form-item>
        <el-form-item v-if="$route.query.id">
          <el-button type="success" @click="update(false)">修改</el-button>
          <el-button @click="update(true)">存入草稿</el-button>
        </el-form-item>
        <el-form-item v-else>
          <el-button type="primary" @click="publish(false)">发表</el-button>
          <el-button @click="publish(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 提交文章表单
      articleForm: {
        title: null,
        content: null,
        cover: {
          type: 1,
          images: []
        }
      },
      // 富文本配置对象
      editorOption: {
        // placeholder: '',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            ['image']
          ]
        },
        theme: 'snow'
      },
      publishRules: {
        title: [{ required: true, message: '标题不能为空' }, {
          // 最小长度 min  最大长度max
          min: 5, max: 30, message: '标题长度要控制在5到30个字符之间'
        }],
        content: [{ required: true, message: '内容不能为空' }],
        channel_id: [{ required: true, message: '频道不能为空' }]
      } //  发布规则
    }
  },
  created () {
    // 根据地址栏是否有ID来判断
    const articleId = this.$route.query.id
    if (articleId) {
      // 修改逻辑
      // 填充表单内容
      this.getArticle(articleId)
    }
  },
  methods: {

    // 发表文章
    async publish (draft) {
      this.$refs.publishForm.validate(async (valid) => {
        if (valid) {
          await this.$http.post(`articles?draft=${draft}`, this.articleForm)
          // 成功
          this.$message.success(draft ? '存入草稿成功' : '发表成功')
          this.$router.push('/article')
        }
      })
    },
    // 获取文章详情
    async getArticle (id) {
      const { data: { data } } = await this.$http.get(`articles/${id}`)
      this.articleForm = data
    },
    // 修改文章
    async update (draft) {
      await this.$http.put(`articles/${this.articleForm.id}?draft=${draft}`, this.articleForm)
      // 成功
      this.$message.success(draft ? '存入草稿成功' : '修改成功')
      this.$router.push('/article')
    }
  },
  watch: {
    // 利用watch监听地址栏的变化,当有ID时,根据ID查询填充表单,没有ID时,置空表单
    // key===>被监听的(this下的)数据的字段的名字
    // value ===> 值改变后触发的函数 (newVal,oldVal) 新值  旧值
    '$route.query.id': function (newVal, oldVal) {
      if (newVal) {
        // 修改 填充表单
        this.getArticle(newVal)
      } else {
        // 新建 重置表单
        this.articleForm = {
          title: null,
          content: null,
          cover: {
            type: 1,
            images: []
          }
        }
      }
    }
  }
}
</script>

<style scoped lang='less'>
.el-card {
  border-top: 2px solid #409eff;
}
</style>

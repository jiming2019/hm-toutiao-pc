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
          <el-select v-model="formData.channel_id" placeholder="请选择">
            <el-option
              v-for="item in channels"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="日期：">
          <el-date-picker
            v-model="dateArr"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 筛选结果布局 -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      formData: {
        status: null, // 文章状态 0-草稿，1-待审核，2-审核通过，3-审核失败，4-已删除
        channel_id: null,
        begin_pubdate: null,
        end_pubdate: null
      },
      channels: [], // 定义一个频道数组
      dateArr: []
    }
  },
  methods: {
    async getChannels () {
      const { data: { data } } = await this.$http.get('channels')
      this.channels = data.channels
    }
  },
  created () {
    // 获取频道选项数据
    this.getChannels()
  }
}
</script>

<style scoped lang="less">
</style>

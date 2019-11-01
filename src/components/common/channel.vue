<template>
  <el-select :value="value" @change="changeValue" clearable placeholder="请选择">
    <el-option v-for="item in channels" :key="item.id" :label="item.name" :value="item.id"></el-option>
  </el-select>
</template>

<script>
export default {
  // 组件名称
  name: 'channel',
  // 接受父组件数据
  props: ['value'],
  data () {
    return {
      channels: [] // 频道选项数组
    }
  },
  methods: {
    // 获取频道选项数据
    async getChannels () {
      const {
        data: { data }
      } = await this.$http.get('channels')
      this.channels = data.channels
    },
    // 频道值改变,向父组件传值,把频道ID提交给父组件
    changeValue (channelId) {
      // 清空值是'' 改成null
      if (channelId === '') channelId = null
      // 把ID提交给父组件,这里得写input <!-- v-model  第一 :value  第二  @input -->
      this.$emit('input', channelId)
    }
  },
  created () {
    this.getChannels()
  }
}
</script>

<style scoped lang='less'>
</style>

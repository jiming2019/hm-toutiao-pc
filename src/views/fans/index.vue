<template>
  <div class="container-setting">
    <el-card v-loading="loading">
      <div slot="header">
        <bread-crumb>粉丝管理</bread-crumb>
      </div>
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="粉丝列表" name="fans_list">
          <div class="fans_list">
            <div class="fans_item" v-for="item in fansList" :key="item.id.toString()">
              <el-avatar :size="100" :src="item.photo"></el-avatar>
              <p>{{item.name}}</p>
              <el-button type="primary" size="small" plain>+关注</el-button>
            </div>
          </div>

          <!-- 分页 -->
          <el-row type="flex" justify="center">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="total"
              :page-size="reqParams.per_page"
              :current-page="reqParams.page"
              @current-change="pager"
            ></el-pagination>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="粉丝画像" name="fans_picture">
          <el-row type="flex" >
            <!-- 环形图 -->
            <div ref="doughnutChart" class="echarts" style="width: 600px;height:400px;"></div>
            <!-- 柱状图 -->
            <div ref="barChart" class="echarts" style="width: 600px;height:400px;"></div>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  data () {
    return {
      reqParams: {
        page: 1,
        per_page: 21
      },
      activeName: 'fans_list',
      loading: false,
      fansList: [],
      total: 0
    }
  },
  methods: {
    // 获取粉丝列表
    async getFansList () {
      const {
        data: { data }
      } = await this.$http.get('followers', { params: this.reqParams })
      this.fansList = data.results
      this.total = data.total_count
    },
    // 分页函数
    pager (newPage) {
      // 修改当前的页码为新的页码
      this.reqParams.page = newPage
      // 重新获取数据
      this.getFansList()
    },
    setBarChartOption () {
      this.barChart.setOption({
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '直接访问',
            type: 'bar',
            barWidth: '60%',
            data: [10, 52, 200, 334, 390, 330, 220]
          }
        ]
      })
    }
  },
  created () {
    this.getFansList()
  },
  mounted () {
    // 图表的初始化
    const doughnutChart = echarts.init(this.$refs.doughnutChart) // workChart就是图表实例

    this.barChart = echarts.init(this.$refs.barChart) // workChart就是图表实例
    this.setBarChartOption()
    // 准备配置项和数据
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        x: 'left',
        data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'center'
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '30',
                fontWeight: 'bold'
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: [
            { value: 335, name: '直接访问' },
            { value: 310, name: '邮件营销' },
            { value: 234, name: '联盟广告' },
            { value: 135, name: '视频广告' },
            { value: 1548, name: '搜索引擎' }
          ]
        }
      ]
    }
    doughnutChart.setOption(option)
  }
}
</script>

<style scoped lang='less'>
.el-card {
  border-top: 2px solid #409eff;
}
.fans_item {
  width: 180px;
  height: 200px;
  padding-top: 10px;
  border: 1px dashed #ddd;
  display: inline-block;
  margin-right: 15px;
  margin-bottom: 15px;
  text-align: center;
}
</style>

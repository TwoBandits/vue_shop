<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <div id="echarts-main" style="width: 750px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import _ from 'lodash'

export default {
  name: 'Report',
  data() {
    return {
      options: {
        title: {
          text: '用户来源',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3',
            },
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
      },
    }
  },
  async mounted() {
    const { data: res } = await this.$http.get(`reports/type/1`)
    if (res.meta.status !== 200) {
      return this.$message.error('获取数据折线图数据失败')
    }
    // 基于准备好的dom，初始化echarts实例
    let myChart = echarts.init(document.querySelector('#echarts-main'))

    const result = _.merge(res.data,this.options)

    // 绘制图表
    myChart.setOption(result)
  },
}
</script>

<style>
</style>
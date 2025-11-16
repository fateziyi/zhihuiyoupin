<template>
  <div class="box2">
    <div class="title">
      <p>年龄比例</p>
      <img src="../../images/dataScreen-title.png" alt="">
    </div>
    <!-- 图形图表容器 -->
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted, ref } from 'vue'
let charts = ref()

// 组件挂载完毕初始化图形图表
onMounted(() => {
  let mychart = echarts.init(charts.value)
  // 设置配置项
  let option = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      top: '20px',
      right: '30px',
      orient: 'vertical', // 图例组件方向
      textStyle: {
        color: 'white',
        fontSize: 14,
      },
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          position: 'inside',
          color: 'black',
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 16, name: '10岁以下' },
          { value: 8, name: '10-18岁' },
          { value: 12, name: '18-30岁' },
          { value: 24, name: '30-40岁' },
          { value: 20, name: '40-60岁' },
          { value: 20, name: '60岁以上' },
        ],
        center: ['48%', '35%']  // 调整中心位置
      },
    ],
    // 调整图形图表位置
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
  }
  mychart.setOption(option)
})
</script>

<style scoped lang="scss">
.box2 {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  margin-top: 20px;

  .title {
    p {
      color: white;
      font-size: 25px;
      margin-left: 10px;
    }

    img {
      width: 100px;
      height: 7px;
      margin-top: 10px;
      margin-left: 10px;
    }
  }

  .charts {
    height: 260px;
  }
}
</style>
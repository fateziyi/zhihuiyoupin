<template>
  <div class="box1">
    <div class="title">
      <p>男女比例</p>
      <img src="../../images/dataScreen-title.png" alt="">
    </div>
    <div class="sex">
      <div class="man">
        <img src="../../images/man.png" alt="">
      </div>
      <div class="woman">
        <img src="../../images/woman.png" alt="">
      </div>
    </div>
    <div class="rate">
      <p>男士51%</p>
      <p>女士49%</p>
    </div>
    <!-- 男女比例图表 -->
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted, ref } from 'vue'
let charts = ref()

onMounted(() => {
  // 初始化echarts实例
  let myChart = echarts.init(charts.value)
  // 设置配置项和数据
  myChart.setOption({
    // 标题组件
    title: {
      text: '男女比例', // 主标题
      textStyle: {
        // 主标题颜色
        color: 'skyblue',
      },
      left: '40%',
    },
    // x|y
    xAxis: {
      // type: 'category',
      show: false,
      min: 0,
      max: 100,
    },
    yAxis: { show: false, type: 'category' },
    series: [
      {
        type: 'bar',
        data: [51],
        barWidth: 20,
        z: 100,
        itemStyle: {
          color: '#007AFE',
          borderRadius: 20,
        },
      },
      {
        type: 'bar',
        data: [100],
        barWidth: 20,
        // 调整柱条位置
        barGap: '-100%',
        itemStyle: {
          color: '#FF4B7A',
          borderRadius: 20,
        },
      },
    ],
    grid: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    },
  })
})

</script>

<style scoped lang="scss">
.box1 {
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

  .sex {
    display: flex;
    justify-content: center;

    .man {
      margin: 20px;
      width: 111px;
      height: 115px;
      background: url(../../images/man-bg.png) no-repeat;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .woman {
      margin: 20px;
      width: 111px;
      height: 115px;
      background: url(../../images/woman-bg.png) no-repeat;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .rate {
    display: flex;
    justify-content: space-between;
    color: white;
    font-size: 20px;
  }

  .charts {
    height: 100px;
  }
}
</style>
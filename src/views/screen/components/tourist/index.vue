<template>
  <div class="box">
    <div class="top">
      <p class="title">实时游客统计</p>
      <p class="bg"></p>
      <p class="right">可预约总量<span>99999</span>人</p>
    </div>
    <div class="number">
      <span v-for="(item, index) in people" :key="index">{{ item }}</span>
    </div>
    <!-- 图形图表 -->
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as echarts from "echarts";
// 水球图拓展插件
import 'echarts-liquidfill'
let people = ref('114514人')
// 获取节点
let charts = ref(null)
onMounted(() => {
  // 获取echarts类的实例
  let myChart = echarts.init(charts.value)
  // 设置实例的配置项和数据
  myChart.setOption({
    // 系列：决定你展示什么样的图形图标
    series: {
      type: 'liquidFill',
      data: [0.6, 0.4, 0.2],
      waveAnimation: true,
      animationDuration: 3,
      animationDurationUpdate: 0,
      radius: '90%', // 半径
      outline: {
        show: true,
        borderDistance: 8,
        itemStyle: {
          color: 'none',
          borderColor: '#294D99',
          borderWidth: 8,
          shadowBlur: 20,
          shadowColor: 'rgba(0, 0, 0, 0.25)',
        },
      },
    }
  })
})
</script>

<style scoped lang="scss">
.box {
  background: url(../../images/dataScreen-main-lb.png) no-repeat;
  background-size: 100% 100%;
  margin-top: 10px;

  .top {
    margin-left: 20px;

    .title {
      color: #fff;
      font-size: 25px;
      margin-bottom: 10px;
      margin-top: 10px;
    }

    .bg {
      width: 100px;
      height: 7px;
      background: url(../../images/dataScreen-title.png) no-repeat;
      background-size: 100% 100%;
    }

    .right {
      color: #fff;
      float: right;
      font-size: 18px;
      margin-right: 15px;

      span {
        color: orange;
      }
    }
  }

  .number {
    margin-top: 20px;
    display: flex;
    padding: 20px;

    span {
      flex: 1;
      height: 70px;
      text-align: center;
      line-height: 70px;
      background: url(../../images/total.png) no-repeat;
      background-size: 100% 100%;
      color: #29fcff;
      font-size: 30px;
    }
  }

  .charts {
    width: 100%;
    height: 250px;
  }
}
</style>
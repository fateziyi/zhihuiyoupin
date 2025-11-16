<template>
  <!-- 顶部左侧静态 -->
  <el-icon style="margin-right: 10px; cursor: pointer; font-size: 20px" @click="changeIcon">
    <component :is="fold ? 'Expand' : 'Fold'"></component>
  </el-icon>
  <!-- 左侧面包屑 -->
  <el-breadcrumb separator-icon="ArrowRight">
    <el-breadcrumb-item v-for="(item, index) in $route.matched" :key="index" v-show="item.meta.title" :to="item.path">
      <!-- 图标 -->
      <el-icon style="vertical-align: middle">
        <component :is="item.meta.icon"></component>
      </el-icon>
      <!-- 面包屑展示匹配路由的标题 -->
      <span style="margin: 0 3px; vertical-align: middle">
        {{ item.meta.title }}
      </span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Expand, Fold } from '@element-plus/icons-vue'
import useLayoutSettingStore from '../../../store/modules/setting'
// 获取路由对象
import { useRoute } from 'vue-router'

defineOptions({
  name: 'Breadcrumb'
})

// 定义一个响应式数据控制图标切换
const LayoutSettingStore = useLayoutSettingStore() //控制折叠图标的显示和隐藏
const fold = computed(() => LayoutSettingStore.fold)

const changeIcon = () => {
  // 图标进行切换
  LayoutSettingStore.fold = !LayoutSettingStore.fold
}
const $route = useRoute()
const handler = () => {
  console.log($route.path)
}
</script>

<style scoped></style>
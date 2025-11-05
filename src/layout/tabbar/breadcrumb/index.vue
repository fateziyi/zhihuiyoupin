<template>
  <!-- 顶部左侧静态 -->
  <el-icon style="margin-right: 10px; cursor: pointer; font-size: 20px" @click="changeIcon">
    <component :is="fold?'Expand':'Fold'"></component>
  </el-icon>
  <!-- 左侧面包屑 -->
  <el-breadcrumb separator-icon="ArrowRight">
    <el-breadcrumb-item :to="{ path: '/' }">权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>
      <a href="/">用户管理</a>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { ref } from 'vue'
import { Expand, Fold } from '@element-plus/icons-vue'
import useLayoutSettingStore from '../../../store/modules/setting'

export default defineComponent({
  name: 'Breadcrumb',
  components: {
    Expand,
    Fold,
  },
  setup() {
    // 定义一个响应式数据控制图标切换
    const LayoutSettingStore = useLayoutSettingStore() //控制折叠图标的显示和隐藏
    const fold = computed(() => LayoutSettingStore.fold)
    
    const changeIcon = () => {
      // 图标进行切换
      LayoutSettingStore.fold = !LayoutSettingStore.fold
    }
    return {
      changeIcon,
      fold,
      LayoutSettingStore
    }
  },
})
</script>

<style scoped>
</style>
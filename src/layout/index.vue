<template>
  <div class="layout_container">
    <!-- 左侧菜单 -->
    <div class="layout_slider"></div>
    <!-- 顶部导航 -->
    <div class="layout_tabbar"></div>
    <!-- 内容区域 -->
    <div class="layout_main">
      <Scrollbar>
        <router-view />
      </Scrollbar>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup () {
    

    return {}
  }
})
</script>

<style scoped lang="scss">
  @use "@/styles/variable.scss" as *;
  
  .layout_container {
    width: 100%;
    height: 100vh;
    background-color: #fff;
    .layout_slider {
      width: $base-menu-width;
      height: 100vh;
      background: $base-menu-background;
    }
    .layout_tabbar {
      position: fixed;
      width: calc(100% - $base-menu-width);
      height: $base-tabbar-height;
      background: pink;
      left: $base-menu-width;
      top: 0;
    }
    .layout_main {
      position: absolute;
      width: calc(100% - $base-menu-width);
      height: calc(100vh - $base-tabbar-height);
      left: $base-menu-width;
      top: $base-tabbar-height;
      background: yellow;
      
      // 滚动条样式
      :deep(.el-scrollbar) {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
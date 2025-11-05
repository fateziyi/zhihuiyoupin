<template>
  <el-button
    type="primary"
    size="default"
    icon="Refresh"
    circle="true"
    dark="true"
  ></el-button>
  <el-button
    type="primary"
    size="default"
    icon="FullScreen"
    circle="true"
    dark="true"
  ></el-button>
  <el-button
    type="primary"
    size="default"
    icon="Setting"
    circle="true"
    dark="true"
  ></el-button>
  <img
    src="../../../../public/Avatar.jpg"
    style="width: 32px; height: 32px; margin: 0 20px"
  />
  <!-- 下拉菜单 -->
  <el-dropdown style="cursor: pointer">
    <span class="el-dropdown-link">
      admin
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Setting',
  setup() {
    return {}
  },
})
</script>

<style scoped>
</style>
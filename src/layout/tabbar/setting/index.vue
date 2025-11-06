<template>
  <div class="setting-container">
    <el-button
      type="primary"
      size="default"
      icon="Refresh"
      circle
      @click="updateRefresh"
    ></el-button>
    <el-button
      type="primary"
      size="default"
      icon="FullScreen"
      circle
      @click="fullScreen"
    ></el-button>
    <el-button
      type="primary"
      size="default"
      icon="Setting"
      circle
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
          <ArrowDown />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import useUserStore from '../../../store/modules/user'
import useLayoutSettingStore from '../../../store/modules/setting'

defineOptions({
  name: 'Setting'
})

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const LayoutSettingStore = useLayoutSettingStore()

// 显示菜单标题
const username = computed(() => {
  return userStore.token || 'admin'
})

// 退出登录
const logout = () => {
  // 清除用户信息
  userStore.token = ''
  REMOVE_TOKEN()
  // 跳转到登录页面
  router.push('/login')
}

// 引入操作本地存储的工具方法
import { REMOVE_TOKEN } from '../../../utils/token'

const updateRefresh = () => {
  LayoutSettingStore.refresh = !LayoutSettingStore.refresh
}
// 全屏按钮点击的回调
const fullScreen = () => {
  // DOM对象的一个属性：可以用来判断当前页面是否处于全屏状态
  let full = document.fullscreenElement
  // 切换全屏
  if (!full) {
    // 进入全屏
    document.documentElement.requestFullscreen()
  } else {
    // 退出全屏
    document.exitFullscreen()
  }
}
</script>

<style scoped>
.setting-container {
  display: flex;
  align-items: center;
  height: 100%;
}
</style>
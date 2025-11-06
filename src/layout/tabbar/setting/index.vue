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
      :src="userStore.avatar"
      style="width: 32px; height: 32px; margin: 0 20px; border-radius: 50%;"
    />
    <!-- 下拉菜单 -->
    <el-dropdown style="cursor: pointer">
      <span class="el-dropdown-link">
        {{ userStore.username }}
        <el-icon class="el-icon--right">
          <ArrowDown />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { useRouter,useRoute } from 'vue-router'
import { computed } from 'vue'
// 引入操作本地存储的工具方法
// 获取用户相关的小仓库
import useUserStore from '../../../store/modules/user'
// 获取骨架的小仓库
import useLayoutSettingStore from '../../../store/modules/setting'

defineOptions({
  name: 'Setting'
})

const $router = useRouter()
const $route = useRoute()
const userStore = useUserStore()
const LayoutSettingStore = useLayoutSettingStore()

// 显示菜单标题
const username = computed(() => {
  return userStore.token || 'admin'
})

// 退出登录
const logout = async () => {
  // 清除用户信息
  await userStore.userLogout()
  // 跳转到登录页面
  $router.push({ path: '/login' ,query: { redirect: $route.path }})
}

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
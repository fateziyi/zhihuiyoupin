<template>
  <div class="setting-container">
    <el-button type="primary" size="default" icon="Refresh" circle @click="updateRefresh"
      class="header-btn"></el-button>
    <el-button type="primary" size="default" icon="FullScreen" circle @click="fullScreen"
      class="header-btn"></el-button>
    <el-popover placement="bottom" :width="200" trigger="hover">
      <template #reference>
        <el-button type="primary" size="default" icon="Setting" circle class="header-btn"></el-button>
      </template>
      <!-- 表单组件 -->
      <el-form>
        <el-form-item label="主题颜色">
          <el-color-picker :teleported="false" @change="setColor" v-model="color" show-alpha
            :predefine="predefineColors" />
        </el-form-item>
        <el-form-item label="暗黑模式">
          <el-switch @change="changeDark" v-model="dark" inline-prompt active-icon="Moon" inactive-icon="Sunny" />
        </el-form-item>
      </el-form>
    </el-popover>
    <img :src="userStore.avatar" style="width: 32px; height: 32px; margin: 0 20px; border-radius: 50%;" />
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
import { useRouter, useRoute } from 'vue-router'
import { computed, ref, watch } from 'vue'
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
// 收集开关的数据
let dark = ref<boolean>(false)
let color = ref('rgba(255, 69, 0, 0.68)')

// 显示菜单标题
const username = computed(() => {
  return userStore.token || 'admin'
})

// 退出登录
const logout = async () => {
  // 清除用户信息
  await userStore.userLogout()
  // 跳转到登录页面
  $router.push({ path: '/login', query: { redirect: $route.path } })
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

const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])

// switch开关的change事件回调
const changeDark = () => {
  // 获取html根节点
  let html = document.documentElement
  // 判断html标签是否有类名dark
  if (dark.value) {
    html.classList.add('dark')
  } else {
    html.classList.remove('dark')
  }
}

// 主题颜色的设置
const setColor = (color: string) => {
  // 获取html根节点
  let html = document.documentElement
  // 设置根节点的样式
  html.style.setProperty('--el-color-primary', color)

  // 保存用户选择的主题色到localStorage
  localStorage.setItem('theme-color', color)
}

// 页面加载时恢复保存的主题色
const restoreThemeColor = () => {
  const savedColor = localStorage.getItem('theme-color')
  if (savedColor) {
    color.value = savedColor
    setColor(savedColor)
  }
}

// 监听颜色变化
watch(color, (newColor) => {
  setColor(newColor)
})

// 组件挂载时恢复主题色
restoreThemeColor()
</script>

<style scoped lang="scss">
.setting-container {
  display: flex;
  align-items: center;
  height: 100%;

  .header-btn {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
    transition: all 0.3s ease;
    background-color: #f0f2f5;
    border: none;
    color: #606266;

    &:hover {
      background-color: #409eff;
      color: white;
      transform: scale(1.1);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    }

    &:active {
      transform: scale(1);
    }

    :deep(.el-icon) {
      font-size: 16px;
    }
  }
}
</style>
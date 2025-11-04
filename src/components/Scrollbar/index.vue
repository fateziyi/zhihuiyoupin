<template>
  <el-scrollbar
    :height="height"
    :max-height="maxHeight"
    :always="always"
    :native="native"
    v-bind="$attrs"
  >
    <slot />
  </el-scrollbar>
</template>

<script setup lang="ts">
import { ElScrollbar } from 'element-plus'

// 定义组件属性
interface Props {
  height?: string | number
  maxHeight?: string | number
  always?: boolean
  native?: boolean
}

// 设置默认属性值
withDefaults(defineProps<Props>(), {
  height: '100%',
  maxHeight: undefined,
  always: false,
  native: false
})

// 启用属性继承
defineOptions({
  inheritAttrs: false
})
</script>

<style scoped></style>
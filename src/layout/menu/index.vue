<template>
  <div>
    <template v-for="item in menuList" :key="item.path">
      <!-- 没有子路由 -->
      <template v-if="!item.children">
        <el-menu-item v-if="!item.meta?.hidden" :index="item.path" @click="goRoute">
          <el-icon>
            <component :is="item.meta.icon"></component>
          </el-icon>
          <template #title>
            <span>{{ item.meta?.title }}</span>
          </template>
        </el-menu-item>
      </template>
      <!-- 有一个子路由 -->
      <template v-else-if="item.children && item.children.length == 1">
        <el-menu-item v-if="!item.children[0].meta?.hidden" :index="item.children[0].path" @click="goRoute">
          <el-icon>
            <component :is="item.children[0].meta.icon"></component>
          </el-icon>
          <template #title>
            <span>{{ item.children[0].meta?.title }}</span>
          </template>
        </el-menu-item>
      </template>
      <!-- 有子路由且个数大于一 -->
      <el-sub-menu v-else-if="item.children && item.children.length > 1" :index="item.path">
        <template #title>
          <el-icon>
            <component :is="item.meta.icon"></component>
          </el-icon>
          <span>{{ item.meta?.title }}</span>
        </template>
        <!-- 递归调用自身 -->
        <Menu :menuList="item.children" />
      </el-sub-menu>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  menuList: {
    type: Array as PropType<any[]>,
    required: true,
  },
})

// 获取路由器对象
const $router = useRouter()
// 点击菜单的回调
const goRoute = (vc: any) => {
  // 修复路由跳转逻辑
  $router.push(vc.index)
}
</script>

<script lang="ts">
export default {
  name: 'Menu'
}
</script>

<style scoped lang="scss">
/* 菜单项样式优化 */
:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  display: flex;
  align-items: center;
}

/* 确保图标和文字之间有合适的间距 */
:deep(.el-menu-item .el-icon),
:deep(.el-sub-menu__title .el-icon) {
  flex-shrink: 0;
  margin-right: 8px;
}

/* 文字样式优化 */
:deep(.el-menu-item span),
:deep(.el-sub-menu__title span) {
  opacity: 1;
  transition: opacity 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 解决菜单展开时文字显示问题 */
:deep(.el-menu-item .el-menu-tooltip__trigger) {
  width: 100%;
}
</style>
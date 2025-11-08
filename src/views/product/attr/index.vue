<template>
  <div>
    <!-- 三级分类全局组件 -->
    <Category />
    <!-- 属性管理 -->
    <el-card style="margin: 10px 0;">
      <el-button type="primary" icon="Plus" :disabled="categoryStore.c3Id ? false : true" class="add-attr-button">
        添加属性
      </el-button>
      <el-table border style="margin: 10px 0;">
        <el-table-column label="序号" width="80px" align="center" type="index">
        </el-table-column>
        <el-table-column label="属性名称" width="180px" align="center">
        </el-table-column>
        <el-table-column label="属性值名称" align="center">
        </el-table-column>
        <el-table-column label="操作" width="180px" align="center">
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// 获取分类仓库
import useCategoryStore from '@/store/modules/category';
let categoryStore = useCategoryStore();
</script>

<style scoped lang="scss">
.add-attr-button {
  // 内边距调整，确保文字和图标有合适的空间
  padding: 12px 10px;

  // 字体样式优化
  font-size: 14px;
  font-weight: 500;

  // 使用flex布局确保图标和文字垂直居中对齐
  display: inline-flex;
  align-items: center;
  justify-content: center;

  // 图标与文字间距
  :deep(.el-icon) {
    margin-right: 8px;
  }

  // 按钮圆角
  border-radius: 4px;

  // hover状态优化
  &:hover {
    background-color: var(--el-color-primary-dark-2);
    border-color: var(--el-color-primary-dark-2);
    color: white;
  }

  // focus状态保持一致
  &:focus {
    background-color: var(--el-color-primary);
    border-color: var(--el-color-primary);
    color: white;
  }

  // active状态略微加深
  &:active {
    background-color: var(--el-color-primary-dark-2);
    border-color: var(--el-color-primary-dark-2);
    color: white;
  }

  // 禁用状态保持一致性
  &:disabled {
    background-color: var(--el-color-primary-light-5);
    border-color: var(--el-color-primary-light-5);
    color: white;
    cursor: not-allowed;
  }

  // 添加过渡动画使交互更流畅
  transition: all 0.3s ease;
}
</style>
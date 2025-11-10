<template>
  <div>
    <!-- 三级分类全局组件 -->
    <Category :scene="scene" />
    <!-- 属性管理 -->
    <el-card style="margin: 10px 0;">
      <div v-show="scene == 0">
        <el-button @click="addAttr" type="primary" icon="Plus" :disabled="categoryStore.c3Id ? false : true"
          class="add-attr-button">
          添加属性
        </el-button>
        <el-table border style="margin: 10px 0;" :data="attrArr">
          <el-table-column label="序号" width="80px" align="center" type="index">
          </el-table-column>
          <el-table-column label="属性名称" width="180px" align="center" prop="attrName">
          </el-table-column>
          <el-table-column label="属性值名称" align="center">
            <template #="{ row, $index }">
              <el-tag v-for="(item, index) in row.attrValueList" :key="item.id" style="margin: 5px;">
                {{ item.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180px" align="center">
            <template #="{ row, $index }">
              <el-button type="success" size="default" icon="Edit" circle class="edit-button"
                @click="updateAttr(row)"></el-button>
              <el-popconfirm :title="`你确定要删除${row.attrName}吗?`" width="250px" @confirm="deleteAttr(row.id)">
                <template #reference>
                  <el-button type="danger" size="default" icon="Delete" circle class="delete-button"
                    style="margin-left: 10px;"></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="scene == 1">
        <!-- 展示添加属性与修改数据的结构 -->
        <el-form :inline="true">
          <el-form-item label="属性名称">
            <el-input placeholder="请输入属性名称" v-model="attrParams.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button :disabled="attrParams.attrName ? false : true" type="primary" size="default" icon="Plus"
          class="add-value-button" @click="addAttrValue">添加属性值</el-button>
        <el-button type="info" size="default" @click="cancel" class="cancel-button">取消</el-button>
        <el-table border style="margin: 10px 0;" :data="attrParams.attrValueList">
          <el-table-column width="80px" type="index" align="center" label="序号"></el-table-column>
          <el-table-column label="属性值名称" align="center">
            <template #="{ row, $index }">
              <el-input :ref="(vc: any) => inputArr[$index] = vc" v-if="row.flag" @blur="toLook(row, $index)"
                placeholder="请输入属性值名称" v-model="row.valueName"></el-input>
              <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template #="{ row, $index }">
              <el-button type="danger" size="default" icon="Delete" circle class="delete-button"
                @click="attrParams.attrValueList.splice($index, 1)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="button-group">
          <el-button type="primary" size="default" class="save-button" @click="save"
            :disabled="attrParams.attrValueList.length > 0 ? false : true">保存</el-button>
          <el-button type="info" size="default" @click="cancel" class="cancel-button">取消</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive, nextTick, onBeforeUnmount } from 'vue'
// 引入获取已有属性与属性值接口
import { reqAttr, reqAddOrUpdateAttr, reqRemoveAttr } from '@/api/product/attr';
import type { AttrResponseData, Attr, AttrValue } from '@/api/product/attr/type';
// 获取分类仓库
import useCategoryStore from '@/store/modules/category';
import { ElMessage } from 'element-plus';
let categoryStore = useCategoryStore();
// 存储已有的属性与属性值
let attrArr = ref<Attr[]>([])
// 定义card组件内容切换变量
let scene = ref<number>(0) // 0：显示table，1：显示添加与修改属性
// 收集新增的属性的数据
let attrParams = reactive<Attr>({
  attrName: '', // 属性名称
  attrValueList: [], // 属性值列表
  categoryId: '', // 属性所属的分类ID
  categoryLevel: 3 // 属性所属的分类等级
})
// 准备一个数组，将来存储对应的组件实例el-input
let inputArr = ref<any>([])
// 监听仓库三级分类ID变化
watch(() => categoryStore.c3Id, () => {
  // 清空上一次查询的属性与属性值
  attrArr.value = []
  // 保证三级分类ID不为空
  if (!categoryStore.c3Id)
    return
  // 解构获取分类的ID
  getAttr()

})
// 获取已有的属性与属性值方法
const getAttr = async () => {
  const { c1Id, c2Id, c3Id } = categoryStore
  // 获取分类下的已有的属性和属性值
  let result: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id)
  if (result.code === 200) {
    attrArr.value = result.data
  }
}

// 添加属性按钮的回调
const addAttr = () => {
  // 点击后清空之前的数据
  Object.assign(attrParams, {
    attrName: '',
    attrValueList: [],
    categoryId: categoryStore.c3Id,
    categoryLevel: 3
  })
  // 切换为添加与修改属性的结构
  scene.value = 1
}

// table表格修改已有属性按钮的回调
const updateAttr = (row: Attr) => {
  // 添加属性按钮的回调
  scene.value = 1
  // 点击这个按钮的时候新增属性的三级分类ID
  attrParams.categoryId = categoryStore.c3Id
  // 将当前点击的属性赋值给attrParams
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
}

// 取消按钮的回调
const cancel = () => {
  // 切换为table结构
  scene.value = 0
}

// 添加属性值按钮的回调
const addAttrValue = () => {
  // 添加属性值
  attrParams.attrValueList.push({
    valueName: '',
    flag: true //控制灭一个属性值编辑模式与查看模式的切换
  })
  // 获取最后的el-input聚焦
  nextTick(() => {
    inputArr.value[attrParams.attrValueList.length - 1].focus()
  })
}

// 保存按钮的回调
const save = async () => {
  // 添加属性
  let result: any = await reqAddOrUpdateAttr(attrParams)
  if (result.code === 200) {
    // 提示成功
    ElMessage.success(attrParams.id ? '修改成功' : '添加成功')
    // 添加成功后，切换为table结构
    scene.value = 0
    // 获取已有属性与属性值
    getAttr()
  } else {
    // 提示失败
    ElMessage.error(attrParams.id ? '修改失败' : '添加失败')
  }
}

// 属性值表单元素失去焦点的回调
const toLook = (row: AttrValue, $index: number) => {

  // 非法情况判断1：属性值不能为空
  if (row.valueName.trim() == '') {
    // 删除掉对应属性值为空的元素
    attrParams.attrValueList.splice($index, 1)
    ElMessage.error('属性值不能为空')
    return
  }
  // 非法情况判断2：属性值不能重复
  let repeat = attrParams.attrValueList.find((item) => {
    // 把当前失去焦点的属性值对象从挡圈数组扣除判断
    if (item != row) {
      return item.valueName == row.valueName
    }
  })
  if (repeat) {
    // 删除掉对应属性值为空的元素
    attrParams.attrValueList.splice($index, 1)
    ElMessage.error('属性值不能重复')
    return
  }
  row.flag = false
}

// 属性值div点击事件
const toEdit = (row: AttrValue, $index: number) => {
  row.flag = true
  // nextTick:响应式数据发生变化，获取更新的DOM（组件实例）
  nextTick(() => {
    inputArr.value[$index].focus()
  })
}

// 删除属性的回调
const deleteAttr = async (attrId: number) => {
  let result: any = await reqRemoveAttr(attrId)
  if (result.code === 200) {
    // 提示成功
    ElMessage.success('删除成功')
    // 获取已有属性与属性值
    getAttr()
  } else {
    // 提示失败
    ElMessage.error('删除失败')
  }
}

// 路由组件叫魂的时候，把仓库相关的数据清空
onBeforeUnmount(() => {
  // 清空仓库的数据
  categoryStore.$reset()
})

</script>

<style scoped lang="scss">
// 按钮基础样式
%button-base {
  // 内边距调整
  padding: 12px 16px !important;

  // 字体样式优化
  font-size: 14px !important;
  font-weight: 500 !important;

  // 使用flex布局确保图标和文字垂直居中对齐
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;

  // 按钮圆角
  border-radius: 4px !important;

  // 添加过渡动画使交互更流畅
  transition: all 0.3s ease !important;

  // 图标与文字间距
  :deep(.el-icon) {
    margin-right: 8px !important;
  }

  // focus状态统一处理outline
  &:focus {
    outline: none !important;
  }
}

// 主要按钮样式（蓝色系）
%primary-button {
  @extend %button-base;

  // 固定按钮背景色和边框色
  background-color: #409eff !important;
  border-color: #409eff !important;
  color: white !important;

  // hover状态优化并固定颜色，使用更浅的颜色
  &:hover {
    background-color: #79bbff !important;
    border-color: #79bbff !important;
    color: white !important;
  }

  // focus状态保持一致并固定颜色
  &:focus {
    background-color: #409eff !important;
    border-color: #409eff !important;
    color: white !important;
  }

  // active状态略微加深并固定颜色
  &:active {
    background-color: #337ecc !important;
    border-color: #337ecc !important;
    color: white !important;
  }
}

// 次要按钮样式（灰色系）
%secondary-button {
  @extend %button-base;

  // 固定按钮背景色和边框色
  background-color: #909399 !important;
  border-color: #909399 !important;
  color: white !important;

  // hover状态优化并固定颜色，使用更浅的颜色
  &:hover {
    background-color: #b1b3b8 !important;
    border-color: #b1b3b8 !important;
    color: white !important;
  }

  // focus状态保持一致并固定颜色
  &:focus {
    background-color: #909399 !important;
    border-color: #909399 !important;
    color: white !important;
  }

  // active状态略微加深并固定颜色
  &:active {
    background-color: #72767e !important;
    border-color: #72767e !important;
    color: white !important;
  }
}

// 动作按钮样式（编辑、删除等圆形按钮）
%action-button {
  // 添加过渡动画使交互更流畅
  transition: all 0.3s ease;

  // 添加阴影效果增强立体感
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  // hover状态优化和增强效果
  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    transform: translateY(-1px);
  }

  // active状态添加下沉效果
  &:active {
    transform: translateY(1px);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }
}

// 具体按钮类定义
.add-attr-button {
  @extend %primary-button;

  // 特殊内边距调整
  padding: 12px 10px !important;

  // 禁用状态保持一致性
  &:disabled {
    background-color: #a0cfff !important;
    border-color: #a0cfff !important;
    color: white !important;
    cursor: not-allowed !important;
  }
}

.add-value-button {
  @extend %primary-button;
}

.save-button {
  @extend %primary-button;
}

.cancel-button {
  @extend %secondary-button;

  // 左侧间距
  margin-left: 12px !important;
}

.edit-button {
  @extend %action-button;

  // 默认状态样式
  background-color: var(--el-color-success);
  border-color: var(--el-color-success);
  color: white;

  // focus状态添加发光效果
  &:focus {
    background-color: var(--el-color-success);
    border-color: var(--el-color-success);
    color: white;
    box-shadow: 0 0 0 2px rgba(103, 194, 58, 0.2);
  }

  // active状态略微加深
  &:active {
    background-color: var(--el-color-success-dark-2);
    border-color: var(--el-color-success-dark-2);
    color: white;
  }
}

.delete-button {
  @extend %action-button;

  // 默认状态样式
  background-color: var(--el-color-danger);
  border-color: var(--el-color-danger);
  color: white;

  // focus状态添加发光效果
  &:focus {
    background-color: var(--el-color-danger);
    border-color: var(--el-color-danger);
    color: white;
    box-shadow: 0 0 0 2px rgba(255, 0, 0, 0.2);
  }

  // active状态略微加深
  &:active {
    background-color: var(--el-color-danger-dark-2);
    border-color: var(--el-color-danger-dark-2);
    color: white;
  }
}

.button-group {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
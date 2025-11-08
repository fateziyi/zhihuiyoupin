<template>
  <div>
    <el-card class="box-card">
      <!-- 卡片顶部添加品牌按钮 -->
      <el-button type="primary" size="default" icon="Plus" class="add-brand-button"
        @click="addTrademark">添加品牌</el-button>
      <!-- 表格组件：用于展示品牌列表 -->
      <el-table style="margin: 10px 0;" border :data="trademarkArr">
        <el-table-column label="序号" width="80px" align="center" type="index">
        </el-table-column>
        <!-- table-column:默认展示数据用div -->
        <el-table-column label="品牌名称" align="center">
          <template #="{ row, $index }">
            <pre>{{ row.tmName }}</pre>
          </template>
        </el-table-column>
        <el-table-column label="品牌logo" align="center">
          <template #="{ row, $index }">
            <div class="logo-container">
              <img :src="row.logoUrl" alt="未能找到图片路径" class="brand-logo" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="品牌操作" align="center">
          <template #="{ row, $index }">
            <el-button type="success" size="default" icon="Edit" circle class="edit-button"
              @click="updateTrademark(row)"></el-button>
            <el-popconfirm :title="`您确定要删除${row.tmName}吗？`" width="250px" icon="Warning"
              @confirm="removeTradeMark(row.id)">
              <template #reference>
                <el-button type="danger" size="default" icon="Delete" circle class="delete-button"
                  style="margin-left: 10px;"></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器组件 -->
      <el-pagination @size-change="sizeChange" @current-change="getHasTrademark" :pager-count="6"
        v-model:current-page="pageNo" v-model:page-size="limit" :page-sizes="[3, 5, 7, 9]" size="default"
        :background="true" layout="sizes, prev, pager, next,->, jumper,total" :total="total" />
    </el-card>
    <!-- 对话框组件：添加和修改时使用 -->
    <!-- v-model:控制对话框的显示与隐藏 -->
    <!-- 通过title属性设置对话框标题 -->
    <el-dialog v-model="dialogFormVisible" :title="trademarkParams.id ? '修改品牌' : '添加品牌'" width="500">
      <el-form style="width: 80%;" :model="trademarkParams" :rules="rules" ref="formRef">
        <el-form-item label="品牌名称" prop="tmName">
          <el-input placeholder="请输入品牌名称" v-model="trademarkParams.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌logo" prop="logoUrl">
          <el-upload class="avatar-uploader" action="/api/admin/product/fileUpload" :show-file-list="false"
            :on-success="handleAvatarSuccess" :on-error="handleAvatarError" :before-upload="beforeAvatarUpload"
            :headers="uploadHeaders">
            <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 具名插槽：footer -->
      <template #footer>
        <el-button class="cancel-button" @click="cancelDialog">取消</el-button>
        <el-button type="primary" class="confirm-button" @click="confirmDialog">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed, nextTick } from 'vue'
import { reqHasTrademark, reqAddOrUpdateTrademark, reqDeleteTrademark } from '@/api/product/trademark'
import type { Records, TradeMarkResponseData, Trademark } from '@/api/product/trademark/type'
import { ElMessage } from 'element-plus'
import type { UploadProps } from 'element-plus'
// 引入用户相关的仓库
import useUserStore from '@/store/modules/user'
// 当前页码
let pageNo = ref<number>(1)
// 每页显示的条数
let limit = ref<number>(3)
// 获取已有品牌的总数
let total = ref<number>(0)
// 获取已有品牌的数据
let trademarkArr = ref<Records>([])
// 创建对话框的显示与隐藏变量
let dialogFormVisible = ref<boolean>(false)
// 获取el-form组件实例
let formRef = ref()
// 定义收集新增品牌的数据
let trademarkParams = reactive<Trademark>({
  tmName: '',
  logoUrl: '',
  id: 0
})
// 定义上传图片的请求头
let userStore = useUserStore()
let uploadHeaders = computed(() => {
  return {
    token: userStore.token || ''
  }
})
// 获取已有品牌的接口封装为一个函数:在任何情况下获取数据，调用一次函数即可
const getHasTrademark = async (pager = 1) => {
  try {
    pageNo.value = pager
    let result: TradeMarkResponseData = await reqHasTrademark(pageNo.value, limit.value)
    console.log('获取到的品牌数据:', result)
    if (result.code === 200) {
      // 获取存储品牌的总个数
      total.value = result.data.total
      trademarkArr.value = result.data.records
    } else {
      ElMessage.error(result.message || '获取品牌数据失败')
    }
  } catch (error) {
    console.error('获取品牌数据时发生错误:', error)
    ElMessage.error('获取品牌数据时发生错误')
  }
}
// 组件挂载完毕钩子---发一次请求，获取第一页，一页三条数据
onMounted(() => {
  getHasTrademark()
})
// 监听页码改变事件，重新获取数据
// 对于当前页码的改变，组件pagination父组件回传了数据（当前的页码）
// const changePageNo = (newPageNo: number) => {
//   // 当前页码发生变化后，再次请求改变数据
//   pageNo.value = newPageNo
//   getHasTrademark()
// }

// 当下拉菜单发生变化的时候触发此方法
// 这个自定义事件，分页器组件会将下拉菜单选中的数据返回
const sizeChange = () => {
  // 当下拉菜单发生变化后，重新请求数据，页码重置为1
  getHasTrademark()
}

// 上传图片组件->上传图片之前触发的钩子函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  // 这个钩子是在图片上传组件触发的，可以约束图片格式和大小
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png' && rawFile.type !== 'image/gif') {
    ElMessage.error('上传图片只能是 JPG 或 PNG 格式!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 5) {
    ElMessage.error('上传图片大小不能超过 5MB!')
    return false
  } else {
    return true
  }
}
// 上传图片组件->上传图片成功触发的钩子函数
const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  // response:当前上传图片成功后，后端返回的数据
  // uploadFile:当前上传的图片对象
  // 收集上传图片的地址，添加品牌时带给后端
  console.log('上传响应:', response);
  if (response && response.data) {
    trademarkParams.logoUrl = response.data
    ElMessage.success('图片上传成功')
    // 图片上传成功，清理掉对应图片校验结果
    formRef.value.clearValidate(['logoUrl'])
  } else {
    ElMessage.error('上传图片失败，请重试')
  }
}

// 添加上传失败的处理函数
const handleAvatarError: UploadProps['onError'] = (error, uploadFile) => {
  console.error('上传失败:', error)
  ElMessage.error('图片上传失败，请检查网络连接或稍后重试')
}

// 添加品牌按钮点击事件
const addTrademark = () => {
  dialogFormVisible.value = true
  // 清空收集的数据
  trademarkParams.tmName = ''
  trademarkParams.logoUrl = ''
  // 确保id为undefined，表示添加操作
  delete trademarkParams.id
  // 第一种写法：ts？
  // formRef.value?.clearValidate('tmName')
  // formRef.value?.clearValidate('logoUrl')
  // 第二种写法：nextTick
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })
}

// 修改品牌按钮点击事件
// row:当前已有的品牌
const updateTrademark = (row: Trademark) => {
  // 清空校验的错误提示信息
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })
  dialogFormVisible.value = true

  // 展示已有的品牌数据
  Object.assign(trademarkParams, row)
}

// 取消按钮点击事件
const cancelDialog = () => {
  dialogFormVisible.value = false
}

// 确认按钮点击事件
const confirmDialog = async () => {
  // 在发请求之前，要对于表单进行校验
  // 调用表单的校验方法，校验通过才继续
  await formRef.value.validate()
  // 这里可以添加保存逻辑
  let result = await reqAddOrUpdateTrademark(trademarkParams)
  // 添加或修改品牌
  if (result.code === 200) {
    dialogFormVisible.value = false
    ElMessage({
      message: trademarkParams.id ? '修改品牌成功' : '添加品牌成功',
      type: 'success'
    })
    getHasTrademark(trademarkParams.id ? pageNo.value : 1)
  } else {
    ElMessage({
      message: trademarkParams.id ? '修改品牌失败' : '添加品牌失败',
      type: 'error'
    })
    dialogFormVisible.value = false
  }
}

// 自定义品牌名称验证函数
const validatorTmName = (rule: any, value: string, callback: any) => {
  if (value.trim().length >= 2 && value.trim().length <= 15) {
    callback()
  } else {
    callback(new Error('品牌名称长度应在2到15个字符之间'))
  }
}

// 自定义图片验证函数
const validatorLogoUrl = (rule: any, value: string, callback: any) => {
  if (value) {
    callback()
  } else {
    callback(new Error('请上传品牌logo图片'))
  }
}

// 表单验证规则
const rules = reactive({
  tmName: [
    { required: true, trigger: 'blur', validator: validatorTmName },
  ],
  logoUrl: [
    { required: true, validator: validatorLogoUrl, trigger: 'change' }
  ]
})

// 气泡确认框确定按钮的回调
const removeTradeMark = async (id: number) => {
  // 点击确定按钮删除已有品牌请求
  let result = await reqDeleteTrademark(id)
  if (result.code === 200) {
    ElMessage.success('删除品牌成功')
    // 删除成功后，重新获取数据
    getHasTrademark(trademarkArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage.error('删除品牌失败')
  }
}
</script>

<style scoped lang="scss">
.box-card {
  margin-top: 20px;
}

// 添加品牌按钮样式优化
.add-brand-button {
  // 内边距调整，确保文字和图标有合适的空间
  padding: 12px 12px;

  // 确保字体大小合适
  font-size: 14px;

  // 固定按钮背景色和文字颜色
  background-color: var(--el-color-primary);
  border-color: var(--el-color-primary);
  color: white;

  // 使用flex布局确保图标和文字垂直居中对齐
  display: inline-flex;
  align-items: center;
  justify-content: center;

  // 图标与文字间距
  :deep(.el-icon) {
    margin-right: 6px;
  }

  // hover状态优化 - 颜色稍微加深而不是变浅
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
  }
}

// 编辑按钮样式优化 - 固定颜色
.edit-button {
  background-color: var(--el-color-success) !important;
  border-color: var(--el-color-success) !important;
  color: white !important;

  &:hover {
    background-color: var(--el-color-success-dark-2) !important;
    border-color: var(--el-color-success-dark-2) !important;
    color: white !important;
  }

  &:focus {
    background-color: var(--el-color-success) !important;
    border-color: var(--el-color-success) !important;
    color: white !important;
  }

  &:active {
    background-color: var(--el-color-success-dark-2) !important;
    border-color: var(--el-color-success-dark-2) !important;
    color: white !important;
  }

  &:disabled {
    background-color: var(--el-color-success-light-5) !important;
    border-color: var(--el-color-success-light-5) !important;
    color: white !important;
  }
}

// 删除按钮样式优化 - 固定颜色
.delete-button {
  background-color: var(--el-color-danger) !important;
  border-color: var(--el-color-danger) !important;
  color: white !important;

  &:hover {
    background-color: var(--el-color-danger-dark-2) !important;
    border-color: var(--el-color-danger-dark-2) !important;
    color: white !important;
  }

  &:focus {
    background-color: var(--el-color-danger) !important;
    border-color: var(--el-color-danger) !important;
    color: white !important;
  }

  &:active {
    background-color: var(--el-color-danger-dark-2) !important;
    border-color: var(--el-color-danger-dark-2) !important;
    color: white !important;
  }

  &:disabled {
    background-color: var(--el-color-danger-light-5) !important;
    border-color: var(--el-color-danger-light-5) !important;
    color: white !important;
  }
}

// 取消按钮样式优化
.cancel-button {
  padding: 12px 12px;
  font-size: 14px;
  background-color: var(--el-color-info) !important;
  border-color: var(--el-color-info) !important;
  color: white !important;

  &:hover {
    background-color: var(--el-color-info-dark-2) !important;
    border-color: var(--el-color-info-dark-2) !important;
    color: white !important;
  }

  &:focus {
    background-color: var(--el-color-info) !important;
    border-color: var(--el-color-info) !important;
    color: white !important;
  }

  &:active {
    background-color: var(--el-color-info-dark-2) !important;
    border-color: var(--el-color-info-dark-2) !important;
    color: white !important;
  }

  &:disabled {
    background-color: var(--el-color-info-light-5) !important;
    border-color: var(--el-color-info-light-5) !important;
    color: white !important;
  }
}

// 确认按钮样式优化
.confirm-button {
  padding: 12px 12px;
  font-size: 14px;
  background-color: var(--el-color-primary) !important;
  border-color: var(--el-color-primary) !important;
  color: white !important;

  &:hover {
    background-color: var(--el-color-primary-dark-2) !important;
    border-color: var(--el-color-primary-dark-2) !important;
    color: white !important;
  }

  &:focus {
    background-color: var(--el-color-primary) !important;
    border-color: var(--el-color-primary) !important;
    color: white !important;
  }

  &:active {
    background-color: var(--el-color-primary-dark-2) !important;
    border-color: var(--el-color-primary-dark-2) !important;
    color: white !important;
  }

  &:disabled {
    background-color: var(--el-color-primary-light-5) !important;
    border-color: var(--el-color-primary-light-5) !important;
    color: white !important;
  }
}

// Logo容器样式 - 用于居中图片
.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100px;
}

// 品牌Logo样式
.brand-logo {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
<template>
  <el-form label-width="80px">
    <el-form-item label="SKU名称">
      <el-input placeholder="SKU名称" v-model="skuParams.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input placeholder="价格(元)" type="number" style="width: 200px;" v-model="skuParams.price"></el-input>
    </el-form-item>
    <el-form-item label="重量(g)">
      <el-input placeholder="重量(g)" type="number" style="width: 200px;" v-model="skuParams.weight"></el-input>
    </el-form-item>
    <el-form-item label="SKU描述">
      <el-input placeholder="SKU描述" type="textarea" v-model="skuParams.skuDesc"></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form inline="true">
        <el-form-item v-for="(item, index) in attrArr" :key="item.id" :label="item.attrName">
          <el-select style="width: 200px; margin-top: 5px;" v-model="item.attrIdAndValueId">
            <el-option :value="`${item.id}:${attrValue.id}`" v-for="(attrValue, index) in item.attrValueList"
              :key="attrValue.id" :label="attrValue.valueName"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form inline="true">
        <el-form-item v-for="(item, index) in saleArr" :key="item.id" :label="item.saleAttrName">
          <el-select style="width: 200px;" v-model="item.saleIdAndValueId">
            <el-option :value="`${item.id}:${saleArrValue.id}`"
              v-for="(saleArrValue, index) in item.spuSaleAttrValueList" :key="saleArrValue.id"
              :label="saleArrValue.saleAttrValueName"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片名称">
      <el-table border :data="imgArr" ref="table">
        <el-table-column type="selection" width="80px" align="center"></el-table-column>
        <el-table-column label="图片" align="center">
          <template #="{ row, $index }">
            <div style="display: flex; justify-content: center; align-items: center; height: 100%;">
              <img :src="row.imgUrl" alt="" style="width: 100px; height: 100px; display: block;">
            </div>
          </template>
        </el-table-column>
        <el-table-column label="名称" align="center" prop="imgName"></el-table-column>
        <el-table-column label="操作" align="center">
          <template #="{ row, $index }">
            <el-button class="default-button" type="success" @click="handler(row)">设为默认</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button class="save-button" type="primary" @click="save">保存</el-button>
      <el-button class="cancel-button" type="info" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
// 引入请求API
import { reqAttr } from '@/api/product/attr';
import { reqSpuImageList, reqSpuHasSaleAttr, reqAddSku } from '@/api/product/spu';
import { ref, reactive } from 'vue'
import type { SkuData } from '@/api/product/spu/type';
import { ElMessage } from 'element-plus'
// 平台属性
let attrArr = ref<any>([])
// 销售属性
let saleArr = ref<any>([])
// 照片的数据
let imgArr = ref<any>([])
// 收集SKU的参数
// 获取table组件vc
let table = ref<any>()
let skuParams = reactive<SkuData>({
  // 父组件传递的数据
  category3Id: '', // 三级分类的ID
  spuId: '', // 已有的SPU的ID
  tmId: '', // SPU 品牌ID
  // v-model 收集
  skuName: '', // SKU 名字
  price: '', // SKU 价格
  weight: '', // SKU 重量
  skuDesc: '', // SKU 描述
  skuAttrValueList: [], // 平台属性
  skuSaleAttrValueList: [
    // 销售属性
    {
      saleAttrId: '', // 销售属性ID
      saleAttrValueId: '', // 销售属性值ID
    },
  ],
  skuDefaultImg: '', // 售卖SKU图片地址
})
// 取消按钮的回调
const cancel = () => {
  // 发送自定义事件，让父组件spuList组件监听，并切换场景为0
  $emit('changeScene', { flag: 0, params: '' })
}

// 当前子组件的方法对外暴露
const initSkuData = async (c1Id: number | string, c2Id: number | string, spu: any) => {
  // 收集数据
  skuParams.category3Id = spu.category3Id
  skuParams.spuId = spu.id
  skuParams.tmId = spu.tmId
  // 获取平台属性
  let result: any = await reqAttr(c1Id, c2Id, spu.category3Id)
  // 获取对应的销售属性
  let result1: any = await reqSpuHasSaleAttr(spu.id)
  // 获取照片墙数据
  let result2: any = await reqSpuImageList(spu.id)
  // 平台属性
  attrArr.value = result.data
  // 销售属性
  saleArr.value = result1.data
  // 图片数据
  imgArr.value = result2.data
}

// 设置默认图片方法的回调
const handler = (row: any) => {
  // 点击的时候，全部的复选框不勾选
  table.value?.clearSelection()
  // 勾选选中的行
  table.value?.toggleRowSelection(row, true)
  // 收集图片的地址
  skuParams.skuDefaultImg = row.imgUrl
}

// 保存按钮的回调
const save = async () => {
  // 整理参数
  // 平台属性
  skuParams.skuAttrValueList = attrArr.value.reduce((prev: any, next: any) => {
    if (next.attrIdAndValueId) {
      let [attrId, valueId] = next.attrIdAndValueId.split(':')
      prev.push({
        attrId,
        valueId
      })
    }
    return prev
  }, [])
  // 销售属性
  skuParams.skuSaleAttrValueList = saleArr.value.reduce((prev: any, next: any) => {
    if (next.saleIdAndValueId) {
      let [saleId, saleValueId] = next.saleIdAndValueId.split(':')
      prev.push({
        saleAttrId: saleId,
        saleAttrValueId: saleValueId
      })
    }
    return prev
  }, [])
  // 发送请求
  let result: any = await reqAddSku(skuParams)
  if (result.code == 200) {
    // 提示
    ElMessage.success('添加SKU成功')
    // 跳转
    $emit('changeScene', { flag: 0, params: '' })
  } else {
    ElMessage.error('添加SKU失败')
  }
}

defineExpose({
  initSkuData
})
// 自定义事件方法
let $emit = defineEmits(['changeScene'])
</script>

<style lang="scss" scoped>
// 按钮基础样式
%button-base {
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
}

// 主要操作按钮（保存）
%primary-button {
  @extend %button-base;
  background-color: var(--el-color-primary);
  color: white;

  &:hover {
    background-color: var(--el-color-primary-dark-2);
    color: white;
  }

  &:active {
    background-color: var(--el-color-primary-light-3);
    color: white;
  }
}

// 次要操作按钮（取消）
%secondary-button {
  @extend %button-base;
  background-color: var(--el-color-info);
  color: white;

  &:hover {
    background-color: var(--el-color-info-dark-2);
    color: white;
  }

  &:active {
    background-color: var(--el-color-info-light-3);
    color: white;
  }
}

// 成功操作按钮（设为默认）
%success-button {
  @extend %button-base;
  background-color: var(--el-color-success);
  color: white;

  &:hover {
    background-color: var(--el-color-success-dark-2);
    color: white;
  }

  &:active {
    background-color: var(--el-color-success-light-3);
    color: white;
  }
}

// 保存按钮样式
.save-button {
  @extend %primary-button;
  margin-right: 10px;
}

// 取消按钮样式
.cancel-button {
  @extend %secondary-button;
}

// 设为默认按钮样式
.default-button {
  @extend %success-button;
}
</style>
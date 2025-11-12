<template>
  <el-form label-width="80px">
    <el-form-item label="SKU名称">
      <el-input placeholder="SKU名称"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input placeholder="价格(元)" type="number" style="width: 200px;"></el-input>
    </el-form-item>
    <el-form-item label="重量(g)">
      <el-input placeholder="重量(g)" type="number" style="width: 200px;"></el-input>
    </el-form-item>
    <el-form-item label="SKU描述">
      <el-input placeholder="SKU描述" type="textarea"></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form inline="true">
        <el-form-item>
          <el-select label="手机一级">
            <el-option></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select label="手机一级">
            <el-option></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select label="手机一级">
            <el-option></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form inline="true">
        <el-form-item>
          <el-select label="手机一级">
            <el-option></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select label="手机一级">
            <el-option></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select label="手机一级">
            <el-option></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片名称">
      <el-table border>
        <el-table-column type="selection" width="80px" align="center"></el-table-column>
        <el-table-column label="图片" align="center"></el-table-column>
        <el-table-column label="名称" align="center"></el-table-column>
        <el-table-column label="操作" align="center"></el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary">保存</el-button>
      <el-button type="info" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
let $emit = defineEmits(['changeScene'])
// 取消按钮的回调
const cancel = () => {
  // 发送自定义事件，让父组件spuList组件监听，并切换场景为0
  $emit('changeScene', { flag: 0, params: '' })
} 
</script>

<style lang="scss" scoped></style>
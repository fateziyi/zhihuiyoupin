<template>
  <div class="tabbar">
    <div class="tabbar_left">
      <Breadcrumb />
    </div>
    <div class="tabbar_right">
      <Setting />
    </div>
  </div>
</template>

<script setup lang="ts">
import Breadcrumb from './breadcrumb/index.vue'
import Setting from './setting/index.vue'

defineOptions({
  name: 'Tabbar'
})
</script>

<style scoped lang="scss">
.tabbar {
  width: 100%;
  height: 100%;
  // background-color: #f5f5f5;
  // background-image: linear-gradient(90deg, #f5f5f5 0%, #e8e8e8 100%);
  background-image: linear-gradient(90deg, #faf6ed 0%, #faebe0 100%);
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  .tabbar_left {
    display: flex;
    align-items: center;
    margin-left: 20px;
  }
  .tabbar_right {
    display: flex;
    align-items: center;
    margin-right: 20px;
    padding-right: 30px;
  }
}
</style>
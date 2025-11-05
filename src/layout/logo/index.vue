<template>
  <div class="logo" v-if="setting.logoHidden">
    <img :src="setting.logo" alt="" />
    <p>{{ setting.title }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
// 引入设置logo和标题的配置文件
import setting from '../../setting'

export default defineComponent({
  name: 'Logo',
  setup() {
    return {
      setting,
    }
  },
})
</script>

<style scoped lang="scss">
.logo {
  width: 100%;
  height: $base-menu-logo-height;
  display: flex;
  align-items: center;
  margin-top: 10px;
  padding: 8px;
  box-sizing: border-box;
  color: black;
  img {
    width: 40px;
    height: 40px;
    margin-right: 10px;
  }

  p {
    font-size: $base-logo-title-fontSize;
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-left: 5px;
  }
}
</style>
<template>
  <el-card>
    <div class="box">
      <img :src="userStore.avatar" alt="" class="avatar">
      <div class="bottom">
        <h3 class="title"> {{ getTime() }}{{ userStore.username }}！</h3>
        <p class="subtitle">智选优品运营平台</p>
      </div>
    </div>
  </el-card>
  <div class="bottoms">
    <svg-icon name="welcome" width="700px" height="500px"></svg-icon>
  </div>
</template>

<script setup lang="ts">
// 引入用户相关的仓库，获取当前用户的头像、昵称
import useUserStore from '@/store/modules/user'
import { getTime } from '@/utils/time';
// 获取存储用户信息的仓库对象
let userStore = useUserStore()
</script>

<style scoped lang="scss">
.box {
  display: flex;

  .avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
  }

  .bottom {
    margin-left: 20px;

    .title {
      font-size: 30px;
      font-weight: 900;
      margin-bottom: 30px;
      margin-top: 15px;
    }

    .subtitle {
      font-style: italic;
      font-size: 20px;
      font-weight: 500;
      color: #999;
    }
  }
}

.bottoms {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
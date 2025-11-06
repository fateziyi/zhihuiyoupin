<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form
          class="login_form"
          :model="loginForm"
          :rules="rules"
          ref="loginForms"
        >
          <h1>你好！</h1>
          <h2>欢迎来到智选优品</h2>
          <el-form-item prop="username">
            <el-input
              placeholder="请输入用户名"
              :prefix-icon="User"
              v-model="loginForm.username"
              @keyup.enter="login"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              placeholder="请输入密码"
              type="password"
              :prefix-icon="Lock"
              v-model="loginForm.password"
              show-password
              @keyup.enter="login"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="loading"
              class="login_btn"
              type="primary"
              size="default"
              @click="login"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { Lock, User } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import useUserStore from '../../store/modules/user'
import { useRouter, useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
import { getTime } from '../../utils/time'

// 收集账号和密码数据
let loginForm = reactive({
  username: '',
  password: '',
})
// 定义变量控制按钮加载效果
let loading = ref(false)
// 获取用户仓库实例
const useStore = useUserStore()
// 获取路由实例
const $router = useRouter()
// 获取路由对象
const $route = useRoute()
// 获取el-form实例
const loginForms = ref()
// 登录按钮回调
const login = async () => {
  // 保证全部表单校验通过再发送请求
  await loginForms.value.validate()
  // 开始加载
  loading.value = true
  // 点击登录按钮->通知仓库发登录请求
  // 请求成功后->跳转到首页
  // 请求失败->提示用户并弹出错误信息
  try {
    // 保证登录成功
    await useStore.userLogin(loginForm)
    // 获取用户信息
    await useStore.userInfo()
    // 编程式导航跳转到展示数据的首页
    // 判断登录的时候，路由路径当中是否有query参数，如果有就往query参数跳转，没有就跳转到首页
    let redirect:any = $route.query.redirect
    $router.push({path:redirect|| '/'})
    // 登录成功提示信息
    ElNotification({
      title: `Hello,${getTime()}`,
      message: '欢迎回来',
      type: 'success',
      duration: 3000, // 3秒后自动关闭
    })
    // 登录成功加载效果停止
    loading.value = false
  } catch (error) {
    // 登录失败加载效果停止
    loading.value = false
    // 登录失败的提示信息
    ElNotification({
      message: (error as Error).message,
      type: 'error',
      duration: 3000, // 3秒后自动关闭
    })
  }
}
// 自定义检验规则需要的函数
const validatorUsername = (rule: any, value: any, callback: any) => {
  // rule即为数组的校验规则对象
  // value即为表单元素的文本内容
  // 如果符合条件，callback放行即可通过，如果不符合条件，callback注入错误信息
  if (value.length >= 5 && value.length <= 10) {
    callback()
  } else {
    callback(new Error('用户名长度在 5 到 10 个字符'))
  }
}
const validatorPassword = (rule: any, value: any, callback: any) => {
  if (value.length >= 6 && value.length <= 15) {
    callback()
  } else {
    callback(new Error('密码长度在 6 到 15 个字符'))
  }
}
// 定义表单校验需要的配置对象
const rules = {
  username: [
    // { required: true, min: 5, max: 10, message: '用户名长度在 5 到 10 个字符', trigger: 'change' }
    { trigger: 'change', validator: validatorUsername },
  ],
  password: [
    // { required: true, min: 6, max: 15, message: '密码长度在 6 到 15 个字符', trigger: 'change' }
    { trigger: 'change', validator: validatorPassword },
  ],
}
</script>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;

  .login_form {
    position: relative;
    width: 70%;
    top: 30vh;
    background: url('@/assets/images/login_form1.png') no-repeat;
    background-size: cover;
    border-radius: 8px;
    padding: 30px;

    h1 {
      color: white;
      font-size: 40px;
    }

    h2 {
      color: white;
      font-size: 25px;
      margin: 15px 0;
    }

    .login_btn {
      width: 100%;
      background: #409eff !important; // 设置固定背景色
      border-color: #409eff !important; // 设置固定边框色
      color: white !important; // 设置固定文字颜色

      // 悬停状态也保持固定颜色
      &:hover {
        background: #66b1ff !important;
        border-color: #66b1ff !important;
        color: white !important;
      }

      // 激活状态也保持固定颜色
      &:active {
        background: #3a8ee6 !important;
        border-color: #3a8ee6 !important;
        color: white !important;
      }
    }
  }
}
</style>
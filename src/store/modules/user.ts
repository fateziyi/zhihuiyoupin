// 创建用户相关的小仓库
import { defineStore } from "pinia"
// 引入接口
import { reqLogin, reqUserInfo } from "@/api/user"
// 引入数据类型
import type { loginForm, loginResponseData, userResponseData } from "@/api/user/type"
// 引入ref和watch
import { ref, watch } from "vue"
// 创建用户仓库
export const useUserStore = defineStore("user", () => {
  const token = ref(localStorage.getItem("token")) //用户唯一标识token

  // 监听token变化，实现持久化存储
  watch(token, (newToken) => {
    if (newToken) {
      localStorage.setItem("token", newToken)
    } else {
      localStorage.removeItem("token")
    }
  })

  const userLogin = async (data: loginForm) => {
    // 发登录请求
    let result: loginResponseData = await reqLogin(data)
    // 处理登录结果并存储token
    if (result.code == 200) {
      token.value = result.data.token || null
      // 保证当前async函数返回一个成功的promise
      return Promise.resolve(result.data)
    } else {
      return Promise.reject(new Error(result.data.message || "登录失败"))
    }
    return result
  }

  return {
    token,
    userLogin
  }
})

// 对外暴露用户小仓库
export default useUserStore
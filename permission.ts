// 路由鉴权，项目中的路由什么条件下才能访问
import router from '@/router'
import nprogress from 'nprogress'
import settings from '@/setting'
// 引入进度条样式
import 'nprogress/nprogress.css'
nprogress.configure({ showSpinner: false })
// 获取用户相关的小仓库内部的token来判断是否登录
import pinia from '@/store'
import useUserStore from '@/store/modules/user'
let userStore = useUserStore(pinia)
// 获取用户名字
let username = userStore.username
// 全局守卫：项目当中任意路由切换都会触发的钩子
// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  document.title = `${settings.title}-${to.meta.title}` || '智选优品'
  // 访问某一个路由之前会触发
  // to:要访问的路由信息对象
  // from:从哪个路由而来
  // next:表示放行函数
  // 开启进度条
  nprogress.start()
  // 获取token，判断是否登录
  let token = userStore.token
  if (token) {
    // 用户已登录判断
    if (to.path == '/login') {
      next({ path: '/' })
    } else {
      // 有用户信息
      if (username) {
        // 放行
        next()
      } else {
        // 获取用户信息
        try {
          await userStore.userInfo()
          next()
        } catch (error) {
          // token过期|用户信息获取失败->重新登录
          // 清除token
          userStore.userLogout()
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
  } else {
    // 用户未登录判断
    if (to.path == '/login') {
      next()
    } else {
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
})
// 全局后置守卫
router.afterEach((to, from) => {
  // 关闭进度条
  nprogress.done()
})

// 第一项：任意路由切换实现进度条业务
// 第二项：权限控制（路由组件鉴权）
// 用户未登录：可以访问login，其余路由不嫩访问
// 用户登陆成功：不可以访问login，其余的可以访问
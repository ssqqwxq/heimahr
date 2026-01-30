import router from '@/router'
import store from '@/store'
import nprogress from 'nprogress' // 进度条
import 'nprogress/nprogress.css'

// 有token => 去登录页拦截到首页 =>有token不去登录页放行
// 无token => 去的地址在白名单里面放行 => 去的地址不在白名单里面拦截到登录页
// next（地址） 有地址它不会执行后置守卫的关闭进度条 需手动关闭
const whiteList = ['/login', '/404'] // 白名单
// 路由前置守卫
router.beforeEach((to, from, next) => {
  nprogress.start()
  // 有token 
  if (store.getters.token) {
    // 去登录页
    if (to.path === '/login') {
      next('/') // 跳到首页
      // next（地址）并没有执行后置守卫
      nprogress.done()
    } else {
      // 不是去登录页
      next() // 放行
    }
  } else {
    // 没有token  
    // 去的地址在白名单里面
    if (whiteList.includes(to.path)) {
      next() // 放行
    } else {
      next('/login') // 去登录页
      nprogress.done()
    }
  }
}
)


// 路由后置守卫
router.afterEach(() => {
  nprogress.done()//关闭进度条

})
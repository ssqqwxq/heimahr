
import router from '@/router'
import store from '@/store'
import nprogress from 'nprogress' // 进度条
import 'nprogress/nprogress.css'
import { asyncRouters } from '@/router'
// 有token => 去登录页拦截到首页 =>有token不去登录页放行
// 无token => 去的地址在白名单里面放行 => 去的地址不在白名单里面拦截到登录页
// next（地址） 有地址它不会执行后置守卫的关闭进度条 需手动关闭
const whiteList = ['/login', '/404'] // 白名单
// 路由前置守卫
router.beforeEach(async (to, from, next) => {
  nprogress.start()
  // 有token 
  if (store.getters.token) {
    // 去登录页
    if (to.path === '/login') {
      next('/') // 跳到首页
      // next（地址）并没有执行后置守卫
      nprogress.done()
    } else {
      // 去首页 判断是否获取过资料
      if (!store.getters.userId) {
        // dispatch拿到的是函数的返回值需要写return 接口本身会返回不需写
        const res = await store.dispatch('user/getUserInfo')
        //console.log(res.roles.menus); // 用户权限
        //console.log(asyncRouters);  //动态路由
        // 筛选动态路由 看看用户权限里包含几个动态路由
        const filterRoutes = asyncRouters.filter(item => {
          return res.roles.menus.includes(item.name)
        })
        store.commit('user/setRoutes', filterRoutes)
        console.log(filterRoutes); // 存储到vuex响应式
        // 添加动态路由信息到路由表 并且 404路由要放到路由表的最后面
        router.addRoutes([...filterRoutes], { path: '*', redirect: '/404', hidden: true })
        // router添加动态路由之后 需要转发一下
        next(to.path) // 目的是让路由拥有信息 router的已知缺陷
      } else {
        next() // 放行
      }
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
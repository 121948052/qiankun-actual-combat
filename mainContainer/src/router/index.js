import Vue from 'vue'
import VueRouter from 'vue-router'
import notFound from '@/components/status/404.vue'
import { read, save, clear } from '../storage/index'

// 自动导入其他 router 文件
const context = require.context('./', true, /.js$/)
let routerList = []
context.keys().forEach(k => {
  if (k !== './index.js') {
    routerList = [...routerList, ...context(k).default]
  }
})

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

const originalReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace (location) {
  return originalReplace.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

let router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    ...routerList,
    {
      path: '/404',
      name: 404,
      component: notFound
    }
  ]
})

router.beforeEach((to, from, next) => {
  // 业务后续不能使用i&&c&&t形式
  if (to.query.i && to.query.c && to.query.t) {
    clear('', true)
  }
  if (to.path === '/' || to.path === '/login') {
    if (read('token') && !read('logout')) return next('/work/home')
    // 在此处做路由拦截
    if (!read('token')) {
      const token = to.query.t // 跳转
      if (token) {
        let userInfor = read('userInfor')
        // 这条代码为了兼容oa 项目 system id 和 填充session userInfo数据
        save('innerSystemList', JSON.stringify([{ 'id': '10000', 'name': 'GAIA', 'urlPrefix': '/gaia', 'domain': '' }]))
        save('token', `Bearer ${decodeURIComponent(token)}`)
        save('instanceCode', decodeURIComponent(to.query.i))
        if (!userInfor) {
          userInfor = {
            'tenantCode': decodeURIComponent(to.query.c),
            'refresh_token': decodeURIComponent(to.query.r)
          }
        } else {
          userInfor.tenantCode = decodeURIComponent(to.query.c)
          userInfor.refresh_token = decodeURIComponent(to.query.r)
        }
        save('userInfor', JSON.stringify(userInfor))
        // 处理
        next()
      } else {
        next()
      }
    }
  } else {
    if (!read('token')) return next('/login')
  }
  next()
})

router.afterEach((to) => {
})

export default router

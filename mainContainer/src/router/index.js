import Vue from 'vue'
import VueRouter from 'vue-router'
import notFound from '@/components/status/404.vue'
import { clear } from '../storage/index'

// 自动导入其他 router 文件
const context = require.context('./', true, /.js$/)
let routerList = []
context.keys().forEach(k => {
  if (k === './childrenRouter.js') {
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
      redirect: '/main/home'
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
  if (to.query.i && to.query.c && to.query.t) {
    clear('', true)
  }
  if (to.path === '/') {
    next('/main/home')
  } else {
    next()
  }
})

router.afterEach((to) => {
})

export default router

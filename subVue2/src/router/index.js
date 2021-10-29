// 引入路由
import Vue from 'vue'
import VueRouter from 'vue-router'
// 引入其余模块路由
import permission from './permission'
import personalManage from './personalManage'
import businessGroup from './businessGroup'

Vue.use(VueRouter)

const router = [
  ...permission,
  ...personalManage,
  ...businessGroup,
  {
    path: '*',
    name: '404',
    component: {
      render (h) {
        return h('div', {}, '')
      }
    }
  },
  {
    path: '/oa/empty',
    name: 'empty',
    component: {
      render (h) {
        return h('div', {}, '')
      }
    }
  }
]
export default router

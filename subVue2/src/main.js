import Vue from 'vue'
import App from './App.vue'
import './http'
import VueRouter from 'vue-router'
import routes from './router'
import store from './store'
import './public-path'

import antd from 'ant-design-vue'
import 'ant-design-vue/lib/date-picker/style/css'

// 最后引入公共样式
import '@/assets/css/base.less'
Vue.use(antd)
Vue.config.productionTip = false

let router = null
let instance = null
let gaiaStore = null
const { name: appName } = require('../package.json')

function replaceState (state, type, target) {
  if (!target[type]) target[type] = {}
  Object.keys(state).forEach(k => {
    target[type][k] = state[k]
  })
}

export async function bootstrap ({ actions, mutations, state, getters, func, GaiaStore } = {}) {
  // console.log('[vue] vue app bootstraped')
  replaceState(actions, 'GAIA_COM_ACTIONS', Vue.prototype)
  replaceState(mutations, 'GAIA_COM_MUTATIONS', Vue.prototype)

  // push
  const originalPush = VueRouter.prototype.push
  VueRouter.prototype.push = function push (location) {
    return originalPush.call(this, location).catch(err => err)
  }

  // replace
  const originalReplace = VueRouter.prototype.replace
  VueRouter.prototype.replace = function replace (location) {
    return originalReplace.call(this, location).catch(err => err)
  }
  // 初始化GaiaStore
  gaiaStore = new GaiaStore({
    _vue: Vue,
    GAIA_STATE: state || {},
    GAIA_GETTERS: getters || {}
  })

  window.func = func

  // // 监听tab关闭事件
  // window.addEventListener('tab-close', (res) => {
  //   console.log('tab-close', res.detail)
  // })
  // // 监听tab新增事件
  // window.addEventListener('tab-add', (res) => {
  //   console.log('tab-add', res.detail)
  // })
}

export async function mount (props = {}) {
  const { render } = props
  // console.log('[vue] app mount')
  router = new VueRouter({ mode: 'history', routes })
  // 设置通讯
  Vue.prototype.$onGlobalStateChange = props.onGlobalStateChange
  Vue.prototype.$setGlobalState = props.setGlobalState

  instance = render(instance, Vue, App, { router, store, i18n, scui, gaiaStore })
}

export async function unmount ({ state } = {}) {
  // console.log('[vue] vue app unmount', app)
  const app = instance.$router.apps[0]
  const lastCompoentName = app.$route.matched[0].components.default.name
  const cachedInstance = instance.cachedInstance || instance

  cachedInstance._vnode.data.keepAlive = true
  cachedInstance.catchRoute = { apps: [app] }
  if (lastCompoentName && lastCompoentName !== '') {
    const result = state.catchComponent[appName].find(item => item === lastCompoentName)
    if (result) cachedInstance.$router.leavePath = cachedInstance.$router.currentRoute.path
  }

  instance.$destroy()
  router = null
  instance.$router.apps = []
}
// 单独开发环境
window.__POWERED_BY_QIANKUN__ || mount()

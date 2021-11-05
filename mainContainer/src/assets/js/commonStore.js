import global from '@/store'
import common from '@/store/model/common'
import _router from '@/router'

function replaceStore (obj, type) {
  const result = {}
  Object.keys(obj).forEach(k => {
    result[k] = async function (val) {
      if (type === 'dispatch') {
        return new Promise((resolve, reject) => {
          global[type](k, val)
            .then(res => resolve(res))
            .catch(err => reject(err))
        })
      } else {
        return global[type](k, val)
      }
    }
  })
  return result
}

function render (instance, Vue, App, options) {
  if (window.__POWERED_BY_QIANKUN__ && instance) {
    const cachedInstance = instance.cachedInstance || instance
    const cachedNode = cachedInstance._vnode

    options.router.apps.push(...cachedInstance.catchRoute.apps)
    delete cachedInstance.catchRoute

    instance = new Vue({
      ...options,
      render: () => cachedNode
    })

    // 缓存最初的Vue实例
    instance.cachedInstance = cachedInstance
    options.router.onReady(() => {
      cachedNode.data.keepAlive = false
      // 会缓存所有的vue组件
      const { path, fullPath } = options.router.currentRoute
      const oldPath = cachedInstance.$router.leavePath

      if (path !== oldPath) {
        instance.$router.push(fullPath)
      } else {
        instance.$router.replace({ path: `/${fullPath.split('/')[1]}/empty` }).then(() => {
          setTimeout(() => {
            instance.$router.replace(fullPath)
          }, 0)
        })
      }
    })
    instance.$mount(document.querySelector('#root-view').firstElementChild.shadowRoot.querySelector('#app'))
  } else {
    instance = new Vue({
      ...options,
      render: h => h(App)
    }).$mount(document.querySelector('#root-view').firstElementChild.shadowRoot.querySelector('#app'))
  }
  return instance
}

function changeRouter (fn = 'replace', route) {
  _router[fn](route)
}
class GaiaStore {
  constructor (options) {
    Object.defineProperty(options._vue.prototype, '$GAIA_STORE', {
      get: function get () {
        return this._GAIA_STATE
      }
    })
    this.GAIA_STATE = options.GAIA_STATE
    this.GAIA_GETTERS = options.GAIA_GETTERS
    options._vue.mixin({
      beforeCreate () {
        if (this.$options.gaiaStore) {
          this._GAIA_STATE = this.$options.gaiaStore
          options._vue.util.defineReactive(this, '_GAIA_STATE', this._GAIA_STATE)
        } else {
          this._GAIA_STATE = (this.$parent && this.$parent._GAIA_STATE) || this
        }
      }
    })
  }
}

function destroyByName (componentName, vue) {
  if (vue) {
    vue.$children.forEach(child => {
      const name = child.$options.name
      if (name === componentName) {
        child.$destroy()
        return true
      } else {
        destroyByName(componentName, child)
      }
    })
  }
  return false
}

// 定义传入子应用的数据
export default {
  state: global.state.common,
  getters: global.getters,
  actions: replaceStore(common.actions, 'dispatch'),
  mutations: replaceStore(common.mutations, 'commit'),
  func: {
    // 调动平台项目的路由
    changeRouter,
    // 销毁子组件
    destroyByName
  },
  // 渲染子项目
  render,
  // 公共store
  GaiaStore
}

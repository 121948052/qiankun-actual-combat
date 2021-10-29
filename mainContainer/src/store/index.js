import Vue from 'vue'
import Vuex from 'vuex'

// 自动导入model 文件夹下的所有js文件
const importSubModules = () => {
  const modelList = require.context('./model', true, /\.js$/)
  let subModels = {}
  modelList.keys().forEach(k => {
    let key = k.match(/^\.\/(.*)\.js$/)[1]
    subModels[key] = modelList(k).default
  })
  return subModels
}

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    url: {},
    loaded: false
  },
  mutations: {
    SET_URL (store, payload) {
      store.url = payload
    },
    SET_LOADED_APP (store, state) {
      store.loaded = state
    }
  },
  actions: {
  },
  getters: {},
  modules: {
    ...importSubModules()
  }
})

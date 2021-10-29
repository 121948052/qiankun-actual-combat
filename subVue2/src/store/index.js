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

let subModules = importSubModules()

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    url: ''
  },
  mutations: {
    SET_URL (store, payload) {
      store.url = payload
    }
  },
  actions: {
  },
  getters: {
  },
  modules: {
    ...subModules
  }
})

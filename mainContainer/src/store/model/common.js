// import { MicroApps } from '@/assets/js/router'

// const catchComponent = Object.create(null)
// MicroApps.forEach(app => {
//   catchComponent[app] = []
// })

export default {
  // namespaced: true,
  state: {
    tabList: [],
    currentTabs: '',
    compoentsSize: 'middle',
    currentMenu: '1',
    pageTableHeight: 645, // 页面中table高度
    modelTableHeight: 478, // 弹出框中table高度
    baiscDataQueryParam: '', // 基础数据全局传递参数对象
    catchComponent: {}
  },
  getters: {
  },
  actions: {
  },
  mutations: {
    SET_CATCH_COMPONENT (store, { key, arr }) {
      store.catchComponent[key] = arr
    },
    PUSH_CATCH_COMPONENT (store, { key, value }) {
      if (!store.catchComponent[key]) store.catchComponent[key] = []
      store.catchComponent[key] = value
    },
    SET_COMPOENTS_SIZE (store, payload) {
      store.compoentsSize = payload
    },
    SET_TAB_LIST (store, payload) {
      store.tabList = payload
    },
    PUSH_TAB_LIST (store, payload) {
      if (store.tabList.length > 20) store.tabList.splice(0, 1)
      store.tabList = [...store.tabList, payload]
    },
    SET_CURRENT_TAB (store, payload) {
      store.currentTabs = payload
    },
    SET_TABLE_HEIGHT (state, size) {
      switch (size) {
        case 'large':
          state.pageTableHeight = 655
          state.modelTableHeight = 478
          break
        case 'middle':
          state.pageTableHeight = 451
          state.modelTableHeight = window.innerHeight < 690 ? 361 : 441
          break
        case 'small':
          state.pageTableHeight = 385
          state.modelTableHeight = 300
          break
        default:
          state.pageTableHeight = 655
          state.modelTableHeight = 478
          break
      }
    },
    SET_BASICDATA_PARAM (state, payload) {
      state.baiscDataQueryParam = payload
    }
  }
}

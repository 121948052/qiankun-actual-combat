// import { MicroApps } from '@/assets/js/router'

import { save } from '@/storage/index'

// const catchComponent = Object.create(null)
// MicroApps.forEach(app => {
//   catchComponent[app] = []
// })
// 自动导入其他 router 文件
const context = require.context('../../router', true, /.js$/)

export default {
  // namespaced: true,
  state: {
    tabsList: [],
    menus: [],
    currentTabs: '',
    currentMenu: '1',
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
      store.tabsList = payload
      save('tabsList', JSON.stringify(payload))
    },
    PUSH_TAB_LIST (store, payload) {
      if (store.tabsList.length > 20) store.tabsList.splice(0, 1)
      store.tabsList = [...store.tabsList, payload]
      save('tabsList', JSON.stringify(store.tabsList))
    },
    SET_CURRENT_TAB (store, payload) {
      store.currentTabs = payload
      save('currentTab', JSON.stringify(payload))
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
    },
    GET_ASYNC_ROUTES (state, payload) {
      let menuList = []
      context.keys().forEach(k => {
        if (k === './asyncMenus.js') {
          menuList = [...menuList, ...context(k).default]
        }
      })
      state.menus = menuList
      save('menus', menuList)
    }
  }
}

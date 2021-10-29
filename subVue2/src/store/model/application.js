import * as Api from '../../http/application'

export default {
  state: {},
  getters: {},
  actions: {
    getTenantInstanceInfo ({ commit }, payload) {
      return Api.getTenantInstanceInfo(payload)
    },
    getTenantInstanceList ({ commit }, payload) {
      return Api.getTenantInstanceList(payload)
    },
    getPageListByInstance ({ commit }, payload) {
      return Api.getPageListByInstance(payload)
    },
    getTenantInstancePageList ({ commit }, payload) {
      return Api.getTenantInstancePageList(payload)
    },
    getServiceShapeByInstance ({ commit }, payload) {
      return Api.getServiceShapeByInstance(payload)
    },
    getTenantAccountInfo ({ commit }, payload) {
      return Api.getTenantAccountInfo(payload)
    },
    getTenantInstanceByAccount ({ commit }, payload) {
      return Api.getTenantInstanceByAccount(payload)
    },
    getTenantAccountPageList ({ commit }, payload) {
      return Api.getTenantAccountPageList(payload)
    },
    getAccountLogList ({ commit }, payload) {
      return Api.getAccountLogList(payload)
    },
    bindToInstance ({ commit }, payload) {
      return Api.bindToInstance(payload)
    },
    deleteByInstance ({ commit }, payload) {
      return Api.deleteByInstance(payload)
    },
    getAccountNotExistInstance ({ commit }, payload) {
      return Api.getAccountNotExistInstance(payload)
    },
    pageListByInstance ({ commit }, payload) {
      return Api.pageListByInstance(payload)
    },
    platformListAll ({ commit }, payload) {
      return Api.platformListAll(payload)
    }
  }
}

import * as Api from '../../http/businessGroup'

export default {
  state: {},
  getters: {},
  actions: {
    deleteBuyer ({ commit }, payload) {
      return Api.deleteBuyer(payload)
    },
    getBuyerList ({ commit }, payload) {
      return Api.getBuyerList(payload)
    },
    getBuyerInfo ({ commit }, payload) {
      return Api.getBuyerInfo(payload)
    },
    saveBuyerInfo ({ commit }, payload) {
      return Api.saveBuyerInfo(payload)
    },
    updateBuyerInfo ({ commit }, payload) {
      return Api.updateBuyerInfo(payload)
    }
  }
}

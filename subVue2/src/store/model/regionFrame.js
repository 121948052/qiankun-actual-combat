import * as Api from '../../http/regionFrame'

export default {
  state: {},
  getters: {},
  actions: {
    getRegionInfo ({ commit }, payload) {
      return Api.getRegionInfo(payload)
    },
    saveRegion ({ commit }, payload) {
      return Api.saveRegion(payload)
    },
    getRegionTree ({ commit }, payload) {
      return Api.getRegionTree(payload)
    },
    updateRegion ({ commit }, payload) {
      return Api.updateRegion(payload)
    }
  }
}

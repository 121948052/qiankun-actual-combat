import * as Api from '../../http/dict'

export default {
  state: {},
  getters: {},
  actions: {
    getPersonalDictList ({ commit }, payload) {
      return Api.getPersonalDictList(payload)
    },
    removePersonalDictById ({ commit }, payload) {
      return Api.removePersonalDictById(payload)
    },
    savePersonalDict ({ commit }, payload) {
      return Api.savePersonalDict(payload)
    },
    updatePersonalDict ({ commit }, payload) {
      return Api.updatePersonalDict(payload)
    },
    getPersonalDictDetail ({ commit }, payload) {
      return Api.getPersonalDictDetail(payload)
    }
  }
}

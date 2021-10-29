import * as Api from '../../http/seeker'

export default {
  state: {},
  getters: {},
  actions: {
    getSeekerList ({ commit }, payload) {
      return Api.getSeekerList(payload)
    },
    getSeekerDetail ({ commit }, payload) {
      return Api.getSeekerDetail(payload)
    }
  }
}

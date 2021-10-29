import * as Api from '../../http/orgFrame'

export default {
  state: {},
  getters: {},
  actions: {
    getFrameInfo ({ commit }, payload) {
      return Api.getFrameInfo(payload)
    },
    saveFrame ({ commit }, payload) {
      return Api.saveFrame(payload)
    },
    getFrameTree ({ commit }, payload) {
      return Api.getFrameTree(payload)
    },
    updateFrame ({ commit }, payload) {
      return Api.updateFrame(payload)
    }
  }
}

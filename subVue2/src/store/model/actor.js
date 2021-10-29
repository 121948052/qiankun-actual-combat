import * as Api from '../../http/actor'

export default {
  state: {},
  getters: {},
  actions: {
    deleteActor ({ commit }, payload) {
      return Api.deleteActor(payload)
    },
    getActorList ({ commit }, payload) {
      return Api.getActorList(payload)
    },
    getActorInfo ({ commit }, payload) {
      return Api.getActorInfo(payload)
    },
    saveActorInfo ({ commit }, payload) {
      return Api.saveActorInfo(payload)
    },
    updateActorInfo ({ commit }, payload) {
      return Api.updateActorInfo(payload)
    },
    appActorTreeList ({ commit }, payload) {
      return Api.appActorTreeList(payload)
    },
    raRelationDelete ({ commit }, payload) {
      return Api.raRelationDelete(payload)
    },
    roleAccountRaletionSave ({ commit }, payload) {
      return Api.roleAccountRaletionSave(payload)
    },
    raRelationList ({ commit }, payload) {
      return Api.raRelationList(payload)
    },
    updateRoleMenuRelation ({ commit }, payload) {
      return Api.updateRoleMenuRelation(payload)
    }
  }
}

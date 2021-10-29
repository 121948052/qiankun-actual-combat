
import * as Api from '@/http/standardActor'
export default {
  // namespaced: true,
  state: {},
  getters: {},
  actions: {
    getStandardActorList (ctx, payload) {
      return Api.getList(payload)
    },
    publishActor (ctx, payload) {
      return Api.publishActor(payload)
    },
    saveStandardActor (ctx, payload) {
      return Api.save(payload)
    },
    updateStandardActor (ctx, payload) {
      return Api.update(payload)
    },
    delStandardActor (ctx, payload) {
      return Api.removeById(payload)
    },
    getStandardActorDetail (ctx, payload) {
      return Api.getDetail(payload)
    },
    getPlatformOptions (ctx, payload) {
      return Api.getPlatformOptions(payload)
    },
    getServiceShape (ctx, payload) {
      return Api.getServiceShape(payload)
    },
    getVersionByServiceCode (ctx, payload) {
      return Api.getVersionByServiceCode(payload)
    },
    saveActorMenuRelation (ctx, payload) {
      return Api.saveActorMenuRelation(payload)
    },
    getActorMenu (ctx, payload) {
      return Api.getActorMenu(payload)
    },
    getRoleGroupDict (ctx, payload) {
      return Api.getRoleGroupDict(payload)
    },
    getRoleTypeDict (ctx, payload) {
      return Api.getRoleTypeDict(payload)
    }
  },
  mutations: {
  }
}

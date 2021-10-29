
import * as Api from '@/http/standardPost'
export default {
  // namespaced: true,
  state: {},
  getters: {},
  actions: {
    getStandardPostList (ctx, payload) {
      return Api.getList(payload)
    },
    saveStandardPost (ctx, payload) {
      return Api.save(payload)
    },
    updateStandardPost (ctx, payload) {
      return Api.update(payload)
    },
    updateInstanceName (ctx, payload) {
      return Api.updateInstanceName(payload)
    },
    delStandardPost (ctx, payload) {
      return Api.removeById(payload)
    },
    getStandardPostDetail (ctx, payload) {
      return Api.getDetail(payload)
    },
    getPostActors (ctx, payload) {
      return Api.getPostActors(payload)
    },
    savePostActor (ctx, payload) {
      return Api.savePostActor(payload)
    },
    getSelectedMenu (ctx, payload) {
      return Api.getSelectedMenu(payload)
    },
    removePostActor (ctx, payload) {
      return Api.removePostActor(payload)
    }
  },
  mutations: {
  }
}

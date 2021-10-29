
import * as Api from '@/http/personPost'
export default {
  // namespaced: true,
  state: {},
  getters: {},
  actions: {
    getTenantPostList (ctx, payload) {
      return Api.getList(payload)
    },
    saveTenantPost (ctx, payload) {
      return Api.save(payload)
    },
    updateTenantPost (ctx, payload) {
      return Api.update(payload)
    },
    getTenantPostInfo (ctx, payload) {
      return Api.getDetail(payload)
    },
    delTenantPost (ctx, payload) {
      return Api.removeById(payload)
    }
  },
  mutations: {
  }
}

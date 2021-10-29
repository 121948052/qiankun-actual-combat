
import * as Api from '@/http/costCenterManage'
export default {
  // namespaced: true,
  state: {},
  getters: {},
  actions: {
    getCostCenterList (ctx, payload) {
      return Api.getList(payload)
    },
    saveCostCenter (ctx, payload) {
      return Api.save(payload)
    },
    updateCostCenter (ctx, payload) {
      return Api.update(payload)
    },
    getCostCenterInfo (ctx, payload) {
      return Api.getDetail(payload)
    },
    delCostCenter (ctx, payload) {
      return Api.removeById(payload)
    }
  },
  mutations: {
  }
}

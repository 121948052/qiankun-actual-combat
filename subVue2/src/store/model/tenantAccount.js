import * as Api from '../../http/tenantAccount'

export default {
  state: {
    hasEditPermission: false
  },
  getters: {},
  actions: {
    getTenantAccountList ({ commit }, payload) {
      return Api.getTenantAccountList(payload)
    },
    getTenantAccountListByInstance ({ commit }, payload) {
      return Api.getTenantAccountListByInstance(payload)
    },
    deleteTenantAccount ({ commit }, payload) {
      return Api.deleteTenantAccount(payload)
    },
    findAllByAccountId ({ commit }, payload) {
      return Api.findAllByAccountId(payload)
    },
    getTenantAccount ({ commit }, payload) {
      return Api.getTenantAccount(payload)
    },
    saveTenantAccount ({ commit }, payload) {
      return Api.saveTenantAccount(payload)
    },
    bindAccountToTenant ({ commit }, payload) {
      return Api.bindAccountToTenant(payload)
    },
    getLogList ({ commit }, payload) {
      return Api.getLogList(payload)
    },
    verifyPhoneOrAccount ({ commit }, payload) {
      return Api.verifyPhoneOrAccount(payload)
    },
    getSystemDict ({ commit }, payload) {
      return Api.getSystemDict(payload)
    },
    updateTenantInstanceStatus ({ commit }, payload) {
      return Api.updateTenantInstanceStatus(payload)
    },
    putUnlockAccount ({ commit }, payload) {
      return Api.putUnlockAccount(payload)
    },
    resetAccountPassword ({ commit }, payload) {
      return Api.resetAccountPassword(payload)
    },
    updatePhoneAndEmail ({ commit }, payload) {
      return Api.updatePhoneAndEmail(payload)
    },
    setEditPermission ({ commit }, edit) {
      commit('SET_EDIT_PERMISSION', edit)
    }
  },
  mutations: {
    SET_EDIT_PERMISSION (state, edit) {
      state.hasEditPermission = edit
    }
  }
}

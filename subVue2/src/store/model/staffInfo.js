import { read } from '@/storage'
import * as Api from '../../http/staffInfo'

export default {
  state: {
    structsTreeKey: 'structsTree'
  },
  getters: {
    getStructsTreeKey: (state) => {
      let obj = read('userInfor')
      let info
      try {
        if (typeof JSON.parse(obj) === 'object') {
          info = JSON.parse(obj)
        } else {
          info = null
        }
      } catch (e) { console.log(e) }
      return info ? `${state.structsTreeKey}_${info.tenantCode}` : false
    }
  },
  actions: {
    defaultAccountInfo ({ commit }, payload) {
      return Api.defaultAccountInfo(payload)
    },
    staffInfo ({ commit }, payload) {
      return Api.staffInfo(payload)
    },
    getStaffList ({ commit }, payload) {
      return Api.getStaffList(payload)
    },
    registerAccount ({ commit }, payload) {
      return Api.registerAccount(payload)
    },
    saveStaff ({ commit }, payload) {
      return Api.saveStaff(payload)
    },
    updateStaff ({ commit }, payload) {
      return Api.updateStaff(payload)
    },
    accountFindByPhone ({ commit }, payload) {
      return Api.accountFindByPhone(payload)
    },
    staffDictList ({ commit }, payload) {
      return Api.staffDictList(payload)
    },
    structList ({ commit }, payload) {
      return Api.structList(payload)
    },
    costCenterList ({ commit }, payload) {
      return Api.costCenterList(payload)
    }
  }
}

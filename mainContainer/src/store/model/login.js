import * as loginApi from '@/http/login'
import { save, read } from '@/storage/index'
import store from '@/store'
import Antd from 'ant-design-vue'
const { Notice } = Antd

export default {
  state: {
    isShowNotice: false,
    lastDay: 0
  },
  getters: {
  },
  actions: {
    userlogin ({ commit, dispatch }, param) {
      return new Promise((resolve, reject) => {
        loginApi
          .loginInfor(param).then(res => {
            save('token', `Bearer ${res.data.access_token}`)
            save('userInfor', JSON.stringify(res.data))
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    getPhoneMessages ({ commit, dispatch }, param) {
      return loginApi.getPhoneMessage(param)
    },
    forgetPassWordM ({ commit, dispatch }, param) {
      return loginApi.forgetPassWord(param)
    },
    loginOuts ({ commit }) {
      return new Promise((resolve, reject) => {
        loginApi.logoutFun()
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            console.error('logoutFun', err)
            reject(err)
          })
      })
    },
    changPasswd ({ commit, dispatch }, param) {
      return loginApi.changPasswd(param)
    },
    getResourceByToken ({ commit, dispatch }, param) {
      return new Promise((resolve, reject) => {
        loginApi.getResourceByToken()
          .then(res => {
            save('btnPremissions', JSON.stringify(res.data))
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    getUserInfoByToken ({ commit, dispatch }, param) {
      return new Promise((resolve, reject) => {
        loginApi.getUserInfoByToken().then(res => {
          // 解析不出当前数据
          let userInfo = read('userInfor')
          userInfo = JSON.parse(userInfo)
          console.log(res, userInfo)
          // 所有key 全部复制进去
          for (let key in userInfo) {
            if (res.data[key] && res.data[key].length > 0) {
              userInfo[key] = res.data[key]
            }
          }
          for (let key in res.data) {
            userInfo[key] = res.data[key]
          }
          userInfo.username = userInfo['employeeName']
          if (userInfo.busDept) {
            userInfo.busDept = JSON.parse(userInfo.busDept)
          } else {
            userInfo.busDept = null
          }
          if (userInfo.busOrg) {
            userInfo.busOrg = JSON.parse(userInfo.busOrg)
          } else {
            userInfo.busOrg = null
          }
          if (userInfo.role) {
            userInfo.role = JSON.parse(userInfo.role)
          } else {
            userInfo.role = null
          }
          if (userInfo.mainBody) {
            userInfo.mainBody = JSON.parse(userInfo.mainBody)
          }
          save('userInfor', JSON.stringify(userInfo))
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getAllElements () {
      return new Promise((resolve, reject) => {
        Promise.all([
          store.dispatch('getUserMenu'),
          store.dispatch('getUserInfo'),
          store.dispatch('getResourceByToken'),
          store.dispatch('getUserInfoByToken')
        ]).then((res) => {
          // 这条代码为了兼容oa 项目 system id 和 填充session userInfo数据
          save('innerSystemList', JSON.stringify([{ 'id': '10000', 'name': 'GAIA', 'urlPrefix': '/gaia', 'domain': '' }]))
          // 兼容header 数据
          let userInfor = JSON.parse(read('userInfor'))
          let tenantInfor = JSON.parse(read('tenantInfor'))
          userInfor.header = tenantInfor.header
          save('userInfor', JSON.stringify(userInfor))
          const tablist = [{ label: '工作台', name: '/work/home', path: '/work/home', closed: false }]
          store.commit('SET_TAB_LIST', tablist)
          save('tabList', JSON.stringify(tablist))
          resolve(res)
        }).catch(err => {
          reject(err)
          console.log(err)
        })
      })
    },
    getAccountLoginTimes ({ commit, dispatch }, param) {
      return loginApi.getAccountLoginTimes(param)
    },
    createCodeByToken ({ commit, dispatch }, param) {
      return loginApi.createCodeByToken(param)
    },
    getAccountNoticeInfo ({ commit, dispatch }, param) {
      return loginApi.getAccountNoticeInfo(param)
    },
    setNoticeStatus ({ commit, dispatch }, param) {
      store.commit('SET_NOTICE_STATUS', param)
    },
    getUserLoginInfo () {
      setTimeout(() => {
        store.dispatch('getAccountNoticeInfo')
          .then(res => {
            const { loginInfo, passwordInfo } = res.data
            const { loginTime, loginIp } = loginInfo
            const { day } = passwordInfo
            store.commit('SET_NOTICE_STATUS', day)
            if (loginTime || loginIp) {
              Notice.config({
                top: (window && window.document ? window.document.body.clientHeight : 700) - 100
              })
              Notice.open({
                title: '上次登录信息',
                desc: `您上次登录时间为:<span class="login-info">${loginTime}</span>
                        <br />登录IP:<span class="login-info">${loginIp}</span>`,
                duration: 5
              })
            }
          })
          .catch(err => {
            console.log(err)
          })
      }, 1000)
    }
  },
  mutations: {
    SET_NOTICE_STATUS (store, payload) {
      store.isShowNotice = typeof (payload) === 'number'
      store.lastDay = payload
    }
  }
}

'use strict'

import Vue from 'vue'
import axios from 'axios'
import antd from 'ant-design-vue'
import { read, clear } from '@/storage/index'
import store from '../store'
import assetsUrl from './../../.config.http.js'

const { Message } = antd

/**
 * 根据环境变量区分各个环境地址
 * 1. url为axios所需请求地址
 * 2. 其余请求地址，请放在vuex中
 */

store.commit('SET_URL', assetsUrl)
let config = {
  timeout: 10 * 60 * 1000
}

const _axios = axios.create(config)

_axios.interceptors.request.use(
  function (config) {
    const token = read('token')
    const userInfor = read('userInfor')
    config.headers['device-type'] = 'pc'
    config.headers['x-client-language'] = window.localStorage.lang
    if (token) {
      config.headers.Authorization = token
    }
    if (userInfor) {
      config.headers['tenant-code'] = JSON.parse(userInfor).tenantCode
      config.headers['instance-code'] = `${JSON.parse(userInfor).tenantCode}_tenant_pc` // 实例编码
    }
    if (config.method === 'get') {
      config.data = true
    }
    return config
  },
  function (error) {
    Message({ type: 'error', message: '请求超时！' })
    return Promise.reject(error)
  }
)

// Add a response interceptor
_axios.interceptors.response.use(
  function (response) {
    if (response.data.status !== 200 && response.data.status) {
      Message({ type: 'error', message: response.data.message })
      return Promise.reject(response)
    } else if (response.config.headers.responseType === 'blob') {
      return response
    } else {
      return response.data
    }
  },
  function (error) {
    if (!error.response) {
      Message({
        type: 'error',
        message: '网络异常，请检查您的网络连接是否正常！'
      })
      window.func.changeRouter('replace', '/502')
    } else if (error.response.status === 401) {
      if (read('token')) window.func.changeRouter('replace', '/403')
      Message({
        type: 'error',
        message: '当前用户没有访问该页面资源的权限！'
      })
    } else if (error.response.status === 404) {
      Message({
        type: 'error',
        message: error
      })
    } else if (error.response.status === 403) {
      Message({
        type: 'error',
        message: error.response.data.message
      })
      clear('', true)
      window.location.href = assetsUrl.tenantUrl
    } else {
      Message({
        type: 'error',
        message: '系统错误'
      })
    }
    return Promise.reject(error)
  }
)

Plugin.install = function (Vue, options) {
  Vue.axios = _axios
}

Vue.use(Plugin)

export default Plugin

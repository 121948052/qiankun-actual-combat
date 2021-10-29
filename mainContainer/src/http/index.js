'use strict'

import Vue from 'vue'
import axios from 'axios'
import Antd from 'ant-design-vue'
import router from '../router'
import { read, clear } from '@/storage/index'

const { Message } = Antd

/**
 * 根据环境变量区分各个环境地址
 * 1. url为axios所需请求地址
 * 2. 其余请求地址，请放在vuex中
 */

const time = 3000
let date = new Date().getTime()
let axiosCancel = []
let timer = null
let msgFlag = { router: '', isError: true }

let config = {
  timeout: 10 * 60 * 1000
}

const _axios = axios.create(config)

_axios.interceptors.request.use(
  function (config) {
    const token = read('token')
    config.headers['device-type'] = 'pc'
    config.headers['x-client-language'] = 'zh_cn'
    if (token) {
      config.headers.Authorization = token
    }
    if (config.method === 'get') {
      config.data = true
    }
    config.cancelTag = ++date
    config.cancelToken = new axios.CancelToken(cancel => {
      axiosCancel.push({ cancel, cancelTag: date })
    })
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
    axiosCancel = axiosCancel.filter(a => a.cancelTag === response.config.cancelTag)
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
    if (error.message !== '频繁切换，中断请求') {
      axiosCancel = axiosCancel.filter(a => a.cancelTag === error.config.cancelTag)
    }

    if (msgFlag.router === '' || msgFlag.router !== router.history.current.fullPath) {
      msgFlag.isError = true
    }

    if (!msgFlag.isError) {
      return Promise.reject(error)
    }

    clearTimeout(timer)
    msgFlag.isError = false
    msgFlag.router = router.history.current.fullPath
    timer = setTimeout(() => {
      msgFlag.isError = true
    }, time)
    if (error.message === '频繁切换，中断请求') {
      return Promise.reject(error)
    }
    if (!error.response) {
      Message({
        type: 'error',
        message: '网络异常，请检查您的网络连接是否正常！'
      })
      router.replace('/502')
    } else if (error.response.status === 401) {
      if (read('token') && window.location.pathname !== '/login') router.replace('/401')
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
      if (window.location.pathname !== '/login') router.replace('/login')
    } else {
      Message({
        type: 'error',
        message: '系统错误'
      })
    }
    return Promise.reject(error)
  }
)

function canelRequest (arr = axiosCancel) {
  if (arr.length > 0) {
    arr.forEach(r => {
      r.cancel('频繁切换，中断请求')
    })
    arr = []
  }
}

Plugin.install = function (Vue, options) {
  Vue.prototype.$axiosCancel = canelRequest
  Vue.axios = _axios
}

Vue.use(Plugin)

export default Plugin

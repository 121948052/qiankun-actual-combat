import Vue from 'vue'
import { read } from '../storage'

export const get = param => {
  return new Promise((resolve, reject) => {
    Vue.axios
      .get(param.url, {
        params: param.query || {},
        headers: param.headers || {}
      })
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}

export const post = (param, config = {}) => {
  return new Promise((resolve, reject) => {
    Vue.axios
      .post(param.url, param.body, config)
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}

export const put = (param, config = {}) => {
  return new Promise((resolve, reject) => {
    Vue.axios
      .put(param.url, param.body, config)
      .then(res => {
        resolve(res)
      })
      .catch(err => reject(err))
  })
}

export const remove = (param, config = {}) => {
  return new Promise((resolve, reject) => {
    Vue.axios
      .delete(param.url, {
        data: param.body
      }, config)
      .then(res => {
        resolve(res)
      })
      .catch(err => reject(err))
  })
}

export function downloadByGet (param) {
  return new Promise((resolve, reject) => {
    Vue.axios
      .get(param.url, {
        params: param.query || {},
        headers: param.headers || {},
        responseType: 'blob'
      })
      .then(res => {
        const temp = decodeURI(
          res.headers['content-disposition'].split('filename=')[1]
        )
        let fileName =
          param.query.fileName || temp.substring(1, temp.length - 1)
        if (read('browser') === 'IE') {
          window.navigator.msSaveOrOpenBlob(res.data, fileName)
        } else {
          const linkEle = document.createElement('a')
          let url = window.URL.createObjectURL(res.data)
          linkEle.setAttribute('href', url)
          linkEle.setAttribute('download', fileName)
          linkEle.click()
        }
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}

export function downloadImage (param) {
  return new Promise((resolve, reject) => {
    Vue.axios
      .get(param.url, {
        params: param.query || {},
        headers: param.headers || {},
        responseType: 'blob'
      })
      .then(res => {
        resolve(window.URL.createObjectURL(res.data))
      })
      .catch(err => {
        reject(err)
      })
  })
}

export function downloadByPost (param) {
  return new Promise((resolve, reject) => {
    Vue.axios({
      method: 'post',
      url: param.url,
      data: param.body,
      responseType: 'blob'
    })
      .then(res => {
        let fileName = param.body.contractNum + '.pdf'
        if (read('browser') === 'IE') {
          window.navigator.msSaveOrOpenBlob(res, fileName)
        } else {
          const linkEle = document.createElement('a')
          let url = window.URL.createObjectURL(res)
          linkEle.setAttribute('href', url)
          linkEle.setAttribute('download', fileName)
          linkEle.click()
        }
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}

export function downloadFilesByZip (param) {
  return new Promise((resolve, reject) => {
    Vue.axios({
      method: 'post',
      url: param.url,
      data: param.body,
      responseType: 'blob'
    })
      .then(res => {
        let fileName = param.body.zipFilename + '.zip'
        if (read('browser') === 'IE') {
          window.navigator.msSaveOrOpenBlob(res, fileName)
        } else {
          const linkEle = document.createElement('a')
          let url = window.URL.createObjectURL(res)
          linkEle.setAttribute('href', url)
          linkEle.setAttribute('download', fileName)
          linkEle.click()
        }
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}

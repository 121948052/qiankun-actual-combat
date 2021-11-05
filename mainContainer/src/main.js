
import '@/http'

// 渲染Vue
import '@/assets/js/renderVue'

// qiankun
import { MicroApps } from '@/assets/js/router'
import { registerMicroApps, runAfterFirstMounted, start, initGlobalState } from 'qiankun'
import Vue from 'vue'

const globalActions = initGlobalState({ isLogout: false })
Vue.prototype.$globalActions = globalActions

// 注册子应用
registerMicroApps(
  MicroApps,
  {
    beforeLoad: [
      app => {
        // console.log('before load', app)
      }
    ],
    beforeMount: [
      app => {
        // console.log('before mount', app)
      }
    ],
    afterUnmount: [
      app => {
        // console.log('after unload', app)
      }
    ]
  },
  {
    // fetch: function (url) {
    //   console.log('registerMicroApps', url)
    //   return new Promise((resolve, reject) => {
    //   })
    // }
  }
)
// setDefaultMountApp('/subVue/page1')
// 第一个子应用加载完毕回调
runAfterFirstMounted(() => {
  // console.log(app)
})

// 全局异常捕获
// addGlobalUncaughtErrorHandler((err) => {
//   console.log('app mount err', err)
// })

// 启动微服务

start({
  prefetch: false,
  // singular: false,
  sandbox: {
    strictStyleIsolation: true,
    experimentalStyleIsolation: true
  },
  fetch (url) {
    return window.fetch(url, {
      cache: 'no-cache'
    })
  }
  // getTemplate: function (html) {
  //   // eslint-disable-next-line no-undef
  //   console.log(embedHTMLCache)
  //   return html
  // }
})


import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'

import antd from 'ant-design-vue'
import 'ant-design-vue/lib/date-picker/style/css'

// 最后引入公共样式
import '@/assets/css/base.less'
Vue.use(antd)
Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#base-wrap')

import axios from 'axios'

let serviceUrl = ''
let tenantUrl = ''

switch (process.env.NODE_ENV) {
  case 'development':
    serviceUrl = 'http://deviamgateway.shuhaisc.io/'
    tenantUrl = 'http://devhaina.shuhaisc.io'
    break
  case 'test':
    serviceUrl = 'https://testiamgateway.shuhaisc.com/'
    tenantUrl = 'https://testbc.shuhaisc.com'
    break
  case 'uat':
    serviceUrl = 'https://uatiamgateway.shuhaisc.com/'
    tenantUrl = 'https://uatbc.shuhaisc.com'
    break
  case 'production':
    serviceUrl = 'https://iamgateway.shuhaisc.com/'
    tenantUrl = 'https://bc.shuhaisc.com'
    break
}

axios.defaults.baseURL = serviceUrl

export default {
  serviceUrl,
  tenantUrl
}
import LostConnection from '../components/status/502.vue'
import NoPrivileges from '../components/status/401.vue'

export default [
  {
    path: '/502',
    name: '502',
    component: LostConnection
  },
  {
    path: '/403',
    name: '403',
    component: NoPrivileges
  }
]

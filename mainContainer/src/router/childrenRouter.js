import HomePage from '@/views/MainHome.vue'
import LostConnection from '../components/status/502.vue'
import NoPrivileges from '../components/status/401.vue'

export default [
  {
    path: '/main/home',
    name: 'mainHome',
    component: HomePage
  },
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

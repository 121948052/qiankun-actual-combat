import commonStore from '@/assets/js/commonStore'

export const projectArr = ['/purchaseServer/']

export function getActiveRule (routerPrefix) {
  return (location) => {
    return location.pathname.startsWith(routerPrefix) && projectArr.some(router => routerPrefix === router)
  }
}

const hostArr = {
  development: [
    {
      'shsc-tenant-op-web': '//localhost:9000'
    }
  ]
}

export function getUrl (name) {
  let host = []
  switch (process.env.NODE_ENV) {
    case 'development':
      host = hostArr['development']
      break
    case 'production':
      host = hostArr['production']
      break
    case 'test':
      host = hostArr['test']
      break
    case 'uat':
      host = hostArr['uat']
      break
  }
  for (let i = 0; i < host.length; i++) {
    if (host[i][name]) {
      return host[i][name]
    }
  }
  return null
}

export function isSubRouter () {
  return projectArr.some(r => window.location.pathname.startsWith(r))
  // return !window.location.pathname.startsWith('/home')
}

export const MicroApps = [
  {
    name: 'shsc-tenant-op-web',
    entry: getUrl('shsc-tenant-op-web'),
    container: '#root-view',
    activeRule: getActiveRule('/tenant/'),
    props: commonStore,
    loader: function (loading) {
      // console.log(loading)
    }
  }
]

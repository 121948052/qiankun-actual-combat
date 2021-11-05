import commonStore from '@/assets/js/commonStore'

export const projectArr = ['/subVue/']

export function getActiveRule (routerPrefix) {
  return (location) => {
    return location.pathname.startsWith(routerPrefix) && projectArr.some(router => routerPrefix === router)
  }
}

const hostArr = {
  development: [
    {
      'sub-vue': '//localhost:8082'
    }
  ]
}

export function getUrl (name) {
  let host = []
  switch (process.env.NODE_ENV) {
    case 'development':
      host = hostArr['development']
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
    name: 'sub-vue',
    entry: getUrl('sub-vue'),
    container: '#root-view',
    activeRule: getActiveRule('/subVue/'),
    props: commonStore,
    loader: function (loading) {
      // console.log(loading)
    }
  }
]

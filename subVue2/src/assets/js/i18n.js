import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

function loadContainNotRootJs (key) {
  // 判断当前连接是否
  let arr = key.split('/')
  if (arr && arr.length === 2) {
    return true
  }
  return false
}

function isNumber (obj) {
  return typeof obj === 'number' && isFinite(obj)
}

function createObject (path, value) {
  let keyPath = []
  if (Array.isArray(path)) keyPath = [...path]
  if (keyPath.length) {
    const key = keyPath.shift()
    if (isNumber(key)) {
      const object = new Array(key + 1)
      object[key] = createObject(keyPath, value)
      return object
    } else return { [key]: createObject(keyPath, value) }
  } else return value
}

function createCopyObject (distObj, toDistObj) {
  // {page:{c:''}} {page: {a:''}} => {page： {a:'',c:''}}
  for (let prop in toDistObj) {
    if (toDistObj.hasOwnProperty(prop)) {
      if (!distObj.hasOwnProperty(prop)) {
        distObj[prop] = toDistObj[prop]
      } else {
        createCopyObject(distObj[prop], toDistObj[prop])
      }
    }
  }
}

function loadLocaleMessages () {
  const locales = require.context('@/locale', true, /[A-Za-z0-9-_,\s]+\.js$/i)
  const uiLocales = require.context('shsc-ui/lib/locale/lang', true, /[A-Za-z0-9-_,\s]+\.js$/i)
  const buzuiLocales = require.context('shsc-business-ui/lib/locale/lang', true, /[A-Za-z0-9-_,\s]+\.js$/i)
  // 获取当前local 目录下根文件
  const messages = {}
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const name = matched[1]
      // en: Object.assign(enLocal, en),
      // 因为export default打包后会导出一个default对象
      let locale = locales(key).default
      if (!messages.hasOwnProperty(name)) {
        messages[name] = Object.assign({}, uiLocales(`./${name}.js`).default)
        messages[name] = Object.assign(messages[name], buzuiLocales(`./${name}.js`).default)
      }
      if (loadContainNotRootJs(key) && uiLocales(key)) {
        // 根目录下配置的国际化文件并读取ui国际化文件
        locale = Object.assign({}, locales(key).default, messages[name])
        messages[name] = locale
      } else if (!loadContainNotRootJs(key)) {
        let keyPath = []
        let arr = key.split('/')
        arr.forEach(item => {
          if (item.indexOf('.') === -1) {
            keyPath.push(item)
          }
        })
        let dict = createObject(keyPath, locales(key).default)
        createCopyObject(messages[name], dict)
      }
    }
  })
  console.log('国际化', messages)
  return messages
}

export default new VueI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || 'en_us',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en_us',
  messages: loadLocaleMessages()
})

const { dependencies } = require('./package')

function getNpmVersion (name, modules = dependencies) {
  return modules[name].replace(/[^~x]/, '')
}

let hostname = ''
switch (process.env.NODE_ENV) {
  case 'production':
    hostname = 'cdnqiniu'
    break
  case 'test':
    hostname = 'testcdnqiniu'
    break
  case 'uat':
    hostname = 'uatcdnqiniu'
    break
  default:
    hostname = 'testcdnqiniu'
    break
}

const privateAssets = {
  css: [],
  js: [
    `https://${hostname}.shuhaisc.com/shsc-ui/${getNpmVersion('shsc-ui')}/index.umd.min.js`,
    `https://${hostname}.shuhaisc.com/shsc-business-ui/${getNpmVersion('shsc-business-ui')}/index.umd.min.js`
  ]
}
module.exports = privateAssets

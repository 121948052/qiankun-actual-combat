const { name } = require('./package')
const isProduction = process.env.NODE_ENV !== 'development'

module.exports = {
  chainWebpack: config => {
    config.plugins.delete('prefetch')
    config.plugins.delete('preload')

    if (isProduction) {
      config.output
        .set('filename', 'static/js/[name].[contenthash:8].js')
        .set('chunkFilename', 'static/js/[name].[contenthash:8].js')
      config.optimization.minimize(true)
      config.optimization.splitChunks({
        chunks: 'all'
      })
    }
  },
  // 自定义webpack配置
  configureWebpack: {
    output: {
      library: `${name}-[name]`,
      libraryTarget: 'umd', // 把子应用打包成 umd 库格式
      jsonpFunction: `webpackJsonp_${name}`
    }
  },
  devServer: {
    open: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
}

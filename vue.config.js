module.exports = {
    chainWebpack: config => {
        // 生产模式
        config.when(process.env.NODE_ENV === 'production',config => {
            config.entry('app').clear().add('./src/main-prod.js')
        })

        // 开发模式
        config.when(process.env.NODE_ENV === 'development',config => {
            config.entry('app').clear().add('./src/main-dev.js')
        })
    },
    publicPath:'./',
    outputDir:'docs',
    devServer: {
        proxy: {
          '/api': {
            target: 'http://127.0.0.1:8888/api/private/v1/',
            ws: true,
            changeOrigin: true
          }
        }
      }
}
module.exports = {
  publicPath: '/', // 部署应用包时的基本 URL
  lintOnSave: false, // 去除ESlint警告
  devServer: {  // 配置代理
    proxy: {
      '/api': {
        target: 'http://47.107.167.164:8080', // 目标API地址
        ws: true, // 如果要代理websockets
        changeOrigin: true, // 将主机表头的原点改为目标URL
        pathRewrite: { // 重写路径
          '^/api': ''
        }
      }
    }
  }
}
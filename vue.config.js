module.exports = {
  devServer: {
    port: 8080,
    // 设置代理
    proxy: {
      '/api/': {
        target: 'http://127.0.0.1:7001/', // 域名
        ws: true, // 是否启用websockets
        changOrigin: true, // 开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
        pathRequiresRewrite: {
        // "^/v1": "/"
        }
      },
      '/public/': {
        target: 'http://127.0.0.1:7001/', // 域名
        ws: true, // 是否启用websockets
        changOrigin: true, // 开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
        pathRequiresRewrite: {
        // "^/v1": "/"
        }
      }
    }
  },
  chainWebpack: (config) => {
    const rule = config.module.rule('markdown').test(/\.md$/)
    rule.use('html-loader').loader('html-loader')
    rule.use('markdown-loader').loader('markdown-loader')
    rule.end()
  }
}

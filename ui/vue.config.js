module.exports = {
  publicPath: './',
  devServer: {
    // https: true,
    disableHostCheck: true,
    proxy: {
      '/edgerApi': {
        target: 'https://192.168.128.1:7381',
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/edgerApi': '',
        },
      },
      '/socket.io': {
        target: 'https://192.168.128.1:7381',
        ws: true,
        changeOrigin: true,
      },
      "/eos/websynctable": {
        target: "https://192.168.128.1:7381",
        ws: true,
        changeOrigin: true
      }
    },
  },
};

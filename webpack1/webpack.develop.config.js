const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const DashboardPlugin = require('webpack-dashboard/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const { merge} = require('webpack-merge')
const baseconfig = require('./webpack.base.config')
module.exports = merge(baseconfig, {
  entry: [
    // 开启热更新客户端
    // 'webpack-hot-middleware/client',
    './src/index.js'
  ],
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    port:9100,
    hot: true
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css' // 异步加载的资源名
    }),
    new HtmlWebpackPlugin({
      template: './template.html'
    }),
    new webpack.HotModuleReplacementPlugin()
    // new DashboardPlugin() 对编译信息进行
  ]
})
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { VueLoaderPlugin } = require('vue-loader')
module.exports = {
  entry: {
    index: './src/index.js'
  },
  mode: 'development',
  output: {
    filename: '[name].[contenthash:8].js',
    chunkFilename: '[name].[chunkhash:8].js'
  },
  module: {
    rules: [
      { test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', 
          options: {
            cacheDirectory: true,
            cacheCompression: false
          }
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
      },
    ]
  },
  devServer: {
    port: 3000,
    hot: true,
    historyApiFallback: true
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.runtime.esm.js'
    },
    extensions: ['.js', '.vue']
  }, 
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css',
      chunkFilename: '[name].[chunkhash:8].chunk.css' // 异步加载的资源名
    }),
    new HtmlWebpackPlugin({
      template: './template.html',
      filename: 'index.html',
      chunks: ['index']
    })
  ]
}
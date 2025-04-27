const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
module.exports = {
  entry: './src/index.js',
  output: {
    filename: '[name].[contenthash].js',
    publicPath: '/'
  },
  mode: 'development',
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  module: {
    // noParse 不去解析 但仍然会打包
    rules: [{
      test: /\.css$/,
      // use: ['style-loader','css-loader'],
      use: [
        { loader: MiniCssExtractPlugin.loader, options: { publicPath: '/'}},
        'css-loader',
        'postcss-loader'
      ],
      exclude: /node_modules/,
      // issuer: { // 加载者 resource 被加载者
      //   test: /\.js$/
      // }
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      use:[{
        loader: 'thread-loader', // webpack5  内置多线程支持 webpack <= 4 使用 happyPack
        options: {
          woker: 2
        }
      },{
        loader: 'babel-loader', 
        options: {
          cacheDirectory: true,
          presets: [[
             "@babel/preset-env", {
              modules: false // 禁止babel的模块依赖解析 避免接收到转化过的commonjs 模块 无法treeShaking
             }
          ]]
        }
      }, {
        loader: path.resolve(__dirname, './builder/force-strict-loader.js'),
        options: {
          sourceMap: true
        },
        // {
        // loader: 'happypack/loader?id=js'
        //}
      }] 
    }, {
      test: /\.less$/,
      use: [
         { loader: MiniCssExtractPlugin.loader, options: { publicPath: '/'}},
        'css-loader',
        'postcss-loader',
        'less-loader'
      ]
    }]
  },
}
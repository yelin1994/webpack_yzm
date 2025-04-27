const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin') // 统计各模块编译耗时
const happyPack = require('happypack')
const { merge } = require('webpack-merge')
const baseconfig = require('./webpack.base.config')

const smp = new SpeedMeasurePlugin()

// const Analyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const config = merge(baseconfig, {
  // entry: './src/index.js',
  // output: {
  //   filename: '[name].[contenthash].js',
  //   publicPath: '/'
  // },
  // cache: true, 缓存
  // cache: {
  //   type: 'filesystem',

  // }
  mode: 'production',
  optimization: {
    splitChunks: {
      chunks: 'all'
    },
    minimizer: [
      `...`, // webapck5 已存在的配置
      new CssMinimizerPlugin() // webpack4 用的是  optimize-css-assets-webpack-plugin
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      ENV: JSON.stringify('production')
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css' // 异步加载的资源名
    }),
    new HtmlWebpackPlugin({
      template: './template.html'
    }),
    // new happyPack({
    //   //id : js 多个模块时候
    //   loaders:[
    //     {
    //       loader: 'babel-loader',
    //       options: {

    //       }
    //     }
    //   ]
    // })
    // new Analyzer() // 包大小分析
  ]
})

module.exports = smp.wrap(config)
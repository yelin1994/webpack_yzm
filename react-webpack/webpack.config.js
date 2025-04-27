const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const isProduction = process.env.NODE_ENV === 'Production'
module.exports = {
  entry: {
    index: './src/index.jsx',
    detail: './src/detail.jsx'
  },
  output: {
    filename: '[name].[contenthash:8].js',
    chunkFilename: '[name].[chunkhash:8].js'
  },
  mode: 'development',
  devServer: {
    port: 3000,
    hot: true
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  resolve: {
    extensions: ['.js', '.jsx', '.less']
  },
  devtool: 'source-map',
  module: {
    rules: [
      { test: /\.(js|jsx)?$/,
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
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
      },
      {
        test: /\.(png|jpg|svg)$/,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css',
      chunkFilename: '[name].[chunkhash:8].chunk.css' // 异步加载的资源名
    }),
    new HtmlWebpackPlugin({
      template: './template.html',
      filename: 'index.html',
      chunks: ['index']
    }),
    new HtmlWebpackPlugin({
      template: './template.html',
      filename: 'detail.html',
      chunks: ['detail']
    })
  ]
}
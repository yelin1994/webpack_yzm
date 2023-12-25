const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
// const glob = require('glob');

// const setMPA = () => {
//     const entry = {};
//     const htmlWebpackPlugins = [];
//     const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js' ))
//     Object.keys(entryFiles)
//         .map((index) => {
//           const entryFile = entryFiles[index];
//           const pageName = entryFile.match(/src\/(.*)\/index\.js/)[1];
//           entry [pageName] = entryFile;
//           htmlWebpackPlugins.push();
//         })
//     return {
//         entry,
//         htmlWebpackPlugins
//     }
// }

module.exports = {
  // entry: './src/index.js',
  /*
     watch: true,
     watchOptions: {
         ignored: /node_modules/, // 默认为空， 不监听的文件或者文件夹
         aggregateTimeout: 300, // 监听到变化发生后等300ms 再去执行
         poll: 1000 // 每秒问1000 次 ，指定文件是否发生变化
     }
     */
  entry: {
    app: './src/index/index.js',
    search: './src/search/index.js',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name]_[chunkhash:8].js',
    publicPath: './',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        use: [
          'babel-loader',
        ],
      },
      {
        test: /\.css$/,
        use: [
          // 'style-loader',
          miniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /\.scss$/,
        use: [
          // 'style-loader',
          miniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'autoprefixer',
                    {
                      browsers: ['last 2 version', '>1%', 'ios 7'],
                    },
                  ],
                ],
              },
            },
          },
        ],
        //     {
        //         loader: 'px2rem-loader',
        //         options: {
        //             remUnit: 75, // 一个rem 对应几个px
        //             remPrecision: 8
        //         }
        //     }
        // ]
      },
      {
        test: /\.(png|svg|jpeg|gif|jpg)$/,
        // loader: 'file-loader'
        use: [
          {
            loader: 'file-loader', // url-loader
            options: {
              // limit: 10240
              name: 'img/[name][hash:8].[ext]',

            },
          },
        ],
      },
    ],
  },
  mode: 'production',
  plugins: [
    // new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name]_[contenthash].css',
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.(css|scss)$/g,
      cssProcessor: require('cssnano'),
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/index/index.html'),
      filename: 'index.html',
      chunks: ['app', 'commons'],
      inject: true,
      minify: {
        html5: true,
        collapseWhitespace: true,
        preserveLineBreaks: false,
        minifyCSS: true,
        minifyJS: true,
        removeComments: true,
      },
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/search/index.html'),
      filename: 'search.html',
      chunks: ['search'],
      inject: true,
      minify: {
        html5: true,
        collapseWhitespace: true,
        preserveLineBreaks: false,
        minifyCSS: true,
        minifyJS: true,
        removeComments: true,
      },
    }),
    new CleanWebpackPlugin(),
    new FriendlyErrorsWebpackPlugin(),
    function () {
      this.hooks.done.tap('done', (stats) => { // compiler done 事件. this 指向的是compiler
        if (stats.compilation.error && stats.compilation.errors.length && process.argv.indexOf('--watch') == -1) {
          console.log('build error');
          process.exit(1);
        }
      });
    },
    // new HtmlWebpackExternalsPlugin({
    //     externals: [
    //         {
    //             module: 'react',
    //             entry: 'https://now8.gtimg.com/now/lib/16.2.0/react.min.js',
    //             global: 'React'
    //         },
    //         {
    //             module: 'react-dom',
    //             entry: 'https://now8.gtimg.com/now/lib/16.2.0/react-dom.min.js',
    //             global: 'ReactDOM'
    //         }
    //     ]

    // })

  ],
  // devServer: {
  //     contentBase: './dist',
  //     hot: true
  // },
  // devtool: "inline-source-map",// eval source-map inline-source-map
  optimization: {
    splitChunks: {
      // chunks: 'all',// async 同步引入的库进行分离  initial 同步引入的库进行分离， all  所有引入的库进行分离
      /**
             * chunks(chunk) {
             *     return chunk.name !== 'my-excluded-name'
             * }
             */
      minSize: 0,
      // maxSize: 0,
      // minChunks: 1, // 被引用的次数
      // maxAsyncRequests: 5,
      automaticNameDelimiter: '~',
      // maxInitialREquest: 3,
      cacheGroups: {
        // vendors: {
        //     test: /[\\/]node_modules[\\/]/,
        //     priority: -10
        // },
        commons: {
          test: /(react|react-dom)/,
          chunks: 'all',
          name: 'commons',
        },
        // hello: {
        //     chunks: 'all',
        //     minChunks: 2,
        //     name: 'hello',
        //     priority: -10,
        // }
      },
    },
  },
};

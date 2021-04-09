const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
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
        filename: '[name][chunkhash:8].js',
    },
    resolve: {
        extensions: ['.tsx', 'ts', '.js', '.jsx', '.ts']
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    'babel-loader',
                    // 'eslint-loader'
                ]
            },
            {
                test: /\.tsx?$/,
                use: [
                    'ts-loader'
                ]
            },
            {
                test: /\.jsx$/,
                use: [
                    'babel-loader',
                    // 'eslint-loader'
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ]
            },
            {
                test: /\.(png|svg|jpeg|gif|jpg)$/,
                // loader: 'file-loader'
                use: [
                    {
                        loader: 'file-loader', // url-loader
                        options: {
                            // limit: 10240
                            name: 'img/[name][hash:8].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new CleanWebpackPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new FriendlyErrorsWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src/index/index.html'),
            filename: 'index.html',
            chunks: ['app'],
            inject: true,
            minify: {
                html5: true,
                collapseWhitespace: true,
                preserveLineBreaks: false,
                minifyCSS: true,
                minifyJS: true,
                removeComments: true,
            }
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
            }
        }),
    ],
    devServer: {
        contentBase: './dist',
        hot: true
    },
    devtool: 'source-map'

    // Source map 
}
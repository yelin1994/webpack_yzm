const path = require('path');
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin =  require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
module.exports = {
    entry: {
        app: './src/index/index-server.js',
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name]-server.js',
        libraryTarget: 'umd',
        publicPath: '/'
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts']
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    'babel-loader'
                ]
            },
            {
                test: /\.jsx$/,
                use: [
                    'babel-loader'
                ]
            },
            {
                test: /\.css$/,
                use: [
                    // 'style-loader',
                    miniCssExtractPlugin.loader,
                    'css-loader'
                ]
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
                                           browsers: ['last 2 version', '>1%', 'ios 7']
                                       }
                                   ]
                                ]
                            } 
                        }
                    },
                    {
                        loader: 'px2rem-loader', 
                        options: {
                            remUnit: 75, // 一个rem 对应几个px
                            remPrecision: 8
                        }
                    }
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
                            name: 'img/[name].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    mode: "production",
    plugins: [
        // new webpack.HotModuleReplacementPlugin(),
        new miniCssExtractPlugin({
            filename: '[name]_[contenthash].css'
        }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.(css|scss)$/g,
            cssProcessor: require('cssnano')
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
            }
        }),
        new CleanWebpackPlugin(),

    ],
    devServer: {
        contentBase: './dist',
        hot: true
    },
}
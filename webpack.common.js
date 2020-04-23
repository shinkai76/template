const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// link方式引入样式文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: {
        index: './src/js/index.js',
        login: './src/js/login.js'
    },
    plugins: [
        // 自动清空dist目录
        new CleanWebpackPlugin(),
        // 设置html模板生成路径
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/html/index.html',
            chunks: ['style', 'index'] // 当前实例仅引入chunk名为index的模块
        }),
        new HtmlWebpackPlugin({
            filename: 'login.html',
            template: './src/html/login.html',
            chunks: ['style', 'login']
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css'
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: [
                            '@babel/plugin-transform-runtime',
                            // @babel/plugin-transform-modules-commonjs将ES2015模块转换为CommonJS
                            '@babel/plugin-transform-modules-commonjs'
                        ]
                    }
                }
            },
            {
                test: /\.css$/,
                // MiniCssExtractPlugin.loader替换style-loader
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // css中的图片路径增加前缀
                            publicPath: '../'
                        }
                    }
                    , 'css-loader', 'less-loader']
            },
            // 把css中的图片提取并打包
            {
                test: /\.(png|svg|jpg|gif|webp)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            // 图片输出的实际路径(相对于dist)
                            outputPath: 'images',
                            // 当小于某KB时转为base64
                            limit: 0
                        }
                    }
                ]
            },
            // 把html中的图片提取并打包
            {
                test: /\.(html)$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        attrs: ['img:src', 'img:data-src', 'audio:src'],
                        minimize: true
                    }
                }
            },
            // 字体文件
            {
                test: /\.(woff|woff2|eot|ttf|svg)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        // 保留原文件名和后缀名
                        name: '[name].[ext]',
                        // 输出到dist/fonts/目录
                        outputPath: 'fonts'
                    }
                }
            }
        ]
    },
    optimization: {
        // 单独打包
        splitChunks: {
            cacheGroups: {
                styles: {
                    // src/css/common/下的css单独打包并引用
                    test: /[\\/]common[\\/].\.css$/,
                    name: 'styles',
                    chunks: 'all',
                    enforce: true
                }
            }
        }
    },
    output: {
        // js生成到dist/js，[name]表示保留原js文件名
        filename: 'js/[name].js',
        // 输出路径为dist
        path: path.resolve(__dirname, 'dist')
    }
};

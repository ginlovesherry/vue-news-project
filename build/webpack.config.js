const path = require('path')
const webpack = require('webpack')
const htmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HappyPack = require('happypack')
const os = require('os')
const happyThreadPool = HappyPack.ThreadPool({size: os.cpus().length})
// 读取同一目录下的 base config
const config = require('./webpack.base.config');

config.output = {
    path: path.resolve(__dirname, '..', './dist'),//指定打包输出的目录
    publicPath: './',
    filename:'js/[name]-[hash:8].js'
};

config.module.rules.push(
    {
        test: /\.css$/,//匹配的文件类型
        use: ExtractTextPlugin.extract({
            fallback: "vue-style-loader",
            use: 'happypack/loader?id=happycss'
        })
    },
    {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
            // other vue-loader options go here
            loaders: {
                css: ExtractTextPlugin.extract({
                    fallback: 'vue-style-loader',
                    use: 'happypack/loader?id=happycss'
                })
            }
        }
    },
    {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
            name: '[path][name].[ext]?[hash:8]',
            limit: 8192,
            outputPath: 'img/', //outputPath表示输出文件路径前缀
            publicPath: 'http://localhost/dist/img/' // publicPath表示打包文件中引用文件的路径前缀
        }
    }
);

config.plugins.push(
    new htmlWebpackPlugin({
        filename: path.resolve(__dirname, '..', './dist/index.html'),//输出文件名
        template: path.resolve(__dirname, '..', 'index.html'),//以当前目录下的index.html文件为模板生成dist/index.html文件
        hash: false,
        minify: {
            //删除注释
            removeComments: false,
            //删除空格
            collapseWhitespace: false
        }
    }),
    new HappyPack({
        id: 'happycss',
        loaders: ['css-loader?importLoaders=1', 'postcss-loader'], //打包
        threadPool: happyThreadPool,
        cache: true,
        verbose: true
    }),
    new webpack.DefinePlugin({
            'process.env': {//为wepack增加一个全局变量 NODE_ENV,它的值为'development'/'production',设置为production的话webpack在打包时会删除开发框架中的警告、注释等在生产环境下用不到的代码
                NODE_ENV: '"production"'
            }
        }),
    new webpack.optimize.UglifyJsPlugin({
        sourceMap: false,
        cache: true,
        parallel: true,
        // 最紧凑的输出
        beautify: false,
        // 删除所有的注释
        comments: false,
        compress: {
            warnings: false,
            // 删除所有的 `console` 语句
            // 还可以兼容ie浏览器
            drop_console: true,
            // 内嵌定义了但是只用到一次的变量
            collapse_vars: true,
            // 提取出出现多次但是没有定义成变量去引用的静态值
            reduce_vars: true,
        }
    }),
    new webpack.LoaderOptionsPlugin({
        minimize: true
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),//作用域提升
    new webpack.optimize.CommonsChunkPlugin({
        // names: ['vendor', 'manifest'] //把变动的部分分离出来 让vendor缓存
        names: ['vendor'],
        // minChunks: Infinity
        minChunks: 2
    }),
    new ExtractTextPlugin({
        filename: 'css/[name]-[hash:8].css', //路径以及命名
    }),
    new CopyWebpackPlugin([{
        from: path.resolve(__dirname, '..', './static/js'),
        to: path.resolve(__dirname, '..', './dist/static/js')
    }])
);
module.exports = config;
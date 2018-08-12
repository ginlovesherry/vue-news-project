const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HappyPack = require('happypack')
const os = require('os')
const happyThreadPool = HappyPack.ThreadPool({size: os.cpus().length})
// 配置常量
// 源代码的根目录（本地物理文件路径）
const SRC_PATH = path.resolve('./src');
// 打包后的资源根目录（本地物理文件路径）
const ASSETS_DIST_PATH = path.resolve('./dist');
//alias中用到的函数
function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

module.exports = {//暴露一个对象出去，webpack去读
    context: SRC_PATH, // 设置源代码的默认根路径
    entry: {
        main: "./main.js"
    },
    //配置loader来处理文件
    module: {
        noParse: /node_modules\/(element-ui\.js)/,
        rules: [
            {
                test: require.resolve('jquery'),
                use: [{
                    loader: 'expose-loader',
                    options: 'jQuery'
                },{
                    loader: 'expose-loader',
                    options: '$'
                }]
            },
            {
                test: /\.js[x]?$/,
                loader: 'happypack/loader?id=happybabel',
                exclude: /node_modules/
            },
            {
                test: /\.exec\.js$/,
                use: ['script-loader']
            }
        ]
    },
    plugins: [
        new HappyPack({
            id: 'happybabel',
            loaders: ['babel-loader?cacheDirectory'],
            threadPool: happyThreadPool,
            cache: true,
            verbose: true
        }),
        new CleanWebpackPlugin(['./dist'], {
            root: path.resolve(__dirname, '..')
        }),
        new webpack.DllReferencePlugin({
            context: path.resolve(__dirname, '..'),
            manifest: require('../static/mainfest.json')
        }),
        new webpack.ProvidePlugin({
            '$': 'jquery',
            'jQuery': 'jquery',
            'window.jQuery': 'jquery',
            'window.$': 'jquery'
        }),
    ],
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src'),
            '@assets': resolve('src/assets'),
            '@constants': resolve('src/constants'),
            '@partials': resolve('src/partials'),
            '@views': resolve('src/views'),
            '@pages': resolve('src/views/pages'),
            '@components': resolve('src/components'),
            '@router': resolve('src/router'),
            '@store': resolve('src/store'),
            '@helper': resolve('src/helper'),
            '@services': resolve('src/services'),
            '@mixins': resolve('src/mixins'),
        },
        extensions: ['*', '.js', '.vue', '.json']
    },
    performance: {
        hints: false
    }
}
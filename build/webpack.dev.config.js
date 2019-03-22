const path = require('path')
const webpack = require('webpack')
const HappyPack = require('happypack')
const os = require('os')
const happyThreadPool = HappyPack.ThreadPool({size: os.cpus().length})
// 读取同一目录下的 base config
const config = require('./webpack.base.config');

// 添加 webpack-dev-server 相关的配置项
config.output = {
    path: path.resolve(__dirname, './dist'),//指定打包输出的目录
    publicPath: '/dist/',// 指定静态资源的位置
    filename: 'build.js'// 打包输出的文件名
};
config.devServer = {
    historyApiFallback: true,
    noInfo: true,
    overlay: true
};
config.devtool = '#eval-source-map';
config.module.rules.push(
    {
        test: /\.css$/,//匹配的文件类型
        use: 'happypack/loader?id=happycss'
    },
    {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
            // other vue-loader options go here
            loaders: {}
        }
    },
    {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
            name: '[path][name].[ext]?[hash:8]',
            limit: 8192,
            outputPath: 'img/', //outputPath表示输出文件路径前缀
        }
    }
);
config.plugins.push(
    new HappyPack({
        id: 'happycss',
        loaders: ['vue-style-loader', 'css-loader?importLoaders=1&minimize', 'postcss-loader'], //非打包
        threadPool: happyThreadPool,
        // cache: true,
        verbose: true
    })
);
module.exports = config;
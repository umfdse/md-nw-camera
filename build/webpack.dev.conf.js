var webpack = require('webpack');
var {merge} = require('webpack-merge');
var baseWebpackConfig = require('./webpack.base.conf');
var path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const chalk = require('chalk');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
var WebpackBuildNotifierPlugin = require('webpack-build-notifier');
const Jarvis = require("webpack-jarvis");


// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
});

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}


var tmpJson = require(resolve('./package.json'));
const projectName = tmpJson.appName;

const webpackDevConfig = merge(baseWebpackConfig, {
  //开发模式下使用 cheap-module-eval-source-map, 生成的 source map 能和源码每行对应，方便打断点调试
  devtool: 'cheap-module-eval-source-map',
  module: {
    rules: [
      // {
      //   test: /\.(js|vue)$/,
      //   use: [{
      //     loader: 'eslint-loader',
      //     options: { // 这里的配置项参数将会被传递到 eslint 的 CLIEngine
      //       formatter: require('eslint-friendly-formatter') // 指定错误报告的格式规范
      //     }
      //   }],
      //   enforce: "pre", // 编译前检查
      //   exclude: /node_modules/, // 不检测的文件
      //   include: [resolve(__dirname, 'src')], // 指定检查的目录
      // },
      {
        test: /\.css$/,
        use: ['vue-style-loader','style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new Jarvis({
      port: 1337 // optional: set a port
    }),

    new ProgressBarPlugin({
      format: '  build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)',
      clear: false
    }),

    new WebpackBuildNotifierPlugin({
      title: projectName+" Project Webpack Build",
      suppressSuccess: true,
      showDuration: true
    }),

    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // 浏览器展示：打包后模块依赖大小，需要的时侯启用
    // new BundleAnalyzerPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html',
      inject: 'body',
      minify: {
        removeComments: true
      }
    }),
  ]
});

module.exports = webpackDevConfig;

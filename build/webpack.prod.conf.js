var path = require('path');
var utils = require('./utils');
var config = require('../config');
var {merge} = require('webpack-merge');
var baseWebpackConfig = require('./webpack.base.conf');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

var webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules:[
      {
        test:/\.css$/,
        use:[
          {loader:MiniCssExtractPlugin.loader},
          'css-loader'
        ]
      }
    ]
  },
  //生产模式下使用 hidden-source-map, 生成独立的 source map 文件，并且不在 js 文件中插入 source map 路径，用于在 error report 工具中查看 （比如 Sentry)
  devtool: 'hidden-source-map',
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: utils.assetsPath('css/[hash].css')
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
      inject: 'body',
      minify: {
        removeComments: true
      }
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
});

module.exports = webpackConfig;

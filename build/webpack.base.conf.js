var path = require('path');
var utils = require('./utils');
var config = require('../config');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}


module.exports = {
  entry: {
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
  },
  optimization: {
    runtimeChunk: true,
    splitChunks: {
      chunks: 'all',
      name: true,
      cacheGroups: {
        libs: {
          name: "chunk-libs",
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: "initial" // 只打包初始时依赖的第三方
        },
        elementUI: {
          name: "chunk-elementUI", // 单独将 elementUI 拆包
          priority: 20, // 权重要大于 libs 和 app 不然会被打包进 libs 或者 app
          test: /[\\/]node_modules[\\/]md-element-ui[\\/]/
        },
        commons: {
          name: "chunk-commons",
          test: resolve("src/components"), // 可自定义拓展你的规则
          minChunks: 2, // 最小共用次数
          priority: 5,
          reuseExistingChunk: true
        }
      }
    }
  },
  mode: process.env.NODE_ENV,
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        // loader: ['cache-loader','babel-loader'],
        use: [
          {
            loader: 'cache-loader',
            options: {
              cacheDirectory: path.resolve('.cache')
            }
          },
          'babel-loader'
        ],
        include: [resolve('src')],
        exclude: file => (
          /node_modules/.test(file) &&
          !/\.vue\.js/.test(file)
        )
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.sass$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(mp3)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          name: utils.assetsPath('assets/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  target: 'node-webkit',
  plugins: [
    new VueLoaderPlugin(),

    new OptimizeCssAssetsPlugin({
      cssProcessor: require('cssnano'), //引入cssnano配置压缩选项
      cssProcessorOptions: {
        discardComments: { removeAll: true }
      },
      canPrint: true //是否将插件信息打印到控制台
    })

  ]
};

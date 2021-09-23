// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

function resolve () {
  return path.resolve.apply(path, [__dirname, '..'].concat(...arguments))
}

// 解析`./package.json`获取版本号用于更新功能
var tmpJson = require(resolve('./package.json'));
//重新设置mainfestUrl值
tmpJson.manifestUrl=tmpJson.name+"/"+tmpJson.version+"/upgrade.json";

var curReleasesPath = resolve('./releases', tmpJson.version);

var moment = require('moment');
var currentTimeStr = moment().format("yyyyMMDD_HHmmss");
//http://vuejs-templates.github.io/webpack/static.html
module.exports = {
  build: {
    env: require('./prod.env'),
    index: resolve('./dist/index.html'),
    assetsRoot: resolve('./dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: false,
    //当前版本
    packageVersion:tmpJson.version,
    projectName:tmpJson.name,
    // only build nw
    onlyNW: process.env.npm_config_onlyNW,
    // only build nw
    noSetup: process.env.npm_config_noSetup,
    nw: {
      // manifest for nw
      // the fileds will merge with `./package.json` and build to `./dist/package.json` for NW.js
      // Manifest Format: http://docs.nwjs.io/en/latest/References/Manifest%20Format/
      manifest: ['name', 'appName', 'version', 'versionNote','description', 'author', {main: './index.html'},
        'manifestUrl', 'netUrl', 'window', 'nodejs', 'js-flags', 'node-remote'],

      // 配置参数: https://github.com/nwjs/nw-builder
      builder: {
        files: [resolve('./dist/**')],
        // platforms: ['osx64', 'linux32', 'linux64'],
        platforms: ['win32', 'win64'],
        // 0.14.7兼容xp, 0.37.3最新无vue内存泄漏问题
        version: '0.37.3',
        //控制打包形式，sdk模式带控制台，normal不带控制台
        flavor: 'sdk',
        //打包缓存，第一次打包下载，后续不用下载加快速度
        cacheDir: resolve('./.cache_nw/'),
        buildDir: resolve('./releases'),
        winIco: resolve('./build/setup_resources/logo.ico'),
        buildType: function () {
          return this.appVersion
        },
        //设为false,则业务代码不会合并，推荐合并
        zip: true,
        // 添加软件版权相关信息
        // https://docs.microsoft.com/zh-cn/windows/win32/menurc/versioninfo-resource?redirectedfrom=MSDN#string-name
        winVersionString: {
          'CompanyName': '武汉明德生物科技股份有限公司',
          'FileDescription': tmpJson.appName,
          'FileVersion': tmpJson.version,
          'ProductName': tmpJson.appName,
          'ProductVersion': tmpJson.version,
          'OriginalFilename':tmpJson.name,
          'LegalCopyright': 'Copyright © 2017-2020 武汉明德生物'
        }
      },
      setup: {
        issPath: resolve('./config/setup.iss'),
        // only one version path
        files: curReleasesPath,
        resourcesPath: resolve('./build/setup_resources'),
        appPublisher: 'md-nw-camera, Inc.',
        appURL: 'http://172.16.15.115:9081',
        appId: '{{4828f4a0-5945-4fe0-caa0-8362de647bb2}}',
        outputFileName: function (data) {
          return data.name + '-' + data.version+ '_' + currentTimeStr;
        }
      },
      //升级信息地址
      upgrade: {
        outputFile: resolve('./releases/'+tmpJson.version+'/upgrade.json'),
        // 生成的upgrade.json中设置获取安装包的地址
        // publicPath: '/staticPDF/node/nw/',
        publicPath: '/',
        files: [curReleasesPath]
      }
    }
  },
  dev: {
    env: require('./dev.env'),
    port: require('./dev.env').port,
    jarvisOpen: require('./dev.env').jarvisOpen,
    jarvisPort: require('./dev.env').jarvisPort,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/api': {
        // 测试环境
        target: 'http://localhost:8082/',  // 接口域名
        changeOrigin: true,  //是否跨域
        pathRewrite: {
          '^/api': '/api'   //需要rewrite重写的
        }
      },
      '/node': {
        // 测试环境
        target: 'http://localhost:8082/',  // 接口域名
        changeOrigin: true,  //是否跨域
        pathRewrite: {
          '^/node': '/node'   //需要rewrite重写的
        }
      },
      '/stroke/report/pdfView/': {
        // 测试环境
        target: 'http://localhost:8082/',  // 接口域名
        changeOrigin: true,  //是否跨域
        pathRewrite: {
          '^/stroke/report/pdfView/': '/stroke/report/pdfView/'   //需要rewrite重写的
        }
      }
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false,
    upgrade: {
      publicPath: '/releases',
      directory: 'releases'
    }
  }
}

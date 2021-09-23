require('./check-versions')();

var config = require('../config');
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV);
}
var path = require('path');
var express = require('express');
var webpack = require('webpack');
var {createProxyMiddleware} = require('http-proxy-middleware');
var webpackConfig = require('./webpack.dev.conf');

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port;
console.log('port:' + port);

var jarvisPort = config.dev.jarvisPort;
var jarvisOpen = config.dev.jarvisOpen;

// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser;
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable;

var app = express();
var compiler = webpack(webpackConfig);

// https://segmentfault.com/a/1190000011761306
// webpack会自动给我们编译文件，我们刷新浏览器就可以看到，编译后的文件。
// 编编译的文件是放在内存中的，我们的实际文件中并不会看到
var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  //向控制台显示任何内容
  quiet: true
});

// https://segmentfault.com/a/1190000011761345
// 保存之后，文件被编译好，浏览器自动刷新
var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: (t) => {
    console.log("重新加载:"+t);
  }
  // log: console.log
});

//加入会导致每次变动全局刷新页面
// force page reload when html-webpack-plugin template changes
// compiler.hooks.compilation.tap('html-webpack-plugin-after-emit', () => {
//   hotMiddleware.publish({
//     action: 'reload'
//   });
// });

compiler.hooks.done.tap('done', (stats) => {
  console.log(stats.toString({ chunks: false, colors: true }))
});


// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context];
  if (typeof options === 'string') {
    options = {target: options};
  }
  app.use(createProxyMiddleware(options.filter || context, options));
});

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')());

// serve webpack bundle output
app.use(devMiddleware);

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware);

// 配置静态路径映射
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory);
app.use(staticPath, express.static('./static'));

// for upgrade server
var upgrade = config.dev.upgrade;
if (upgrade && upgrade.publicPath && upgrade.directory) {
  app.use(upgrade.publicPath, [function (req, res, next) {
    console.log(req.url, JSON.stringify(req.headers));
    next();
  }, express.static(upgrade.directory)]);
}

var uri = 'http://localhost:' + port;

devMiddleware.waitUntilValid(function () {
  console.log('> Listening at ' + uri + '\n');


  // openDefaultBrowser('http://localhost:1337/');
});

function openDefaultBrowser(url) {
  var exec = require('child_process').exec;
  // console.log(process.platform);
  switch (process.platform) {
    case "darwin":
      exec('open ' + url);
      break;
    case "win32":
      exec('start ' + url);
      break;
    default:
      exec('xdg-open', [url]);
  }
}


module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err);
    return;
  }
  if(jarvisOpen){
    openDefaultBrowser('http://localhost:'+jarvisPort+"/");
  }

  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    require('./dev-nw')(uri);
  }
});

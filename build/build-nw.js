var exec = require('child_process').exec;
var path = require('path');
var fs = require('fs');
var util = require('util');
var zlib = require("zlib");
var fstream = require("fstream");
var tar = require("tar");


var buildWinSetup = require('./build-win-setup.js');
var buildUpgrade = require('./build-upgrade');

var rootPath = path.resolve(__dirname, '../');

// get config
var config = require(path.resolve(rootPath, 'config'));

// `./package.json`
var tmpJson = require(path.resolve(rootPath, './package.json'));
//重新设置mainfestUrl值
tmpJson.manifestUrl=tmpJson.name+"/"+tmpJson.version+"/upgrade.json";
var manifestPath = path.resolve(config.build.assetsRoot, './package.json');

// manifest for `./dist/package.json`
var manifest = {};
config.build.nw.manifest.forEach(function(v, i) {
  if (util.isString(v)) manifest[v] = tmpJson[v];
  else if (util.isObject(v)) manifest = util._extend(manifest, v)
});

fs.writeFile(manifestPath, JSON.stringify(manifest, null, '  '), 'utf-8', function(err) {
  if (err) throw err;

  // start build app
  if (!config.build.nw.builder) return;
  // https://github.com/nwjs-community/nw-builder
  var NwBuilder = require('md-nw-builder');
  var nw = new NwBuilder(config.build.nw.builder);
  nw.on('log', function (msg) {
    console.log('nw-builder >>> ', msg);
  });
  nw.build().then(function () {
    console.log('----------build nw done!----------');
    console.log('----------开始构建安装包----------');

    // build windows setup
    if (config.build.noSetup) return;
    if (~config.build.nw.builder.platforms.toString().indexOf('win')) {
      //windows平台
      console.log("开始生成window exe安装包");
      buildWinSetup().then(() => buildUpgrade(manifest));
    } else {
      var setupFilePath = config.build.nw.setup.files;
      let sourcePath = path.join(setupFilePath, "linux64");
      let filePath = path.join(setupFilePath, tmpJson.name+"_linux64.tar.gz");
      console.log("sourcePath:" + sourcePath);
      console.log("filePath:" + filePath);
      fstream.Reader({
        'path': sourcePath,
        'type': 'Directory'
      }).pipe(tar.Pack())
        .pipe(zlib.Gzip())
        .pipe(fstream.Writer({
          'path': filePath,
        }));
      // buildUpgrade(manifest)
      console.log('----------完成构建安装包----------');
    }
  }).catch(function (error) {
    console.error(error);
  });

});

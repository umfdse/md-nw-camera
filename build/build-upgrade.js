var path = require('path');
var fs = require('fs');
var moment = require('moment');

var rootPath = path.resolve(__dirname, '../');

// get config
var config = require(path.resolve(rootPath, 'config'));
var buildCnf = config.build;
var setupCnf = config.build.nw.setup;
var updCnf = config.build.nw.upgrade;

// var platforms = ['win32', 'win64', 'osx32', 'osx64', 'linux32', 'linux64']
var platforms = {
  'win32-setup': {
    name: 'win32',
    ext: '.exe'
  },
  'win64-setup': {
    name: 'win64',
    ext: '.exe'
  },
  'osx32': {
    name: 'osx32',
    ext: '.app'
  },
  'osx64': {
    name: 'osx64',
    ext: '.app'
  },
  'linux32': {
    name: 'linux32',
    ext: '.gz'
  },
  'linux64': {
    name: 'linux64',
    ext: '.gz'
  }
};

// `./output/pc.json`
module.exports = makeUpgrade;

// makeUpgrade({ name: 'md-critical-illness-apsara', appName: '应用的中文别名', version: '0.1.0' })
function makeUpgrade(manifest) {
  var upgradeJson = Object.assign({}, manifest, {packages: {}});

  // due to files
  updCnf.files.forEach(function (curPath) {
    var files = fs.readdirSync(curPath);

    files.forEach(function (fileName) {
      var platform = platforms[fileName];
      if (!platform) return;

      var filePath = getFilePath(manifest, platform, fileName);
      var size = getFileSize(curPath, manifest, platform, fileName);
      upgradeJson.packages[platform.name] = {url: buildCnf.projectName + updCnf.publicPath + filePath, size: size}
    });
    makeJson(upgradeJson)
  })

  console.log('----------完成构建安装包----------');
}

function getFilePath(manifest, platform, fileName) {
  var file = getFile(manifest, platform, fileName);
  return manifest.version + '/' + file
}

function getFileSize(curPath, manifest, platform, fileName) {
  var file = getFile(manifest, platform, fileName);
  return fs.statSync(path.resolve(curPath, file)).size
}

function getFile(manifest, platform, fileName) {
  var name = manifest.name;
  if (typeof setupCnf.outputFileName === 'function') {
    name = setupCnf.outputFileName({name: manifest.name, version: manifest.version, platform})
  }
  return fileName + '/' + name + platform.ext
}

/**
 * 生成update.json文件
 * @param json
 */
function makeJson(json) {
  var upgradeAssetsRoot = path.parse(updCnf.outputFile).dir;
  if (!fs.existsSync(upgradeAssetsRoot)) fs.mkdirSync(upgradeAssetsRoot);
  var updateJson = {};
  updateJson.name = json.name;
  updateJson.appName = json.appName;
  updateJson.version = json.version;
  updateJson.versionNote = json.versionNote;
  updateJson.description = json.description;
  // updateJson.main = json.main;
  updateJson.manifestUrl = json.manifestUrl;
  // updateJson.netUrl = json.netUrl;
  updateJson.packages = json.packages;
  //当前生成时间
  updateJson.createTime = new moment().format('YYYY-MM-DD HH:mm:ss');

  // var updateJsonStr =JSON.stringify(updateJson, null, '  '); //美化输出
  var updateJsonStr = JSON.stringify(updateJson);

  fs.writeFile(updCnf.outputFile, updateJsonStr, 'utf-8', function (err) {
    if (err) console.log(err);
    console.log('\n', 'build upgrade.json in:\n', updCnf.outputFile, '\n')
  })
}

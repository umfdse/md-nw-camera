'use strict';

import { App } from 'nw.gui';
import fs from 'fs';
import path from 'path';
import http from 'http';
import * as SessionStorageServeice from '@/utils/SimpleSessionStorageService';
import * as localStorageService from '@/utils/SimpleLocalStorageService.js';

const events = require('events');

// 自动判断当前平台，选择合适的安装包
const platform = (/^win/.test(process.platform) ? 'win' : /^darwin/.test(process.platform) ? 'osx' : 'linux') + (process.arch === 'ia32' ? '32' : '64');
// 获取nw_pc_soft_version表中package_info字段
let remoteUpdateJson = null;

/**
 * 判断newV是否大于oldV
 *
 * @param newV
 * @param oldV
 */
function versionCompare(newV, oldV) {
  if (newV == null || oldV == null) {
    return false;
  }
  if (newV == oldV) {
    return false;
  }

  var newArray = newV.split('.');
  var oldArray = oldV.split('.');

  for (var i = 0; i < newArray.length; i++) {
    const newItem = +newArray[i];
    const oldItem = oldArray[i] != null ? +oldArray[i] : 0;
    if (newItem > oldItem) {
      return true;
    } else if (newItem < oldItem) {
      return false;
    }
  }
  return false;
}

/**
 * 通过接口获取版本信息
 *
 * @param noCache
 * @returns {Promise<unknown>|Promise<any>}
 */
export function getUpdateJson(noCache) {
  try {
    if (!noCache && remoteUpdateJson) {
      return Promise.resolve(remoteUpdateJson);
    }
    // 后台发送接口请求
    var options = {
      method: 'post',
      // pc端产品类型：com.md.nwpc.enums.NwPcTypeEnum
      body: JSON.stringify({ type: 1 }),
      headers: {}
    };
    const user = SessionStorageServeice.getSessionData('currentUser');
    if (user != null) {
      const infoData = JSON.parse(SessionStorageServeice.getSessionData('login:' + user));
      if (infoData != null && infoData.respData != null) {
        options.headers.token = infoData.respData.token;
        options.headers.LOGINTYPE = 4;
        options.headers['Content-Type'] = 'application/json';
      }
    }
    var versionUrl = global.url + '/api/nw/version/getVersionInfo';
    console.log('versionPostUrl:' + versionUrl);
    console.log('options:' + JSON.stringify(options));
    return window.fetch(versionUrl, options).then(resp => resp.json())
      .then(json => {
        if (json.msg == '201') {
          const respData = json.respData;
          remoteUpdateJson = JSON.parse(respData.packageInfo);
          // 医院配置可以连到静态资源的地址
          let prefixUrl = global.staticUrl;
          if (!prefixUrl.endsWith('/')) {
            prefixUrl = prefixUrl + '/';
          }
          if (!remoteUpdateJson.packages.win32.url.startsWith('http')) {
            // 针对非后台上传，直接ssh上传静态资源服务器的文件
            remoteUpdateJson.packages.win32.url = prefixUrl + remoteUpdateJson.packages.win32.url;
          }

          if (!remoteUpdateJson.packages.win64.url.startsWith('http')) {
            remoteUpdateJson.packages.win64.url = prefixUrl + remoteUpdateJson.packages.win64.url;
          }
          console.log('remoteUpdateJson:' + JSON.stringify(remoteUpdateJson));
          return remoteUpdateJson;
        } else {
          console.error('获取版本返回异常，msg:' + json.msg + ',content:' + json.content);
          return null;
        }
      }).catch(function (e) {
        console.error(e);
      });
  } catch (e) {
    console.error(e);
  }
}

export function parseName(json) {
  if (!json) return;
  const pkg = json.packages[platform];
  if (!pkg) return;
  return path.parse(pkg.url).base;
}

/**
 * 入口：检测版本
 * 版本比较逻辑
 */
export function checkUpdate() {
  try {
    if (global.staticUrl == null) {
      try {
        const netUrlStr = localStorageService.getData('netUrl');
        if (netUrlStr != null && netUrlStr != '') {
          const netUrl = JSON.parse(netUrlStr);
          if (netUrl.staticProduction != null && netUrl.staticProduction != '') {
            global.staticUrl = netUrl.staticProduction;
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    if (global.staticUrl == null) {
      console.warn('未配置升级地址');
      return;
    }

    getUpdateJson().then(json => {
      try {
        console.log(json);
        if (json.version == null) {
          console.log('-----------checkUpdate异常---------------');
          console.error(json);
          return;
        }
        if (json.version === App.manifest.version) {
          console.log('-----------checkUpdate:版本号一致，不用升级---------------');
          return;
        }
        console.log('升级版本，最新版本:' + json.version + ',本地版本:' + App.manifest.version);
        // 版本比较逻辑
        if (versionCompare(json.version, App.manifest.version)) {
          window.location.hash = '/update';
        } else {
          console.log('无最新包，最新版本:' + json.version + ',本地版本:' + App.manifest.version);
        }
      } catch (e) {
        console.error(e);
      }
    }).catch(function (e) {
      console.error(e);
    });
  } catch (e) {
    console.error(e);
  }
}

/**
 * 执行下载exe安装包逻辑，并发送进度事件
 *
 * @param savePath
 * @param json
 * @returns {EventEmitter|u}
 */
export function downloadHandle(savePath, json) {
  console.log('---downloadHandle---');
  const ev = new events.EventEmitter();
  var url = json.packages[platform].url;
  const totalSize = json.packages[platform].size;
  const loadFile = fs.createWriteStream(savePath);
  let loaded = 0;

  http.get(url, res => {
    if (res.statusCode < 200 || res.statusCode >= 300) {
      return ev.emit('error', res.statusCode);
    }
    res.on('end', () => {
      loadFile.end();
      loadFile.destroySoon();
      ev.emit('end', savePath);
    });

    res.on('error', err => {
      return ev.emit('error', err.message);
    });

    res.on('data', chunk => {
      loadFile.write(chunk);
      loaded += chunk.length;
      ev.emit('data', loaded / totalSize);
    });
  }).on('error', err => ev.emit('error', err.message));

  return ev;
}

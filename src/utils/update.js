'use strict';

import { App } from 'nw.gui';
import fs from 'fs';
import path from 'path';
import http from 'http';

const events = require('events');

const { manifest } = App;
const platform = (/^win/.test(process.platform) ? 'win' : /^darwin/.test(process.platform) ? 'osx' : 'linux') + (process.arch === 'ia32' ? '32' : '64');

const options = { method: 'GET', mode: 'cors', credentials: 'include' };
let tmpUpdateJson = null;

// get update.json
export function getUpdateJson (noCache) {
  try {
    if (!noCache && tmpUpdateJson) return Promise.resolve(tmpUpdateJson);
    var url = global.staticUrl;
    console.log('升级地址:' + url + manifest.manifestUrl);
    // if (url.indexOf('gateway') != -1) {
    //   url = 'http://static.whmhyl.cn';
    // }
    if (url == null) {
      console.log('未配置升级地址');
      return;
    }

    return window.fetch(url + manifest.manifestUrl + '?' + new Date().getTime(), options)
      .then(resp => resp.json())
      .then(json => {
        tmpUpdateJson = json;
        return tmpUpdateJson;
      }).catch(function (e) {
        console.error(e);
      });
  } catch (e) {
    console.error(e);
  }
}

export function parseName (json) {
  if (!json) return;
  const pkg = json.packages[platform];
  if (!pkg) return;
  return path.parse(pkg.url).base;
}

// check version
export function checkUpdate () {
  try {
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
        console.log('升级版本，最新版本:' + json.version + ',原版本:' + App.manifest.version);
        // debugger;
        window.location.hash = '/update';
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

export function downloadHandle (savePath, json) {
  const ev = new events.EventEmitter();

  var url = json.packages[platform].url;
  var headerUrl = global.staticUrl;
  // if (headerUrl.indexOf('gateway') != -1) {
  //   headerUrl = 'http://static.whmhyl.cn';
  // }
  url = headerUrl + url;

  const totalSize = json.packages[platform].size;
  const loadFile = fs.createWriteStream(savePath);
  let loaded = 0;

  http
    .get(url, res => {
      if (res.statusCode < 200 || res.statusCode >= 300) return ev.emit('error', res.statusCode);
      res.on('end', () => {
        loadFile.end();
        loadFile.destroySoon();
        ev.emit('end', savePath);
      });
      res.on('error', err => ev.emit('error', err.message));
      res.on('data', chunk => {
        loadFile.write(chunk);
        loaded += chunk.length;
        ev.emit('data', loaded / totalSize);
      });
    })
    .on('error', err => ev.emit('error', err.message));

  return ev;
}

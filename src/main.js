// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import AppVue from './App.vue';
// import router from './router';
import ElementUI, { Message, Loading } from 'md-element-ui';
import './assets/css/element-variables.scss'
// import 'md-element-ui/lib/theme-chalk/index.css';
// 引入公共样式和全局样式，单个页面分开写，避免样式冲突，尽量少用内联样式
// import './assets/font_md/iconfont.css'; //  引入明德UI设计的图标
// import './assets/css/base.css';
// import './assets/css/common.css';
// import './assets/css/reset.css';
import './components/tableComponent/install';
// https://github.com/yugasun/vue-axios-plugin
import VueAxiosPlugin from 'vue-axios-plugin';
import { Window, App } from 'nw.gui';
import * as SessionStorageServeice from '@/utils/SimpleSessionStorageService';
import * as localStorageService from '@/utils/SimpleLocalStorageService.js';
import Echarts from 'echarts';
Vue.prototype.echarts = Echarts;
// import Print from 'vue-print-nb'

// 　　Vue.use(Print);  //注册
import Print from '@/utils/print'
import "@/utils/date.js"
Vue.use(Print)
// Vue.use(Echarts);
Vue.directive('has', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: (el, binding, vnode) => {
    const value = binding.value;

    const auths = SessionStorageServeice.getSessionData('menuPerms') || '';
    const adminPerssion =  SessionStorageServeice.getSessionData('roleCodes').indexOf("ADMIN")>-1

    if (!auths.split(',').includes(value)&&!adminPerssion) {
      el.parentNode.removeChild(el);
    }
  }
});
Vue.config.devtools = process.env.NODE_ENV === 'development';
// import VConsole from 'vconsole';
// // eslint-disable-next-line no-new
// new VConsole();
// 过滤输入框特殊字符
Vue.prototype.validSe = function (value, number = 255) {
  value = value.replace(/[`～*~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/g, '').replace(/\s/g, '');
  if (value.length >= number) {
    this.$message({
      type: 'warning',
      message: `输入内容不能超过${number}个字符`
    });
  }
  return value;
};
// 初始化网络配置相关
try {
  var path = require('path');
  // 根目录，如app://movie_desktop
  var rootArray = window.document.location.href.split('/');
  var rootPath = rootArray[0] + '//' + rootArray[2];
  global.rootPath = rootPath;
  // 数据存储地址
  var dataPath = App.dataPath;
  // nw.exe运行地址
  var execPath = path.dirname(process.execPath);
  // 应用地址
  var cwdPath = process.cwd();

  console.log('根目录:' + rootArray +
    '\nrootPath:' + rootPath +
    '\ndataPath:' + dataPath +
    '\nexecPath:' + execPath +
    '\ncwdPath:' + cwdPath);
  console.log('起始页:\t' + JSON.stringify(process.mainModule, null, 2));
  console.log('nwjs版本内容:\t' + JSON.stringify(process.versions, null, 2));

  // 配置网络请求连接地址
  const { manifest } = App;
  console.log('===============================================');
  console.log('当前应用内部版本号为：' + manifest.version);
  console.log('===============================================');
  // 以local中存储的网址为准(放入dataPath配置文件中?)
  // localStorageService.removeData('netUrl');
  let netUrlStr = localStorageService.getData('netUrl');
  // window.alert('netUrlStr1:\n' + netUrlStr);
  if (netUrlStr == null || netUrlStr == '' || typeof (netUrlStr) == 'undefined') {
    netUrlStr = JSON.stringify(manifest.netUrl);
    // window.alert('netUrlStr2:\n' + netUrlStr);
    localStorageService.saveData('netUrl', netUrlStr);
  } else {
    // window.alert('localStorage已经有数据:\n' + netUrlStr);
    // console.log('localStorage已经有数据:' + netUrlStr);
  }
  // window.alert('netUrlStr3:\n' + netUrlStr);
  const netUrl = JSON.parse(netUrlStr);
  global.url = netUrl.production;
  global.staticUrl = netUrl.staticProduction;
} catch (e) {
  window.alert(e);
}

// 打开时最大化窗口
// Window.get().maximize();
Vue.config.productionTip = false;
Vue.prototype.timerCount = []; // 定时器数组
// 使用element框架
Vue.use(ElementUI);

// Vue.mixin({
//   beforeDestroy() {
//     console.log(`%c component ${this.name || this.$options.name} will be destoryed`, 'background:#aaa;color:red');
//   }
// })

// var Loading = ElementUI.Loading;
// 添加axios插件用于发送http请求(http://axios-js.com/docs/vue-axios-plugin.html#Options)
Vue.use(VueAxiosPlugin, {
  // 调置默认超时时间
  timeout: 15000,
  reqHandleFunc: function (config) {
    // console.log('reqHandleFunc');
    const user = SessionStorageServeice.getSessionData('currentUser');
    if (user != null) {
      const infoData = JSON.parse(SessionStorageServeice.getSessionData('login:' + user));
      if (infoData != null && infoData.respData != null) {
        config.headers.token = infoData.respData.token;
        config.headers.LOGINTYPE = 4;
        config.headers['Content-Type'] = 'application/json';
      }
    }
    debugger;
    // console.log('%c>>请求: \n config:' + JSON.stringify(config), 'color:blue;background:yellow;');
    return config;
  },
  reqErrorFunc: function (error) {
    console.log('reqErrorFunc');
    return Promise.reject(error);
  },
  resHandleFunc: function (response) {
    // console.log('resHandleFunc');
    // console.log('%c<<响应:  \n' + JSON.stringify(response.data), 'color:blue;background:#9CEC97;');
    // eslint-disable-next-line eqeqeq
    if (response != null && response.data != null && response.data.msg == 303) {
      SessionStorageServeice.removeSessionData('currentUser');
      Window.get().restore();
      router.push({ path: '/' });
    }
    return response;
  },
  resErrorFunc: function (error) {
    return Promise.reject(error);
  }
});

var aVue = new Vue({
  el: '#app',
//   // router,
  render: h => h(AppVue)
});

aVue.$axios.interceptors.response.use(response => {
  return response;
}, error => {
  if (error) {
    if (error.response) {
      switch (error.response.status) {
        case 404:
          Message({
            offset: 300,
            message: '服务器找不到请求的网页!',
            type: 'warning'
          });
          break;

        case 500:
          Message({
            offset: 300,
            message: '服务器异常!',
            type: 'warning'
          });
          break;
        case 502:
          Message({
            offset: 300,
            message: '服务器异常!',
            type: 'warning'
          });
          break;
        case 302:
          Message({
            offset: 300,
            message: error,
            type: 'warning'
          });
          break;

        default: error.message = `连接出错(${error.response.status})!`;
      }
    } else {
      Message({
        offset: 300,
        message: error == 'Error: Network Error' ? '请检查网络设置' : error,
        type: 'warning'
      });
    }
  } else {
    Message({
      offset: 300,
      // eslint-disable-next-line no-undef
      message: data.content,
      type: 'warning'
    });
  }
  return Promise.reject(error);
});
// 主窗口监听`close`事件 .
// eslint-disable-next-line no-undef
nw.Window.get().on('close', function () {
  var that = this;
  aVue.$axios.post(global.url + '/api/logout', {}).then((response) => {
    if (response) {
      that.close(true);
    }
    // eslint-disable-next-line handle-callback-err
  }).catch((error) => {
    that.close(true);
  });
});
//  backspace 键禁止返回
document.onkeypress = banBackSpace;
document.onkeydown = banBackSpace;
function banBackSpace (e) {
  var ev = e || window.event;
  // 各种浏览器下获取事件对象
  var obj = ev.relatedTarget || ev.srcElement || ev.target || ev.currentTarget;
  // 按下Backspace键
  if (ev.keyCode == 8) {
    var tagName = obj.nodeName; // 标签名称
    // 时间控件必填字段不能清空
    var clearAble = !!(obj.parentNode && obj.parentNode.getAttribute('data-clear') == 'no');
    if (clearAble) { return stopIt(ev); }
    // 如果标签不是input或者textarea则阻止Backspace
    if (tagName != 'INPUT' && tagName != 'TEXTAREA') {
      return stopIt(ev);
    }
    var tagType = obj.type.toUpperCase();// 标签类型
    // input标签除了下面几种类型，全部阻止Backspace
    if (tagName == 'INPUT' && (tagType != 'TEXT' && tagType != 'TEXTAREA' && tagType != 'PASSWORD' && tagType != 'NUMBER')) {
      return stopIt(ev);
    }
    // input或者textarea输入框如果不可编辑则阻止Backspace
    if ((tagName == 'INPUT' || tagName == 'TEXTAREA') && (obj.readOnly == true || obj.disabled == true)) {
      return stopIt(ev);
    }
  }
}
function stopIt (ev) {
  if (ev.preventDefault) {
  // preventDefault()方法阻止元素发生默认的行为
    ev.preventDefault();
  }
  if (ev.returnValue) {
  // IE浏览器下用window.event.returnValue = false;实现阻止元素发生默认的行为
    ev.returnValue = false;
  }
  return false;
}


/*
 * 由一个组件，向上找到最近的指定组件
 *
 * @param context 当前上下文，比如你要基于哪个组件来向上寻找，一般都是基于当前的组件，也就是传入this
 * @param componentName 要找的组件的name
 */
Vue.prototype.findComponentUpward = function (context, componentName) {
  let parent = context.$parent;
  let name = parent.$options.name;

  while (parent && (!name || [componentName].indexOf(name) < 0)) {
    parent = parent.$parent;
    if (parent) name = parent.$options.name;
  }
  return parent;
};

/**
 * 由一个组件，向上找到所有的指定组件
 *
 * @param context 当前上下文，比如你要基于哪个组件来向上寻找，一般都是基于当前的组件，也就是传入this
 * @param componentName 要找的组件的name
 */
Vue.prototype.findComponentsUpward = function (context, componentName) {
  const parents = [];
  const parent = context.$parent;

  if (parent) {
    if (parent.$options.name === componentName) parents.push(parent);
    return parents.concat(this.findComponentsUpward(parent, componentName));
  } else {
    return [];
  }
};


/**
 * 由一个组件，向下找到最近的指定组件
 *
 * @param context 当前上下文，比如你要基于哪个组件来向上寻找，一般都是基于当前的组件，也就是传入this
 * @param componentName 要找的组件的name
 */
Vue.prototype.findComponentDownward = function (context, componentName) {
  const childrens = context.$children;
  let children = null;
  if (childrens.length) {
    for (const child of childrens) {
      const name = child.$options.name;
      if (name === componentName) {
        children = child;
        break;
      } else {
        children = this.findComponentDownward(child, componentName);
        if (children) break;
      }
    }
  }
  return children;
};

/**
 * 由一个组件，向下找到所有指定的组件
 *
 * @param context 当前上下文，比如你要基于哪个组件来向上寻找，一般都是基于当前的组件，也就是传入this
 * @param componentName 要找的组件的name
 */
Vue.prototype.findComponentsDownward = function (context, componentName) {
  return context.$children.reduce((components, child) => {
    if (child.$options.name === componentName) components.push(child);
    const foundChilds = this.findComponentsDownward(child, componentName);
    return components.concat(foundChilds);
  }, []);
};

// 监听缓存 全局方法 this.resetSetItem()
Vue.prototype.resetSetItem = function (key, newVal) {
  if (key === 'watchStorage') {
    // 创建一个StorageEvent事件
    var newStorageEvent = document.createEvent('StorageEvent');
    const storage = {
      setItem: function (k, val) {
        sessionStorage.setItem(k, val);
        // 初始化创建的事件
        newStorageEvent.initStorageEvent('setItem', false, false, k, null, val, null, null);
        // 派发对象
        window.dispatchEvent(newStorageEvent);
      }
    };
    return storage.setItem(key, newVal);
  }
};
console.log=function () {

}





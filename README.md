# md-nw-camera


## 使用方式

``` bash
# install dependencies
npm install 或npm run cnpm_ii(优先，使用淘宝镜像)  第一次运行时间可能有点长，需要等

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

```

## 版本更新

# 需更改 package.json 里面的 version 版本号，然后进行 npm run build，服务器会自动匹配版本号，不一致提示更新升级，登录时进入 update 页面.

## 项目结构

# build	这个是我们最终发布的时候会把代码发布在这里，在开发阶段，我们基本不用管
# config	配置目录，默认配置没有问题，所以我们也不用管
# docs  开发过程需要注意的，代码开发规范说明,目录中的微软雅黑.ttf为系统默认字体，没有请先安装到本地系统中,需要到docs文件夹下面点击安装
# node_modules	这个目录是存放我们项目开发依赖的一些模块
# src	我们的开发目录，基本上绝大多数工作都是在这里开展的
# static	资源目录，我们可以把一些图片啊，字体啊，放在这里。
# releases nw打包后自动生成的 .exe 可执行应用包，目前只支持windows环境 ，有32位和64位
# .xxxx文件	这些是一些配置文件，包括语法配置，git配置等。基本不用管
# index.html	首页入口文件，基本不用管
# package.json	项目配置文件。前期基本不用管
# src->assets 项目公共全局样式，分卒中和胸痛两个文件夹，需自己在 main.js 引入
# src->components 项目公共组件，目前只是引用elementUI 组件 ，如需要可以自己写
# src->data 目前没用到，可忽略
# src->router 项目路由，目前是根据角色 rolId 进入区分，卒中、胸痛无区分，编辑时需写明 路由注释，以便维护
# src->utils 项目js工具，目前有时间计算、缓存等
# src->views 项目视图层，大部分代码在此文件夹编写，分为卒中、胸痛两大类，登录入口一致，先不改，里面可拆开每个独立小项目
# src->App.vue 项目入口，无需更改
# src->main.js 项目入口js，基本无需更改，如需加缓存字段，需写明注释

## releases目录是打包后生成的安装包，不用提交到svn目录中

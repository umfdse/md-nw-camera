<template>
  <div id="login">
    <div class="loginConbox">
      <div class="loginBox">
        <div class="loginCon">
          <el-row>
            <el-col :span="12" class="logo-box">
              <img :src=logoUrl alt="" >
            </el-col>
            <el-col :span="12">
              <el-card class="login-module" shadow="never">
                <div slot="header" class="clearfix formTitlt">
                  <span class="loginTitle">登录</span>
                  <el-button type="text" @click="dialogFormVisible = true" style="margin-left:15px">(设置)</el-button>
                </div>
                <el-form :model="loginForm" :rules="rules" ref="loginForm" status-icon label-width="100px" class="demo-ruleForm"
                  style="padding-right:3px">
                  <el-form-item label="" prop="username">
                    <el-input type="text" v-model="loginForm.username" placeholder="请输入用户名" 
                      class="input-box">
                      <i slot="prefix" class="el-input__icon icon-man"></i>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="" prop="password">
                    <el-input type="password" v-model="loginForm.password" auto-complete="new-password" show-password
                      class="input-box" placeholder="请输入密码" >
                      <i slot="prefix" class="el-input__icon icon-password"></i>
                    </el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-row>
                      <el-col :span="8">
                        <el-checkbox v-model="rememberPwd" class="remember-pwd"><span class="remind-text">记住密码</span>
                        </el-checkbox>
                      </el-col>
                      <el-col :span="8" :offset="8" class="pointer">
                        <el-button @click="forgetClick" class="forget-pwd remind-text">忘记密码?</el-button>
                      </el-col>
                    </el-row>
                  </el-form-item>
                  <el-form-item style="margin-bottom:5px">
                    <el-button v-show="!forgetPwd" class="subBtn" type="primary" @click="submitForm">登录</el-button>
                  </el-form-item>
                </el-form>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>

    <el-dialog title="设置" :visible.sync="dialogFormVisible" width="95%" class="netDialog">
      <el-form :model="netForm">
        <el-form-item label="请求地址 :" :label-width="formLabelWidth">
          <el-input v-model="netForm.production" autocomplete="off"></el-input>
          <el-button @click="testNet">测试</el-button>
        </el-form-item>
        <el-form-item label="静态请求地址 :" :label-width="formLabelWidth">
          <el-input v-model="netForm.staticProduction" autocomplete="off"></el-input>
          <el-button @click="testStaticNet">测试</el-button>
        </el-form-item>
        <el-form-item label="打印机名称 :" :label-width="formLabelWidth">
          <el-select v-model="printSelectValue" placeholder="请选择" size="medium" class="print-item">
            <el-option v-for="item in printForms.options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="版本号 :" :label-width="formLabelWidth">
         <p>{{version}}</p>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handlerChangeNet">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {App} from "nw.gui";
  import {saveSessionData} from '@/utils/SimpleSessionStorageService.js';
  import * as localStorageService from '@/utils/SimpleLocalStorageService.js';
  const {
    manifest
  } = App;
  import {
    Loading
  } from 'md-element-ui';
  import {
    Window
  } from 'nw.gui';
  var gui = require('nw.gui');
  var ping = require('node-http-ping')
  var qsUrl = require('url');
  export default {
    name: 'Login',
    data () {
      return {
        version: manifest.version,
        loginForm: {
          username: '',
          password: ''
        },
           rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ],
           },
        dialogFormVisible: false,
        netForm: {
          production: '',
          staticProduction: '',
          test: '',
          checkNetType: ''
        },
        formLabelWidth: '120px',
        isClickLogin: false, // 是否可以点击登录按钮
        rememberPwd: false, // 记住密码
        forgetPwd: false, // 忘记密码
        showPrint: false,
        printForms: {
          options: []
        },
        printSelectValue: '',
        demoMode: '0',
        logoUrl: '/static/img/logoBgc.png',
        hospitalCode: ''
      };
    },
    created () {
      var that = this;
      Window.get().setPosition('center');
      let netUrlStr = localStorageService.getData('netUrl');
      let netUrl = JSON.parse(netUrlStr);
      that.netForm.production = netUrl.production;
      that.netForm.staticProduction = netUrl.staticProduction;
      that.netForm.test = netUrl.test;
      that.netForm.checkNetType = 1;

      let lastLoginName = localStorageService.getData('lastLoginName');
      let lastLoginPwd = localStorageService.getData('lastLoginPwd');
      let lastRememberPwd = localStorageService.getData('lastRememberPwd'); // 记住密码用户点击一次就可以
      if (lastLoginName != null || lastLoginName != '') {
        that.loginForm.username = lastLoginName;
      }
      if (lastLoginPwd != null || lastLoginPwd != '') {
        that.loginForm.password = lastLoginPwd;
      }
      // 如果用户名和密码都存在，则可以点击登录
      if (that.loginForm.username && that.loginForm.password) {
        that.isClickLogin = true;
      }
      // 存的时候，转成了string,重新赋值的时候需要转成boolean
      if (lastRememberPwd == 'true') {
        that.rememberPwd = Boolean(lastRememberPwd);
        that.isClickLogin = true;
      }
      // 打印机
      var printOpts = [];
      gui.Window.get().getPrinters(function (printers) {
        printers.map(function (printer) {
          printOpts.push({
            value: printer.printerName,
            label: printer.printerName
          });
          return console.log('当前可用打印方式', printer.printerName);
        });
        console.log('************' + JSON.stringify(printOpts));
        that.$set(that.printForms, 'options', printOpts);
      });

      let printSelectValue = localStorageService.getData('selectPrint');
      if (printSelectValue != null && printSelectValue != '') {
        that.printSelectValue = printSelectValue;
      }
      // 演示模式
      let demoMode = JSON.parse(localStorageService.getData('demoMode'));
      this.demoMode = demoMode;
      // 背景图片url
      this.logoUrl = localStorageService.getData('logoUrl') ? localStorageService.getData('logoUrl') : '/static/img/logoBgc.png';
    },
    methods: {
      /**
       * 测试网络地址
       */
      testNet () {
        var that = this;
        var url = that.netForm.production;
        if (url == null || url == '') {
          that.$message('请输入请求地址');
          return;
        }
        // 去除最后面的斜杠(可能有多个)
        that.netForm.production = url = url.replace(/(\/*)$/, '');
        that.$axios.post(url + '/healthCheck', {}, {}).then(response => {
          console.log(JSON.stringify(response));
          if(response.data.msg==201){
             that.$message.success(response['data']['content']);
          }else{
            that.$message.error("网络异常");
          }
         
        }).catch(function (e) {
          console.error(e);
          that.$message({
            duration: 3000,
            showClose: true,
            message: '网络异常',
            type: 'error'
          });
        });
      },

      handlerChangeNet () {
        this.dialogFormVisible = false;
        if (this.netForm.checkNetType == 1) {
          global.url = this.netForm.production;
        } else {
          global.url = this.netForm.test;
        }
        let netUrlStr = JSON.stringify({
          'production': this.netForm.production,
          'staticProduction': this.netForm.staticProduction,
          'test': this.netForm.test
        });
        localStorageService.saveData('netUrl', netUrlStr);
        console.log('选中打印机:' + this.printSelectValue);
        localStorageService.saveData('selectPrint', this.printSelectValue);
        // 是否演示模式
        localStorageService.saveData('demoMode', this.demoMode);
      },
      submitForm () {
        var that = this;
        var loginUrl = '';
        var param = {};
        if (!that.loginForm.username || !that.loginForm.password) {
          that.$message({
            duration: 3000,
            showClose: true,
            message: '账号或密码不能为空',
            type: 'error'
          });
          return false;
        }
        loginUrl = '/api/icu/noAuth/login';
        param = {
          'username': that.loginForm.username,
          'password': that.loginForm.password,
          'loginType': 4,
          "validStrategy": 1,
        };
        var loadingInstance = Loading.service({});
        that.$axios.post(global.url + loginUrl, param, {}).then((response) => {
          that.$nextTick(() => {
            // 以服务的方式调用的 Loading 需要异步关闭
            loadingInstance.close();
          });
          let data = response.data;
          if (data.msg === 201) {
            if (data.respData) {
              // 保存登录信息至sessionStorage
              saveSessionData("token",data.respData.token)
              saveSessionData('menuPerms', JSON.stringify(data.respData.menuPerms));
              saveSessionData('roleCodes', JSON.stringify(data.respData.roleCodes));
              saveSessionData('username', JSON.stringify(data.respData.username));
               saveSessionData('realName',data.respData.realName);
              saveSessionData('userType', JSON.stringify(data.respData.userType));
              saveSessionData('loginUserData', JSON.stringify(data.respData));
              saveSessionData('login:' + this.loginForm.username, JSON.stringify(data));
              saveSessionData("hospitalCode",data.respData.hospitalCode)
              saveSessionData("userId",data.respData.id)
              saveSessionData("deptId",data.respData.deptIds)
              saveSessionData("deptName",data.respData.deptName)

              // 路由到主页面
              let curentUser = that.loginForm.username;
              saveSessionData('currentUser', curentUser);
              // 记录下用户名，用于下次登录时回填
              localStorageService.saveData('lastLoginName', curentUser);
              if (that.rememberPwd) { // 记住密码
                let curentPwd = that.loginForm.password;
                localStorageService.saveData('lastLoginPwd', curentPwd);
                localStorageService.saveData('lastRememberPwd', that.rememberPwd);
              } else { // 没有点击记住密码按钮，则将上次登录密码删除
                localStorageService.removeData('lastLoginPwd');
                localStorageService.removeData('lastRememberPwd');
              }
              Window.get().setResizable(true);
              // 打开时最大化窗口
              Window.get().maximize();
                if(data.respData.userType=="3"){
                if(JSON.stringify(data.respData.menuPerms).indexOf("patient:view")>0){
                    that.$router.push({
                      path: `/patient/list`
                    });
                }else if(JSON.stringify(data.respData.menuPerms).indexOf("dept:view")>0){
                   that.$router.push({
                      path: `/departmentDoctor`
                    });
                }
                else if(JSON.stringify(data.respData.menuPerms).indexOf("report:view")>0){
                   that.$router.push({
                      path: `/dataManage`
                    });
                }else if(JSON.stringify(data.respData.menuPerms).indexOf("sys:view")>0){
                   that.$router.push({
                      path: `/system`
                    });
                }
               
              }else if(data.respData.userType=="4"){
                 if(JSON.stringify(data.respData.menuPerms).indexOf("patient:view")>0){
                    that.$router.push({
                      path: `/patient`
                    });
                  }else if(JSON.stringify(data.respData.menuPerms).indexOf("advice:view")>0){
                   that.$router.push({
                      path: `/doctorAdvice`
                    });
                }else if(JSON.stringify(data.respData.menuPerms).indexOf("dept:view")>0){
                   that.$router.push({
                      path: `/department`
                    });
                }else if(JSON.stringify(data.respData.menuPerms).indexOf("sys:view")>0){
                   that.$router.push({
                      path: `/system`
                    });
                }
             
            }else{
               that.$router.push({
                      path: `/patient`
                    });
            }
             
            }
          } else {
            that.message(data.content);
          }
        }).catch(function (error) {
          that.$nextTick(() => {
            // 以服务的方式调用的 Loading 需要异步关闭
            loadingInstance.close();
          });
        });
      },
      message (m) {
        const h = this.$createElement;
        this.$notify({
          title: '登录提示',
          message: h('i', {
            style: 'color: teal'
          }, m),
          duration: 1000
        });
      },
      forgetClick () { // 点击忘记密码
      this.$message({
        type:'warning',
        message:"如果密码忘记或丢失请联系管理员进行处理"
      })
      },
      testStaticNet () {
        var that = this;
        var url = that.netForm.staticProduction;
        console.log('url:' + url);
        if (url == null || url == '') {
          that.$message('请输入请求地址');
          return;
        }
        // 去除最后面的斜杠(可能有多个)
        that.netForm.staticProduction = url = url.replace(/(\/*)$/, '');
        // 通过ping静态地址来判断是否正常
        var purl = qsUrl.parse(url);
        console.log("purl",purl);
        ping(purl.hostname, purl.port /* optional */)
          .then(time => {
            that.$message('网络正常，'+`Response time: ${time}ms`);
          })
          .catch(() => {
            that.$message({
              duration: 3000,
              showClose: true,
              message: '网络异常',
              type: 'error'
            });
          })
      }
    }
  };

</script>
<style lang="scss">
  #login {
    width: 100%;
    height: 100%;

    .el-button--primary {
      border-radius: 2px;
    }
    .dialog-footer{
      display: flex;
      justify-content: center;
    }
    .header {
      height: 60px;
      position: relative;
      background: #2d3a4b;
    }

    .loginBox {
      .iconcolor {
        color: #409EFF;
      }

      .loginCon {
        .logo-box {
          text-align: center;
        }
        .logo-box img{
          width: 100%;
          height: 100%;
        }

        .el-card__header {
          padding: 15px 0 !important;

          .formTitlt {
            text-align: left !important;
            height: 28px !important;
            font-size: 20px !important;
            font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Noto Sans CJK SC, WenQuanYi Micro Hei, Arial, sans-serif !important;
            font-weight: bold !important;
            color: rgba(51, 51, 51, 1) !important;
            line-height: 28px !important;

            .loginTitle {
              width: 34px;
              font-size: 17px !important;
              font-family: PingFangHK-Semibold, PingFangHK;
              font-weight: 600;
              color: rgba(51, 51, 51, 1);
            }

            .el-button--text {
              font-weight: 600 !important;
              font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Noto Sans CJK SC, WenQuanYi Micro Hei, Arial, sans-serif !important;
              color: rgba(51, 51, 51, 1) !important
            }
          }
        }

        .el-card__body {
          padding: 0 !important;
        }

        .title {
          font-size: 36px;
          font-weight: 600;
          color: #000000;
          width: 500px;
          float: left;
          margin-top: 0px;

          &:first-child {
            font-size: 34px;
            margin-top: 50px;
            margin-bottom: 30px;
          }
        }

        .login-module {
          margin: 15px 20px 0 20px;
          border: none;

          .formTitlt {
            font-size: 18px;
            font-weight: 400;

            .titIconbox {
              float: right;


            }
          }

          .smalltxt {
            text-align: right;

            .a {
              text-decoration: none;
              color: #999999;
              font-size: 12px;
              margin-left: 8px;
            }
          }

          .remind-text {
            font-size: 14px;
            font-family: PingFangHK-Medium, PingFangHK;
            font-weight: 500;
            color: rgba(153, 153, 153, 1);
          }

          .pointer {
            cursor: pointer;
          }

          .forget-pwd {
            border: 0;
          }

          .forget-pwd:hover {
            background-color: #fff;
          }

          .input-box {
            .el-input__inner {
              padding-left: 40px;
            }

            .el-input__prefix {
              left: 10px !important;

              .el-input__icon {
                display: inline-block;
                margin-top: 10px;
                width: 20px;
                height: 20px;
              }

              .icon-man {
                background: url(/static/img/icon_user.png) 0 0 no-repeat;
              }

              .icon-password {
                background: url(/static/img/icon_password.png) 0 0 no-repeat;
              }

              .icon-code {
                background: url(/static/img/icon_code.png) 0 0 no-repeat;
              }
            }

          }

          .validate-code {
            position: absolute;
            top: 8px;
            right: 10px;
            width: 60px;
            height: 24px;
            padding: 0;
            border-radius: 4px;
          }

          .toLogin {
            width: 55px;
            height: 25px;
            font-size: 14px;
            font-family: PingFangHK-Medium, PingFangHK;
            font-weight: 500;
            color: rgba(24, 144, 255, 1);
            line-height: 20px;
            cursor: pointer;
            border: none;
            border-bottom: 1px solid #1890FF;
            border-radius: 0;
            background-color: #fff;
            padding: 0 !important;
          }

          .toLogin:hover {
            background-color: #fff;
          }


        }

        .el-form-item__content {
          margin-left: 0px !important;

          .subBtn {
            width: 100%;
            height: 44px;
            border-radius: 5px;
            font-size: 17px;
            font-family: PingFangHK-Medium, PingFangHK;
            font-weight: 500;
            color: rgba(255, 255, 255, 1);
            margin: 0 !important;
          }
        }
      }

      .el-input__inner,
      .el-card,
      .el-message {
        border-radius: 0px !important;
      }

      .el-form-item__content .ico {
        position: absolute;
        top: 0px;
        left: 0px;
        z-index: 999;
        width: 40px;
        height: 39px;
        text-align: center;
        border-right: 1px solid #ccc;
      }
    }

    .netDialog {
      overflow: hidden;

      .print-item {
        width: 100% !important;
      }

      .el-input {
        width: 80%;
      }

      .el-dialog {
        min-width: 260px !important;
        margin-top: 5vh !important;
      }

      .el-dialog__body {
        padding: 10px 10px;

        .el-form-item {
          margin-bottom: 10px;
        }
      }

      .el-dialog__footer {
        padding: 2px 20px 13px;
      }

      .el-form-item__label {
        width: 100px !important;
      }

      .el-form-item__content {
        margin-left: 100px !important;
      }

      .el-dialog__footer {
        text-align: center;
      }

    }

  }

</style>

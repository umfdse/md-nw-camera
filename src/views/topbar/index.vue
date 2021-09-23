<template>
  <div class="header">
    <!--头部-->
    <el-row class="rowContent">
      <el-col :span="5" class="nav_logo">
        <img src="/static/img/icu_logo.png">
        <!-- <span class="header-title">重症监护系统</span> -->
      </el-col>
      <el-col :span="switchShow?14:16" class="nav_menu">
        <cz-navbar ref="navbar"></cz-navbar>
      </el-col>
      <el-col :span="2" v-if="switchShow">
        <div class="switchType">
           <el-dropdown placement="bottom" slot="dropdown"  :trigger="'hover'" :show-timeout="0">
          <span class="el-dropdown-link">{{typeFace}}</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="changeLocalenurse">护士端</el-dropdown-item>
             <el-dropdown-item @click.native="changeLocaledoctor">医生端</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        </div>
        
      </el-col>
      <!-- 消息通知-->
      <el-col :span="1" class="nav_handle g-fr">
        <el-popover
          ref="systemMsg"
          class="systemMsg"
          placement="bottom"
          title="消息通知"
          width="336"
          trigger="click">
          <!--消息内容-->
          <ul class="msg_wrapper" v-if="msgList.length>0">
            <div class="msg_wrapper_sysTitle"><span>系统通知</span></div>
            <li v-for="(item,index) in msgList" :key="index" @click="setMsgStatus(item)">
              <p v-if="item.state!=0" class="status-icon-gray"></p>
              <p v-else class="status-icon-red"></p>
              <div class="msg_content">
                <div class="msg_content_title">
                  <el-tooltip :content="item.content" placement="bottom">
                    <div class="wordnowrap">
                      <span>{{item.content}}</span>
                    </div>
                  </el-tooltip>
                </div>
                <div class="msg_content_txt">
                  <el-tooltip :content="item.createTs" placement="bottom">
                    <div class="wordnowrap">
                      {{item.createTs}}
                    </div>
                  </el-tooltip>
                </div>
              </div>
            </li>
            <li class="moreMsg flex-row-center" @click="goMsgPage">
              <span>查看更多</span>
            </li>
          </ul>
          <div v-else class="flex-column-center noDataWrapper">
            <div class="noData"></div>
          </div>
          <el-badge :is-dot="isDot" slot="reference">
            <div class="el-icon-message-solid"></div>
          </el-badge>
        </el-popover>
      </el-col>
      <el-col :span="2" class="nav_handle g-fr">
        <span class="userName">{{userName}}</span>
        <el-dropdown placement="bottom" @command="handleCommand" :trigger="'hover'" :show-timeout="0">
          <span class="el-dropdown-link"><img src="/static/img/userImg.png" alt=""></span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="clickOut">退出系统</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="dialogVisible" :modal-append-to-body="true" :close-on-click-modal="false" width="520px"
               class="login-dialog-position">
      <span class="g-t-black">是否确定退出当前账号?</span>
      <span slot="footer" class="dialog-footer">
        <el-button  @click="dialogVisible = false" >取 消</el-button>
        <!-- class="login-out-btn login-out-cancel common-btn" -->
        <el-button type="primary"  size=small @click="loginOut" >退出登录</el-button>
        <!-- class="login-out-btn login-out-sure common-btn" -->
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import eventBus from "@/utils/eventBus.js"
  import {Window, App} from "nw.gui";
  import {saveSessionData, getSessionData, removeSessionData} from "@/utils/SimpleSessionStorageService.js";
  import Navbar from "../navbar";

  // 处理版本升级
  import {checkUpdate} from '@/utils/updatev1.js';
  export default {
    name: "topbar",
    components: {CzNavbar: Navbar},
    data() {
      return {
        typeFace:"护士端",
        switchShow:false,
        currentUser: "",
        hospitalName: "",
        dialogVisible: false, //弹出退出登录弹框
        localSetDialog: false,
        currenParma: null,
        userName: "",
        /* 消息推送  */
        ws: null,
        wsUrl: '',
        hospitalCode: '',
        userId: '',
        lockReconnect: false,
        timeout: 30 * 1000,
        timeoutObj: null,
        serverTimeoutObj: null,
        timeoutnum: null,
        isDestroyWs: false,
        /*消息列表*/
        msgList: [],
        isDot: false, //是否显示红点

      };
    },
    created() {
      console.group('%c%s', 'color:green', "---created:src/views/all/topbar/index.vue");
      var that = this;
      that.currentUser = getSessionData("currentUser");
      let loginData = getSessionData("login:" + that.currentUser);
      if (loginData != null) {
        let data = JSON.parse(loginData);
        if (data.respData && data.respData.mdHospital) {
          that.hospitalName = data.respData.mdHospital.hospitalName;
        }
      }
      let _this = this
    },
    mounted() {
      if(getSessionData("roleCodes").indexOf("ADMIN")>-1){
        this.switchShow = true
      }else{
        this.switchShow = false
      }
      this.userName = getSessionData("realName")
      //执行升级任务
      setTimeout(function () {
        checkUpdate();
      }, 2000);
      this.userId = getSessionData('userId')
      this.hospitalCode = getSessionData('hospitalCode')
      this.initWebSocket();
      eventBus.$on('listMsgChange', data => {
        this.getMsgList()
      })
    },
   /* 销毁监听*/
    beforeDestroy() {
      eventBus.$off('listMsgChange')
      eventBus.$off('isEndRescue')
    },

    watch:{
      msgList: {
        handler (newVal,oldVal) {
          this.isDot = false
          let _this = this
          newVal.forEach(item=>{
            if(item.state==0){
              _this.isDot = true
            }
          })
        },
        deep: true
      }
    },

    methods: {
 /*     销毁websocket*/
     destroyWs(){
       this.isDestroyWs = true
       if (this.ws != null) {
         this.ws.close();
         this.ws = null
         this.timeoutObj = null
         this.serverTimeoutObj = null
         clearTimeout(this.timeoutObj);
         clearTimeout(this.serverTimeoutObj);
       }
     },
     changeLocalenurse(){
        this.typeFace= "护士端"
        eventBus.$emit('getTarget', this.typeFace); 
         saveSessionData("typeFace",this.typeFace)
         this.$router.push({path:"/patient"})
     },
     changeLocaledoctor(){
       this.typeFace= "医生端"
       eventBus.$emit('getTarget', this.typeFace); 
        saveSessionData("typeFace",this.typeFace)
        this.$router.push({path:"/patient/list"})
     },
      // 退出系统
      clickOut() {
        let isRescue = sessionStorage.getItem('isRescue')
        let currentPath= this.$route.path
        console.log(currentPath)
        if (isRescue == 1 && currentPath =='/patient/nursingMeasures') {
          eventBus.$emit('isEndRescue')
         return
        }
        var that = this;
        var isDetailEdit = getSessionData("isDetailEdit");
        var isSetEdit = window.sessionStorage.getItem("isSetEdit");
        if (isDetailEdit == "true" || isSetEdit == "true") {
          let warningMsg = isDetailEdit == "true" ? "排班详情" : "绩效设置";
          that.$confirm(warningMsg + '数据未保存，是否退出登录?', '提示', {
            confirmButtonText: '退出登录',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            saveSessionData('isDetailEdit', false);
            window.sessionStorage.setItem("isSetEdit", false);
            removeSessionData("currentUser");
            removeSessionData("userId");
            removeSessionData("typeFace");
            removeSessionData("strokeObj");
            removeSessionData("smgUserObj");
            removeSessionData("traumaObj");
            removeSessionData("digestObj");
            removeSessionData("emergencyObj");
            removeSessionData("login:" + that.currentUser);
            Window.get().resizeTo(560, 340);
            that.$axios.post(global.url + "/api/logout", {}).then((response) => {
              that.$router.push({
                path: "/"
              });
            }).catch((error) => {
              that.$router.push({
                path: "/"
              });
            });
          }).catch(() => {
          });
        } else {
          that.dialogVisible = true;
        }
      },
      loginOut() {
        var that = this;
        that.$axios.post(global.url + "/api/icu/logout", {}).then((response) => {
          that.destroyWs()
          removeSessionData("token")
          removeSessionData('menuPerms');
          removeSessionData('roleCodes');
          removeSessionData('username');
          removeSessionData('userType');
          removeSessionData('loginUserData');
          removeSessionData("hospitalCode")
          removeSessionData("typeFace");
          removeSessionData("currentUser");
          removeSessionData("userId");
          removeSessionData("strokeObj");
          removeSessionData("smgUserObj");
          removeSessionData("traumaObj");
          removeSessionData("digestObj");
          removeSessionData("emergencyObj");
          removeSessionData("login:" + that.currentUser);
          Window.get().resizeTo(560, 340);
          that.$router.push({
            path: "/"
          });
        }).catch((error) => {
          removeSessionData("currentUser");
          removeSessionData("login:" + that.currentUser);
          Window.get().resizeTo(560, 340);
          that.$router.push({
            path: "/"
          });
        });
      },
      //下来菜单点击事件
      handleCommand(command) {
        if (command == "clickOut") {
          this.clickOut()
        }
      },
      /**
       * 连接websocket
       */
      initWebSocket() {
        if(this.isDestroyWs){
          return
        }
        this.wsUrl = `ws:${global.url.replace('http://', '//')}/websocket/message/${this.hospitalCode}_${this.userId}`
        this.ws = new WebSocket(this.wsUrl);
        this.ws.onopen = this.onopen;
        this.ws.onmessage = this.onmessage;
        this.ws.onclose = this.onclose;
        this.ws.onerror = this.onerror;
        let _this = this
        window.onbeforeunload = function () {
          if (_this.ws) {
            _this.ws.close();
          }
        }
      },
      reconnect() {
        var _this = this;
        if (_this.lockReconnect) {
          return;
        }
        _this.lockReconnect = true;
        _this.timeoutnum && clearTimeout(_this.timeoutnum);
        _this.timeoutnum = setTimeout(function () {
          _this.initWebSocket();
          _this.lockReconnect = false;
        }, 5000);
      },
      reset() {
        var _this = this;
        clearTimeout(_this.timeoutObj);
        clearTimeout(_this.serverTimeoutObj);
        _this.start();
      },
      start() {
        var _this = this;
        _this.timeoutObj && clearTimeout(_this.timeoutObj);
        _this.serverTimeoutObj && clearTimeout(_this.serverTimeoutObj);
        _this.timeoutObj = setTimeout(function () {
          if (_this.ws && _this.ws.readyState == 1) { //测试连接状态
            _this.ws.send(`${_this.hospitalCode}_${_this.userId}`)
          } else {
            _this.reconnect();
          }
          _this.serverTimeoutObj = setTimeout(function () {
            if (_this.ws) {
              _this.ws.close();
            }
          }, _this.timeout);
        }, _this.timeout)
      },
      onopen() {
        console.log('连接成功')
        this.getMsgList() //连接成功拉一次消息列表
        this.start();
      },
      /**
       * websocket接收消息
       */
      onmessage(e) {
        console.log(e, '有消息过来了')
        let msgData = null
        if (e && e.data) {
          msgData = JSON.parse(e.data)
        }
        if (msgData && msgData.id) {
          this.msgList.unshift(msgData)
          //取最新的5条
          if (this.msgList.length > 4) {
            this.msgList = this.msgList.slice(0, 4)
          }
        }
        this.reset();
      },
      onclose(e) {
        if (this.isDestroyWs) {
          console.log("连接关闭,不在重连");
        } else {
          console.log("连接关闭,开始重连");
          this.reconnect();
        }
      },
      onerror(e) {
        console.log("出现错误");
        if (!this.isDestroyWs) {
          this.reconnect();
        }
      },
      setMsgStatus(data) {
        let _this = this
        let param = {
          ids: [data.id],
          state: 1
        }
        this.$axios({
          url: global.url + '/base/message/updateStateBatch',
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          data: param
        }).then(res => {
          let resData = res.data
          if (resData.msg == 201) {
            this.msgList.forEach(item => {
              if (data.id == item.id) {
                _this.$set(item, 'state', 1)
              }
            })
            eventBus.$emit('noticeMsgChange')
          } else {
            this.$message.error(res.content)
          }
        })
      },
      goMsgPage() {
        this.$router.push({
          path: '/system/message'
        })
      },
      getMsgList() {
        let param = {
          hospitalCode: this.hospitalCode,
          userId: this.userId,
          pageNum: 1,
          pageSize: 5,
        }
        this.$axios({
          url: global.url + '/base/message/list',
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          data: param
        }).then(res => {
          let resData = res.data
          if (resData.msg == 201) {
            this.msgList = resData.respData && resData.respData.list ? resData.respData.list: []
          } else {
            this.$message.error(resData.content)
          }
        })
      },
    }
  };

</script>
<style lang="scss" scoped>
  .global-button {
    position: fixed;
    width: 100px;
    top: 10px;
    right: 20px;
    z-index: 100;
    span {
      display: block;
    }
  }

  .el-icon-pie-chart {
    font-size: 17px;
  }

  @media screen and (max-width: 1440px) {
    .header {
      background-color: #3555ff;
      color: #fff;
      span,
      i {
        /* font-size: 16px; */
        color: #fff;
      }

      .title {
        letter-spacing: 3px;
        font-weight: 600;
        font-size: 20px !important;
      }

      .login-out {
        span {
          font-size: 14px;
        }
      }

      .el-dropdown-link,
      .el-icon-arrow-down {
        letter-spacing: 3px;
        /* font-weight: 600;*/
        font-size: 20px;
        cursor: pointer;
      }

    }
  }

  @media screen and (min-width: 1440px) {
    .header {
      background-color: #3555ff;
      color: #fff;
      span,
      i {
        /* font-size: 18px; */
        color: #fff;
      }

      .title {
        letter-spacing: 3px;
        font-weight: 600;
        font-size: 24px;
      }

      .login-out {
        span {
          font-size: 16px;
        }
      }

      .el-dropdown-link,
      .el-icon-arrow-down {
        letter-spacing: 3px;
        /* font-weight: 600;*/
        font-size: 24px;
        cursor: pointer;
      }
    }
  }

  .header {
    padding: 0 !important;
    height: 48px;
    background: linear-gradient(180deg, #3555ff 0%, #2991F1 100%);
    .rowContent {
      height: 100%;
      .nav_logo {
        height: 100%;
        display: flex;
        align-items: center;
        padding-left: 20px;
        img {
          display: inline-block;
          width: 80%;
          height: 30px;
        }
        span {
          margin-left: 10px;
          display: inline-block;
        }
      }
      .nav_handle {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        img {
          display: inline-block;
          width: 30px;
          height: 30px;
        }
      }
      .nav_foldMenu {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        img {
          display: inline-block;
          width: 30px;
          height: 30px;
          cursor: pointer;
        }
      }
    }

    .login-out {
      color: #1890ff;
    }

    .login-dialog-position {
      .g-t-black {
        color: #333;
      }
    }

    .login-out-btn {
      border-radius: 0;
      margin: 0 30px !important;
    }

    .login-out-cancel {
      color: #333 !important;
      border: 1px solid #333 !important;
    }

    .login-out-sure {
      color: #F23C3C !important;
      border: 1px solid #F23C3C !important;
    }

    .login-out-cancel:active {
      color: #333 !important;
      border-color: #333 !important;
      outline: 1px !important;
    }

    .login-out-cancel:focus,
    .login-out-cancel:hover {
      color: #333 !important;
      border-color: #333 !important;
      background-color: #fff !important;
    }

    .login-out-sure:active {
      color: #F23C3C !important;
      border-color: #F23C3C !important;
      outline: 1px !important;
    }

    .login-out-sure:focus,
    .login-out-sure:hover {
      color: #F23C3C !important;
      background-color: #fff !important;
    }
    .userName {
      color: #fff;
      margin-right: 5px;
    }
  }

</style>
<style lang="scss">
  .login-dialog-position {
    margin-top: 25vh !important;

    .el-dialog__header {
      height: 20px;
    }
    .g-t-black {
      color: #333;
    }

    .el-dialog__body {
      text-align: center;
    }
  }

  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }

  .minhHeight {
    .el-dialog {
      min-width: auto;
    }
  }

  .el-popover__title {
    display: none;
    color: #000000;
    line-height: normal;
    margin-bottom: 12px;
    text-align: center;
    font-size: 14px;
    font-weight: 600;
  }

  .systemMsg {
    height: 48px;
    position: absolute;
    top: 12px;
    z-index: 99;
    font-size: 20px;
    color: #ffffff;
    cursor: pointer;
    .el-badge__content.is-dot {
      height: 6px;
      width: 6px;
    }
    .el-badge__content {
      border: none
    }
    .el-icon-message-solid:before {
      content: "\e799";
      font-size: 20px;
    }
  }

  .msg_wrapper {
    .msg_wrapper_sysTitle {
      display: flex;
      justify-content: center;
      height: 40px;
      align-items: center;
      font-size: 14px;
      font-weight: 600
    }
    li {
      display: flex;
      height: 88px;
      align-items: center;
      border-top: 1px solid rgba(0, 0, 0, 0.06);
      .status-icon-red {
        width: 8px;
        height: 8px;
        background: #F22C2C;
        border-radius: 13px;
        margin-right: 10px;
      }
      .status-icon-gray {
        width: 8px;
        height: 8px;
        background: rgba(0, 0, 0, 0.15);
        border-radius: 13px;
        margin-right: 10px;
      }
      .msg_content {
        display: flex;
        flex-direction: column;
        width: calc(100% - 20px);
        cursor: pointer;
        .wordnowrap {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .msg_content_title {
          font-size: 14px;
          font-weight: 600;
          color: #000000;
          margin-bottom: 9px;
        }
        .msg_content_txt {
          height: 20px;
          font-size: 14px;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.6);
          margin-bottom: 9px;
        }
      }
    }
    .moreMsg {
      height: 46px;
      border-top: 1px solid rgba(0, 0, 0, 0.06);
      padding-top: 12px;
      box-sizing: border-box;
      cursor: pointer;
      color: rgba(0, 0, 0, 0.87);
      font-size: 14px;
      .el-divider--vertical {
        height: 100%;
      }
      .moreMsg_item {
        flex: 1;
        display: flex;
        justify-content: center;
        &.is-disabled {
          cursor: no-drop;
        }
      }
    }
  }
   .noDataWrapper {
    margin: 50px 0;
    .noData {
      margin: 50px auto;
      background-image: url("/static/img/noData_table.png");
      width: 234px;
      height: 224px;
      background-size: 100%;
      background-repeat: no-repeat;
      padding: 0;
    }
    .noData_text {
      font-size: 14px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.45);
      margin-top: 20px;
    }
  }

  .switchType{
    cursor: pointer;
    text-align: center;
    height: 48px;
      line-height: 48px;
    }
</style>

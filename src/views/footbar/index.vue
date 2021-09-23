<template>
  <!--底栏-->
  <div>
    <!-- 页面底部 -->
    <el-row class="footer">
      <el-col :span="3">
        <el-dropdown placement="bottom-start">
          <span class="el-dropdown-link cursor">
            <i class="el-icon-s-custom mr5"></i>{{roleName}} 欢迎您!
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>当前医院：{{hospitalName}}</el-dropdown-item>
            <el-dropdown-item>当前角色：{{roleName}}</el-dropdown-item>
            <el-dropdown-item>当前账号：{{currentUser}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
      <!-- <el-col :span="2" class="cursor login-out">
        <span @click="dialogVisible = true">退出系统</span>
      </el-col> -->
      <el-col :span="8">
        <div class="deviceMsg"><span>当前连接设备&nbsp;:&nbsp;</span><span>{{deviceData.parma.company}}{{deviceData.parma.code}}</span></div>
      </el-col>
      <el-col :span="10">版权所有:武汉明德生物科技股份有限公司</el-col>
      <el-col :span="3" class="alignr">版本号：3.0</el-col>
<!--      <el-col :span="3" class="alignr">版本号：{{version}}</el-col>-->
    </el-row>
    <!-- 退出登录弹框 -->
    <!-- <el-dialog :visible.sync="dialogVisible" :modal-append-to-body="true"  width="600px" class="dialog-position" >
        <span class="g-t-black">是否确定退出当前账号?</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false" class="login-out-btn login-out-cancel common-btn">取 消</el-button>
          <el-button @click="loginOut" class="login-out-btn login-out-sure common-btn">退出登录</el-button>
        </span>
    </el-dialog> -->
  </div>

</template>
<style lang="scss">
  .footer {
    width: 100%;
    padding: 0 10px;
    position: fixed !important;
    z-index: 1000;
    bottom: 0;
    height: 40px;
    line-height: 40px;
    color: #606266;
    background-color: #cce6ff;

    .login-out {
      color: #1890ff;
    }
  }
</style>
<script>
  import {App} from "nw.gui";
  import {getSessionData, removeSessionData} from "@/utils/SimpleSessionStorageService.js";
  import * as localStorageService from '@/utils/SimpleLocalStorageService.js';
  import eventBus from "@/utils/eventBus.js"
  const {
    manifest
  } = App;
  export default {
    name: "footbar",
    data() {
      return {
        currentUser: "",
        hospitalName: "",
        version: manifest.version,
        onLine: navigator.onLine,
        dialogVisible: false, //弹出退出登录弹框
        roleName: "",
        rolId: "",
        deviceData:{
          parma:{
            company:'',
            code:''
          },
          value:''
        }
      };
    },
    created() {
      console.group('%c%s', 'color:green',"---created: src/views/all/footbar/index.vue");
      this.currentUser = getSessionData("currentUser");
      if (window.sessionStorage.getItem('strokeObj')) {
        this.rolId = JSON.parse(window.sessionStorage.getItem('strokeObj')).rolId;
      } else {
        this.rolId = "";
      }
      let loginData = getSessionData("login:" + this.currentUser);
      if (loginData != null) {
        let data = JSON.parse(loginData);
        if (data.respData && data.respData.mdHospital) {
          this.hospitalName = data.respData.mdHospital.hospitalName;
        }
      }
      this.getRoleName();
    },
    watch: {
      onLine() {
        console.log(this.onLine)
      }
    },
    mounted() {
      window.addEventListener("online", this.updateOnlineStatus);
      window.addEventListener("offline", this.updateOnlineStatus);
      let deviceData = JSON.parse(localStorageService.getData('setPrint'))
      if(deviceData && deviceData.parma && deviceData.parma.company && deviceData.parma.code){
        this.deviceData.parma.company = deviceData.parma.company
        this.deviceData.parma.code = deviceData.parma.code
      }
      let _this = this
      eventBus.$on('getDeviceMsg', args => {
        _this.deviceData =JSON.parse(args)
      })
    },
    beforeDestroy () {
      console.group('%c%s', 'color:green',"---beforeDestroy: src/views/all/footbar/index.vue");
      window.removeEventListener('online', this.updateOnlineStatus);
      window.removeEventListener('offline', this.updateOnlineStatus);
      eventBus.$off('getDeviceMsg');
      this.onLine = null;
    },
    methods: {
      updateOnlineStatus(e) {
        const {
          type
        } = e;
        this.onLine = type === "online";
      },
      // 退出系统
      loginOut() {
        var that = this;
        that.isShowLoginOut = true;
        removeSessionData("currentUser");
        removeSessionData("login:" + that.currentUser);
        that.$router.push({
          path: "/"
        });
      },
      getRoleName() {
        // if(this.rolId==2){
        //   this.roleName = "急诊科"
        // }else if(this.rolId==3){
        //   this.roleName = "急诊医生"
        // }else if(this.rolId==5){
        //   this.roleName = "卒中团队"
        // }else if(this.rolId==6){
        //   this.roleName = "基层医务"
        // }else if(this.rolId==9){
        //   this.roleName = "介入团队"
        // }else if(this.rolId==13){
        //   this.roleName = "影像科"
        // }else if(this.rolId==15){
        //   this.roleName = "检验科"
        // }else if(this.rolId==16){
        //   this.roleName = "医务协助人员"
        // }
        // 急诊的逻辑去除
        // if (window.sessionStorage.getItem('emergencyObj')) {  // 急诊分诊
        //   this.roleName = JSON.parse(window.sessionStorage.getItem('emergencyObj')).roleName;
        // } else {
          if (window.sessionStorage.getItem('strokeObj')) {  // 卒中
            this.roleName = JSON.parse(window.sessionStorage.getItem('strokeObj')).roleName;
          } else {
            if (window.sessionStorage.getItem('smgUserObj')) { // 胸痛
              this.roleName = JSON.parse(window.sessionStorage.getItem('smgUserObj')).roleName;
            } else {
              if (window.sessionStorage.getItem('traumaObj')) { // 创伤
                this.roleName = JSON.parse(window.sessionStorage.getItem('traumaObj')).roleName;
              }else{
                if (window.sessionStorage.getItem('digestObj')) { // 消化道
                  this.roleName = JSON.parse(window.sessionStorage.getItem('digestObj')).roleName;
                }
              }
            }
          }
        }
      // }
    }
  };

</script>

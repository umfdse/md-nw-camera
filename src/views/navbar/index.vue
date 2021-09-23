<template>
  <div class="nav">
    <!--头部导航栏-->
    <el-row>
      <el-menu :default-active="activeIndex" class="el-menu-demo" @select="handleSelect"
               text-color="#fff" active-text-color="#ffd04b">
        <el-menu-item v-for="(item, index) in leftNavItems" :index="item.code" :key="index">
          <div class="menuItemWrapper" v-if="item.show">
            <img :src="item.src"/>
            <p class="alignc">{{item.menuName}}</p>
          </div>
        </el-menu-item>
      </el-menu>
    </el-row>
  </div>
</template>
<style lang="scss">
  @media screen and (max-width: 1440px) {
    .nav {
      .el-menu {
        // padding-top: 5px;

        .el-menu-item {
          padding: 0 30px !important;

          img {
            width: 30px;
          }
        }

        .el-menu-item,
        .el-submenu__title {
          height: 48px;
        }
      }
    }
  }

  @media screen and (min-width: 1440px) {
    .nav {
      .el-menu {
        // padding-top: 10px;

        .el-menu-item {
          padding: 0 40px !important;
          width: 150px;

          img {
            width: 30px;
          }
        }

        .el-menu-item,
        .el-submenu__title {
          height: 48px;
        }
      }
    }
  }

  .nav {
    .el-menu {
      display: flex;
      display: -moz-flex;
      display: -webkit-flex;
      justify-content: space-between;
      -webkit-justify-content: space-between;
      -moz-justify-content: space-between;
      background: linear-gradient(180deg, #3555ff 0%, #2991f1 100%);
      border-right: none;
      font-weight: 500;
      padding-right: 200px;

      .el-menu-item {
        padding: 0 20px !important;
        color: #fff !important;
        display: flex;
        align-items: center;
        justify-content: center;

        p {
          font-family: 'Microsoft Yahei', Arial, sans-serif;
          line-height: 20px;
          /* font-size: 16px; */
          display: inline-block;
        }

        img {
          display: inline-block;
          width: 30px;
          height: 30px;
        }

        &.is-active {
          background: linear-gradient(360deg, rgba(255, 255, 255, 0.5) 0%, rgba(24, 144, 255, 0) 100%);
        }
      }

      .el-menu-item:focus,
      .el-menu-item:hover {
        background: linear-gradient(360deg, rgba(255, 255, 255, 0.5) 0%, rgba(24, 144, 255, 0) 100%);
      }
    }
  }

</style>
<script>
  import eventBus from "@/utils/eventBus.js"
  import {getSessionData} from "@/utils/SimpleSessionStorageService.js";
  // import response from './queryNavMenus'
  export default {
    name: "navbar",
    data() {
      return {
        activeIndex: "",
        leftNavItems: [],
        clickDj: false, //点击数据统计
        strokeRolId: '', // stroke 角色Id
        oneShow:false,
        twoShow:false,
        threeShow:false,
        fourShow:false,
        fiveShow:false,
        sixShow:false,
        type:"护士端",
        datalist:[],
      };
    },
    watch: {
      clickDj: function (newVal, oldVal) {
        if (newVal) {
          this.activeIndex = "";
        }
      },
    },
    created() {
        
       let arrayPessions =getSessionData("menuPerms")
      // let arrayPessions = menuPessions.split(",")
      console.log(arrayPessions)
      if(getSessionData("userType")==3){
          this.type="医生端"
          if(arrayPessions.indexOf("patient:view")>0){
            this.oneShow = true
          }
          if(arrayPessions.indexOf("report:view")>0){
            this.fiveShow = true
          }
           if(arrayPessions.indexOf("dept:view")>0){
            this.sixShow = true
          }
          if(arrayPessions.indexOf("sys:view")>0){
            this.fourShow = true
          } 
      }else if(getSessionData("userType")==4){
          this.type="护士端"
           if(arrayPessions.indexOf("patient:view")>0){
            this.oneShow = true
          }
          if(arrayPessions.indexOf("advice:view")>0){
            this.twoShow = true
          }
           if(arrayPessions.indexOf("dept:view")>0){
            this.threeShow = true
          }
          if(arrayPessions.indexOf("sys:view")>0){
            this.fourShow = true
          } 
      }
     
      
     
      if(getSessionData("roleCodes").indexOf("ADMIN")>-1){
        this.oneShow = true
        this.twoShow = true
        this.threeShow = true
        this.fourShow = true
      }
      //临时使用根据用户类型显示菜单栏
      // if(getSessionData("userType")==3){
      //         this.oneShow = true
      //         this.twoShow = false
      //         this.threeShow = false
      //         this.fourShow = true
      //         this.sixShow = true
      //         this.fiveShow = true
      // }else if(getSessionData("userType")==4){
      //         this.oneShow = true
      //         this.twoShow = true
      //         this.threeShow = true
      //         this.fourShow = true
      //         this.fiveShow = false
      //          this.sixShow = false
      // }
      console.log(this.oneShow,this.twoShow,this.threeShow,this.fourShow,this.fiveShow, this.sixShow)
      console.group('%c%s', 'color:green', "--created:src/views/all/navbar/index.vue");
      // if (window.sessionStorage.getItem('strokeObj')) {
      //   this.strokeRolId = JSON.parse(window.sessionStorage.getItem('strokeObj')).rolId;
      // }
      // 初始设置头部默认菜单
      this.getRoleMenuFake();
      // 监听缓存
      window.addEventListener('setItem', this.setItemHandler)
    },
    mounted(){
      eventBus.$on('getTarget', target => {  
            console.log(target); 
            this.type = target
            if(target=="医生端"){
                  this.oneShow = true
                  this.twoShow = false
                  this.threeShow = false
                  this.fourShow = true
                  this.sixShow = true
                  this.fiveShow = true
            }else if(target=="护士端"){
                  this.oneShow = true
                  this.twoShow = true
                  this.threeShow = true
                  this.fourShow = true
                  this.fiveShow = false
                  this.sixShow = false
            }
             this.getRoleMenuFake();
            console.log(this.oneShow ,this.twoShow ,this.threeShow,this.fourShow,this.fiveShow)
        });
      // let arrayPessions =getSessionData("menuPerms")
      // // let arrayPessions = menuPessions.split(",")
      // console.log(arrayPessions)
      // if(arrayPessions.indexOf("card:view")>0){
      //     this.oneShow = true
      // }
      // if(arrayPessions.indexOf("advice:view")>0){
      //   this.twoShow = true
      // }
      // if(arrayPessions.indexOf("dept:view")>0){
      //   this.threeShow = true
      // }
      // if(arrayPessions.indexOf("sys:view")>0){
      //   this.fourShow = true
      // }
      // console.log(this.oneShow,this.twoShow,this.threeShow,this.fourShow)
    },
    beforeDestroy() {
      console.group('%c%s', 'color:green', "--beforeDestroy:src/views/all/navbar/index.vue");
      //清理缓存事件
      window.removeEventListener('setItem', this.setItemHandler);
    },

    methods: {
      setItemHandler() {
        let newVal = sessionStorage.getItem('watchStorage');
        console.log('%c%s', 'color:green', newVal);
        if (newVal === 'true') {
          this.activeIndex = 'c4';
        }
      },
      // 切换头部导航
      handleSelect(code) {
        this.clickDj = false;
        // this.activeIndex = code;
        console.log(code)
        let item = this.leftNavItems.find(item => item.code === code);
        if(item) {
          this.$router.replace({
            path: item.url
          });
        }
        if(code!='c1'){
          sessionStorage.removeItem('activeName_patientTab')
        }
      },
      getRoleMenuFake() {
        if(this.type=="医生端"){
          this.datalist = [
            {
                "code": "c1",
                "menuName": "患者管理",
                "order": 1,
                "url": "/patient/list",
                "show": this.oneShow
            },
             {
                "code": "c6",
                "menuName": "科室管理",
                "order": 6,
                "url": "/departmentDoctor",
                "show": this.sixShow
            },
              {
                "code": "c5",
                "menuName": "数据管理",
                "order": 5,
                "url": "/dataManage",
                "show": this.fiveShow
            },
             {
                "code": "c4",
                "menuName": "系统管理",
                "order": 4,
                "url": "/system",
                "show": this.fourShow
            }
          ];
        }else if(this.type=="护士端"){
          this.datalist = [
            {
                "code": "c1",
                "menuName": "患者管理",
                "order": 1,
                "url": "/patient",
                "show": this.oneShow
            },
            {
                "code": "c2",
                "menuName": "医嘱管理",
                "order": 2,
                "url": "/doctorAdvice",
                "show": this.twoShow
            },
            {
                "code": "c3",
                "menuName": "科室管理",
                "order": 3,
                "url": "/department",
                "show": this.threeShow
            },
            //  {
            //     "code": "c6",
            //     "menuName": "科室管理",
            //     "order": 6,
            //     "url": "/departmentDoctor",
            //     "show": this.sixShow
            // },
            //   {
            //     "code": "c5",
            //     "menuName": "数据管理",
            //     "order": 5,
            //     "url": "/dataManage",
            //     "show": this.fiveShow
            // },
             {
                "code": "c4",
                "menuName": "系统管理",
                "order": 4,
                "url": "/system",
                "show": this.fourShow
            }
          ];
        }
          // let datalist = [
          //   {
          //       "code": "c1",
          //       "menuName": "患者管理",
          //       "order": 1,
          //       "url": "/patient",
          //       "show": this.oneShow
          //   },
          //   {
          //       "code": "c2",
          //       "menuName": "医嘱管理",
          //       "order": 2,
          //       "url": "/doctorAdvice",
          //       "show": this.twoShow
          //   },
          //   {
          //       "code": "c3",
          //       "menuName": "科室管理",
          //       "order": 3,
          //       "url": "/department",
          //       "show": this.threeShow
          //   },
          //    {
          //       "code": "c6",
          //       "menuName": "科室管理",
          //       "order": 6,
          //       "url": "/departmentDoctor",
          //       "show": this.sixShow
          //   },
          //     {
          //       "code": "c5",
          //       "menuName": "数据管理",
          //       "order": 5,
          //       "url": "/dataManage",
          //       "show": this.fiveShow
          //   },
          //    {
          //       "code": "c4",
          //       "menuName": "系统管理",
          //       "order": 4,
          //       "url": "/system",
          //       "show": this.fourShow
          //   }
          // ];
          this.leftNavItems = [];
          let datalist=this.datalist.filter((item,index)=>{
            return item.show != false
          })
          datalist.forEach((e, i) => {
            e.src = global.rootPath + "/static/img/menu_icon" + e.code + ".png";
            this.leftNavItems.push(e)
          });
          console.log(this.leftNavItems)
          this.activeIndex = this.leftNavItems[0].code;
          if (window.sessionStorage.getItem('saveGreen') == "true") {
            this.activeIndex = "c1";
            window.sessionStorage.setItem("saveGreen", false);
          }
      },
      getRoleMenu() {
        this.$axios.post(global.url + "/api/nwpc/queryNavMenus", {}, {}).then((response) => {
          let data = response.data;
          console.log("------------------------------ queryNavMenus ---------------------------------")
          console.log(data)
          console.log("------------------------------ queryNavMenus ---------------------------------")
          if (data.msg == 201) {
            let datalist = data.respData;
            this.leftNavItems = [];

            let currentUser = getSessionData("currentUser");
            let hospitalCode ="";
            let loginData = getSessionData("login:" + currentUser);
            if (loginData != null) {
              let data = JSON.parse(loginData);
              if (data.respData && data.respData.hospitalCode) {
                hospitalCode = data.respData.hospitalCode;
              }
            }
            console.log("hospitalCode:"+hospitalCode);

            datalist.forEach((e, i) => {
              e.src = global.rootPath + "/static/img/menu_icon" + e.code + ".png";

              if(hospitalCode == 'VB1001'){
                //伊犁州新华医院
                if(e.code != "c4" && e.code !="c9"){
                    return false;
                }
              }

            });
            console.log(this.leftNavItems)
            this.activeIndex = this.leftNavItems[0].code;
            if (window.sessionStorage.getItem('saveGreen') == "true") {
              this.activeIndex = "c4";
              window.sessionStorage.setItem("saveGreen", false);
            }
          } else {
            this.$message.warning(data.content)
          }
        })


      }
    },
  };

</script>

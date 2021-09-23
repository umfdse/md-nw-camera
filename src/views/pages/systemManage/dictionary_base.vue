<template>
  <div class="dictionaryBaseWrapper">
    <div class="dictionaryHeader">
      <el-radio-group v-model="activeName" size="small" @change="handleClick">
        <el-radio-button label="first">床位管理</el-radio-button>
        <el-radio-button label="second">设备管理</el-radio-button>
        <el-radio-button label="third">用户管理</el-radio-button>
        <el-radio-button label="fourth">角色管理</el-radio-button>
      </el-radio-group>
    </div>
    <div class="dictionaryContainer">
      <bedManage v-if="bedShow"></bedManage>
      <deviceManage v-if="deviceShow"></deviceManage>
      <userManage v-if="userShow"></userManage>
      <roleManage v-if="roleShow"></roleManage>
    </div>
  </div>
</template>

<script>
    import BedManage from "./bedManage/index"
    import UserManage from "./userManage/index"
    import DeviceManage from "./deviceManage/index"
    import RoleManage from "./roleManage/index"
  export default {
    components: {BedManage, UserManage, DeviceManage, RoleManage},
    data() {
      return {
        activeName: "first",
        bedShow: true,
        deviceShow:false,
        userShow: false,
        roleShow: false,
        pipeShow: false,
        templateShow:false
      }
    },
    methods: {
      handleClick(tab) {
        if (this.activeName == "first") {
          this.bedShow = true
        } else {
          this.bedShow = false
        }
        if (this.activeName == "second") {
          this.deviceShow = true
        } else {
          this.deviceShow = false
        }
        if (this.activeName == "third") {
          this.userShow = true
        } else {
          this.userShow = false
        }
        if (this.activeName == "fourth") {
          this.roleShow = true
        } else {
          this.roleShow = false
        }
        if (this.activeName == "fifth") {
          this.pipeShow = true;
        } else {
          this.pipeShow = false;
        }
        if (this.activeName == "sixth") {
          this.templateShow = true;
        } else {
          this.templateShow = false;
        }
      }
    }

  }
</script>

<style lang="scss" scoped>
  .dictionaryBaseWrapper {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 24px 0;
    .dictionaryHeader{

    }
    .dictionaryContainer {
      width: 100%;
      height: 100%;
      background: #fff;
      box-sizing: border-box;
    }
  }
</style>

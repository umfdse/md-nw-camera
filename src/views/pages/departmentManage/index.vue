<template>
  <div class="tapsName">
    <div class="tabs_container">
      <el-tabs v-model="activeName" @tab-click="handleClick" class="el-tabs__nav-scroll_one">
        <el-tab-pane label="档案查询" name="first" class="tapsCard">
          <archives v-if="archivesShow" class="archives"></archives>
        </el-tab-pane>
        <el-tab-pane label="交班管理" name="second">
          <turnWork v-if="workShow" :activeNameTwo="activeNameTwo"></turnWork>
        </el-tab-pane>
        <el-tab-pane label="排班管理" name="third">
          <scheduling v-if="schedulingShow"></scheduling>
        </el-tab-pane>
        <el-tab-pane label="数据统计" name="fourth">
          <dataSta v-if="dataStaShow"></dataSta>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import Archives from "./archives/index";
import TurnWork from "./turnWork/index";
import Scheduling from "./scheduling/index";
import DataSta from "./dataStatistics/index";
export default {
  components: { Archives, TurnWork, Scheduling, DataSta },
  data() {
    return {
      activeName: "first",
      archivesShow: true,
      workShow: false,
      schedulingShow: false,
      dataStaShow: false,
      activeNameTwo:'',
    };
  },
  mounted(){
    if(this.$route.query.activeName){
      this.activeName = "second"
      this.activeNameTwo = 'third'
      this.handleClick()
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
      if (this.activeName == "first") {
        this.archivesShow = true;
      } else {
        this.archivesShow = false;
      }
      if (this.activeName == "second") {
        this.workShow = true;
      } else {
        this.workShow = false;
      }
      if (this.activeName == "third") {
        this.schedulingShow = true;
      } else {
        this.schedulingShow = false;
      }
      if (this.activeName == "fourth") {
        this.dataStaShow = true;
      } else {
        this.dataStaShow = false;
      }
    },
  },
};
</script>

<style lang="scss" >
.tapsName {
  width: 100%;
  height: 100%;
  background: #f5f5f5;
  padding: 24px;
  box-sizing: border-box;
  .tabs_container {
    width: 100%;
    height:100%;
    overflow-y: auto;
    background: #fff;
    padding: 0 30px;
    box-sizing: border-box;
    .el-tabs__nav-scroll_one{
      height: 48px!important;
      line-height: 48px;
    }
  }
}
</style>

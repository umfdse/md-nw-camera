<template>
  <div class="patientTabsWrapper">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="患者监测" name="first">
        <patientsMonitor v-if="activeName=='first'" :ref="'tab'+'_1'" :patientInfo="patientInfo"></patientsMonitor>
      </el-tab-pane>
      <el-tab-pane label="重症评分" name="second">
        <severityScore v-if="activeName=='second'" :ref="'tab'+'_2'" :patientInfo="patientInfo"></severityScore>
      </el-tab-pane>
      <el-tab-pane label="治疗管理" name="third">
        <treatManagement v-if="activeName=='third'"  :ref="'tab'+'_3'" :patientInfo="patientInfo"></treatManagement>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import patientsMonitor from './patientsMonitor';
import severityScore from './severityScore';
import treatManagement from './treatManagement';
  export default {
    props: ['patientInfo'],
    components:{patientsMonitor,severityScore,treatManagement},
    data() {
      return {
        activeName: "first",
        currentTab:{},
      }
    },
    mounted(){
        this.activeName=this.$route.query.activeName?this.$route.query.activeName:this.activeName

    },
    watch:{
      patientInfo(newVal,oldVal){
        if(Object.keys(this.currentTab).length!=0){
          console.log(this.currentTab)
          this.handleClick(this.currentTab)
        }else{
          this.init();
        }
      }
    },
    methods: {
      init(){
        this.$nextTick(function(){
          if(this.$route.query.activeName){
            this.$refs['tab_2'].initData();
          }else{
            this.$refs['tab_1'].initData();
          }
         
      })
      },
      handleClick(tab, event) {
        this.currentTab = tab
        let tabIndex = Number(tab.index)+1
        let tabRef = 'tab_'+tabIndex;
        this.$nextTick(()=>{
            if(this.$refs[tabRef]){
            this.$refs[tabRef].initData();
            }
          })
      }
    },
  }
</script>

<style lang="scss">
  .patientTabsWrapper {
    .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
      padding-left: 32px;
    }
    .el-tabs__header{
      margin: 0;
    }
    .el-tabs__content {
      padding: 16px 32px;
    }
  }

</style>

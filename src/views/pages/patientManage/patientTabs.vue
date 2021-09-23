<template>
  <div class="patientTabsWrapper">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="生命体征管理" name="first">
        <tab1 :ref="'tab'+'_1'" :patientInfo="patientInfo"></tab1>
      </el-tab-pane>
      <el-tab-pane label="出入量管理" name="second">
        <tab2 :ref="'tab'+'_2'" :patientInfo="patientInfo"></tab2>
      </el-tab-pane>
      <el-tab-pane label="血糖管理" name="third">
        <tab3 :ref="'tab'+'_3'" :patientInfo="patientInfo"></tab3>
      </el-tab-pane>
      <el-tab-pane label="压疮管理" name="fourth">
        <pressure-sores :ref="'tab'+'_4'" :patientInfo="patientInfo"/>
      </el-tab-pane>
      <el-tab-pane label="管路护理" name="fifth">
        <tab5  :ref="'tab'+'_5'" :patientInfo="patientInfo"></tab5>
      </el-tab-pane>
      <el-tab-pane label="病情记录" name="sixth" >
        <illnessRecords :patientInfo="patientInfo" :ref="'tab'+'_6'"></illnessRecords>
      </el-tab-pane>
      <el-tab-pane label="护理评分" name="seventh" >
        <nursing-grading :ref="'tab'+'_7'" :patientInfo="patientInfo"/>
      </el-tab-pane>
      <el-tab-pane label="护理记录" name="eighth" >
        <!-- <nursing-records v-if="nursingRecordShow"  /> -->
        <iframe v-if="nursingRecordShow"   :ref="'myiframe'"   class="ifa" scrolling=auto  :src="routerSrc" width="100%" height="1000px" frameborder="0"></iframe>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import {getSessionData} from "@/utils/SimpleSessionStorageService"
import illnessRecords from './tab/tab6/illnessRecords'
import NursingGrading from './components/nursingGrading.vue'
import PressureSores from './components/pressureSores.vue'
import tab1 from './tab/tab1';
import tab2 from './tab/tab2';
import tab3 from './tab/tab3';
import tab5 from './tab/tab5';
  export default {
    props: ['patientInfo'],
    components:{illnessRecords, PressureSores, NursingGrading,tab1,tab2,tab3,tab5},
    data() {
      return {
        activeName: "first",
        nursingRecordShow:false,
        currentTab:{},
        iframeWin:null,
        routerSrc:"",

      }
    },
    mounted(){
      this.routerSrc = "../../../../../../static/demo/demo2.html"+"?_="+new Date().getTime()
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
      
      sendMessage(){
        let params={
          url:global.url,
          token:getSessionData("token"),
          patientRecordId:this.patientInfo.record.recordId,
          archivesid:this.patientInfo.archivesid
        }
              this.iframeWin.postMessage(params, '*')
            },


      init(){
        this.$nextTick(function(){
         this.$refs['tab_1'].initData();
      })
      },
      handleClick(tab, event) {
        this.currentTab = tab
        let tabIndex = Number(tab.index)+1
        let tabRef = 'tab_'+tabIndex;
        if(this.$refs[tabRef]){
          this.$nextTick(()=>{
            this.$refs[tabRef].initData();
          })
        }
        if(this.activeName=="eighth"){
          this.nursingRecordShow = true
          console.log(this.patientInfo.record.recordId)
          // this.iframeWin=this.$refs.myiframe.contentWindow
          //   this.sendMessage()
          let that = this
          setTimeout(()=>{
                that.iframeWin=that.$refs.myiframe.contentWindow
            that.sendMessage()
          },1000)
          

        
        }else{
          this.nursingRecordShow = false
        }
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

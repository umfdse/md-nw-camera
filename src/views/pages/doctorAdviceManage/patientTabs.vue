<template>
  <div class="patientTabsWrapper">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="医嘱" name="first" >
        <longTerm v-if="longTermShow" :ref="'tab'+'_1'"></longTerm>
      </el-tab-pane>
      <el-tab-pane label="临时医嘱" name="second">
        <temporary v-if="temporaryShow" :ref="'tab'+'_2'"></temporary>
      </el-tab-pane>
       <el-tab-pane label="原始遗嘱" name="third">
        <notSplit v-if="notSplitShow" :ref="'tab'+'_3'"></notSplit>
      </el-tab-pane>
       <el-tab-pane label="已拆分医嘱" name="fouth">
        <splited v-if="splitedShow" :ref="'tab'+'_4'"></splited>
      </el-tab-pane>
     
    </el-tabs>
  </div>
</template>

<script>
import longTerm from "./long_term/index"
import Temporary from "./temporary/index"
import NotSplit from "./notSplit_term/index"
import Splited from "./splited_term/index"
  export default {
    props: ['patientInfo'],
    components:{
      longTerm,
      Temporary,
      NotSplit,
      Splited
    },
    data() {
      return {
        activeName: "first",
        longTermShow:true,
        temporaryShow:false,
        notSplitShow:false,
        splitedShow:false,
        currentTab:{},
      }
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
    mounted(){
      console.log(this.patientInfo)
    },
    methods: {
      init(){
        this.$nextTick(function(){
         this.$refs['tab_1'].loadData();
      })
      },
      handleClick(tab, event) {
        console.log(tab, event)
        this.currentTab = tab
         let tabIndex = Number(tab.index)+1
        let tabRef = 'tab_'+tabIndex;
        if(this.$refs[tabRef]){
          this.$nextTick(()=>{
            this.$refs[tabRef].loadData();
          })
        }
        if(this.activeName=="first"){
          this.longTermShow=true
        }else{
           this.longTermShow=false
        }
        if(this.activeName=="second"){
          this.temporaryShow=true
        }else{
           this.temporaryShow=false
        }
        if(this.activeName=="third"){
          this.notSplitShow=true
        }else{
           this.notSplitShow=false
        }
        if(this.activeName=="fouth"){
          this.splitedShow=true
        }else{
           this.splitedShow=false
        }
      }
    }

  }
</script>

<style lang="scss">
  .patientTabsWrapper {
    .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
      padding-left: 32px;
    }
    .el-tabs__content {
      padding: 16px 32px;
    }
  }

</style>

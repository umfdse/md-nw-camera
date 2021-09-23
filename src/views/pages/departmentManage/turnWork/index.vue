<template>
<div class="turnWork_container">
     <el-tabs v-model="activeName" type="card" @tab-click="handleClick" class="">
    <el-tab-pane label="科室交班" name="first">
        <departmentTurnWork v-if="departmentShow"></departmentTurnWork>
    </el-tab-pane>
    <el-tab-pane label="重点患者交班" name="second">
        <keyPatient v-if="keyPatientShow"></keyPatient>
    </el-tab-pane>
    <el-tab-pane label="交班记录查询" name="third">
        <viewTurnWork v-if="viewShow"></viewTurnWork>
    </el-tab-pane>
  </el-tabs>
  </div>
</template>

<script>
import DepartmentTurnWork from "./department_turnWork/index"
import KeyPatient from "./keyPatient_turnWork/index"
import viewTurnWork from "./view_turnWork/index"
export default {
    components:{
DepartmentTurnWork,KeyPatient,viewTurnWork
    },
    props:{
      activeNameTwo:String
    },
    data(){
        return{
            activeName:"first",
            departmentShow:true,
            keyPatientShow:false,
            viewShow:false,

        }
    },
    mounted(){
      if(this.activeNameTwo){
        this.activeName = 'third'
        this.handleClick()
      }
    },
    methods:{
        handleClick(tab, event){
             if(this.activeName=="first"){
                    this.departmentShow = true
                  }else{
                    this.departmentShow = false
                  }
                  if(this.activeName=="second"){
                    this.keyPatientShow =true
                  }else{
                     this.keyPatientShow =false
                  }
                  if(this.activeName=="third"){
                    this.viewShow =true
                  }else{
                    this.viewShow =false
                  }
        }
    }
}
</script>

<style lang="scss" >
    .turnWork_container{
      margin-top:24px;
        // padding-left:30px;
      .el-tabs__nav-scroll{
        height: 32px!important;
        
        .el-tabs__item {
          height: 32px!important;
          line-height: 32px;
        }
        .el-tabs__nav{
           height: 32px!important;
          line-height: 32px;
        }
      }
    }
</style>
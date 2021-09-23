<template>
  <div class="routine_container">
     <el-tabs v-model="activeName" type="card" @tab-click="handleClick" class="">
    <el-tab-pane label="图表" name="first">
        <routineIcon v-if="iconShow"></routineIcon>
    </el-tab-pane>
    <el-tab-pane label="表格" name="second">
        <routineForm v-if="formShow"></routineForm>
    </el-tab-pane>
  </el-tabs>
  </div>
</template>

<script>
import RoutineIcon from "./routineIcon/index"
import RoutineForm from "./routineForm/index"
export default {
    components:{RoutineIcon,RoutineForm},
    data(){
        return{
             iconShow:true,
            formShow:false,
            activeName:"first",
        }
    },
     mounted(){
      console.log(this.searchData)
    },
    methods:{
        handleClick(tab, event){
            console.log(tab, event)
             if(this.activeName=="first"){
                    this.iconShow = true
                  }else{
                    this.iconShow = false
                  }
                  if(this.activeName=="second"){
                    this.formShow =true
                  }else{
                     this.formShow =false
                  }
        }
    }
}
</script>

<style lang="scss">
    .routine_container{
        margin-top:16px;
    }
</style>
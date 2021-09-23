<template>
  <div class="healCommission_container">
     <el-tabs v-model="activeName" type="card" @tab-click="handleClick" class="">
    <el-tab-pane label="图表" name="first">
        <healCommissionIcon v-if="iconShow"></healCommissionIcon>
    </el-tab-pane>
    <el-tab-pane label="表格" name="second">
        <healCommissionForm v-if="formShow"></healCommissionForm>
    </el-tab-pane>
  </el-tabs>
  </div>
</template>

<script>
import HealCommissionIcon from "./healCommissionIcon/index"
import HealCommissionForm from "./healCommissionForm/index"
export default {
    components:{HealCommissionIcon,HealCommissionForm},
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
    .healCommission_container{
        margin-top:16px;
    }
</style>
<template>
  <div class="levelThree_container">
     <el-tabs v-model="activeName" type="card" @tab-click="handleClick" class="">
    <el-tab-pane label="图表" name="first">
        <levelThreeIcon v-if="iconShow"></levelThreeIcon>
    </el-tab-pane>
    <el-tab-pane label="表格" name="second">
        <levelThreeForm v-if="formShow"></levelThreeForm>
    </el-tab-pane>
  </el-tabs>
  </div>
</template>

<script>
import LevelThreeIcon from "./levelThreeIcon/index"
import LevelThreeForm from "./levelThreeForm/index"
export default {
    components:{LevelThreeIcon,LevelThreeForm},
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
    .levelThree_container{
        margin-top:16px;
    }
</style>
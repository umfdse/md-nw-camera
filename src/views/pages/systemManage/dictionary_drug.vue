<template>
  <div class="dictionaryBaseWrapper">
    <div class="dictionaryHeader">
      <el-radio-group v-model="activeName" size="small" @change="handleClick">
        <el-radio-button label="1">抗生素字典</el-radio-button>
        <el-radio-button label="2">毒麻精字典</el-radio-button>
        <el-radio-button label="3">泵入药字典</el-radio-button>
        <el-radio-button label="4">血制品字典</el-radio-button>
        <el-radio-button label="10">其他特殊药物字典</el-radio-button>
      </el-radio-group>
    </div>
    <div class="dictionaryContainer">
      <antibioticsManage :drugType="drugType" ref="antibioticsManage"></antibioticsManage>
    </div>
  </div>
</template>

<script>
  import antibioticsManage from "./antibioticsManage/index"
  export default {
    components: {antibioticsManage},
    data() {
      return {
        activeName: "1",
        antibioticsShow: true,
        drugType:1
      }
    },
    mounted(){
      this.handleClick(1)
    },
    methods: {
      handleClick(val) {
        this.drugType = val
        this.$refs['antibioticsManage'].initData(this.drugType)
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

<template>
  <div class="dictionaryBaseWrapper">
    <div class="dictionaryHeader">
      <el-radio-group v-model="activeName" size="small" @change="handleClick">
        <el-radio-button label="first">观察项维护</el-radio-button>
        <el-radio-button label="second">导管维护</el-radio-button>
        <el-radio-button label="third">出入量维护</el-radio-button>
        <el-radio-button label="fifth">护理模板维护</el-radio-button>
        <el-radio-button label="sixth">抢救模板管理</el-radio-button>
        <el-radio-button label="seventh">床旁护理操作字典</el-radio-button>
        <el-radio-button label="eighth">基础医嘱字典</el-radio-button>
        <el-radio-button label="nine">药品剂量转换</el-radio-button>
      </el-radio-group>
    </div>
    <div class="dictionaryContainer">
      <obserVation v-if="obserShow"></obserVation>
      <pipeManage v-if="pipeShow"></pipeManage>
      <nursingTemplate v-if="nursingTemplateShow"></nursingTemplate>
      <rescueTemplate v-if="rescueTemplateShow"></rescueTemplate>
       <basicOrder v-if="basicOrderShow"></basicOrder>
        <drugDose v-if="drugDoseShow"></drugDose>
    </div>
  </div>
</template>

<script>
  import pipeManage from "./pipeManage/index"
  import nursingTemplate from "./templateManage/nursingTemplate"
  import rescueTemplate from "./templateManage/rescueTemplate"
  import obserVation from "./observation/index"
  import basicOrder from "./basicOrder/index"
  import drugDose from "./drugDose/index"
  export default {
    components: {pipeManage, nursingTemplate,rescueTemplate,obserVation,basicOrder,drugDose},
    data() {
      return {
        activeName: "first",
        pipeShow: false,
        nursingTemplateShow:false,
        rescueTemplateShow:false,
        obserShow:true,
        basicOrderShow:false,
        drugDoseShow:false,
      }
    },
    methods: {
      handleClick(tab) {
        if(this.activeName=="first"){
          this.obserShow = true;
        }else{
          this.obserShow = false;
        }
        if (this.activeName == "second") {
          this.pipeShow = true;
        } else {
          this.pipeShow = false;
        }
        if (this.activeName == "fifth") {
          this.nursingTemplateShow = true;
        } else {
          this.nursingTemplateShow = false;
        }
        if (this.activeName == "sixth") {
          this.rescueTemplateShow = true;
        } else {
          this.rescueTemplateShow = false;
        }
        if (this.activeName == "eighth") {
          this.basicOrderShow = true;
        } else {
          this.basicOrderShow = false;
        }
         if (this.activeName == "nine") {
          this.drugDoseShow = true;
        } else {
          this.drugDoseShow = false;
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

    .dictionaryContainer {
      width: 100%;
      height: 100%;
      background: #fff;
      box-sizing: border-box;
    }
  }
</style>

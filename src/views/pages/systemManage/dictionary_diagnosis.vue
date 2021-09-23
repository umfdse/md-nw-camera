<template>
  <div class="dictionaryDiagnosisWrapper">
    <div class="switch">
      <el-radio-group v-model="type">
        <el-radio-button
          v-for="(item, index) in typeList"
          :key="index"
          :label="item.value"
          >{{ item.text }}</el-radio-button>
      </el-radio-group>
    </div>
    <div v-if="type==1">
      <icd9></icd9>
    </div>
    <div v-if="type==2">
      <icd10></icd10>
    </div>
  </div>
</template>

<script>
import icd9 from "./diagnosis/icd9"
import icd10 from "./diagnosis/icd10"
export default {
  name: "base_dictionary",
  watch:{
    type(newValue,old){

    }
  },
  components:{
    icd9,icd10
  },
  data() {
    return {
      tempColumn:[],
      typeList: [
        { text: "ICD-9手术名称", value: 1 },
        { text: "ICD-10诊断编码", value: 2 },
      ],
      type: 1,
    };
  },
  methods: {

  },
};
</script>

<style lang="scss">
.dictionaryDiagnosisWrapper {
   .el-table th {
    background: rgba(0, 0, 0, 0.02);
    color: rgba(0, 0, 0, 0.87);
  }
  .switch {
    padding: 24px 0;
    .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      background-color: transparent;
      color: #1f71ff;
      border-color: #1f71ff;
    }
  }
  .pageSearch {
    display: flex;
    padding: 0 !important;
    align-items: center;
    margin-bottom: 20px;
    .obserInput {
      width: 224px;
      margin-right: 10px;
    }
    .searchIcon {
      margin-top: 9px;
      cursor: pointer;
    }
  }
  .noData {
    margin: 0 auto;
    background-image: url("/static/img/noData_table.png");
    width: 234px;
    height: 224px;
    background-size: 100%;
    background-repeat: no-repeat;
    padding: 0;
    margin-top: 50px;
  }
}
</style>

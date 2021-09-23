<template>
  <div class="system_page">
    <div class="system_container">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="基础维护" name="first">
          <dictionaryBase v-if="baseShow"></dictionaryBase>
        </el-tab-pane>
        <el-tab-pane label="诊断字典" name="second">
          <dictionaryDiagnosis v-if="diagnosisShow"></dictionaryDiagnosis>
        </el-tab-pane>
        <el-tab-pane label="护理字典维护" name="third">
          <dictionaryNursing v-if="nursingShow"></dictionaryNursing>
        </el-tab-pane>
        <el-tab-pane label="药品字典维护" name="fourth">
          <dictionaryDrug v-if="drugShow"></dictionaryDrug>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import dictionaryBase from "./dictionary_base"
import dictionaryDiagnosis from "./dictionary_diagnosis"
import dictionaryNursing from "./dictionary_nursing"
import dictionaryDrug from "./dictionary_drug"
  export default {
    components: {dictionaryBase,dictionaryDiagnosis,dictionaryNursing,dictionaryDrug},
    data() {
      return {
        activeName: "first",
        baseShow: true,
        diagnosisShow: false,
        nursingShow: false,
        drugShow: false
      }
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
        if (this.activeName == "first") {
          this.baseShow = true
        } else {
          this.baseShow = false
        }
        if (this.activeName == "second") {
          this.diagnosisShow = true
        } else {
          this.diagnosisShow = false
        }
        if (this.activeName == "third") {
          this.nursingShow = true
        } else {
          this.nursingShow = false
        }
        if (this.activeName == "fourth") {
          this.drugShow = true
        } else {
          this.drugShow = false
        }
      }
    }

  }
</script>

<style lang="scss" scoped>
  .system_page {
    width: 100%;
    height: 100%;
    background: #F5F5F5;
    padding: 24px;
    box-sizing: border-box;
    .system_container {
      width: 100%;
      height: 100%;
      overflow-y: auto;
      background: #fff;
      padding: 0 32px;
      box-sizing: border-box;
    }

  }

</style>

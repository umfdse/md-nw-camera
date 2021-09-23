<template>
  <el-form-item
    :label="type === 'only' ? '' : config.question"
    :prop="config.question"
    :class="{checkRadioSty:type != 'only'} "
  >
    <el-radio-group
      v-if="config.type === 'radio'"
      v-bind="$attrs"
      v-on="$listeners"
      
    >
      <el-radio  
        v-for="(item, index) in config.options"
        :key="index"
        :label="item"
        :class="{ radioOnlyItem: type === 'only' }"
      >
      {{ item.optionText }}
      </el-radio>
    </el-radio-group>
    <el-checkbox-group
      v-if="config.type === 'checkbox'"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <el-checkbox
        v-for="(item, index) in config.options"
        :key="index"
        :label="item"
        :class="{ radioOnlyItem: type === 'only' }"
      >
      {{ item.optionText }}
      </el-checkbox>
    </el-checkbox-group>
  </el-form-item>
</template>

<script>
export default {
  props: {
    config: {
      type: Object,
      require: true,
      default: Object.assign({})
    },
    type: {
      type: String,
      default: ''
    }
  },
  data(){
    return{
      radio:""
    }
  },
  mounted() {
    
  },
  methods:{
    changeRadio(){
       console.log(this.radio)
      console.log(this.config.options)
    }
  }
}
</script>

<style lang="scss">
.radioOnlyItem {
  line-height: 32px;
  // display: block;
  margin-bottom: 14px;
  width: 100%;
  &:last-child{
    margin-bottom: 0;
  }
  .el-radio__label{
    // display: inline-block;
    // // line-height: 20px;
    // white-space: normal;
    width: calc(100% - 38px);
  }
  .el-radio{
    // white-space: normal;
  }
}
.checkRadioSty{
  border-bottom: 1 px solid red;
}
</style>

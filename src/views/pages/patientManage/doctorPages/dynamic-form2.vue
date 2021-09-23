<template>
  <!-- <el-form-item
    :label="type === 'only' ? '' : config.question"
    :prop="config.question"
    class="dynamic-form"
  >
    <el-radio-group
    v-model="radio"
      v-if="config.type === 'radio'"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <el-radio  
        @change="changeRadio"
        v-for="(item, index) in config.options"
        :key="index"
        :label="item.id"
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
  </el-form-item> -->
  <div>
      <el-form-item
        class="dynamic-form"
        :label="arr[0].question"
      >
        <el-radio-group
        v-model="radio"
        >
          <el-radio  
            v-for="(item, index) in arr[0].options"
            :key="index"
            :label="item.id"
            :class="{ radioOnlyItem: arr[0].options.length==1 }"
          >
          {{ item.optionText }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        class="dynamic-form"
        :label="arr[1].question"
      >
        <el-radio-group
        v-model="radio"
        >
          <el-radio  
            v-for="(item, index) in arr[1].options"
            :key="index"
            :label="item.id"
            :class="{ radioOnlyItem: arr[1].options.length==1 }"
          >
          {{ item.optionText }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        class="dynamic-form"
        :label="arr[2].question"
      >
        <el-radio-group
        v-model="radio"
        >
          <el-radio  
            v-for="(item, index) in arr[2].options"
            :key="index"
            :label="item.id"
            :class="{ radioOnlyItem:arr[2].options.length==1}"
          >
          {{ item.optionText }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        class="dynamic-form"
        :label="arr[3].question"
      >
        <el-radio-group
        v-model="radio"
        >
          <el-radio  
            v-for="(item, index) in arr[3].options"
            :key="index"
            :label="item.id"
            :class="{ radioOnlyItem:arr[3].options.length==1 }"
          >
          {{ item.optionText }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        class="dynamic-form"
        :label="arr[4].question"
      >
        <el-radio-group
        v-model="radio"
        >
          <el-radio  
            v-for="(item, index) in arr[4].options"
            :key="index"
            :label="item.id"
            :class="{ radioOnlyItem:arr[4].options.length==1 }"
          >
          {{ item.optionText }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
  </div>
</template>

<script>
export default {
  props: {
    // config: {
    //   type: Object,
    //   require: true,
    //   default: Object.assign({})
    // },
    // type: {
    //   type: String,
    //   default: ''
    // }
    arr:{
      type:Array
    }
  },
  data(){
    return{
      radio:""
    }
  },
  mounted() {
    console.log(this.arr)
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
</style>

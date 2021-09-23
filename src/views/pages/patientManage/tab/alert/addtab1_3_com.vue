<template>
    <div class="unitTab">
        <el-form ref="form" :model="form" label-width="100px">
            <el-col :span="12" v-if="obj.type==1">

            </el-col>
             <el-col :span="12" v-if="obj.type==2">

            </el-col>
             <el-col :span="12" v-if="obj.type==3">
             <el-form-item :label="obj.name+'：'">
                <el-select v-model="form.contentValue" :placeholder="'请选择'+obj.name" size="small">
                    <el-option
                    v-for="item in obj.date"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value">
                    </el-option>
                </el-select>
                </el-form-item>
            </el-col>
             <el-col :span="12" v-if="obj.type==4">
                 <el-form-item :label="obj.name+'：'">
                      <el-input v-model="form.contentValue" :placeholder="'请输入'+obj.name" size="small">
                          <template v-if="obj.unit" slot="suffix">{{obj.unit}}</template>
                      </el-input>  
                  </el-form-item>
            </el-col>
             <el-col :span="12" v-if="obj.type==5">
                <el-form-item :label="obj.name+'：'">
                <el-date-picker
                    v-model="form.contentValue"
                    type="datetime"
                    size="small"
                    placeholder="选择时间"
                    align="left"
                    :default-value="new Date()"
                    style="width: 100%"
                    format="yyyy-MM-dd HH:mm"
                    value-format="yyyy-MM-dd HH:mm"
                    ></el-date-picker>
                </el-form-item>
            </el-col>
        </el-form>
    </div>
</template>
<script>
export default {
    name:'unitTab',
    props:{
        obj:{
        type:Object,
        default:function(){
            return {}
        }
        },
    },
    computed:{
      contentCode:function(){
          return this.obj.value;
      }  
    },
    data(){
      return{
        form:{
            contentValue:""
        },
        options:[]
      }
    },
    methods:{
    }
}
</script>
<style lang="scss">
    .unitTab{

    }
</style>
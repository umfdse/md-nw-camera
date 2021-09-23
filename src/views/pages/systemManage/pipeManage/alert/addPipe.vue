<template>
  <div class="addPipe">
    <el-form ref="form" :model="form" label-width="160px" :rules="rules">
      <el-row>
        <el-col :span="20">
          <el-form-item label="部位：" prop="location">
                <el-select v-model="form.location" placeholder="请选择" @change="changeTypeFun">
                    <el-option v-for="(item,index) in positionLists" :key="index" :label="item.name" :value="item.value">
                    </el-option>
                  </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
              <el-form-item label="导管分类：" prop="type">
                <el-select v-model="form.type" placeholder="请选择" @change="getdangerLevel">
                    <el-option v-for="(item,index) in typeLists" :key="index" :label="item.name" :value="item.value">
                    </el-option>
                  </el-select>
              </el-form-item>
        </el-col>
      </el-row>
        <el-row>
        <el-col :span="20">
          <el-form-item label="危险度：" prop="dangerLevel">
          <el-select v-model="form.dangerLevel" placeholder="请选择">
                    <el-option v-for="(item,index) in options" :key="index" :label="item.name" :value="item.value">
                    </el-option>
                  </el-select>
          </el-form-item>
        </el-col>
      </el-row>
       <el-row>
        <el-col :span="20">
          <el-form-item label="导管名称：" prop="name">
            <el-input
              size="small"
              v-model="form.name"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="管路期限(天)：" prop="limits">
            <el-input
              size="small"
              v-model="form.limits"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
       <el-row>
        <el-col :span="20">
          <el-form-item label="引流液颜色：">
            <el-input
              size="small"
              v-model="form.color"
              placeholder="多种颜色请用逗号分隔"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="引流液性质：">
            <el-input
              size="small"
              v-model="form.property"
              placeholder="多种性质请用逗号分隔"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="addbtn">
          <el-button size="medium" @click="cancel()">取消</el-button>
          <el-button size="medium" @click="addSubmit('form')" type="primary" :disabled="btnDisabled">确定</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "addPipe",
  props:['positionList','typeList'],
  data() {
     let valiRule = {
      int: /^[0-9]\d*$/, //正整数
      decInt: /^\d+$|^\d*\.\d+$/g, //正整数加小数
    };
     let checkLimits=(rule,value,callback)=>{
         if (!valiRule.int.test(value)&&value!=null&&value!='') {
            callback(new Error('请输入正整数'));
          } else {
            if (value < 0) {
              callback(new Error('范围在0-99'));
            } else if(value > 99){
              callback(new Error('范围在0-99'));
            }else {
              callback();
            }
          }
      }
    return {
      btnDisabled: false,
      id:null,
      form: {
        type:'',//分类
        name:'',//名称
        location:'',//部位(mmHG)
        limits:'',//管理期限
        color:'',//引流液颜色
        property:'',//引流液性质
        dangerLevel:''
      },
      options:[
        {name:'低危',value:'1'},
        {name:'中危',value:'2'},
        {name:'高危',value:'3'},
      ],
      rules: {
        location: [{
          required: true,
          trigger: "change",
          message: "部位不能为空",
        }],
         type:[{
          required: true,
          trigger: "change",
          message: "分类不能为空",
        }],
         dangerLevel:[{
          required: true,
          trigger: "change",
          message: "危险度不能为空",
        }],
        name:[
          {
          required: true,
          trigger: "blur",
          message: "名称不能为空",
        },
          {
          max:15,
          trigger: "blur",
          message: "最大长度为15个字符",
        }],
        limits:[{ required: true, trigger: "blur", message: "管理期限不能为空"}, {validator:checkLimits,trigger:'blur'}]
      },
      typeLists:[],
    };
  },
  computed:{
    positionLists:function(){
      return this.positionList;
    }
  },
  created() {

  },
  methods: {
    getdangerLevel(val){
     let level= this.typeLists.filter(function(item,index){
          return item.value==val;
      })
     if(level.length>0){
       this.$set(this.form,'dangerLevel',String(level[0].dangerLevel))
      //  this.form.dangerLevel = level[0].dangerLevel;
     }
    },
    changeTypeFun(val){
        let that = this;
        that.positionLists.forEach(function(item,index){
            if(item.value==val){
              that.typeLists = item.date;
            }
        })
    },
    clearData:function(){
      this.id = null;
      this.form ={
        type:'',//分类
        name:'',//名称
        location:'',//部位(mmHG)
        limits:'',//管理期限
        dangerLevel:'',
        color:'',//引流液颜色
        property:''//引流液性质
      }
      this.$refs['form'].resetFields();
    },
    getInitData(id, flag) {
      let that = this;
      that.id = id;
      let url = "/base/cannula/query/" + that.id;
      this.$axios.get(global.url + url).then(function (res) {
        let list = res.data.respData;
        for (let key in that.form) {
          if (!list[key] && typeof list[key] != "undefined" && list[key] != 0) {
            that.form[key] = list[key];
          } else {
            that.form[key] = String(list[key]);
          }
        }
        that.changeTypeFun(that.form.location);
        that.$set(that.form,'type',that.form.type);
      });
    },
    cancel() {
      this.$emit("submit", 0);
    },
    addSubmit(formName) {
      let that = this;
      that.$refs[formName].validate((valid) => {
        if (valid) {
          let url = "/base/cannula/save";
          that.form.patientRecordId = 1;
          if (that.id) {
            that.form.id = that.id;
          } else {
            that.form.id = null;
          }
          that.$axios.post(global.url + url, that.form).then(function (res) {
            if(res.data.msg==201){
              that.$emit("submit", 1);
              that.$message({
                  message: res.data.content,
                  type: 'success'
                });
            }else if(res.data.msg==302){
              that.$message({
                  message: res.data.content,
                  type: 'info'
                });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss">
.addPipe {
  .el-row .el-form-item__label {
    text-align: right !important;
    width: 160px !important;
  }
  .el-select {
    width: 100%;
  }
  .addbtn {
    padding: 10px 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
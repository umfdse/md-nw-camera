<template>
  <div class="addPipe">
    <el-form ref="form" :model="form" label-width="160px" :rules="rules">
      <el-row>
        <el-col :span="20">
          <el-form-item label="插管部位：" prop="cannulaLocation">
            <el-select
              v-model="form.cannulaLocation"
              placeholder="请选择"
              @change="locationFun">
              <el-option
                v-for="(item, index) in cannulaLocationList"
                :key="index"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="导管分类：" prop="cannulaType">
            <el-select
              v-model="form.cannulaType"
              placeholder="请选择"
              @change="getcannulaName">
              <el-option
                v-for="(item, index) in cannulaTypeList"
                :key="index"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="导管名称：" prop="cannulaName">
            <el-input
              size="small"
              v-model="form.cannulaName"
              maxlength="32"
              placeholder="请输入">
              </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="导管来源：" prop="cannulaSource">
            <el-select v-model="form.cannulaSource" placeholder="请选择">
              <el-option
                v-for="(item, index) in cannulaSourceList"
                :key="index"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="插管时间：" prop="cannulaTime">
            <el-date-picker
              v-model="form.cannulaTime"
              type="datetime"
              size="small"
              placeholder="选择时间"
              align="left"
              :default-value="new Date()"
              style="width: 100%"
              :picker-options="pickerOptions"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
        <el-row>
        <el-col :span="20">
          <el-form-item label="置管深度：" prop="length">
           <el-input
              size="small"
              v-model="form.length"
              maxlength="32"
              placeholder="请输入">
              <template slot="suffix">cm</template>
              </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
     <div class="addbtn">
        <el-button size="medium" @click="cancel()">取消</el-button>
        <el-button size="medium" @click="addSubmit('form')" type="primary" :loading="btnLoading"
          >确定</el-button
        >
      </div>
  </div>
</template>

<script>
export default {
  name: "addtab5",
  props:['cannulaLocation','cannulaSource','recordId','outhosTime'],
  data() {
     let checkLength=(rule,value,callback)=>{
         if (!/^\d+$|^\d*\.\d+$/g.test(value)&&value) {
            callback(new Error('请输入正整数或者小数'));
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
      form: {
        cannulaType: "", //导管分类
        cannulaName: "", //导管名称
        cannulaLocation: "", //插管部位
        cannulaSource: "", //导管来源
        cannulaTime: "", //插管时间
        length:"",//置管深度
      },
      btnLoading:false,
      rules: {
        cannulaLocation: [
          {
            required: true,
            trigger: "change",
            message: "插管部位不为空",
          },
        ],
        cannulaType: [
          {
            required: true,
            trigger: "change",
            message: "导管分类不为空",
          },
        ],
        cannulaName: [
          {
            required: true,
            trigger: "blur",
            message: "导管名称不为空",
          },
        ],
        cannulaSource: [
          {
            required: true,
            trigger: "change",
            message: "导管来源不为空",
          },
        ],
        cannulaTime: [
          {
            required: true,
            trigger: "change",
            message: "插管时间不为空",
          },
        ],
        length: [
          { required: true, trigger: "blur", message: "置管深度不为空"},
          {validator:checkLength,trigger:'blur'}
        ],
      },
      cannulaTypeList: [],
      id: null,
      startTime:null,
      pickerOptions:{
        disabledDate: time => {
        if(this.outhosTime){
          return time.getTime() > new Date(this.outhosTime);
        }else{
          return time.getTime() > new Date().getTime();
        }
      }
    },
    };
  },
  created() {
   
  },
  computed:{
    cannulaLocationList(){
      return this.cannulaLocation;
    },
    cannulaSourceList(){
      return this.cannulaSource;
    },
    patientRecordId(){
      return this.recordId;
    }
  },
  methods: {
    init() {
      let that = this;
      that.$refs["form"].resetFields();
      that.form = {
        cannulaType: "", //导管分类
        cannulaName: "", //导管名称
        cannulaLocation: "", //插管部位
        cannulaSource: "", //导管来源
        cannulaTime: "", //插管时间
        id:"",
        length:"" //置管长度
      };
      that.id="";
      that.btnLoading = false;
    },
    editInit(id) {
      let that = this;
      that.btnLoading = false;
      that.$refs["form"].resetFields();
      let url = "/api/icu/pipe/query/" + id;
      that.id = id;
      that.$axios.get(global.url + url).then(function (res) {
        let data = res.data.respData;
        that.locationFun(data.cannulaLocation);
        for (let key in that.form) {
          if (!data[key] && typeof data[key] != "undefined" && data[key] != 0) {
            that.form[key] = data[key];
          } else {
            that.form[key] = String(data[key]);
          }
        };
      });
    },
    locationFun(value) {
      console.log(value);
      let that = this;
      that.cannulaTypeList = [];
      that.form.cannulaType = "";
      this.cannulaLocationList.forEach(function (item, index) {
        if (item.value == value) {
          that.cannulaTypeList = item.date;
        }
      });
    },
    getcannulaName(value) {
      let that = this;
      that.form.cannulaName = "";
      that.cannulaTypeList.forEach(function (item, index) {
        if (item.value == value) {
          that.form.cannulaName = item.cannulaName;
        }
      });
    },
    cancel() {
      this.$emit("submit");
    },
    addSubmit(formName) {
      let that = this;
      that.$refs[formName].validate((valid) => {
        if (valid) { 
          //修改重复提交
          let startTime = new Date().getTime();
          if(that.startTime&&(startTime - that.startTime<500)){
              return false;
          }
          that.startTime = startTime;
          let url = "/api/icu/pipe/save";
          that.form.patientRecordId = that.patientRecordId;
          if (that.id) {
            that.form.id = that.id;
          } else {
            that.form.id = null;
          }
          that.$axios.post(global.url + url, that.form).then(function (res) {
            if (res.data.msg == 201) {
              that.$emit("submit",1);
              that.$message({
                type: "success",
                message: res.data.content,
                });
            } else if (res.data.msg == 302) {
              that.$message({
                message: res.data.content,
                type: "info",
              });
              that.btnLoading = false;
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
 .el-form{
          padding: 0px 20px;
     }
  .addbtn {
      margin-top: 20px;
      padding: 10px 20px 10px 20px;
      display: flex;
      justify-content: flex-end;
      border-top:1px solid rgba(0, 0, 0, 0.06);
  }
}
</style>
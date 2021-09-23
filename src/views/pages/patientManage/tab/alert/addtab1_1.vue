<template>
  <div class="addData">
    <el-form ref="form" :model="form" label-width="160px" :rules="rules">
      <el-row>
        <el-col :span="20">
          <el-form-item label="采集时间：" prop="inputTime">
            <el-date-picker
              v-model="form.inputTime"
              type="datetime"
              size="small"
              placeholder="选择时间"
              align="left"
              :picker-options="pickerOptions"
              style="width: 100%"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
              <el-form-item label="心率(次/每分)：" prop="heartRate">
                <el-input
                  size="small"
                  v-model="form.heartRate"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
        </el-col>
      </el-row>
       <el-row>
        <el-col :span="20">
              <el-form-item label="呼吸(次/每分)：" prop="breatheRate">
                <el-input
                  size="small"
                  v-model="form.breatheRate"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="血压(mmHG)：" prop="pressure">
           <el-col :span="11">
                    <el-input
                      v-model="form.systolicBloodPressure"
                      size="small"
                      placeholder="收缩压">
                    </el-input>
                  </el-col>
                  <el-col :span="12" :offset="1">
                    <el-input
                      v-model="form.diastolicBloodPressure"
                      size="small"
                      placeholder="舒张压">
                    </el-input>
                  </el-col>
          </el-form-item>
        </el-col>
      </el-row>
       <el-row>
        <el-col :span="20">
          <el-form-item label="氧饱和度(%)：" prop="oxygenSaturation">
            <el-input
              size="small"
              v-model="form.oxygenSaturation"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="体温(℃)：" prop="bodyTemperature">
            <el-input
              size="small"
              v-model="form.bodyTemperature"
              maxlength="32"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
       <el-row>
        <el-col :span="20">
          <el-form-item label="CVP(mmH2O)：" prop="centralVenousPressure">
            <el-input
              size="small"
              v-model="form.centralVenousPressure"
              maxlength="32"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="addbtn">
            <el-button size="medium" @click="cancel()">取消</el-button>
            <el-button size="medium" @click="addSubmit('form')" type="primary" :disabled="btnDisabled" :loading="btnLoading">确定</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "addtab01",
  props:['recordId','outhosTime'],
  data() {
     let valiRule = {
      int: /^[0-9]\d*$/, //正整数
      decInt: /^\d+$|^\d*\.\d+$/g, //正整数加小数
    };
    let checkheartRate = (rule, value, callback) => {
        setTimeout(() => {
          if (!valiRule.int.test(value)&&value) {
            callback(new Error('请输入正整数'));
          } else {
            if (value < 0) {
              callback(new Error('范围在0-999'));
            } else if(value > 999){
              callback(new Error('范围在0-999'));
            }else {
              callback();
            }
          }
        }, 100);
      }
      let checkbreatheRate = (rule, value, callback) => {
        setTimeout(() => {
          if (!valiRule.int.test(value)&&value) {
            callback(new Error('请输入正整数'));
          } else {
            if (value < 0) {
              callback(new Error('范围在0-999'));
            } else if(value > 999){
              callback(new Error('范围在0-999'));
            }else {
              callback();
            }
          }
        }, 100);
      }
      let checkPressure=(rule,value,callback)=>{
        value = this.form.systolicBloodPressure;
        let value2 = this.form.diastolicBloodPressure;
        if(!valiRule.int.test(value)&&value) {
            callback(new Error('请输入正整数'))
        }else{
          if (value < 0) {
              callback(new Error('范围在0-999'));
            } else if(value > 999){
              callback(new Error('范围在0-999'));
            }
        }
        if(value&&!value2){
          callback()
        }
        if(!valiRule.int.test(value2)&&value2) {
            callback(new Error('请输入正整数'))
        }else{
          if (value2 < 0) {
              callback(new Error('范围在0-999'));
            } else if(value2 > 999){
              callback(new Error('范围在0-999'));
            }
        }
        if(!value&&value2){
          callback()
        }else{
          callback();
        }
      }
      let checkOxygenSaturation=(rule,value,callback)=>{
         if (!valiRule.int.test(value)&&value) {
            callback(new Error('请输入正整数'));
          } else {
            if (value < 0) {
              callback(new Error('范围在0-100'));
            } else if(value > 100){
              callback(new Error('范围在0-100'));
            }else {
              callback();
            }
          }
      }
      let checkBodyTemperature=(rule,value,callback)=>{
         if (!/^\d+$|^\d*\.\d+$/g.test(value)&&value) {
            callback(new Error('请输入正整数或者小数'));
          } else {
            if (value < 0) {
              callback(new Error('范围在0-45'));
            } else if(value > 45){
              callback(new Error('范围在0-45'));
            }else {
              callback();
            }
          }
      }
    return {
      btnLoading:false,
      btnDisabled: false,
      pickerOptions:{
         disabledDate: time => {
          if(this.outhosTime){
            return time.getTime() > new Date(this.outhosTime);
          }else{
            return time.getTime() > new Date().getTime();
          }
        }
      },
      form: {
        inputTime:'',//时间
        heartRate:'',//心率(次/每分)
        breatheRate:'',//呼吸(次/分)
        systolicBloodPressure:'',//收缩压(mmHG)
        diastolicBloodPressure:'',//舒张压
        oxygenSaturation:'',//氧饱和度
        bodyTemperature:'',//体温
        centralVenousPressure:''//中心静脉压
      },
      rules: {
        inputTime: [{  required: true,  trigger: "blur", message: "时间不能为空",}],
        heartRate:[{validator:checkheartRate,trigger:'blur'}],
         breatheRate:[{validator:checkbreatheRate,trigger:'blur'}],
        pressure:[
          {validator:checkPressure,trigger:'blur'}
        ],
        oxygenSaturation:[
           {validator:checkOxygenSaturation,trigger:'blur'}
        ],
        bodyTemperature:[ {validator:checkBodyTemperature,trigger:'blur'}],
        centralVenousPressure:[ {validator:checkbreatheRate,trigger:'blur'}]
      }
    };
  },

  created() {
    this.getAmoutData();
  },
  computed:{
    patientRecordId(){
      return this.recordId;
    }
  },
  methods: {
    clearData:function(){
      this.btnLoading = false;
      this.id = null;
      this.form ={
          inputTime:'',//时间
          heartRate:'',//心率(次/每分)
          breatheRate:'',
          systolicBloodPressure:'',//收缩压(mmHG)
          diastolicBloodPressure:'',//舒张压
          oxygenSaturation:'',//氧饱和度
          bodyTemperature:'',//体温
          centralVenousPressure:''//中心静脉压
      }
      this.$refs['form'].resetFields();
    },
    getColorFun(value) {
      console.log(value);
      this.inoutColorList = this.sourceList["inout_color" + value];
    },
    getInitData(id, flag) {
      let that = this;
      that.id = id;
      that.$refs['form'].resetFields();
      let url = "/api/icu/vitalSigns/" + that.id;
      this.$axios.get(global.url + url).then(function (res) {
        let list = res.data.respData;
        for (let key in that.form) {
          if (!list[key] && typeof list[key] != "undefined") {
            that.form[key] = list[key];
          } else {
            that.form[key] = String(list[key]);
          }
        }
      });
    },
    getAmoutData() {
      let that = this;
      let url = "/api/icu/inout/configuration";
      this.$axios.get(global.url + url).then(function (res) {
        that.sourceList = res.data.respData;
        that.inoutSourceList = that.sourceList.outSource;
      });
    },
    cancel() {
      this.$emit("submit", 0);
    },
    addSubmit(formName) {
      let that = this;
      that.$refs[formName].validate((valid) => {
        if (valid) {
          let url = "/api/icu/vitalSigns/save";
          that.form.patientRecordId = this.patientRecordId;
          if (that.id) {
            that.form.id = that.id;
          } else {
            that.form.id = null;
          }
          if(!that.form.systolicBloodPressure&&that.form.diastolicBloodPressure){
            that.$message({
                  message: '请输入收缩压',
                  type: 'info'
                });
            return false;
          }
           if(that.form.systolicBloodPressure&&!that.form.diastolicBloodPressure){
            that.$message({
                  message: '请输入舒张压',
                  type: 'info'
                });
            return false;
          }
           that.btnLoading = true;
          that.$axios.post(global.url + url, that.form).then(function (res) {
            if(res.data.msg==201){
               that.$message({
                  message: res.data.content,
                  type: 'success'
                });
              that.$emit("submit", 1);
              that.$emit('refresh');
            }else if(res.data.msg==302){
              that.$message({
                  message: res.data.content,
                  type: 'info'
                });
            }
            that.btnLoading = false;
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
.addData {
  .el-row .el-form-item__label {
    text-align: right !important;
    width: 160px !important;
  }
  .el-form{
    padding: 0px 20px;
  }
  .el-select {
    width: 100%;
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
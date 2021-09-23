<template>
  <div class="addtab3">
    <el-form ref="form" :model="form" label-width="160px" :rules="rules">
      <el-row>
        <el-col :span="20">
          <el-form-item label="时间：" prop="inoutTime">
            <el-date-picker
              v-model="form.inoutTime"
              type="datetime"
              size="small"
              placeholder="选择时间"
              align="left"
              :default-value="new Date()"
              style="width: 100%"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="血糖值：" prop="bloodSugarValue">
            <el-input size="small" v-model="form.bloodSugarValue">
             <template slot="suffix">mmol/L</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="药物名称：" prop="medicationName">
            <el-input
              size="small"
              v-model="form.medicationName"
              maxlength="32"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="用药剂量：" prop="medicationAmount">
           <el-col :span="13" >
             <el-input size="small" v-model="form.medicationAmount" placeholder="请输入"></el-input>
           </el-col>
            <el-col :span="10" :offset="1">
                        <el-select v-model="form.dosageUnit" size="small">
                             <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                             </el-option>
                        </el-select>
                    </el-col>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="药物用法：">
            <el-select v-model="form.takeMedicineMethod">
              <el-option
                v-for="(item, index) in configList"
                :key="index"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
      <div class="addbtn">
        <el-button size="medium" @click="cancel()">取消</el-button>
        <el-button
          size="medium"
          @click="addSubmit()"
          type="primary" :disabled="btnDisabled" :loading="btnDisabled">确定</el-button>
      </div>
  </div>
</template>

<script>
export default {
  name: "addData",
  props:['recordId','outhosTime'],
  data() {
    let valiRule = {
      int: /^[0-9]\d*$/, //正整数
      decInt: /^\d+$|^\d*\.\d+$/g, //正整数加小数
    };
    let checkBloodSugarValue =(rule,value,callback)=>{
       if (!/^\d+$|^\d*\.\d+$/g.test(value)&&value!='') {
            callback(new Error('请输入整数或小数'));
          } else {
            if (value < 0) {
              callback(new Error('范围在0-100'));
            } else if(value > 100){
              callback(new Error('范围在0-100'));
            }else if(value.indexOf('.')>0) {
              let num = value.indexOf('.');
              let length = value.length;
              if(length-num>4){
                 callback(new Error('请保留三位小数'));
              }else{
                callback();
              }
            }else{
              callback();
            }
          }
    }
    let checkInoutAmount = (rule,value,callback)=>{
      if (!/^\d+$|^\d*\.\d+$/g.test(value)&&value!=='') {
            callback(new Error('请输入整数或小数'));
          } else {
            if (value < 0) {
              callback(new Error('范围在0-9999'));
            } else if(value > 9999){
              callback(new Error('范围在0-9999'));
            }else if(value.indexOf('.')>0) {
              let num = value.indexOf('.');
              let length = value.length;
              if(length-num>4){
                 callback(new Error('请保留三位小数'));
              }else{
                callback();
              }
            }else{
              callback();
            }
          }
    }
    return {
      btnDisabled: false,
      form: {
        id: "",
        inoutTime: "", //时间
        bloodSugarValue: "", //血糖值
        medicationName: "", //药物名称
        medicationAmount: "", //用药剂量
        takeMedicineMethod: "", //药物用法
        dosageUnit:'mg'
      },
      options:[
        {label:'mg',value:'mg'},
        {label:'u',value:'u'}
      ],
      configList: [],
      rules: {
        inoutTime: [
          {
            required: true,
            trigger: "change",
            message: "时间不能为空",
          },
        ],
        bloodSugarValue:[
         {validator:checkBloodSugarValue, trigger:'blur'}
         ],
         medicationName:[
           {
            max:10,
            trigger: "blur",
            message: "最大长度为10个字符",
           }
         ],
         medicationAmount:[
           {
             validator:checkInoutAmount, trigger:'blur'
           }
         ],
      },
      pickerOptions:{
         disabledDate: time => {
          if(this.outhosTime){
            return time.getTime() > new Date(this.outhosTime);
          }else{
            return time.getTime() > new Date().getTime();
          }
        }
      },
      startTime:null,
    }
  },
  computed:{
    patientRecordId(){
      return this.recordId;
    }
  },
  created() {
    this.getConfigData();
  },
  methods: {
    clearData: function () {
      this.id = null;
      this.btnDisabled = false;
      this.form = {
        id: "",
        inoutTime: "", //时间
        bloodSugarValue: "", //血糖值
        medicationName: "", //药物名称
        medicationAmount: "", //用药剂量
        takeMedicineMethod: "", //药物用法
        dosageUnit:'mg'
      };
      this.$refs['form'].resetFields();
      this.getConfigData();
    },
    getInitData(id, flag) {
      let that = this;
      that.id = id;
      let url = "/api/icu/bloodSugar/" + that.id;
      this.$axios.get(global.url + url).then(function (res) {
        let list = res.data.respData;
        for (let key in list) {
          if (that.form.hasOwnProperty(key)) {
            if ( !list[key] &&typeof list[key] != "undefined") {
              that.form[key] = list[key];
            } else {
              that.form[key] = String(list[key]);
            }
          }
        }
      });
    },
    getConfigData() {
      let that = this;
      let url = "/api/icu/bloodSugar/configuration";
      this.$axios.get(global.url + url).then(function (res) {
        that.configList = res.data.respData.method;
      });
    },
    cancel() {
      this.$emit("submit", 0);
    },
    addSubmit() {
      let that = this;
      that.$refs['form'].validate((valid) => {
        if (valid) {
          let url = "/api/icu/bloodSugar/save";
          that.form.patientRecordId = that.patientRecordId;
          if (that.id) {
            that.form.id = that.id;
          } else {
            that.form.id = null;
          }
          if(!that.form.bloodSugarValue&&!that.form.medicationName){
            that.$message({
                message:'请填写血糖值或药物名称',
                offset:100,
                type: "info",
            })
            return false;
          }
          let startTime = new Date().getTime();
          if(that.startTime&&(startTime - that.startTime<500)){
              return false;
          }
          that.startTime = startTime;
          that.$axios.post(global.url + url, that.form).then(function (res) {
            if (res.data.msg == 201) {
              that.$emit("submit", 1);
              that.$emit("refresh");
                that.$message({
                  message: res.data.content,
                  type: 'success'
                });
            } else if (res.data.msg == 302) {
              that.$message({
                message: res.data.content,
                type: "info",
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
.addtab3 {
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

<template>
  <div class="addData2_1">
    <el-form ref="form" :model="form" label-width="160px" :rules="rules">
      <el-row>
        <el-col :span="20">
          <el-form-item label="时间：" prop="inoutTime" >
            <el-date-picker
              v-model="form.inoutTime"
              type="datetime"
              size="small"
              placeholder="选择时间"
              align="left"
              :default-value="new Date()"
              style="width: 100%"
              :picker-options="pickerOptions"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
              :disabled="id&&!modify"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="出入量类型：" class="dotInfo" prop="inoutType">
            <el-select
              placeholder="请选择"
              size="small"
              :disabled="id&&!modify"
              v-model="form.inoutType"
            >
              <el-option label="出量" value="1"></el-option>
              <el-option label="入量" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="出入量估计(mL)：" prop="inoutAmount">
            <el-input
              size="small"
              v-model="form.inoutAmount"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="form.inoutType==1||form.inoutType==2">
        <el-col :span="20">
          <el-form-item label="出入量来源：" class="dotInfo" prop="inoutSource">
            <el-select
              placeholder="请选择"
              size="small"
              :disabled="id&&!modify"
              v-model="form.inoutSource"
              @change="getColorFun"
            >
              <el-option
                v-for="(item, index) in inoutSourceList"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col
          :span="20"
          v-if="(form.inoutSource == 1 && form.inoutType ==1)||
            (form.inoutSource == 2 && form.inoutType ==1)||
            (form.inoutSource == 3 && form.inoutType ==1)"
        >
          <el-form-item label="颜色：" class="dotInfo" prop="inoutColor">
            <el-select
              placeholder="请选择"
              size="small"
              :disabled="id&&!modify"
              v-model="form.inoutColor"
            >
              <el-option
                v-for="(item, index) in sourceList[
                  'inout_color' + form.inoutSource]"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item :label="form.inoutType==1?'性状：':'名称'" prop="inoutShape">
            <el-input
              size="small"
              :disabled="id&&!modify"
              v-model="form.inoutShape"
              maxlength="32"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
        <el-row v-if="form.inoutType==1">
          <el-col :span="20">
            <el-form-item label="是否用药：" prop="useDrug">
              <el-radio-group v-model="form.useDrug"  :disabled="id&&!modify">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <div v-if="form.useDrug == 1 && form.inoutType==1">
          <el-row>
            <el-col :span="20">
              <el-form-item label="药物名称：" prop="medicationName">
                <el-input
                  size="small"
                  v-model="form.medicationName"
                  maxlength="32"
                  :disabled="id&&!modify"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
              <el-form-item label="剂量：" prop="medicationAmount">
                <el-col :span="20">
              <el-col :span="12">
                <el-input
                  size="small"
                  v-model="form.medicationAmount"
                  placeholder="请输入"
                  :disabled="id&&!modify"
                ></el-input>
              </el-col>
                <el-col :span="8" :offset="1">
                        <el-select v-model="form.dosageUnit" size="small"   :disabled="id&&!modify">
                             <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                             </el-option>
                        </el-select>
                    </el-col>
               </el-col>
              </el-form-item>
          </el-row>
          <el-row>
            <el-col :span="20">
              <el-form-item label="用药方式：" prop="takeMedicineMethod">
                <el-select
                  placeholder="请选择"
                  size="small"
                  :disabled="id&&!modify"
                  v-model="form.takeMedicineMethod"
                >
                  <el-option
                    v-for="(item, index) in takeMedicineList"
                    :key="index"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
    </el-form>
       <div class="addbtn">
        <el-button size="medium" @click="cancel()">取消</el-button>
        <el-button
          size="medium"
          @click="addSubmit('form')"
          type="primary"
          :disabled="btnDisabled"
          :loading="btnLoading"
          >确定</el-button
        >
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
    let checkInoutAmount = (rule,value,callback)=>{
      if (!/^\d+$|^\d*\.\d+$/g.test(value)&&value!==''&&value!=null) {
            callback(new Error('请输入整数或小数'));
          } else {
            if (value < 0) {
              callback(new Error('范围在0-9999'));
            } else if(value > 9999){
              callback(new Error('范围在0-9999'));
            }else if(String(value).indexOf('.')>0) {
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
      id:null,
      btnDisabled: false,
      btnLoading:false,
      form: {
        inoutTime: "",
        inoutType: "", //出入量类型
        inoutAmount: "", //出入量估计
        inoutSource: "", //出入量来源
        inoutColor: "", //出入量颜色
        inoutShape: "", //出入量形状
        useDrug: "0", //是否用药
        medicationName: "", //用药名称
        medicationAmount: "", //用药剂量
        dosageUnit:'mL',
        takeMedicineMethod: "", //用药方式
      },
      inoutSourceList: [],
      takeMedicineList: [
        //用药方式
        { name: "口服", value: '1' },
        { name: "静脉", value: '2' },
        { name: "泵入", value: '3' },
        { name: "皮下注射", value: '4' },
      ],
      options:[
        { name: "mL", value: "mL" },
        { name: "mg", value: "mg" },
        { name: "u", value: "u" },
        ],
      sourceList: [],
      inoutColorList: [],
      rules: {
        inoutType: [{
          required: true,
          trigger: "change",
          message: "出入量类型不能为空",
        }],
        inoutTime: [{
          required: true,
          trigger: "change",
          message: "时间不能为空",
        }],
        inoutAmount: [
         {
          required: true,
          trigger: "blur",
          message: "出入量估计不能为空",
        },
         {
          validator:checkInoutAmount,trigger:'blur'
         }
        ],
        // useDrug:[{
        //   required: true,
        //   trigger: "change",
        //   message: "用药不可为空",
        // }],
        inoutSource: [{
          required: true,
          trigger: "change",
          message: "出入量来源不能为空",
        }],
        inoutColor:[{
          required: true,
          trigger: "change",
          message: "颜色不能为空",
        }],
        inoutShape:[{
          required: true,
          trigger: "blur",
          message: "不能为空",
        }],
        medicationName:[
          {required: true, trigger: "blur", message: "药物名称不能为空"},
          {
          max:10,
          trigger: "blur",
          message: "最大长度为10个字符",
        }],
        medicationAmount:[
          {required: true, trigger: "blur", message: "剂量不能为空"},
          { validator:checkInoutAmount,trigger:'blur'}
        ],
        takeMedicineMethod:[
          {required: true, trigger: "blur", message: "用药方式不能为空"},
        ]
      },
      isShowdrug: true,
      pickerOptions:{
         disabledDate: time => {
          if(this.outhosTime){
            return time.getTime() > new Date(this.outhosTime);
          }else{
            return time.getTime() > new Date().getTime();
          }
        }
      },
      modify:true,
    };
  },

  created() {
    this.getAmoutData();
  },
  watch:{
    'form.inoutType':{
      handler(newValue,old){
        if(newValue==1){
            this.inoutSourceList = this.sourceList.outSource;
        }else if(newValue==2){
            this.inoutSourceList = this.sourceList.inSource;
        }
      }
    }
  },
  computed:{
    patientRecordId(){
      return this.recordId;
    }
  },
  methods: {
    clearData:function(){
      this.id = null;
      this.isShowdrug = true;
      this.btnLoading = false;
      this.form ={
        inoutTime: "",
        inoutType: "", //出入量类型
        inoutAmount: "", //出入量估计
        inoutSource: "", //出入量来源
        inoutColor: "", //出入量颜色
        inoutShape: "", //出入量形状
        useDrug: "0", //是否用药
        medicationName: "", //用药名称
        medicationAmount: "", //用药剂量
        dosageUnit:"mL",
        takeMedicineMethod: "", //用药方式
      }
      this.modify =true;
       this.$refs['form'].resetFields();
    },
    getColorFun(value) {
      console.log(value);
      this.inoutColorList = this.sourceList["inout_color" + value];
    },
    getInitData(id, flag) {
      let that = this;
      that.id = id;
      that.isShowdrug = flag;
      that.$refs['form'].resetFields();
      let url = "/api/icu/inout/" + that.id;
      this.$axios.get(global.url + url).then(function (res) {
        let list = res.data.respData;
        that.modify = list.modify;
        for (let key in that.form) {
          if (!list[key] && typeof list[key] != "undefined" && list[key] != 0) {
            that.form[key] = list[key];
          } else {
            that.form[key] = String(list[key]);
          }
        }
        if(!that.form.dosageUnit){
          that.form.dosageUnit = 'mL'
        }
      });
    },
    getAmoutData() {
      let that = this;
      let url = "/api/icu/inout/configuration";
      this.$axios.get(global.url + url).then(function (res) {
        if(res.data.msg==201){
         that.sourceList = res.data.respData;
        }
      });
    },
    cancel() {
      this.$emit("submit", 0);
    },
    addSubmit(formName) {
      let that = this;
      that.$refs[formName].validate((valid) => {
        if (valid) {
          that.$emit("submit", 1);
          let url = "/api/icu/inout/save";
          that.form.patientRecordId = that.patientRecordId;
          if (that.id) {
            that.form.id = that.id;
          } else {
            that.form.id = null;
          }
          that.btnLoading = true;
          that.$axios.post(global.url + url, that.form).then(function (res) {
            if(res.data.msg==201){
              that.$emit('refresh');
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
.addData2_1 {
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

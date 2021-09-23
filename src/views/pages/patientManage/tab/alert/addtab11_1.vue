<template>
  <div class="addtab11">
    <el-form ref="form" :model="form" label-width="160px" :rules="rules">
      <el-row>
        <el-col :span="12">
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
         <el-col :span="12">
          <el-form-item label="腘动脉搏动(左)：">
            <el-select v-model="form.poplitealArteryPulsationLeft">
              <el-option
                v-for="item in poplitealArteryPulsationLefts"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="腘动脉搏动(右)：">
            <el-select v-model="form.poplitealArteryPulsationRight">
              <el-option
                v-for="(item, index) in poplitealArteryPulsationRights"
                :key="index"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
         <el-col :span="12">
          <el-form-item label="足背动脉搏动(左)：">
            <el-select v-model="form.footPulsationLeft">
              <el-option
                v-for="(item, index) in footPulsationLefts"
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
        <el-col :span="12">
          <el-form-item label="足背动脉搏动(右)：">
            <el-select v-model="form.footPulsationRight">
              <el-option
                v-for="(item, index) in footPulsationRights"
                :key="index"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
          <el-col :span="12">
          <el-form-item label="下肢皮肤颜色：">
            <el-select v-model="form.lowerLimbSkinColor">
              <el-option
                v-for="(item, index) in lowerLimbSkinColors"
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
        <el-col :span="12">
          <el-form-item label="Homans征：">
                <el-radio-group v-model="form.homanStatus">
                    <el-radio :label="1">+</el-radio>
                    <el-radio :label="2">-</el-radio>
                </el-radio-group>
          </el-form-item>
        </el-col>
          <el-col :span="12">
          <el-form-item label="疼痛评分：">
            <el-select v-model="form.painScore">
              <el-option
                v-for="(item, index) in painScores"
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
      
      </el-row>
        <el-row>
        <el-col :span="12">
          <el-form-item label="下肢肿胀：">
            <el-select v-model="form.lowerLimbSwelling">
              <el-option
                v-for="(item, index) in lowerLimbSwellings"
                :key="index"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
          <el-col :span="12">
          <el-form-item label="肤温(℃)：" prop="skinTemperature">
           <el-input size="small" type="text" v-model="form.skinTemperature">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
       <el-row>
        <el-col :span="12">
          <el-form-item label="下肢麻痹感：">
                <el-radio-group v-model="form.lowerLimbParalysis">
                    <el-radio :label="1">+</el-radio>
                    <el-radio :label="2">-</el-radio>
                </el-radio-group>
          </el-form-item>
        </el-col>
         <el-col :span="12">
          <el-form-item label="评估结果：" prop="result">
            <el-select v-model="form.result">
              <el-option
                v-for="(item, index) in results"
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
        <el-col :span="24">
          <el-form-item label="预防措施：">
            <el-checkbox-group v-model="preventMessure" >
                <el-checkbox label="足底静脉泵VEP">足底静脉泵VEP </el-checkbox>
                <el-checkbox label="抗血栓形成药物">抗血栓形成药物 </el-checkbox>
                <el-checkbox label="梯度压力弹力袜GCS">梯度压力弹力袜GCS </el-checkbox>
                <el-checkbox label="间歇充气加压装置IPC" >间歇充气加压装置IPC </el-checkbox>
            </el-checkbox-group>

            <!-- <el-checkbox-group v-model="form.preventMessure">
            <el-checkbox  v-for="item in preventMessures " :key='item.label'
            :label="item.label" name="type">{{item.name}}</el-checkbox>
            </el-checkbox-group> -->

          </el-form-item>
        </el-col>
      </el-row>
       <el-row>
        <el-col :span="24">
          <el-form-item label="治疗措施：">
              <el-checkbox-group v-model="diagnosisMessure" >
                <el-checkbox label="抗凝、抗血小板形成 "> 抗凝、抗血小板形成 </el-checkbox>
                <el-checkbox label="下腔静脉滤器">下腔静脉滤器 </el-checkbox>
                <el-checkbox label="溶栓">溶栓 </el-checkbox>
                <el-checkbox label="手术" >手术 </el-checkbox>
                <el-checkbox label="机械血栓清除术" >机械血栓清除术 </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row>
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
      </el-row> -->
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
  // ^3[5-9](\.\d)?$|^40(\.0)?$
  name: "addData",
  props:['recordId','outhosTime'],
  data() {
     var validatePass = (rule, value, callback) => {
      let regPass =/^3[5-9](\.\d)?$|^40(\.0)?$/;
      // if (value === "") {
      //   callback(new Error("肤温不能为空"));
      // } else 
      if(value){
        if(!regPass.test(value)){
           callback(new Error("请输入35-40的数字可包含一位小数点"));
        }else{
        callback();
      }
      }else{
        callback();
      }
      // if (!regPass.test(value)) {
      //   callback(new Error("请输入35-40的数字可包含一位小数点"));
      // } else {
      //   callback();
      // }
    };
    return {
      btnDisabled: false,
      form: {
        id: "",
        patientRecordId:"",
        inoutTime: "", //时间
        poplitealArteryPulsationLeft: "", //腘动脉搏动(左)
        poplitealArteryPulsationRight: "", //腘动脉搏动(右)
        footPulsationLeft: "", //足背动脉搏动(左)
        footPulsationRight: "", //足背动脉搏动(右)
        lowerLimbSkinColor:"",//下肢皮肤颜色
        homanStatus:"",
        painScore:"",
        lowerLimbSwelling:"",
        skinTemperature:"",
        lowerLimbParalysis:"",
        result:"",
        preventMessure:"",
        diagnosisMessure:"",

      },
      preventMessure:[],
      diagnosisMessure:[],
      poplitealArteryPulsationLefts:[
          {value:1,name:"正常"},
          {value:2,name:"减弱"},
          {value:3,name:"消失"}
      ],
      poplitealArteryPulsationRights:[
          {value:1,name:"正常"},
          {value:2,name:"减弱"},
          {value:3,name:"消失"}
      ],
      footPulsationLefts:[
          {value:1,name:"正常"},
          {value:2,name:"减弱"},
          {value:3,name:"消失"}
      ],
      footPulsationRights:[
          {value:1,name:"正常"},
          {value:2,name:"减弱"},
          {value:3,name:"消失"}
      ],
       lowerLimbSkinColors:[
          {value:1,name:"正常"},
          {value:2,name:"淡红"},
          {value:3,name:"紫色"},
          {value:4,name:"红色"}
      ],
      painScores:[
        {value:1,name:"1"},
        {value:2,name:"2"},
        {value:3,name:"3"},
        {value:4,name:"4"},
         {value:5,name:"5"},
        {value:6,name:"6"},
        {value:7,name:"7"},
        {value:8,name:"8"},
         {value:9,name:"9"},
        {value:10,name:"10"},
      ],
      lowerLimbSwellings:[
        {value:0,name:"无"},
        {value:1,name:"I度"},
        {value:2,name:"II度"},
        {value:3,name:"III度"},
      
      ],
      results:[
        {value:1,name:"未发现问题"},
        {value:2,name:"待进一步评估"},
        {value:3,name:"疑似血栓形成"},
        {value:4,name:"血栓形成"},
        
      ],
      preventMessures:[
        {value:'足底静脉泵VEP',name:"足底静脉泵VEP"},
        {value:'抗血栓形成药物',name:"抗血栓形成药物"},
        {value:"梯度压力弹力袜GCS",name:"梯度压力弹力袜GCS"},
        {value:"间歇充气加压装置IPC",name:"间歇充气加压装置IPC"},
      ],
      diagnosisMessures:[
        {value:"抗凝、抗血小板形成",name:"抗凝、抗血小板形成"},
        {value:"下腔静脉滤器",name:"下腔静脉滤器"},
        {value:"溶栓",name:"溶栓"},
        {value:"手术",name:"手术"},
        {value:"机械血栓清除术",name:"机械血栓清除术"},
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
         result: [
          {
            required: true,
            trigger: "change",
            message: "评估结果不能为空",
          },
        ],
        skinTemperature: [{ validator: validatePass, trigger: "blur" }],
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
    // changePrevent(){
    //     this.form.preventMessure = this.preventMessure.toString()
    //   },
    // changeDiagno(){
    //      this.form.diagnosisMessure = this.diagnosisMessure.toString()
    // },
    clearData: function () {
      this.id = null;
      this.btnDisabled = false;
      this.form = {
        id: "",
        patientRecordId:"",
        inoutTime: "", //时间
        poplitealArteryPulsationLeft: "", //腘动脉搏动(左)
        poplitealArteryPulsationRight: "", //腘动脉搏动(右)
        footPulsationLeft: "", //足背动脉搏动(左)
        footPulsationRight: "", //足背动脉搏动(右)
        lowerLimbSkinColor:"",//下肢皮肤颜色
        homanStatus:"",
        painScore:"",
        lowerLimbSwelling:"",
        skinTemperature:"",
        lowerLimbParalysis:"",
        result:"",
        preventMessure:"",
        diagnosisMessure:"",
      };
      this.preventMessure = []
      this.diagnosisMessure = []
      this.$refs['form'].resetFields();
      this.getConfigData();
    },
    getInitData(id,row, flag) {
        let that = this;
        that.id = id;
        console.log(row)
         this.form = row
         this.preventMessure = this.form.preventMessure.split(",")||[this.form.preventMessure]
         this.diagnosisMessure = this.form.diagnosisMessure.split(",")||[this.form.diagnosisMessure]
        //  this.form.inoutTime = row.inoutTime
        // this.form.poplitealArteryPulsationLeft = row.poplitealArteryPulsationLeft
    //   let that = this;
    //   that.id = id;
    //   let url = "/api/icu/bloodSugar/" + that.id;
    //   this.$axios.get(global.url + url).then(function (res) {
    //     let list = res.data.respData;
    //     for (let key in list) {
    //       if (that.form.hasOwnProperty(key)) {
    //         if ( !list[key] &&typeof list[key] != "undefined") {
    //           that.form[key] = list[key];
    //         } else {
    //           that.form[key] = String(list[key]);
    //         }
    //       }
    //     }
    //   });
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
        this.form.preventMessure = this.preventMessure.toString()
        this.form.diagnosisMessure = this.diagnosisMessure.toString()
      let that = this;
      that.$refs['form'].validate((valid) => {
        if (valid) {
          let url = "/api/icu/dvt/saveDVTRecord";
          that.form.patientRecordId = that.patientRecordId;
          if (that.id) {
            that.form.id = that.id;
          } else {
            that.form.id = null;
          }
        //   if(!that.form.bloodSugarValue&&!that.form.medicationName){
        //     that.$message({
        //         message:'请填写血糖值或药物名称',
        //         offset:100,
        //         type: "info",
        //     })
        //     return false;
        //   }
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
.addtab11 {
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

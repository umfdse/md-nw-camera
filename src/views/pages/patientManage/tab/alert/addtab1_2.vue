<template>
    <div class="addtab02">
    <el-form ref="form" :model="form" label-width="160px" :rules="rules">
        <el-row v-if="collectType==0">
            <el-col :span="20">
                <el-form-item label="采集间隔：" prop="intervals">
                    <el-col :span="13" >
                        <el-input size="small" v-model="form.intervals" placeholder="请输入"></el-input>
                    </el-col>
                     <el-col :span="10" :offset="1">
                        <el-select v-model="form.intervalType" size="small">
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
          <el-form-item label="采集时间：" prop="executedayTime">
            <el-date-picker
              v-model="form.executedayTime"
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
      </el-row>
      <el-row v-if="collectType==0">
          <el-col :span="20">
            <el-form-item label="危急值采集：" prop="danger">
              <el-radio-group v-model="form.danger">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
    </el-row>
    <div v-show="form.danger==1">
      <el-row>
        <el-col :span="20">
          <el-form-item label="收缩压正常范围：" prop="blood">
           <el-col :span="8">
                    <el-input
                      v-model="form.minSystolicBloodPressure"
                      size="small"
                      placeholder="最小">
                    </el-input>
                  </el-col>
                  <el-col :span="8" :offset="1">
                    <el-input
                      v-model="form.maxSystolicBloodPressure"
                      size="small"
                      placeholder="最大">
                    </el-input>
                  </el-col>
                     <el-col :span="6" :offset="1">
                      <span>mmHg</span>
                    </el-col>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="舒张压正常范围：" prop="blood2">
           <el-col :span="8">
                    <el-input
                      v-model="form.minDiastolicBloodPressure"
                      size="small"
                      placeholder="最小">
                    </el-input>
                  </el-col>
                  <el-col :span="8" :offset="1">
                    <el-input
                      v-model="form.maxDiastolicBloodPressure"
                      size="small"
                      placeholder="最大">
                    </el-input>
                  </el-col>
                  <el-col :span="6" :offset="1">
                      <span>mmHg</span>
                    </el-col>
          </el-form-item>
        </el-col>
      </el-row>
       <el-row>
        <el-col :span="20">
          <el-form-item label="心率正常范围：" prop="rate">
           <el-col :span="8">
                    <el-input
                      v-model="form.minHeartRate"
                      size="small"
                      placeholder="最低">
                    </el-input>
                  </el-col>
                  <el-col :span="8" :offset="1">
                    <el-input
                      v-model="form.maxHeartRate"
                      size="small"
                      placeholder="最高">
                    </el-input>
                  </el-col>
                  <el-col :span="6" :offset="1">
                      <span>次/每分</span>
                  </el-col>
          </el-form-item>
        </el-col>
      </el-row>
       <el-row>
        <el-col :span="20">
          <el-form-item label="氧饱和度正常范围：" prop="saturation">
           <el-col :span="8">
              <el-input
                v-model="form.minOxygenSaturation"
                size="small"
                placeholder="最低">
              </el-input>
            </el-col>
            <el-col :span="8" :offset="1">
              <el-input
                v-model="form.maxOxygenSaturation"
                size="small"
                placeholder="最高">
              </el-input>
            </el-col>
            <el-col :span="6" :offset="1">
                <span>次/每分</span>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
         <el-col :span="20">
          <el-form-item label="呼吸正常范围：" prop="breatheRate">
           <el-col :span="8">
              <el-input
                v-model="form.minBreatheRate"
                size="small"
                placeholder="最低">
              </el-input>
            </el-col>
            <el-col :span="8" :offset="1">
              <el-input
                v-model="form.maxBreatheRate"
                size="small"
                placeholder="最高">
              </el-input>
            </el-col>
            <el-col :span="6" :offset="1">
                <span>次/每分</span>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>
    </div>
    </el-form>
    <div class="addbtn">
            <el-button size="medium" @click="cancel()">取消</el-button>
            <el-button size="medium" @click="addSubmit('form')" type="primary">确定</el-button>
    </div>
    </div>
</template>
<script>
export default {
    name:'addtab02',
    data(){
       let valiRule = {
          int: /^[0-9]\d*$/, //正整数
          decInt: /^\d+$|^\d*\.\d+$/g, //正整数加小数
       };
      let checkBodyBlood = (rule, value, callback) => {
        this.checkFun(this.form.maxSystolicBloodPressure,this.form.minSystolicBloodPressure,'请输入最小血压','请输入最高血压',callback,valiRule);
      }
      let checkBodyBlood2 = (rule, value, callback) => {
         this.checkFun(this.form.maxDiastolicBloodPressure,this.form.minDiastolicBloodPressure,'请输入最小血压','请输入最高血压',callback,valiRule);
      }
      let checkrate = (rule, value, callback) => {
        this.checkFun(this.form.maxHeartRate,this.form.minHeartRate,'请输入最低心律','请输入最高心律',callback,valiRule);
      }
      let checksaturation = (rule, value, callback) => {
        this.checkFun(this.form.maxOxygenSaturation,this.form.minOxygenSaturation,'请输入最低呼吸','请输入最高呼吸',callback,valiRule);
      }
      let checkintervals =(rule,value,callback) =>{
        value = this.form.intervals;
        if(!valiRule.int.test(value)&&value!=""){
            callback(new Error('请输入正整数'))
          }else{
            callback();
          }
      }
        return{
        patientRecordId:null,
        collectType:null,
         options: [{
          value: '1',
          label: '小时'
        }, {
          value: '2',
          label: '分钟'
        }],
        form: {
                intervalType:'1',//采集间隔
                intervals:'',//心率(次/每分)
                executedayTime:'',//血压(mmHG)
                danger:'0',//危急值采集
                minSystolicBloodPressure:90,//最小收缩压
                maxSystolicBloodPressure:139,//最大收缩压
                minDiastolicBloodPressure:60,//最小舒张压
                maxDiastolicBloodPressure:80,//最大舒张压
                minHeartRate:60,//最低心率
                maxHeartRate:100,//最高心率
                minOxygenSaturation:10,//最低氧饱和度
                maxOxygenSaturation:20,//最高氧饱和度
                minBreatheRate:10,//最低呼吸频率
                maxBreatheRate:20,//最高呼吸频率

            },
            rules: {
                executedayTime:
                 [{
                    required: true,
                    trigger: "blur",
                    message: "时间不能为空",
                }],
                intervals:[{
                    required: true,
                    trigger: "blur",
                    message: "采集间隔值不可以空",
                },
                 {validator:checkintervals,trigger:'blur'}
                ],
                danger:[{
                    required: true,
                    trigger: "blur",
                    message: "危急值采集不可以空",
                }],
                blood:[
                  {validator:checkBodyBlood,trigger:'blur'}
                ],
                blood2:[
                  {validator:checkBodyBlood2,trigger:'blur'}
                ],
                rate:[
                  {validator:checkrate,trigger:'blur'}
                ],
                saturation:[
                  {validator:checksaturation,trigger:'blur'}
                ]
            },
        }
    },
    methods:{
      cancel() {
        this.$emit("submit");
    },
  checkFun(max,min,text,text2,callback,valiRule){
          if(!valiRule.int.test(min)&&min!=""){
            callback(new Error('请输入正整数'))
          }else{
            if (min < 0) {
              callback(new Error('范围在0-999'));
            } else if(min > 999){
              callback(new Error('范围在0-999'));
            }else {
                if(max&&min==""){
                  callback(new Error(text));
                }else if(min&&max==""){
                  callback(new Error(text2));
                }else{
                  callback();
                }
            }
          }
          if(!valiRule.int.test(max)&&max!=""){
            callback(new Error('请输入正整数'))
          }else{
            if (max < 0) {
              callback(new Error('范围在0-999'));
            } else if(max > 999){
              callback(new Error('范围在0-999'));
            }else {
               if(max&&min==""){
                  callback(new Error(text));
                }else if(min&&max==""){
                  callback(new Error(text2));
                }else{
                  callback();
                }
            }
          }
  },
  initData(){
        this.$refs['form'].resetFields();
    },
    getInit(patientRecordId,collectTypes){
      let that = this;
      that.patientRecordId = patientRecordId;
      that.collectType = collectTypes;
      let url = '/api/icu/vitalSigns/collect/'+patientRecordId+'?collectType='+collectTypes;
      that.$axios.get(global.url + url).then(function(res){
          if(res.data.msg==201){
            let list = res.data.respData;
            if(list){
              that.form.id = list.id;
            for(let key in that.form){
              if(list.hasOwnProperty(key)&& list[key] !=null){
                  that.form[key] = String(list[key]);
              }
            }
            }else{
              that.form={
                intervalType:'1',//采集间隔
                intervals:'',//心率(次/每分)
                executedayTime:'',//时间(mmHG)
                danger:'0',//危急值采集
                minSystolicBloodPressure:90,//最小收缩压
                maxSystolicBloodPressure:139,//最大收缩压
                minDiastolicBloodPressure:60,//最小舒张压
                maxDiastolicBloodPressure:80,//最大舒张压
                minHeartRate:60,//最低心率
                maxHeartRate:100,//最高心率
                minOxygenSaturation:10,//最低氧饱和度
                maxOxygenSaturation:20,//最高氧饱和度
                minBreatheRate:10,//最低呼吸频率
                maxBreatheRate:20,//最高呼吸频率
              }
            }
          }
      })
      // this.form={
      //     intervalType:'1',//采集间隔
      //     intervals:'',//心率(次/每分)
      //     executedayTime:'',//血压(mmHG)
      //     danger:'1',//危急值采集
      //     minSystolicBloodPressure:90,//最小收缩压
      //     maxSystolicBloodPressure:139,//最大收缩压
      //     minDiastolicBloodPressure:60,//最小舒张压
      //     maxDiastolicBloodPressure:80,//最大舒张压
      //     minHeartRate:60,//最低心率
      //     maxHeartRate:100,//最高心率
      //     minOxygenSaturation:10,//最低呼吸频率
      //     maxOxygenSaturation:20,//最高呼吸频率
      //   }
      //   this.getInit();
    },
    addSubmit(formName) {
      let that = this;
      that.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.form);
          let tempForm = this.form;
          let flag = (tempForm.minSystolicBloodPressure!=""&&tempForm.maxSystolicBloodPressure!="")
          ||(tempForm.minDiastolicBloodPressure!=""&&tempForm.maxDiastolicBloodPressure!="")
          ||(tempForm.minHeartRate!=""&&tempForm.maxHeartRate!="")
          ||(tempForm.maxOxygenSaturation!=""&&tempForm.minOxygenSaturation!="")
          if(!flag){
             that.$message({
                  message: '请填写危急值数据',
                  type: 'info'
                });
            return false;
          }
          that.$emit("submit");
          let url = "/api/icu/vitalSigns/collect";
          that.form.patientRecordId = that.patientRecordId;
          that.form.collectType = that.collectType;
          that.form.collectTimes = that.collectType;
          let obj = {};
          if(that.collectType==1){ //手动采集
            obj.patientRecordId = that.form.patientRecordId;
            obj.collectTimes = that.form.collectType;
            obj.collectType = that.collectType;
            obj.executedayTime = that.form.executedayTime;
          }else{
            obj = that.form;
          }
          that.$axios.post(global.url + url,obj).then(function (res) {
             if(res.data.msg==201){
              that.$message({
                message: res.data.content,
                type: 'success'
              });
               that.$emit('refresh');
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
    }
}
</script>
<style lang="scss">
    .addtab02 {
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
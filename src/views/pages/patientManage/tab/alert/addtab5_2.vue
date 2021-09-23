<template>
  <div class="pullPipe">
      <el-form ref="form" :model="form" label-width="160px" :rules="rules">
      <el-row>
        <el-col :span="20">
          <el-form-item label="管理时间" prop="manageTime">
            <el-date-picker
              v-model="form.manageTime"
              type="datetime"
              size="small"
              placeholder="选择时间"
              align="left"
              :default-value="new Date()"
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
              <el-form-item label="管理内容" prop="type">
                  <el-select v-model="form.type">
                    <el-option v-for="(item,index) in typeList" :key="index" :value="Number(item.type)" :label="item.name"></el-option>
                </el-select>
              </el-form-item>   
          </el-col>
      </el-row>
        <el-row v-if="form.type==3">
          <el-col :span="20">
              <el-form-item label="管理方式" prop="wayOfInfection">
                  <el-select v-model="form.wayOfInfection">
                    <el-option v-for="(item,index) in managList" :key="index" :value="Number(item.value)" :label="item.name"></el-option>
                </el-select>
              </el-form-item>   
          </el-col>
      </el-row>
      <el-row v-if="form.type==1||form.type==2">
          <el-col :span="20">
              <el-form-item :label="form.type==2?'拔管原因':'换管原因'" prop="reason">
                  <el-radio-group v-model="form.reason">
                    <el-radio  :label="1">计划内</el-radio>
                    <el-radio  :label="2">非计划内</el-radio>
                </el-radio-group>
              </el-form-item>   
          </el-col>
      </el-row>
      <el-row v-if="(form.type==1||form.type==2)&&(form.reason==2)">
          <el-col :span="20">
            <el-form-item :label="form.type==2?'非计划内拔管':'非计划内换管'" prop="changeReason">
             <el-select v-model="form.changeReason" placeholder="请选择">
                <el-option
                v-for="(item,index) in reasonList"
                :key="index"
                :label="item.name"
                :value="item.value">
                </el-option>
            </el-select>
            </el-form-item>
          </el-col>
      </el-row>
    </el-form>
    <div class="addbtn">
            <el-button size="medium" @click="cancel('form')">取消</el-button>
            <el-button size="medium" @click="addSubmit('form')" type="primary">确定</el-button>
        </div>
  </div>
</template>

<script>
export default {
    props:['changeReasonList','id','recordId','outhosTime','manageList'],
    data(){
        return{
            form:{
                manageTime:"",
                type:"",
                wayOfInfection:"",
                reason:"",
                changeReason:""
            },
            typeList:[
              {type:1,name:'换管'},
              {type:2,name:'拔管'},
              {type:3,name:'感染管理'},
            ],
            rules:{
                  manageTime:[{
                    required: true,
                    trigger: "change",
                    message: "时间不为空",
                }],
                  type:[{
                    required: true,
                    trigger: "change",
                    message: "管理内容不为空",
                }],
                  changeReason:[{
                    required: true,
                    trigger: "change",
                    message: "非计划内不为空",
                }],
            },
            num:null,
            pickerOptions:{
            disabledDate: time => {
              if(this.outhosTime){
                return time.getTime() > new Date(this.outhosTime);
              }else{
                return time.getTime() > new Date().getTime();
              }
            }
          },
        }
    },
    computed:{
        reasonList(){
            return this.changeReasonList
        },
        managList(){
          return this.manageList
        },
        getId(){
            return this.id;
        },
         patientRecordId(){
          return this.recordId;
        }
    },
    methods:{
        init(num){
             this.form.manageTime = "";
             this.form.type ="";
             this.form.changeReason ="";
             this.form.wayOfInfection = "";
             this.num = num;
             this.$refs['form'].resetFields();
        },
        cancel(formName){
           this.$emit("submit",1);
           this.$refs[formName].resetFields();
        },
        addSubmit(formName){
            let that = this;
                that.$refs[formName].validate((valid) => {
                if (valid) {
                let url = "/api/icu/pipe/manage";
                that.form.patientRecordId = that.patientRecordId;
                that.form.isChange = that.num;
                that.form.id = this.getId;
                that.$axios.post(global.url + url, that.form).then(function (res) {
                    if (res.data.msg == 201) {
                    that.$emit("submit");
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
        }
    }
}
</script>

<style lang="scss">
.pullPipe {
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
<template>
    <el-dialog 
        :visible.sync="isVisible"
        title="编辑重点患者交班备注" 
        :close-on-click-modal='false'
        :close-on-press-escape='false'
        :modal-append-to-body="false"
         width="840px"
         top="18vh"
        @close="closeEditDialog"
         v-dialogDrag>
        <div class="form_keyPatientEdit">
            <el-form 
                ref="ruleForm" 
                :model="ruleForm"
                :rules="rules"
                :label-width="dialog.formLabelWidth" 
                style="margin:10px;width:auto;">
                <el-form-item label="床位号:" >
                  <el-col :span="8">{{ruleForm.bedNo}}</el-col>
                  <el-col :span="8" >患者ID:{{ruleForm.inhosNum}}</el-col>
                  <el-col :span="8" class="forrm_header">患者姓名: {{ruleForm.patientName}}</el-col>
                </el-form-item>
                
                <el-form-item prop='statusQuo'  label="现状:">
                    <el-input type="textarea" autosize placeholder="请输入" v-model="ruleForm.statusQuo" :maxlength="200" class="inputInner"></el-input>
                </el-form-item>
                <el-form-item prop='background' label="背景:">
                    <el-input type="textarea" autosize placeholder="请输入" v-model="ruleForm.background" :maxlength="200"  class="inputInner"></el-input>
                </el-form-item>
                 <el-form-item prop='advice' label="建议:">
                    <el-input type="textarea" autosize placeholder="请输入" v-model="ruleForm.advice" :maxlength="200"  class="inputInner"></el-input>
                </el-form-item>
                 <el-form-item prop='assessment' label="评估:">
                    <el-input type="textarea" autosize placeholder="请输入" v-model="ruleForm.assessment" :maxlength="200"  class="inputInner"></el-input>
                </el-form-item>
                  <!-- <el-form-item prop='specialEvent' label="特殊事件:">
                    <el-input type="textarea" :rows="2" placeholder="请输入" v-model="ruleForm.specialEvent"  class="inputInner"></el-input>
                </el-form-item> -->
                <el-form-item  class="text_right">
                    <el-button @click="isVisible = false">取 消</el-button>
                    <el-button type="primary" @click="onSubmit('ruleForm')">提  交</el-button>
                </el-form-item>

            </el-form>
        </div>
    </el-dialog>
</template>

<script>
// import moment from "moment";
  export default {
      name:'editFundDialogs',
        data(){
        
          return {
            isVisible: this.isEditShow,
            //  newTime:"",
            ruleForm:{
                bedNo:'',
                patientName:'',
                inhosNum:'',
                statusQuo:'',
                background:'',
                advice:'',
                assessment:"",
                // specialEvent:'',
            },
            rules: {
              // userName: [{required: true, message : '用户名不能为空！',trigger : 'blur'}],
              // tel:[{required: true, validator: checkTel, trigger: "blur" }],
              // unit: [{required: true, validator: checkUnitName, trigger: "blur" }],
            },
            //详情弹框信息
            dialog: {
                width:'400px',
                formLabelWidth:'120px'
            }
          }
      },
      props:{
          isEditShow:Boolean,
          dialogEditRow:Object,
          newTime:String,
           shiftTimePeriod:String,
      },
 
      mounted(){
            // this.newTime = moment().format("YYYY-MM-DD")
            console.log(this.newTime)
            this.form = this.dialogEditRow;
            this.ruleForm.bedNo = this.form.bedNo
            this.ruleForm.patientName = this.form.patientName
            this.ruleForm.inhosNum = this.form.inhosNum
            this.ruleForm.statusQuo = this.form.statusQuo
            this.ruleForm.background = this.form.background
            this.ruleForm.advice = this.form.advice
            this.ruleForm.assessment = this.form.assessment
            // this.ruleForm.specialEvent = this.form.specialEvent
            console.log(this.form)
      },
      methods:{
          closeEditDialog(){
              this.$emit('closeEditDialog');
          },
          //表单提交
          onSubmit(ruleForm){
            this.$refs[ruleForm].validate((valid) => {
              if(valid){
                      let params = {
                        id:this.form.id,
                        patientRecordId:this.form.patientRecordId,
                        shiftClass:1,//1代表护士端 2代表医生端
                        shiftDate:this.newTime,//交班日期
                        statusQuo:this.ruleForm.statusQuo,
                        background:this.ruleForm.background,
                        advice:this.ruleForm.advice,
                        assessment:this.ruleForm.assessment,
                         shiftTimePeriod:this.shiftTimePeriod,
                        // specialEvent:this.ruleForm.specialEvent
                      };
                      let url = '/api/icu/transition/editFocusTransitionRemark'
                      this.$axios.post(global.url + url,params).then(response=>{
                          if(response.data.msg==201){
                              this.$message({
                              message: "编辑成功",
                              type: "success"
                            });
                            this.isVisible = false;
                            this.$emit("getFundList");
                          }else{
                            console.log(response.data.msg);
                          }
                      })
                 }
            })
          }
      }
  }
</script>

<style lang="scss" scoped>
  .form_keyPatientEdit{
    .forrm_header{
      // float:right;
     text-align: right;
      padding-right:35px;
    }
    .search_container{
        margin-bottom: 20px;
    }
    .btnRight{
        float: right;
        margin-right: 0px !important;
    }
    .searchArea{
        background:rgba(255,255,255,1);
        border-radius:2px;
        padding: 18px 18px 0;
    }
    .text_right{
    text-align: right;
    }
    .inputInner{
      width:620px;
    }
  }
    
</style>

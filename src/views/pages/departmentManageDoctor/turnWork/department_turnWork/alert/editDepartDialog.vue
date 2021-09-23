<template>
    <el-dialog 
        :visible.sync="isVisible"
        title="编辑新病人交班数据" 
        :close-on-click-modal='false'
        :close-on-press-escape='false'
        :modal-append-to-body="false"
         width="480px"
         top="18vh"
        @close="closeEditDialog"
         v-dialogDrag>
        <div class="form_departEdit">
            <el-form 
                ref="ruleForm" 
                :model="ruleForm"
                :rules="rules"
                :label-width="dialog.formLabelWidth" 
                style="margin:10px;width:auto;">
                <el-form-item prop='bedNo' label="床位号:">
                    <!-- <el-input type="text" v-model="ruleForm.userName" :disabled="true"></el-input> -->
                    <p >{{ruleForm.bedNo}}</p>
                </el-form-item>
                
                <el-form-item prop='inhosNum'  label="患者ID:">
                    <!-- <el-input v-model="ruleForm.tel"></el-input> -->
                    <p>{{ruleForm.inhosNum}}</p>
                </el-form-item>
                <el-form-item prop='patientName' label="患者姓名:">
                    <!-- <el-input v-model="ruleForm.unit" :maxlength="30"></el-input> -->
                     <p>{{ruleForm.patientName}}</p>
                </el-form-item>
                 <!-- <el-form-item prop='diagnosisContent' label="诊断:">
                      <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请输入"
                        v-model="ruleForm.diagnosisContent"
                        class="inputInner">
                      </el-input>
                    
                </el-form-item> -->
                 <el-form-item prop='inDeptCase' label="入科情况:">
                    <el-input
                      type="textarea"
                      :rows="2"
                      placeholder="请输入"
                      v-model="ruleForm.inDeptCase"
                      :maxlength="200"
                       class="inputInner">
                    </el-input>
                    
                </el-form-item>
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
      name:'editDepartDialog',
        data(){
          return {
            // newTime:"",
            isVisible: this.isEditShow,
            ruleForm:{
                bedNo:'',
                inhosNum:'',
                patientName: '',
                diagnosisContent:'',
                inDeptCase:'',
                
            },
            rules: {
              allergicHistory: [{required: true, message : '过敏史不能为空！',trigger : 'blur'}],
              diagnosisContent: [{required: true, message : '诊断不能为空！',trigger : 'blur'}],
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
        //  this.newTime = moment().format("YYYY-MM-DD")
        //  let dateTime =new Date(new Date().getTime()-24*60*60*1000)
        // let getMouth = (dateTime.getMonth()+1)>10?(dateTime.getMonth()+1):"0"+(dateTime.getMonth()+1)
        // let newDateTime =dateTime.getFullYear()+ "-" + getMouth + "-" + dateTime.getDate();
        // if(new Date().getHours()>=8&&new Date().getHours()<17){
        //   this.shiftTimePeriod="晨"
        //   this.newTime = moment().format("YYYY-MM-DD")
        // }else if(new Date().getHours()<8){
        //   this.shiftTimePeriod="夜"
        //   this.newTime = newDateTime
        // }else if(new Date().getHours()>=17){
        //   this.shiftTimePeriod="夜"
        //   this.newTime = moment().format("YYYY-MM-DD")
        // }
        console.log(this.newTime)
           this.form = this.dialogEditRow;
            this.ruleForm.bedNo = this.form.bedNo
            this.ruleForm.inhosNum = this.form.inhosNum
            this.ruleForm.patientName = this.form.patientName
             this.ruleForm.diagnosisContent = this.form.diagnosisContent
              this.ruleForm.inDeptCase = this.form.inDeptCase
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
                  shiftType:4,
                  inDeptCase:this.ruleForm.inDeptCase,
                  patientRecordId:this.form.patientRecordId,
                  shiftClass:2,//1代表护士端 2代表医生端
                  shiftDate:this.newTime,//交班日期
                  shiftTimePeriod:this.shiftTimePeriod
                };
                let url = '/api/icu/transition/editDoctorTransition'
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

<style lang="scss">
  .form_departEdit{
    .inputInner{
      width:224px;
    }
    .search_container {
      margin-bottom: 20px;
    }
    .searchArea {
      background: rgba(255, 255, 255, 1);
      border-radius: 2px;
      padding: 18px 18px 0;
    }
    
    .text_right{
      text-align: right;
    }
  }
    
</style>

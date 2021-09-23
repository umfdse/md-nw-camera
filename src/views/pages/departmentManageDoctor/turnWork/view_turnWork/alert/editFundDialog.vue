<template>
    <el-dialog 
        :visible.sync="isVisible"
        title="编辑用户" 
        :close-on-click-modal='false'
        :close-on-press-escape='false'
        :modal-append-to-body="false"
         width="500px"
         top="18vh"
        @close="closeEditDialog"
         v-dialogDrag>
        <div class="form">
            <el-form 
                ref="ruleForm" 
                :model="ruleForm"
                :rules="rules"
                :label-width="dialog.formLabelWidth" 
                style="margin:10px;width:auto;">
                <el-form-item prop='userName' label="用户名:">
                    <el-input type="text" v-model="ruleForm.userName" :disabled="true"></el-input>
                </el-form-item>
                
                <el-form-item prop='tel'  label="电话号码:">
                    <el-input v-model="ruleForm.tel"></el-input>
                </el-form-item>
                <el-form-item prop='unit' label="单位名称:">
                    <el-input v-model="ruleForm.unit" :maxlength="30"></el-input>
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
  export default {
      name:'editFundDialogs',
        data(){
          var checkTel = (rule, value, callback) => {
          let regPhone = /^1\d{10}$/;
            if (value == "") {
              callback(new Error("电话号码不能为空"));
            } else if(!regPhone.test(value)) {
                callback(new Error("请输入正确的手机号"));
              }else{
                callback();
              }
            
          };
          var checkUnitName = (rule, value, callback) => {
            if (value == "") {
              callback(new Error("单位名称不能为空"));
            } else {
              callback();
            }
          };
          return {
            isVisible: this.isEditShow,
            ruleForm:{
                userName:'',
                tel:'',
                unit: '',
            },
            rules: {
              userName: [{required: true, message : '用户名不能为空！',trigger : 'blur'}],
              tel:[{required: true, validator: checkTel, trigger: "blur" }],
              unit: [{required: true, validator: checkUnitName, trigger: "blur" }],
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
          dialogEditRow:Object
      },
 
      mounted(){
           this.form = this.dialogEditRow;
            this.ruleForm.userName = this.form.userName
            this.ruleForm.tel = this.form.tel
            this.ruleForm.unit = this.form.unit
            console.log(this.form)
      },
      methods:{
          closeEditDialog(){
              this.$emit('closeEditDialog');
          },
          //表单提交
          onSubmit(ruleForm){
            // debugger
            this.$refs[ruleForm].validate((valid) => {
              if(valid){
                let params = {};
                let url = Inter.editMessage
                  .replace("{id}", this.form.id)
                  .replace("{tel}", this.ruleForm.tel)
                  .replace("{unit}",  this.ruleForm.unit)
                  .replace("{userName}", this.ruleForm.userName)
                this.$api.get(url, params, response => {
                  if (response.code == 200) {
                    this.$message({
                      message: "修改成功",
                      type: "success"
                    });
                    this.isVisible = false;
                    this.$emit("getFundList");
                  } else {
                    console.log(response.message);
                  }
                });
                 }
            })
          }
      }
  }
</script>

<style lang="scss" scoped>
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
</style>

<template>
    <el-dialog 
        :visible.sync="isVisible"
        title="编辑用户" 
        :close-on-click-modal='false'
        :close-on-press-escape='false'
        :modal-append-to-body="false"
         width="480px"
         top="18vh"
        @close="closeEditDialog"
         v-dialogDrag>
        <div class="form_userEdit">
            <el-form 
                ref="ruleForm" 
                :model="ruleForm"
                :rules="rules"
                :label-width="dialog.formLabelWidth" 
                style="margin:10px;width:auto;">
           <el-form-item prop="originalName" label="药品通用名:">
          <el-input type="text" v-model="ruleForm.originalName" class="inputInner" ></el-input>
        </el-form-item>
        <!-- <el-form-item prop="realName" label="用户姓名:">
          <el-input type="text" v-model="form.realName" class="inputInner"  ></el-input>
        </el-form-item> -->
         <el-form-item prop="specification" label="规格:">
          <!-- <el-select v-model="form.userType"  placeholder="请选择" class="inputInner">
            <el-option
              v-for="item in userTypes"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            >
            </el-option>
          </el-select> -->
            <el-input type="text" v-model="ruleForm.specification" class="inputInner" ></el-input>
        </el-form-item>
        <el-form-item prop="unit" label="单位:">
          <el-select v-model="ruleForm.unit"  placeholder="请选择" class="inputInner">
            <el-option
              v-for="item in doseUnits"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item prop="transferDose" label="入量转化:">
          <el-input type="text" v-model="ruleForm.transferDose" class="inputInner"  ></el-input>
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
          var validatePass = (rule, value, callback) => {
              let regPass =/[0-9a-zA-Z]/;
              if (value === "") {
                callback(new Error("用户工号不能为空"));
              } else if (!regPass.test(value)) {
                callback(new Error("请输入字母或数字"));
              } else {
                callback();
              }
            };
          return {
             doseUnits:[
              {value:"盒",name:"盒"},
              {value:"支",name:"支"},
              {value:"瓶",name:"瓶"},
              {value:"袋",name:"袋"},
              {value:"mg",name:"mg"},
              {value:"g",name:"g"}
            ],
            roles: [
     
            ],
            isVisible: this.isEditShow,
            ruleForm:{
                id:"",
                originalName:"",
                specification:"",
                unit:"",
                transferDose:"",
            },
            rules: {
                originalName: [{ required: true, message: '药品通用名不能为空', trigger: "blur" }],
                specification: [{ required: true, message: '规格不能为空', trigger: "blur" }],
                unit: [{ required: true, message: '单位不能为空', trigger: "blur" }],
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
            console.log(this.form)
            this.ruleForm.id = this.form.id
            this.ruleForm.originalName = this.form.originalName
            this.ruleForm.specification = this.form.specification
            this.ruleForm.unit = this.form.unit
             this.ruleForm.transferDose = this.form.transferDose
            // for(let i=0;i<this.derpartments.length;i++){
            //   if(this.derpartments[i].deptName==this.form.deptName){
            //     this.ruleForm.isDept.push(this.derpartments[i].id) 
            //   }
            // }
            
            // this.ruleForm.role.push(this.form.roleName)
            console.log(this.form)
            console.log(this.ruleForm)
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
                let params = {
                  originalName:this.ruleForm.originalName,
                  specification:this.ruleForm.specification,
                  id:this.ruleForm.id,
                  unit:this.ruleForm.unit,
                  transferDose:this.ruleForm.transferDose,


                };
                let url = "/api/icu/advice/dict/editAdviceTransferDictData"
                let that = this
                 this.$axios.post(global.url + url,params).then( response => {
                  if (response.data.msg == 201) {
                    that.$message({
                      message: "修改成功",
                      type: "success"
                    });
                    that.isVisible = false;
                    that.$emit("getFundList");
                  } else {
                    that.$message.error(response.data.content)
                  }
                });
                 }
            })
          }
      }
  }
</script>

<style lang="scss" scoped>
  .form_userEdit{
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
    .inputInner{
      width:224px
    }
  }
   
</style>

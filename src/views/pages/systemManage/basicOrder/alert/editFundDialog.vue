<template>
    <el-dialog 
        :visible.sync="isVisible"
        title="编辑模板" 
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
          <!-- <el-form-item prop="username" label="原始医嘱执行方式:">
            <el-input type="text" v-model="ruleForm.username" class="inputInner"></el-input>
          </el-form-item> -->
          <el-form-item prop="sortName" label="系统执行方式:">
            <!-- <el-input type="text"   v-model="ruleForm.realName"  class="inputInner" ></el-input> -->
             <el-select v-model="ruleForm.sortName"   placeholder="请选择" class="inputInner" @change="changeDept">
              <el-option
                v-for="item in sortNames"
                :key="item.sortName"
                :label="item.sortName"
                :value="item.sortName"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item prop="isDept" label="匹配入量清算:">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.value"
               >
              </el-switch>
            </template>  
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


            sortNames: [],
            isVisible: this.isEditShow,
            ruleForm:{
                id:"",
                sort:"",
                sortName:"",
            },
            rules: {
                sortName: [{ required: true, message: '系统执行方式不能为空', trigger: "blur" }],
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
            this.getSysMethod()
            this.form = this.dialogEditRow;
            console.log(this.form)
            this.ruleForm.id = this.form.id
            this.ruleForm.sortName = this.form.sortName
            this.ruleForm.sort = this.form.sort
            
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
        changeDept(){
          console.log(this.ruleForm.isDept)
        },
          closeEditDialog(){
              this.$emit('closeEditDialog');
          },
           //获取执行方式
          getSysMethod(){
            let url = "/api/icu/advice/dict/getSortDictData"
            let that = this
            this.$axios.get(global.url + url).then(function (res) {
                that.sortNames = res.data.respData
            });
          },
          //表单提交
          onSubmit(ruleForm){
            // debugger
            this.$refs[ruleForm].validate((valid) => {
              if(valid){
                let params = {
                  sort:this.ruleForm.sort,
                  sortName:this.ruleForm.sortName,
                  id:this.ruleForm.id,
               


                };
                let url = "/api/icu/advice/dict/editAdministrationDictData"
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

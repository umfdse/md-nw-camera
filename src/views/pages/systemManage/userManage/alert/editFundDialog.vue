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
          <el-form-item prop="username" label="用户工号:">
            <el-input type="text" v-model="ruleForm.username" class="inputInner"></el-input>
          </el-form-item>
          <el-form-item prop="realName" label="用户姓名:">
            <el-input type="text"   v-model="ruleForm.realName"  class="inputInner" ></el-input>
          </el-form-item>
          <el-form-item prop="isDept" label="所属科室:">
            <el-select v-model="ruleForm.isDept"   placeholder="请选择" class="inputInner" @change="changeDept">
              <el-option
                v-for="item in derpartments"
                :key="item.id"
                :label="item.deptName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="role" label="角色名:">
            <el-select v-model="ruleForm.role"   placeholder="请选择" class="inputInner">
              <el-option
                v-for="item in roles"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
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
            isDerpartment:"",
            role:"",
            derpartments: [
              
            ],
            roles: [
     
            ],
            isVisible: this.isEditShow,
            ruleForm:{
                id:"",
                username:"",
                realName:"",
                isDept:"",
                role:"",
            },
            rules: {
                role: [{ required: true, message: '角色名不能为空', trigger: "blur" }],
                isDept: [{ required: true, message: '所属科室不能为空', trigger: "blur" }],
                realName: [ { required: true, message: '用户姓名不能为空', trigger: 'blur' }],
                username: [{ required: true, validator: validatePass, trigger: "blur" }],
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
            this.getDept()
            this.getRole()
            this.form = this.dialogEditRow;
            console.log(this.form)
            this.ruleForm.id = this.form.id
            this.ruleForm.realName = this.form.realName
            this.ruleForm.username = this.form.username
            this.ruleForm.isDept = this.form.deptId
             this.ruleForm.role = Number(this.form.roleId)
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
           //获取科室列表
          getDept(){
            let url = "/base/user/getDepts"
            let that = this
            this.$axios.get(global.url + url).then(function (res) {
                that.derpartments = res.data.respData
            });
          },
            //获取角色列表
          getRole(){
            let that = this
            let url = "/base/user/getRoles"
            this.$axios.get(global.url + url).then(function (res) {
                that.roles = res.data.respData
            });
          },
          //表单提交
          onSubmit(ruleForm){
            // debugger
            this.$refs[ruleForm].validate((valid) => {
              if(valid){
                let params = {
                  realName:this.ruleForm.realName,
                  username:this.ruleForm.username,
                  userId:this.ruleForm.id,
                  deptIds:[this.ruleForm.isDept],
                  roleIds:[this.ruleForm.role],


                };
                let url = "/base/user/editDoctorUser"
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

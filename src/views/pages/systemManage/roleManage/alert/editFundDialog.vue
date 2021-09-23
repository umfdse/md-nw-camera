<template>
    <el-dialog 
        :visible.sync="isVisible"
        title="编辑角色" 
        :close-on-click-modal='false'
        :close-on-press-escape='false'
        :modal-append-to-body="false"
         width="840px"
        @close="closeEditDialog"
         v-dialogDrag>
        <div class="form_roleEdit">
           <el-form
              class="form"
                ref="form"
                :model="form"
                :rules="rules"
                :label-width="dialog.formLabelWidth"
                style="margin:0 24px; width: auto"
              >
                <div class="form_header">
                  <el-form-item class="leftInput" prop="name" label="角色名称:">
                    <el-input v-model="form.name"  placeholder="请输入角色名称" class="inputInner"></el-input>
                  </el-form-item>
                  <el-form-item class="rightInput" prop="description" label="角色说明:">
                    <el-input v-model="form.description" placeholder="请输入角色说明" class="inputInner"></el-input>
                  </el-form-item>
                </div>
                <div class="form_table">
                   <el-tree
                      :data="treeData"
                      show-checkbox
                      node-key="menuId"
                      :default-checked-keys="menuIds"
                      :default-expanded-keys="menus"
                      
                      ref="tree"
                      :props="defaultProps">
                    </el-tree>
                </div>
                <el-form-item class="text_right">
                  <el-button @click="isVisible = false">取 消</el-button>
                  <el-button type="primary" @click="onSubmit('form')">提 交</el-button>
                </el-form-item>
              </el-form>
        </div>
    </el-dialog>
</template>

<script>
import Pagination from "@/components/pagination";
  export default {
    components:{
      Pagination
    },
      name:'editFundDialogs',
        data(){
          return {
            isVisible: this.isEditShow,
             treeData:[],
             defaultProps: {
                children: 'children',
                label: 'menuName'
              },
             menuIds:[],
             menus:[],
            tableData: [],
            roleName:"",
            userName:"",
            limitsNumber:"",
             code:"",
            form:{
                name:'',
                description:'',
            },
              incomePayData: {
                page: 1,
                limit: 10,
                name: ""
              },
              loading:false,
              pageTotal: 0,
            rules: {
              name: [{required: true, message : '角色名称不能为空！',trigger : 'blur'}],
              description: [{required: true, message : '角色说明不能为空！',trigger : 'blur'}],
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
          this.form.name = this.dialogEditRow.name
          this.code = this.dialogEditRow.code
          console.log(this.dialogEditRow)
          this.form.description = this.dialogEditRow.description
          let that = this
          let url = '/base/menu/list'
           this.$axios.get(global.url + url).then( (response) => {
              if (response.data.msg == 201) {
                that.treeData =  response.data.respData 
              } else {
                that.$message.error(response.data.content)
              }
            });
            if(this.dialogEditRow.menuIds){
              this.menuIds =this.dialogEditRow.menuIds.split(",")
            }
            if(this.dialogEditRow.menuIds){
               this.menus =this.dialogEditRow.menuIds.split(",")
            }
           
            if(this.menus.length){
              for(let i=0;i<this.menus.length;i++){
                  this.menus[i]=Number(this.menus[i])
              }
            }
            // console.log(this.menus)
          },
      methods:{
          closeEditDialog(){
              this.$emit('closeEditDialog');
          },
          handleCurrentChange(val) {
            this.incomePayData.page = val;
            this.loadData();
          },
          // 每页显示多少条
          handleSizeChange(val) {
            this.incomePayData.limit = val;
            this.loadData();
          },
          //表单提交
          onSubmit(form){
            // debugger
            this.$refs[form].validate((valid) => {
              let that = this
                console.log(this.$refs[form]);
                this.$refs.form.validate((valid) => {
                  if (valid) {
                    //表单数据验证完成之后，提交数据;
                    let params = {
                        roleId:this.dialogEditRow.roleId,
                        code:this.code,
                        name:this.form.name,
                        description:this.form.description,
                         menuIds:this.$refs.tree.getCheckedKeys().join(),
                        // menuIds:this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys()).join(),
                    };
                    let url = "/base/role/updateRoleMenu"
                    this.$axios.post(global.url + url,params).then((response) => {
                      if (response.data.msg == 201) {
                        that.$message({
                          type: "success",
                          message: "编辑角色成功",
                        });
                        that.isVisible = false;
                          that.$emit("getFundList");
                      } else {
                        that.$message.error(response.data.content)
                      }
                    });
                  }
                });
            })
          }
      }
  }
</script>

<style lang="scss" >
    .form_roleEdit{
        max-height: 550px;
        overflow: auto;
        .inputInner{
              width:224px;
        }
        .search {
            height: 32px;
            line-height: 32px;
            padding:0 10px;
            margin-top:30px;
            .limitTitle {
              float: left;
              font-size: 16px;
              color:#000;
            }
          }
          .limitInput {
            float: right;
          }
          .text_right {
            text-align: right;
            padding-right: 10px;
          }
          .form_header{
            height: 32px;
            display: flex;
            justify-content: space-between;

            .rightInput{
              padding-right:80px;
            }
          }
          .form_table{
            padding-left:20px;
          }
          .table_container .el-table th{
            height: 38px!important
          }
    }

</style>

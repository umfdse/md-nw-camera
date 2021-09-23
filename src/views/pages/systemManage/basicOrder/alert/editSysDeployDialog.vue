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
                <div class="obserTable">
                  <el-table
                    v-loading="loading"
                    :data="tableData"
                    style="width: 100%"
                    align="center"
                  >
                    <el-table-column prop="sortName" label="系统执行方式"  ></el-table-column>
                    <el-table-column  label="匹配入量计算">
                    <template slot-scope="scope">
                          <el-switch
                            :active-value="1"
                            :inactive-value="0"
                            @change="changeSwith(scope.row)"
                            v-model="scope.row.isCalculation"
                          >
                          </el-switch>
                          <!-- <el-switch
                          v-else-if="scope.row.isCalculation != 1"
                            v-model="scope.row.isCalculation"
                          >
                          </el-switch> -->
                        </template>  
                    </el-table-column>
                  </el-table>
                </div>
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
      name:'editSysDeployDialogs',
        data(){
          return {
            sortNames: [],
            loading:true,
            isVisible: this.isEditShow,
            ruleForm:{
                id:"",
                sort:"",
                sortName:"",
            },
            tableData:[],
            adviceSortDicts:[],
            rules: {
               
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
          changeSwith(row){
            for(let i=0;i<this.adviceSortDicts.length;i++){
              if(this.adviceSortDicts[i].sort==row.sort){
                this.adviceSortDicts[i].isCalculation = row.isCalculation
              }
            }
          },
           //获取执行方式
          getSysMethod(){
            this.loading = false
            let url = "/api/icu/advice/dict/getSortDictData"
            let that = this
            this.$axios.get(global.url + url).then(function (res) {
                that.tableData = res.data.respData
                that.adviceSortDicts = that.tableData
            });
          },
          //表单提交
          onSubmit(ruleForm){
            // debugger
            this.$refs[ruleForm].validate((valid) => {
              if(valid){
                let params = {
                  adviceSortDicts:this.adviceSortDicts
                };
                let url = "/api/icu/advice/dict/editSortDictData"
                let that = this
                 this.$axios.post(global.url + url,params).then( response => {
                  if (response.data.msg == 201) {
                    that.$message({
                      message: "修改成功",
                      type: "success"
                    });
                    that.isVisible = false;
                    // that.$emit("getFundList");
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

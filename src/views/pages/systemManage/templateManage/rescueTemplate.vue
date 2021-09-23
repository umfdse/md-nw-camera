<template>
  <div class="rescueTemplateWrapper">
    <div class="main">
      <div class="pageSearch">
        <el-input v-model="searchForm.templateName" placeholder="请输入模板名称搜索">
          <i
            class="el-icon-search searchIcon"
            slot="suffix"
            @click="search">
          </i>
        </el-input>
        <el-button @click="reset" class="resetBtn">重置</el-button>
        <el-button type="primary" class="addBedBtn" @click="addTemplate">新增模板</el-button>
      </div>
      <div class="pageContent">
        <table-mixin :pageSize="pageSize" :pageNum="pageNum" :total="total" :pagination="pagination"
                     :handleSizeChange="handleSizeChange" :handleCurrentChange="handleCurrentChange">
          <el-table v-loading="tableData.loading" :data="tableData.body">
            <div slot="empty" class="noData"></div>
            <el-table-column v-for="(item,index) in tableData.head" :prop="item.key" :label="item.name"
                             align="left" :formatter="formatter"
                             :key="index" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="操作" align="left" width="200">
              <template slot-scope="scope">
                <el-link type="primary" style="margin-right: 24px;padding-right: 0" @click="editTemplate(scope.row)">编辑
                </el-link>
                <el-link type="primary" @click="deleteTemplate(scope.row)">删除</el-link>
              </template>
            </el-table-column>
          </el-table>
        </table-mixin>
      </div>
    </div>
    <!--新增模板-->
    <el-dialog :title="isEdit ? '编辑模板':'新增模板'" :visible.sync="addTemplateDialog" width="480px"
               class="addTemplateDialog">
      <el-form :model="addTemplateForm" label-width="100px" :rules="rules" label-position="right" ref="addTemplateForm">

        <el-form-item label="模板类型:" prop="type">
          <el-select v-model="addTemplateForm.type" clearable filterable>
            <el-option v-for="(item,index) in typeOptions"
                       :key="index"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="模板名称:" prop="templateName">
          <el-input v-model="addTemplateForm.templateName" placeholder="请输入"></el-input>
        </el-form-item>

        <el-form-item label="模板内容:" prop="templateContent">
          <el-input v-model="addTemplateForm.templateContent" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="addTemplateDialog = false">取 消</el-button>
        <el-button size="small" style="margin-right: 0" type="primary" @click="saveTemplate('addTemplateForm')">确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {tableDataMixin} from '../../../../assets/js/mixin'

  export default {
    name: "rescueTemplate",
    mixins: [tableDataMixin],
    data() {
      return {
        pagination: true,
        isEdit: false,
        tableData: {
          loading: false,
          head: [
            {
              name: '模板名称',
              key: 'name'
            },
            {
              name: '模板类型',
              key: 'type'
            },
            {
              name: '模板内容',
              key: 'content'
            }
          ],
          body: [],
          option: [],
          condition: []
        },
        searchForm: {
          templateName: ''
        },
        rules: {
          type: [
            {required: true, message: '请选择模板类型', trigger: 'blur'},
          ],
          templateName: [
            {required: true, message: '请输入模板名称', trigger: 'blur'},
          ],
          templateContent: [
            {required: true, message: '请输入模板内容', trigger: 'blur'},
          ]
        },
        addTemplateDialog: false,
        addTemplateForm: {
          id: '',
          type: '',
          templateName: '',
          templateContent: ''
        },
        typeOptions: [
          {
            label: '药品',
            value: 2
          },
          {
            label: '抢救措施',
            value: 3
          }
        ],
      }
    },
    mounted() {
      this.initData()
    },
    methods: {
      dealNull(val) {
        return val ? val : ''
      },
      //初始化数据
      initData() {
        this.getTableData()
      },
      getTableData() {
        this.loading = true
        let param = {
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          data: {
            name: this.searchForm.templateName
          }
        }
        this.$axios({
          url: global.url + '/api/nursing/cfg/list',
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          data: param
        }).then(res => {
          let resData = res.data
          this.dealTableResponse(resData)
        })
      },
      formatter(row, column, cellValue, index) {
        let formatValue = cellValue
        if(column.property=='type'){
          if(formatValue==2){
            formatValue = '药品'
          }else if(formatValue==3){
            formatValue = '抢救措施'
          }
        }
        return formatValue
      },
      addTemplate() {
        this.isEdit = false
        this.addTemplateDialog = true
        this.$nextTick(() => {
          this.$refs['addTemplateForm'].resetFields()
        })
      },
      editTemplate(row) {
        this.isEdit = true
        this.addTemplateDialog = true
        this.$nextTick(() => {
          this.$refs['addTemplateForm'].resetFields()
          this.addTemplateForm.id = row.id
          this.addTemplateForm.templateName = row.name
          this.addTemplateForm.type = row.type
            this.addTemplateForm.templateContent = row.content
        })
      },
      //删除模板
      deleteTemplate(row) {
        this.$confirm('确认要删除这条数据吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = {
            id: row.id
          }
          const formData = new FormData()
          Object.keys(param).forEach((key) => {
            formData.append(key, param[key]);
          })
          this.$axios({
            url: global.url + '/api/nursing/cfg/disable',
            method: 'post',
            headers: {
              'Content-Type': 'application/json'
            },
            data: formData
          }).then(res => {
            if (res.data.msg == 201) {
              this.$message.success(res.data.content)
              this.search()
            } else {
              this.$message.error(res.data.content)
            }
          })
        }).catch(() => {

        });

      },
      //新增编辑床位保存
      saveTemplate(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let param = {
              type: this.addTemplateForm.type,
              name: this.addTemplateForm.templateName,
              content: this.addTemplateForm.templateContent,
            }
            if (this.isEdit) {
              param.id = this.addTemplateForm.id
            }
            this.$axios({
              url: global.url + '/api/nursing/cfg/save',
              method: 'post',
              headers: {
                'Content-Type': 'application/json'
              },
              data: param
            }).then(res => {
              if (res.data.msg == 201) {
                this.$message.success(res.data.content)
                this.addTemplateDialog = false
                this.search()
              } else {
                this.$message.error(res.data.content)
              }
            })
          }
        })
      },
      reset(){
        this.searchForm.templateName = ''
        this.search()
      }
    }
  }
</script>
<style lang="scss">
  .rescueTemplateWrapper {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    .addTemplateDialog {
      .el-select, .el-input {
        width: 224px;
      }
    }

    .el-dialog__body {
      display: flex;
      justify-content: center;
      padding-right: 40px !important;
    }
    .el-button {
      margin-right: 16px;
      margin-left: 0;
    }
    .el-table th {
      background: rgba(0, 0, 0, 0.02);
      color: rgba(0, 0, 0, 0.87);
    }
    .main {
      height: 100%;
      background: #FFFFFF;
      box-sizing: border-box;
      .el-table {
        min-height: 390px;
      }
      .pageSearch {
        display: flex;
        padding: 0 !important;
        height: 64px;
        align-items: center;
        position: relative;
        .el-select, .el-input {
          width: 224px;
        }
        .resetBtn{
          margin-left: 10px;
        }
        .addBedBtn {
          position: absolute;
          right: 0;
          top: 18px;
        }
        .searchIcon {
          margin-top: 9px;
          cursor: pointer;
        }
      }
      .noData {
        margin: 0 auto;
        background-image: url("/static/img/noData_table.png");
        width: 234px;
        height: 224px;
        background-size: 100%;
        background-repeat: no-repeat;
        padding: 0;
        margin-top: 50px;
      }
    }
  }
</style>

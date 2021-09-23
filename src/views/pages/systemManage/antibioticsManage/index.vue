<template>
  <div class="antibioticsManageWrapper">
    <div class="main">
      <div class="pageSearch">
        <el-input v-model="searchForm.name" placeholder="请输入名称搜索">
          <i
            class="el-icon-search searchIcon"
            slot="suffix"
            @click="search">
          </i>
        </el-input>
        <el-button @click="reset" class="resetBtn">重置</el-button>
        <!-- <el-button type="primary" class="addBedBtn" @click="addDrug">新增药物</el-button> -->
      </div>
      <div class="pageContent">
        <div class="leftContent">
          <div v-for="(item,index) in allDrugGroupList" :key="index" class="groupItem" @click="changeDrugGroup(item,index)"
               :class="{'active_item':currentIndex==index}">
            <div class="name">{{item.groupName}}</div>
            <p class="selectedBorder" v-if="currentIndex==index"></p>
          </div>
        </div>
        <div class="rightContent">
          <table-mixin :pageSize="pageSize" :pageNum="pageNum" :total="total" :pagination="pagination"
                       :handleSizeChange="handleSizeChange" :handleCurrentChange="handleCurrentChange">
            <el-table v-loading="tableData.loading" :data="tableData.body">
              <div slot="empty" class="noData"></div>
              <el-table-column>
                <template slot-scope="scope">
                  <div class="drugTableCell">
                    <div class="content">
                      <p>药物名称: <span>{{scope.row.name}}</span></p>
                      <p class="ellipsis">规格:<span>{{scope.row.description}}</span></p>
                    </div>
                    <div class="handle">
                      <el-link type="primary" style="margin-right: 24px;padding-right: 0" @click="editDrug(scope.row)">编辑</el-link>
                      <el-link type="primary" @click="deleteDrug(scope.row)">删除</el-link>
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </table-mixin>
        </div>
      </div>
    </div>
    <!--新增药物-->
    <el-dialog :title="isEdit ? '编辑药物':'新增药物'" :visible.sync="addDrugDialog" width="480px"
               class="addDrugDialog">
      <el-form :model="drugForm" label-width="100px" :rules="rules" label-position="right" ref="drugForm">
        <!-- <el-form-item label="药物种类:" prop="groupCode">
          <el-select v-model="drugForm.groupCode" placeholder="请选择种类" @change="search" clearable filterable>
            <el-option
              v-for="(item,index) in drugGroupList"
              :key="index"
              :label="item.groupName"
              :value="item.groupCode">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="药物名称:" prop="name">
          <el-input v-model="drugForm.name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="规格:" prop="description">
          <el-input v-model="drugForm.description" placeholder="请输入"
                    type="textarea"
                    :rows="4">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="addDrugDialog = false">取 消</el-button>
        <el-button size="small" style="margin-right: 0" type="primary" @click="saveDrug('drugForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {tableDataMixin} from '../../../../assets/js/mixin'

  export default {
    name: "antibioticsManage",
    mixins: [tableDataMixin],
    data() {
      return {
        pagination: true,
        isEdit: false,
        tableData: {
          loading: false,
          body: [],
          option: [],
          condition: []
        },
        searchForm: {
          name: ''
        },
        drugForm: {
          id: '',
          name: '',
          description:'',
          groupName:'',
          groupCode:''
        },
        rules: {
          groupCode: [
            {required: true, message: '请选择药物种类', trigger: 'blur'},
          ],
          name: [
            {required: true, message: '请输入药物名称', trigger: 'blur'},
          ],
          description: [
            {required: true, message: '请输入药物规格', trigger: 'blur'},
          ]
        },
        addDrugDialog: false,
        currentGroup:null,
        currentIndex:0,
        allDrugGroupList:[],
        drugGroupList:[],
        drugType:1
      }
    },
    mounted() {
    },
    methods: {
      dealNull(val) {
        return val ? val : ''
      },
      //初始化数据
      initData(type) {
        this.drugType = type
        this.currentGroup=null
        this.currentIndex=null
        this.search()
        this.getDrugGroupData()
      },
      // 切换药品
      changeDrugGroup(item, index) {
        this.currentIndex = index
        this.currentGroup = item
        this.search()
      },
      getDrugGroupData() {
        let param = {
          type:this.drugType
        }
        this.$axios({
          url: global.url + '/base/drug/queryGroup',
          method: 'get',
          headers: {
            'Content-Type': 'application/json'
          },
          params: param
        }).then(res => {
          this.drugGroupList = JSON.parse(JSON.stringify(res.data.respData))
          this.allDrugGroupList = res.data.respData
          this.allDrugGroupList.unshift({
            groupName: '全部',
            groupCode: ''
          })
        })
      },

      getTableData() {
        this.loading = true
        let param = {
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          name:this.searchForm.name,
          type:this.drugType,
          groupCode:this.currentGroup  &&  this.currentGroup.groupCode ? this.currentGroup.groupCode: ''
        }
        this.$axios({
          url: global.url + '/base/drug/list',
          method: 'get',
          headers: {
            'Content-Type': 'application/json'
          },
          params: param
        }).then(res => {
          let resData = res.data
          this.dealTableResponse(resData)
        })
      },
      formatter(row, column, cellValue, index) {
        let formatValue = cellValue
        return formatValue
      },
      addDrug() {
        this.isEdit = false
        this.addDrugDialog = true
        this.$nextTick(() => {
          this.$refs['drugForm'].resetFields()
        })
      },
      editDrug(row) {
        this.isEdit = true
        this.addDrugDialog = true
        this.$nextTick(() => {
          this.$refs['drugForm'].resetFields()
          this.drugForm.id = row.id
          this.drugForm.name = row.name
          this.drugForm.description = row.description
          this.drugForm.groupCode = row.groupCode
        })
      },
      //删除模板
      deleteDrug(row) {
        this.$confirm('确认要删除这条数据吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios({
            url: global.url + `/base/drug/delete/${row.id}`,
            method: 'post',
            headers: {
              'Content-Type': 'application/json'
            },
            data: {}
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
      saveDrug(formName) {
        let _this = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let groupName = ''
            this.drugGroupList.forEach(item=>{
              if(_this.drugForm.groupCode == item.groupCode){
                groupName = item.groupName
              }
            })
            let param = {
              "groupCode": this.drugForm.groupCode,
              "groupName": groupName,
              "name": this.drugForm.name,
              "description": this.drugForm.description,
              "type": this.drugType
            }
            if (this.isEdit) {
              param.id = this.drugForm.id
            }
            this.$axios({
              url: global.url + '/base/drug/save',
              method: 'post',
              headers: {
                'Content-Type': 'application/json'
              },
              data: param
            }).then(res => {
              if (res.data.msg == 201) {
                this.$message.success(res.data.content)
                this.addDrugDialog = false
                this.search()
              } else {
                this.$message.error(res.data.content)
              }
            })
          }
        })
      },
      reset(){
        this.searchForm.name = ''
        this.search()
      }
    }
  }
</script>
<style lang="scss">
  .antibioticsManageWrapper {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    .addDrugDialog {
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
      background: #ffffff;
      color: rgba(0, 0, 0, 0.87);
      display: none;
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
        .searchIcon {
          margin-top: 9px;
          cursor: pointer;
        }
      }
      .pageContent{
          display: flex;
        .leftContent{
          width: 180px;
          border-right:1px solid #E8E8E8;
          min-height: 100%;
          overflow-y: auto;
          background: #FFFFFF;
          .active_item {
            background: #E7F1FC;
          }
          .groupItem {
            width: 100%;
            display: flex;
            flex-direction: column;
            padding: 20px 12px 16px 16px;
            box-sizing: border-box;
            cursor: pointer;
            position: relative;
            .selectedBorder {
              position: absolute;
              left: 0;
              top: 0;
              height: 100%;
              width: 2px;
              background: #1374E4;
              z-index: 1;
            }
            .name {
              font-size: 16px;
              font-weight: 600;
              color: #1B1B1B;
              flex: 1;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
        }
        .rightContent{
          width: calc(100% - 180px);
          padding-left: 10px;
          box-sizing: border-box;

          .drugTableCell{
            display: flex;
            align-items: center;
            .content{
              width:calc(100% - 100px);
              display: flex;
              flex-direction: column;
              color: rgba(27, 27, 27, 0.87);
              p{
                width: 100%;
              }
              .ellipsis{
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                word-break: break-all;
                width: calc(100% - 40px);
              }
            }
            .handle{
              width:100px;
            }
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
  }
</style>

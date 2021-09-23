<template>
  <div class="bedManageWrapper">
    <div class="main">
      <div class="pageSearch">
      <!--  <el-select v-model="bedManageForm.hospital" placeholder="请选择院区" clearable filterable>
          <el-option
            v-for="(item,index) in hospitalOption"
            :key="index"
            :label="item.hosregionName"
            :value="item.hosregionCode">
          </el-option>
        </el-select>
        <el-select style="margin-left: 16px" v-model="bedManageForm.department"  placeholder="请选择科室"
                   clearable
                   filterable>
          <el-option
            v-for="(item,index) in departmentOption"
            :key="index"
            :label="item.deptName"
            :value="item.id">
          </el-option>
        </el-select>
        <el-button type="primary" size="small" class="search" @click="search">查询</el-button>
        <el-button size="small"  @click="resetSearch()">重置</el-button>-->
        <span class="title">当前科室:<span class="content">{{deptName}}</span></span>
        <el-button type="primary" class="addBedBtn" @click="addBed" v-if="`bed:add`">新增床位</el-button>
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
                <el-link type="primary" v-if="scope.row.bedState==0 && `bed:edit`" @click="stopOrStartBed(scope.row,1)" >启用</el-link>
                <el-link type="primary" v-if="(scope.row.bedState==1|| scope.row.bedState==null) && `bed:edit`" @click="stopOrStartBed(scope.row,0)"  >停用</el-link>
                <el-link type="primary" @click="editBed(scope.row)" vi-if="`bed:edit`">编辑
                </el-link>
                <el-link type="primary" @click="deleteBed(scope.row)"  v-if="`bed:delete`">删除</el-link>
              </template>
            </el-table-column>
          </el-table>
        </table-mixin>
      </div>
    </div>
    <!--新增床位-->
    <el-dialog :title="isEdit ? '编辑床位':'新增床位'" :visible.sync="addBedDialog" width="480px" class="addBedDialog">
      <el-form :model="addBedForm" label-width="100px" :rules="rules" label-position="right" ref="addBedForm">
        <el-form-item label="床位号:" prop="bedNo">
          <el-input v-model="addBedForm.bedNo" placeholder="请输入" :disabled="isEdit"></el-input>
        </el-form-item>

   <!--     <el-form-item label="床位状态:" prop="bedStatus">
          <el-select v-model="addBedForm.bedStatus" placeholder="请选择状态" clearable filterable>
            <el-option
              v-for="(item,index) in bedStatusOption"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>-->

        <el-form-item label="所属科室:" prop="deptId">
          <el-select v-model="addBedForm.deptId" disabled placeholder="请选择科室" clearable
                     filterable>
            <el-option
              v-for="(item,index) in departmentOption"
              :key="index"
              :label="item.deptName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关联设备:" prop="device">
          <el-select v-model="addBedForm.device" placeholder="请选择设备" multiple clearable filterable>
            <el-option
              v-for="(item,index) in deviceOption"
              :key="index"
              :label="item.deviceName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="addBedDialog = false">取 消</el-button>
        <el-button size="small" style="margin-right: 0" type="primary" @click="saveBed('addBedForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {tableDataMixin} from '../../../../assets/js/mixin'
  import {saveSessionData, getSessionData, removeSessionData} from "@/utils/SimpleSessionStorageService.js";
  export default {
    name: "bedManage",
    mixins: [tableDataMixin],
    data() {
      return {
        pagination: true,
        isEdit: false,
        tableData: {
          loading: false,
          head: [
            {
              name: '床号',
              key: 'bedNo'
            },
            {
              name: '床位状态',
              key: 'bedState'
            },
            {
              name: '关联设备',
              key: 'deviceList'
            }
          ],
          body: [],
          option: [],
          condition: [],
          recordTime: ''
        },
        bedManageForm: {
          hospital: '',
          department: ''
        },
        rules: {
          bedNo: [
            {required: true, message: '请输入床位号', trigger: 'blur'},
          ],
          deptId:[{required: true, message: '请选择科室', trigger: 'blur'},]
        },
        hospitalOption: [],
        departmentOption: [],
        addBedDialog: false,
        addBedForm: {
          id: '',
          bedNo: '',
          device: [],
          deptId: '',
        },
        hasPatient:'',//床位是否有病患
      /*  bedStatusOption: [{
          label: '启用',
          value: 1
        }, {
          label: '停用',
          value: 0
        }],*/
        deviceOption: [],
        allDeviceOption: [],
        deptName:''
      }
    },
    mounted() {
      this.addBedForm.deptId = getSessionData('deptId') ? Number(getSessionData('deptId')): ''
      this.deptName = getSessionData('deptName') ? getSessionData('deptName'): ''
      this.initData()
    },
    methods: {
      resetSearch(){
        this.bedManageForm.hospital = ''
        this.bedManageForm.department = ''
        this.search()
      },
      dealNull(val) {
        return val ? val : ''
      },
      //初始化数据
      initData() {
        this.getDepartmentList()
        this.search()
        this.getAllDeviceList()
        this.getDeviceList()
        this.getHospitalArea()
      },
      //获取科室列表
      getDepartmentList() {
        let param = {
          hospitalCode: '',
          pageSize: 0,
          pageNum: 1,
          type:'1'
        }
        this.$axios({
          url: global.url + '/base/dept/list',
          method: 'get',
          headers: {
            'Content-Type': 'application/json'
          },
          params: param
        }).then(res => {
          let data=res.data
          if (data.msg ===201) {
            this.departmentOption = data.respData && data.respData.list ? data.respData.list : []
          } else {
            this.$message.error(data.content)
          }
        })
      },
      //获取所有设备列表
      getAllDeviceList() {
        let param = {
          hospitalCode: '',
          pageNum:1,
          pageSize:0,
        }
        this.$axios({
          url: global.url + '/base/device/list',
          method: 'get',
          headers: {
            'Content-Type': 'application/json'
          },
          params: param
        }).then(res => {
          let data=res.data
          if (data.msg ===201) {
            this.allDeviceOption = data.respData && data.respData.list ? data.respData.list : []
          } else {
            this.$message.error(data.content)
          }
        })
      },
      //获取未绑定的设备列表
      getDeviceList() {
        let param = {
          hospitalCode: '',
        }
        this.$axios({
          url: global.url + '/base/device/NoBandinglist',
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          data: param
        }).then(res => {
          let data=res.data
          if (data.msg ===201) {
            console.log(222222222222222222)
            this.deviceOption = data.respData && data.respData ? data.respData : []
          } else {
            this.$message.error(data.content)
          }

        })
      },
      //获取医院区域
      getHospitalArea() {
        let param = {
          hospitalCode: '',
        }
        this.$axios({
          url: global.url + '/base/hosregion/list',
          method: 'get',
          headers: {
            'Content-Type': 'application/json'
          },
          params: param
        }).then(res => {
          let data =res.data
          if (data.msg ===201) {
            this.hospitalOption = data.respData && data.respData.list ? data.respData.list : []
          } else {
            this.$message.error(data.content)
          }
        })
      },
      getTableData() {
        this.loading = true
        let param = {
          deptId: this.bedManageForm.department,
          hosregionId: this.bedManageForm.hospital,
          pageSize: this.pageSize,
          pageNum: this.pageNum
        }
        this.$axios({
          url: global.url + '/base/bed/queryBedDevices',
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
        //床位状态
        if (column.property == 'bedState') {
          if (formatValue === 1) {
            formatValue = '启用'
          } else if (formatValue === 0) {
            formatValue = '停用'
          }
        }
        //关联设备
        if (column.property == 'deviceList') {
          let deviceList = row.deviceList ? row.deviceList : []
          let deviceNameStr = []
          for (let item of deviceList) {
            deviceNameStr.push(item.deviceName)
          }
          formatValue = deviceNameStr.length != 0 ? deviceNameStr.join(',') : ''
        }
        return formatValue
      },
      addBed() {
        this.getDeviceList()
        this.isEdit = false
        this.addBedDialog = true
        this.$nextTick(() => {
          this.$refs['addBedForm'].resetFields()
        })
      },
      //编辑床位
     async editBed(row) {
       this.isEdit = true
       await this.$axios({
         url: global.url + '/base/device/NoBandinglist',
         method: 'post',
         headers: {
           'Content-Type': 'application/json'
         },
         data: {
           hospitalCode: '',
         }
       }).then(res => {
         let data=res.data
         if (data.msg ===201) {
           this.deviceOption = data.respData && data.respData ? data.respData : []
         } else {
           this.$message.error(data.content)
         }
       })
        this.addBedDialog = true
        let deviceIdList = []
        let _this = this
        if (row && row.deviceList) {
          row.deviceList.forEach(item => {
            deviceIdList.push(item.deviceId)
            _this.allDeviceOption.forEach(dItem=>{
              if(dItem.id == item.deviceId){
                _this.deviceOption.push(dItem)
              }
            })
          })
        }

        this.$nextTick(() => {
          this.hasPatient = 0
          this.$refs['addBedForm'].resetFields()
          this.addBedForm.id = row.id
          this.addBedForm.bedNo = row.bedNo
          this.addBedForm.deptId = row.deptId
          this.addBedForm.device = deviceIdList
          this.hasPatient = row.state
        })
      },
      //删除床位
      deleteBed(row) {
        if(this.hasPatient && this.addBedForm.bedStatus==0){
          this.$message.error('该床位有病患, 不能删除!')
          return
        }
        this.$confirm('确认要删除这条数据吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = {
            bedId: row.id
          }
          const formData = new FormData()
          Object.keys(param).forEach((key) => {
            formData.append(key, param[key]);
          })
          this.$axios({
            url: global.url + '/base/bed/disable',
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
      saveBed(formName) {
        this.$refs[formName].validate((valid) => {
          if(valid){
            let selectedNo = this.addBedForm.device ? this.addBedForm.device : []
            let selectObjList = []
            for (let sItem of selectedNo) {
              for (let deviceItem of this.deviceOption) {
                if (sItem == deviceItem.id) {
                  selectObjList.push({
                    deviceName: deviceItem.deviceName,
                    deviceNo: deviceItem.deviceNo,
                    id: deviceItem.id
                  })
                }
              }
            }
            let param = {
              bedNo: this.addBedForm.bedNo,
              // bedState: this.addBedForm.bedStatus,
              deviceList: selectObjList,
              deptId: this.addBedForm.deptId
            }
            if (this.isEdit) {
              param.id = this.addBedForm.id
            }
            this.$axios({
              url: global.url + '/base/bed/saveBedDevices',
              method: 'post',
              headers: {
                'Content-Type': 'application/json'
              },
              data: param
            }).then(res => {
              if (res.data.msg == 201) {
                this.$message.success(res.data.content)
                this.addBedDialog = false
                this.search()
              } else {
                this.$message.error(res.data.content)
              }
            })
          }
        })
      },

      stopOrStartBed(row,state){
        let param = {
          bedNo: row.bedNo,
          bedState: state,
          deviceList: row.deviceList,
          deptId: row.deptId,
          id: row.id,
        }
        this.$axios({
          url: global.url + '/base/bed/saveBedDevices',
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          data: param
        }).then(res => {
          if (res.data.msg == 201) {
            this.$message.success(res.data.content)
            this.search()
          } else {
            this.$message.error(res.data.content)
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  .bedManageWrapper {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    .addBedDialog {
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
        .title{
          color:rgba(0,0,0,0.6)
        }
        .content{
          margin-left: 10px;
          color:rgba(0,0,0,0.6)
        }
        .search{
          margin-left: 16px;
        }
        .el-select, .el-input {
          width: 224px;
        }
        .addBedBtn {
          position: absolute;
          right: 0;
          top: 18px;
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

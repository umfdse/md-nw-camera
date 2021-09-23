<template>
  <div class="deviceManageWrapper">
    <div class="main">
      <div class="pageSearch">
   <!--     <el-select v-model="deviceManageForm.hospital" placeholder="请选择院区" clearable filterable>
          <el-option
            v-for="(item,index) in hospitalOption"
            :key="index"
            :label="item.hosregionName"
            :value="item.hosregionCode">
          </el-option>
        </el-select>
        <el-select style="margin-left: 16px" v-model="deviceManageForm.department"  placeholder="请选择科室" clearable
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
        <el-button type="primary" class="addDeviceBtn" @click="addDevice" v-if="`device:add`">新增设备</el-button>
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
                <el-link type="primary" v-if="scope.row.state==1&&`device:edit`" @click="closeDevice(scope.row,0)">关闭设备</el-link>
                <el-link type="primary" v-if="(scope.row.state==0|| scope.row.state==null)&&`device:edit`" @click="closeDevice(scope.row,1)">开启设备</el-link>
                <el-link type="primary" @click="editDevice(scope.row)" v-if="`device:edit`">编辑</el-link>
                <el-link type="primary" @click="deleteDevice(scope.row)" v-if="`device:delete`">删除</el-link>
              </template>
            </el-table-column>
          </el-table>
        </table-mixin>
      </div>
    </div>
    <!--新增设备-->
    <el-dialog :title="isEdit ? '编辑设备':'新增设备'" :visible.sync="addDeviceDialog" width="480px" class="addDeviceDialog">
      <el-form :model="addDeviceForm" label-width="100px" label-position="right" :rules="rules" ref="addDeviceForm">
        <el-form-item label="唯一识别码:" prop="deviceOutId">
          <el-input v-model="addDeviceForm.deviceOutId"  placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="设备名称:" prop="deviceName">
          <el-input v-model="addDeviceForm.deviceName"  placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="设备类型:" prop="deviceType">
          <el-select  v-model="addDeviceForm.deviceType" placeholder="请选择设备类型" clearable filterable>
            <el-option
              v-for="(item,index) in deviceTypeOption"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备公司:" prop="company">
          <el-input v-model="addDeviceForm.company"  placeholder="请输入设备公司"></el-input>
        </el-form-item>

        <el-form-item label="所属科室:" prop="deptId">
          <el-select v-model="addDeviceForm.deptId" disabled placeholder="请选择科室" clearable
                     filterable>
            <el-option
              v-for="(item,index) in departmentOption"
              :key="index"
              :label="item.deptName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注:" prop="deviceModel">
          <el-input v-model="addDeviceForm.deviceModel"  placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="addDeviceDialog = false">取 消</el-button>
        <el-button size="small" style="margin-right: 0" type="primary" @click="saveDevice('addDeviceForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {tableDataMixin} from '../../../../assets/js/mixin'
  import {saveSessionData, getSessionData, removeSessionData} from "@/utils/SimpleSessionStorageService.js";
  export default {
    name: "deviceManage",
    mixins: [tableDataMixin],
    data() {
      return {
        pagination: true,
        isEdit:false,
        tableData: {
          loading: false,
          head: [
            {
              name: '设备名称',
              key: 'deviceName'
            },
            {
              name: '设备类型',
              key: 'deviceType'
            },
            {
              name: '关联床位',
              key: 'bed'
            },
            {
              name: '设备状态',
              key: 'state'
            }
          ],
          body: [],
          option: [],
          condition: [],
          recordTime:''
        },
        deviceManageForm: {
          hospital:'',
          department:''
        },
        rules: {
          deviceOutId: [
            {required: true, message: '请输入设备厂商的唯一识别码', trigger: 'blur'},
          ]
        },
        hospitalOption:[],
        departmentOption:[],
        addDeviceDialog:false,
        addDeviceForm:{
          deptId:'',
          deviceOutId:'',
          id:'',
          deviceName:'',
          deviceType:'',
          deviceNo:'',
          company:'',
          deviceModel:''
        },
        deviceTypeOption:[{
          label:'呼吸机',
          value:1
        },{
          label:'监护仪',
          value:2
        },{
          label:'CRRT',
          value:3
        },{
          label:'ECMO',
          value:4
        }],
        deviceOption:[],
        deptName:''
      }
    },
    mounted() {
      this.addDeviceForm.deptId = getSessionData('deptId') ? Number(getSessionData('deptId')): ''
      this.deptName = getSessionData('deptName') ? getSessionData('deptName'): ''
      this.initData()
    },
    methods: {
      resetSearch(){
        this.deviceManageForm.hospital = ''
        this.deviceManageForm.department = ''
        this.search()
      },
      //初始化数据
      initData() {
        this.getDepartmentList()
        this.getTableData()
        this.getHospitalArea()
      },
      //获取科室列表
      getDepartmentList() {
        let param = {
          hospitalCode: '',
          pageSize: 0,
          pageNum: 1
        }
        this.$axios({
          url: global.url + '/base/dept/list',
          method: 'get',
          headers: {
            'Content-Type': 'application/json'
          },
          params: param
        }).then(res => {
          let data = res.data
          if (data.msg ===201) {
            this.departmentOption = data.respData && data.respData.list ? data.respData.list : []
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
          let data = res.data
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
          deptId: this.deviceManageForm.department,
          hosregionId: this.deviceManageForm.hospital,
          pageSize: this.pageSize,
          pageNum: this.pageNum
        }
        this.$axios({
          url: global.url + '/base/device/queryDeviceBed',
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
        if (column.property == 'bed') {
          formatValue = (row['bed'] && row['bed'].bedNo) ? row['bed'].bedNo: ''
        }
        if (column.property == 'state') {
            if(cellValue==1){
              formatValue = '启用'
            }else {
              formatValue = '停用'
            }
        }
        if (column.property == 'deviceType') {
          this.deviceTypeOption.forEach(item=>{
            if(cellValue == item.value){
              formatValue = item.label
            }
          })
        }
        return formatValue
      },
      addDevice(){
        this.isEdit = false
        this.addDeviceDialog = true
        this.$nextTick(() => {
          this.$refs['addDeviceForm'].resetFields()
        })
      },
      //编辑床位
      editDevice(row) {
        this.isEdit = true
        this.addDeviceDialog = true
        this.$nextTick(() => {
          this.$refs['addDeviceForm'].resetFields()
          this.addDeviceForm.id = row.id
          this.addDeviceForm.deviceName = row.deviceName
          this.addDeviceForm.deptId = row.deptId
          this.addDeviceForm.deviceType = row.deviceType
          this.addDeviceForm.deviceOutId = row.deviceOutId
          this.addDeviceForm.company = row.company
          this.addDeviceForm.deviceModel = row.deviceModel
        })
      },
      //删除设备
      deleteDevice(row) {

        this.$confirm('确认要删除这条数据吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = {
            deviceId:row.id
          }
          const formData = new FormData()
          Object.keys(param).forEach((key) => {
            formData.append(key, param[key]);
          })
          this.$axios({
            url: global.url + '/base/device/disable',
            method: 'post',
            data: formData
          }).then(res => {
            if (res.data.msg == 201) {
              this.$message.success(res.data.content)
              this.search()
            }else {
              this.$message.error(res.data.content)
            }
          })
        }).catch(() => {

        });

      },
      //新增编辑设备保存
      saveDevice(formName) {
        this.$refs[formName].validate((valid) => {
          if(valid){
            let param = {
              deviceOutId:this.addDeviceForm.deviceOutId,
              deptId:this.addDeviceForm.deptId,
              deviceName:this.addDeviceForm.deviceName,
              deviceType:this.addDeviceForm.deviceType,
              company:this.addDeviceForm.company,
              deviceModel:this.addDeviceForm.deviceModel,
            }
            if (this.isEdit) {
              param.id = this.addDeviceForm.id
            }
            this.$axios({
              url: global.url + '/base/device/save',
              method: 'post',
              headers: {
                'Content-Type': 'application/json'
              },
              data: param
            }).then(res => {
              if (res.data.msg == 201) {
                this.$message.success(res.data.content)
                this.addDeviceDialog = false
                this.search()
              }else {
                this.$message.error(res.data.content)
              }
            })
          }

        })
      },
      closeDevice(row,state){
        let param = {
          id:row.id,
          state:state //0关闭设备1开启设备
        }
        this.$axios({
          url: global.url + '/base/device/save',
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          data: param
        }).then(res => {
          if (res.data.msg == 201) {
            this.search()
            this.$message.success(res.data.content)
          }else {
            this.$message.error(res.data.content)
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  .deviceManageWrapper {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    .addDeviceDialog{
      .el-select,.el-input{
        width: 224px;
      }
    }

    .el-dialog__body{
      display: flex;
      justify-content: center;
      padding-right: 40px !important;
    }
    .el-button{
      margin-right: 16px;
      margin-left: 0;
    }
    .el-table th{
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
      .pageSearch{
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
        .el-select,.el-input{
          width: 224px;
        }
        .search{
          margin-left: 16px;
        }
        .addDeviceBtn{
          position: absolute;
          right: 0;
          top:18px;
        }
      }
      .noData {
        margin:0 auto;
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

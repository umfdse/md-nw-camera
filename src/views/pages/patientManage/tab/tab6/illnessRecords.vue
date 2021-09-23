<template>
  <div class="illnessRecordsWrapper">
    <div class="pageSearch">
      <el-button  size="small" :disabled="isDisabled" class="addPlan" @click="addNurseEvent"  v-has="`patient-record:add`">新增护理事件</el-button>
      <el-button  size="small" :disabled="isDisabled||inHosStatus" class="addPlan" @click="addEnter" v-has="`patient-record:add`">新增入院评估</el-button>
      <el-button size="small" class="addPlan" :disabled="isDisabled||outHosStatus" @click="addOut" v-has="`patient-record:add`">新增出院评估</el-button>
      <el-button  size="small" class="addPlan" :disabled="isDisabled || patientInfo.record.isRescue==1"  v-has="`patient-record:add`" @click="goPage('/patient/nursingMeasures',patientInfo)">新增护理措施</el-button>
      <el-date-picker
        style="width: 215px;margin-left: 16px"
        value-format="yyyy-MM-dd"
        v-model="recordTime"
        @change="search"
        type="date"
        placeholder="请选择日期">
      </el-date-picker>
    </div>

    <div class="pageContent">
      <table-mixin :pageSize="pageSize" :pageNum="pageNum" :total="total" :pagination="pagination"
                   :handleSizeChange="handleSizeChange" :handleCurrentChange="handleCurrentChange">
        <el-table v-loading="tableData.loading" :data="tableData.body">
          <div slot="empty" class="noData"></div>
          <el-table-column  prop="paTime" label="时间" align="left" show-overflow-tooltip>
            <template slot-scope="scope">
              <div style="display: flex">
                <span>{{scope.row.paTime}}</span>
                <span class="isRescue" v-if="scope.row.rescueId">抢救</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="operationName" label="操作记录"
                           align="left"
                            show-overflow-tooltip>
          </el-table-column>

          <el-table-column label="操作" align="left" width="200">
            <template slot-scope="scope">
              <el-link type="primary" v-has="`patient-record:update`" :disabled="isDisabled || (patientInfo.record.isRescue==1 && !(scope.row.isRescue==1 && currentUserId== scope.row.nursingUserId))" style="margin-right:24px;" @click="editRecord(scope.row)">查看详情</el-link>
              <el-link type="primary" v-has="`patient-record:delete`"  :disabled="isDisabled || (patientInfo.record.isRescue==1 && !(scope.row.isRescue==1 && currentUserId== scope.row.nursingUserId))" @click="deleteRecord(scope.row)">删除</el-link>
            </template>
          </el-table-column>
        </el-table>
      </table-mixin>
    </div>


    <!--护理事件-->
    <el-dialog :title="isEdit ?  '编辑护理事件':'新增护理事件'" :visible.sync="nurseEventDialog" width="480px"
               class="nurseEventDialog">
      <el-form :model="nurseEventForm" label-width="100px" label-position="right" :rules="rules" ref="nurseEventForm">
        <el-form-item label="时间:" prop="eventTime">
          <el-date-picker
            style="width: 224px"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm"
            format="yyyy-MM-dd HH:mm"
            @change="pickerChange_eventTime"
            v-model="nurseEventForm.eventTime"
            type="datetime"
            placeholder="请选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="事件类型:" prop="eventType">
          <el-select v-model="nurseEventForm.eventType" placeholder="请选择" clearable filterable  @change="eventTypeChange">
            <el-option
              v-for="(item,index) in eventTypeOptions"
              :key="index"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="事件内容:" prop="eventContent">
          <el-select v-model="nurseEventForm.eventContent" placeholder="请选择" clearable filterable>
            <el-option
              v-for="(item,index) in eventContentOptions"
              :key="index"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click=" nurseEventDialog = false">取 消</el-button>
        <el-button size="small" style="margin-right: 0" type="primary" @click="saveNurseEvent('nurseEventForm')">确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {tableDataMixin} from '../../../../../assets/js/mixin'
  import {getSessionData} from "@/utils/SimpleSessionStorageService"
  export default {
    name: "illnessRecords",
    props: ['patientInfo','isDisabled'],
    computed:{
    //  patientRecordId(){
    //   return this.patientInfo.record.recordId;
    // },
    patientId(){
        return this.patientInfo.id;
    }
  },
    mixins: [tableDataMixin],
    data() {
      return {
        pickerOptions: {
          disabledDate: (time) => {
            return time.getTime() > new Date().getTime()
          }
        },
        pagination: true,
        inHosStatus:false,
        outHosStatus:false,
        recordTime: '',
        tableData: {
          loading: false,
          head: [
            {
              name: '时间',
              key: 'paTime',
              sortable: false
            },
            {
              name: '操作记录',
              key: 'operationName',
              sortable: false
            }
            /*  {
                name: '执行状态',
                key: 'timeNode',
                sortable: false
              }*/
          ],
          body: [],
          option: [],
          condition: []
        },
        nurseEventDialog: false,
        isEdit:false,
        nurseEventForm: {
          id: '',
          eventTime:'',
          eventType: '',
          eventContent: ''
        },
        rules: {
          eventTime: [{required: true, message: '请选择时间', trigger: 'blur'}],
          eventType:[{required: true, message: '请选择事件类型', trigger: 'blur'}],
          eventContent:[{required: true, message: '请选择事件内容', trigger: 'blur'}]
        },
        eventData: [],
        eventTypeOptions:[
          {name:'基础护理',value:'1'},
          {name:'特殊事件',value:'2'}
        ],
        eventContentOptions:[],
        currentUserId:''
      }
    },
    mounted() {
      this.currentUserId = getSessionData("userId")
    },
    methods: {
      addEnter(){
         this.$router.push({
            path: '/patient/pathography/enter',
            query: {
              patientInfo: this.patientInfo,
              patientId:this.patientId
            }
          })
      },
      addOut(){
         this.$router.push({
            path: '/patient/pathography/out',
            query: {
              patientInfo: this.patientInfo,
              patientId:this.patientId
            }
         
          })
      },
      //初始化数据
      initData() {
        this.search()
        this.getNurseEvent()
        this.getEstimateStatus()
      },
      getEstimateStatus(){
        let url = "/api/icu/extimate/queryEstimateStatus"
        let params={
          patientRecordId: this.patientInfo.record.recordId,
        }
        let that = this
        this.$axios.post(global.url+url,params).then((res)=>{
          if(res.data.msg==201){
            if(res.data.respData.inHospitalStatus==1){
              that.inHosStatus=true
            }else{
              that.inHosStatus=false
            }
            if(res.data.respData.outHospitalStatus==1){
              that.outHosStatus=true
            }else{
              that.outHosStatus=false
            }
          }
        })
      },
      goPage(path, query) {
        this.$router.push({
          path: path,
          query: {
            patientInfo: this.patientInfo,
            recordTime: '',
            isRescue:0,
            rescueId:''
          }
        })
      },
      getTableData() {
        let param = {
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          patientRecordId: this.patientInfo.record.recordId,
          startTime:this.recordTime
        }
        this.$axios({
          url: global.url + '/api/icu/extimate/queryPathographyList',
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          data: param
        }).then((res) => {
          let data = res.data
          if (data.msg == 201) {
            this.dealTableResponse(data)
          } else {
            this.$message({
              message: data.content,
              type: 'warning'
            });
          }
        });
      },
      //编辑
      editRecord(row) {
          if(row.pathgraphyType && row.pathgraphyType==7){
            this.editNurseEvent(row.id)
          }else if(row.pathgraphyType && row.pathgraphyType==5){
              this.$router.push({
              path: '/patient/pathography/enterEdit',
              query: {
                patientInfo: this.patientInfo,
                patientId:this.patientId
              }
            })
          }
          else if(row.pathgraphyType && row.pathgraphyType==6){
                this.$router.push({
              path: '/patient/pathography/outEdit',
              query: {
                patientInfo: this.patientInfo,
                patientId:this.patientId
              }
            })
          }else {
            this.$router.push({
              path: '/patient/nursingMeasures',
              query: {
                patientInfo: this.patientInfo,
                rescueId:row.rescueId,
                isRescue:row.isRescue,
                recordTime: row.paTime, //护理时间或者开始抢救时间
                rescueStartTs:row.rescueStartTs,
                rescueEndTs:row.rescueEndTs //结束抢救时间
              }
            })
          }



      },
      //删除记录
      deleteRecord(row) {
        this.$confirm('确认要删除这条数据吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = {
            id: row.id,
            pathgraphyType: row.pathgraphyType
          }
          this.$axios({
            url: global.url + '/api/icu/extimate/deletePathographyById',
            method: 'post',
            headers: {
              'Content-Type': 'application/json'
            },
            data: param
          }).then(res => {
            if (res.data.msg == 201) {
              this.$message.success("删除成功")
              this.search()
              this.getEstimateStatus()
            } else {
              this.$message.error(res.data.content)
            }
          })
        }).catch(() => {

        });

      },
      getNurseEvent() {
        let param = {}
        this.$axios({
          url: global.url + '/api/icu/nurseEvent/queryEventConfiguration',
          method: 'get',
          headers: {
            'Content-Type': 'application/json'
          },
          params: param
        }).then((res) => {
          let data = res.data
          if (data.msg == 201) {
            this.eventData = data.respData ?  data.respData : []
            if(this.eventData.length>0){
              this.eventTypeChange()
            }
          } else {
            this.$message({
              message: data.content,
              type: 'warning'
            });
          }
        });
      },

      eventTypeChange(val){
        let _this = this
        _this.eventTypeOptions = []
        _this.eventContentOptions = []
        this.eventData.forEach(item=>{
          _this.eventTypeOptions.push({
            name:item.name,
            value:item.value
          })
          if(val && val==item.value){
           let hasVal = false
            _this.eventContentOptions = item.date
            _this.eventContentOptions.forEach(cItem=>{
              if(_this.nurseEventForm.eventContent == cItem.value){
                hasVal = true
              }
            })
            if(!hasVal){
              _this.nurseEventForm.eventContent = ''
            }
          }
        })
      },
      addNurseEvent(){
        this.isEdit = false
        this.nurseEventDialog = true
        this.$nextTick(()=>{
          this.$refs['nurseEventForm'].clearValidate()
          this.$refs['nurseEventForm'].resetFields()
        })
      },

      editNurseEvent(id){
        this.isEdit = true
        this.nurseEventDialog = true
        this.$nextTick(()=>{
          this.$refs['nurseEventForm'].clearValidate()
          this.$refs['nurseEventForm'].resetFields()
          this.$axios({
            url: global.url + '/api/icu/nurseEvent/queryEvent',
            method: 'get',
            headers: {
              'Content-Type': 'application/json'
            },
            params: {
              eventId:id
            }
          }).then(res => {
            if (res.data.msg == 201) {
              this.nurseEventForm.id= res.data.respData.id
              this.nurseEventForm.eventType= res.data.respData.eventType
              this.nurseEventForm.eventTime= res.data.respData.eventDate
              this.nurseEventForm.eventContent= res.data.respData.content
              this.eventTypeChange(this.nurseEventForm.eventType)
            } else {
              this.$message.error(res.data.content)
            }
          })
        })
      },

      saveNurseEvent(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let param = {
              "content": this.nurseEventForm.eventContent,
              "eventDate": this.nurseEventForm.eventTime,
              "eventType": this.nurseEventForm.eventType,
               patientRecordId: this.patientInfo.record.recordId,
            }
            if(this.isEdit){
              param.id=this.nurseEventForm.id
            }

            this.$axios({
              url: global.url + '/api/icu/nurseEvent/saveEvent',
              method: 'post',
              headers: {
                'Content-Type': 'application/json'
              },
              data: param
            }).then(res => {
              if (res.data.msg == 201) {
                this.$message.success(res.data.content)
                this.nurseEventDialog = false
                this.search()
              } else {
                this.$message.error(res.data.content)
              }
            })
          }
        })
      },
      formatter(row, column, cellValue, index) {
        let formatValue = cellValue
        return formatValue
      },
      pickerChange_eventTime(val){
        let date = new Date(val)
        if(date.getTime() > Date.now()){
          this.nurseEventForm.eventTime = ''
          this.$message.error('护理事件时间不能大于当前时间, 请重新选择')
          return false
        }else if(this.patientInfo.record.indeptFlag===0 && this.patientInfo.record.outdeptTime && date.getTime() > new Date(this.patientInfo.record.outdeptTime).getTime()){
          this.nurseEventForm.eventTime = ''
          this.$message.error('护理事件时间不能大于出科时间, 请重新选择')
          return false
        }
      }
    }
  }
</script>
<style lang="scss">
  .illnessRecordsWrapper {
    .el-button {
      margin-left: 16px;
    }
    .el-table th {
      background: rgba(0, 0, 0, 0.02);
      color: rgba(0, 0, 0, 0.87);
    }
    .nurseEventDialog {
      .el-select, .el-input {
        width: 224px;
      }
    }
    .el-dialog__body {
      display: flex;
      justify-content: center;
      padding-right: 40px !important;
    }
    .pageSearch {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
    .pageContent {
      margin-top: 16px;
      .el-table {
        min-height: 390px;
      }
      .isRescue{
        width: 40px;
        height: 22px;
        background: #FFE9F0;
        border-radius: 4px;
        color: #FF4C86;
        font-size: 12px;
        margin-left: 7px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .noData {
        background-image: url("/static/img/noData_table.png");
        width: 234px;
        height: 224px;
        margin: 0 auto;
        background-size: 100%;
        background-repeat: no-repeat;
        padding: 0;
        margin-top: 50px;
      }
    }
  }
</style>

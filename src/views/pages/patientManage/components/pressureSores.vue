<template>
  <div class="pressureSores">
    <div class="title">
      <span class="t">Bruden压疮评估统计</span>
      <div style="float: right">
        <el-button @click=" assessDetail">评估详情</el-button>
      </div>
    </div>
    <div class="chart">
      <div class="myChart" id="myChart"></div>
    </div>
    <div class="title">
      <span class="t">压疮数据（{{time}}）</span>
      <div style="float: right">
        <el-date-picker
          type="date"
          v-model="time"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          style="margin-right: 16px;"
          @change="changeHandle"
          placeholder="选择日期">
        </el-date-picker>
        <el-button type="primary" @click="show('add')"  :disabled="isDisabled" v-has="`pressure:add`">新增数据</el-button>
      </div>
    </div>
     <div class="echart_table_content">
    <el-table
    :data="tableData"
    v-loading="loading"
    style="width: 100%">
     <!-- :header-cell-style="{background:'rgba(0, 0, 0, 0.02)',color:'rgba(0, 0, 0, 0.87)',height: '54px', 'font-weight': '500'}"
    :row-style="{height: '54px', color: 'rgba(0, 0, 0, 0.87)'}" -->
      <div slot="empty" class="nodata">
        <img src="/static/img/nodata.png">
      </div>
      <el-table-column prop="inoutTime" label="时间" />
      <el-table-column prop="pressurePosition" label="部位" >
        <template slot-scope="scope">
          {{ pressurePositionList[scope.row.pressurePosition - 1] }}
        </template>
      </el-table-column>
      <el-table-column prop="pressureRange" align="right" label="压疮大小" />
      <el-table-column prop="degree" align="right" label="深度" />
      <el-table-column prop="sneak" align="right" label="潜行" />
        <el-table-column prop="secretion" align="center" label="分泌物">
        <template slot-scope="scope"> 
          {{ secretionList[scope.row.secretion - 1] }}
        </template>
      </el-table-column>
      <el-table-column prop="pressureLevel" align="center" label="分期">
        <template slot-scope="scope">
          {{ pressureLevelList[scope.row.pressureLevel - 1] }}
        </template>
      </el-table-column>
      <el-table-column prop="pressureSource" label="来源">
        <template slot-scope="scope">
          {{ pressureSourceList[scope.row.pressureSource - 1] }}
        </template>
      </el-table-column>
      <el-table-column prop="pressureTreatment" label="治疗" />
      <el-table-column prop="pressureNursing" label="护理措施">
        <template slot-scope="scope">
          {{ pressureNursingList[scope.row.pressureNursing - 1] }}
        </template>
      </el-table-column>
      <el-table-column prop="transfer" label="转归" >
        <template slot-scope="scope">
          {{ transferList[scope.row.transfer - 1] }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="show('update', scope.row.id)"  :disabled="isDisabled" v-has="`pressure:update`">编辑</el-button>
          <el-button type="text" size="small" @click="del(scope.row.id)"  :disabled="isDisabled" v-has="`pressure:delete`">删除</el-button> 
        </template>
      </el-table-column>
    </el-table>
     </div>
    <el-dialog
      :title="(dialogType === 'add' ? '新增' : '编辑') + '压疮数据'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="480px"
      @close="closeDialog"
      class="dialogMain"
    >
    <el-form label-width="130px" :rules="rules" class="form"  :model="ruleForm" ref="ruleForm" >
      <el-form-item label="时间：" prop="inoutTime" style="width: 224px">
        <!-- <el-date-picker
          type="datetime"
          v-model="ruleForm.inoutTime"
          :picker-options="pickerOptions"
          placeholder="选择时间">
        </el-date-picker> -->
          <el-date-picker
              v-model="ruleForm.inoutTime"
              type="datetime"
              size="small"
              placeholder="选择时间"
              align="left"
              :picker-options="pickerOptions"
              :default-value="new Date()"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
            ></el-date-picker>
      </el-form-item>
      <el-form-item label="部位：" prop="pressurePosition">
        <el-select v-model="ruleForm.pressurePosition" placeholder="请选择" style="width: 224px">
          <el-option
            v-for="(item, index) in pressurePositionList"
            :key="index"
            :label="item"
            :value="(index + 1)"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="压疮大小(cm²)：" prop="pressureRange">
        <el-input v-model="ruleForm.pressureRange"  style="width: 224px" />
      </el-form-item>
       <el-form-item label="深度(cm)：" prop="degree">
        <el-input v-model="ruleForm.degree"  style="width: 224px" />
      </el-form-item>
       <el-form-item label="潜行(cm)：" prop="sneak">
        <el-input v-model="ruleForm.sneak" style="width: 224px" />
      </el-form-item>
       <el-form-item label="分泌物：" prop="secretion">
        <el-select v-model="ruleForm.secretion" placeholder="请选择" style="width: 224px">
          <el-option
            v-for="(item, index) in secretionList"
            :key="index"
            :label="item"
            :value="(index + 1)"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="分期：" prop="pressureLevel">
        <el-select v-model="ruleForm.pressureLevel" placeholder="请选择" style="width: 224px">
          <el-option
            v-for="(item, index) in pressureLevelList"
            :key="index"
            :label="item"
            :value="(index + 1)"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="来源：" prop="pressureSource">
        <el-select v-model="ruleForm.pressureSource" placeholder="请选择" style="width: 224px">
          <el-option
            v-for="(item, index) in pressureSourceList"
            :key="index"
            :label="item"
            :value="(index + 1)"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="治疗：" prop="pressureTreatment">
        <el-input v-model="ruleForm.pressureTreatment" style="width: 224px" />
      </el-form-item>
      <el-form-item label="护理措施：" prop="pressureNursing">
        <el-select v-model="ruleForm.pressureNursing" placeholder="请选择" style="width: 224px">
          <el-option
            v-for="(item, index) in pressureNursingList"
            :key="index"
            :label="item"
            :value="(index + 1)"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="转归：" prop="transfer">
        <el-select v-model="ruleForm.transfer" placeholder="请选择" style="width: 224px">
          <el-option
            v-for="(item, index) in transferList"
            :key="index"
            :label="item"
            :value="(index + 1)"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </span>
  </el-dialog>
  </div>
</template>

<script>
// import moment from "moment";
export default {
  props:['patientInfo','isDisabled'],
  computed:{
    //  patientRecordId(){
    //   return this.patientInfo.record.recordId;
    // },
    patientId(){
        return this.patientInfo.id;
    }
  },
  data() {
     var checkDegree = (rule, value, callback) => {
        let regName =/^[1-9]\d{0,1}(?:\.\d{1,2})?$/;
        if (value == "") {
          callback(new Error("深度不能为空"));
        } else {
          if (!regName.test(value)) {
            callback(new Error("深度由1-99数字组成包含两位小数"));
          }else{
            callback()
          }
        }
    };
    var checkSneak = (rule, value, callback) => {
        let regName =/^[1-9]\d{0,1}(?:\.\d{1,2})?$/;
        if (value == "") {
          callback(new Error("潜行不能为空"));
        } else {
          if (!regName.test(value)) {
            callback(new Error("潜行由1-99数字组成包含两位小数"));
          }else{
            callback()
          }
        }
    };
    var checkPressureRange = (rule, value, callback) => {
        let regName =/^[1-9]\d{0,1}(?:\.\d{1,2})?$/;
        if (value == "") {
          callback(new Error("压疮大小不能为空"));
        } else {
          if (!regName.test(value)) {
            callback(new Error("压疮大小由1-99数字组成包含两位小数"));
          }else{
            callback()
          }
        }
    };
  
    return {
      time: '',
      myChart: null,
      tableData: [],
      patientRecordId: "",
      loading: false,
      dialogVisible: false,
      dialogType: '',
      selectId: '',
      ruleForm: {
        inoutTime: '',
        degree:'',
        sneak:'',
        pressureRange:''
      },
        pickerOptions:{
         disabledDate: time => {
          return time.getTime() > new Date().getTime();
          }
        },
      rules: {
        inoutTime: [
          {  required: true, message: '请选择时间', trigger: 'blur' }] ,
          degree: [{ required: true,validator: checkDegree,  trigger: "blur" }],
          sneak: [{ required: true,validator: checkSneak,  trigger: "blur" }],
          pressureRange: [{ required: true,validator: checkPressureRange,  trigger: "blur" }],
      },
      pressurePositionList: [
        '仰卧位枕骨',
        '肩胛骨仰卧位',
        '仰卧位手肘',
        '仰卧位骶骨',
        '仰卧位足跟',
        '仰卧位足趾',
        '俯卧位额部',
        '俯卧位手肘',
        '俯卧位下颌',
        '俯卧位胸前',
        '俯卧位生殖器官',
        '俯卧位膝盖',
        '俯卧位足趾',
        '仰卧位枕骨',
        '仰卧位肩胛骨',
        '仰卧位骶骨',
        '仰卧位坐骨',
        '仰卧位足趾',
        '侧卧位耳翼',
        '侧卧位肩膊',
        '侧卧位手肘外侧',
        '侧卧位股骨粗隆',
        '侧卧位膝内侧',
        '侧卧位膝外侧',
        '侧卧位足踝',
        '侧卧位足跟'
      ],
      pressureLevelList: [
        'I期',
        'II期',
        'III期',
        'IV期',
        '不可分期阶段',
        '可疑深部组织损伤'
      ],
      secretionList:[
        '无',
        '少',
        '中',
        '多',
      ],
      pressureSourceList: [
        '院内',
        '院外'
      ],
      pressureNursingList: [
        '翻身',
        '气垫床',
        '压疮贴',
        '换药',
        '营养'
      ],
      transferList: [
        '痊愈',
        '好转',
        '无变化',
        '面积扩大',
        '其它部位新发压疮'
      ],
      mapData: []
    }
  },
  mounted(){
    this.patientRecordId = this.patientInfo.record.recordId
  },
  methods: {
     //获取未绑定床位病患列表
      getPatientList() {
        this.$axios({
          url: global.url + '/base/patient/queryPatientRecords',
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          data: {}
        }).then((response) => {
          var data = response.data;
          if (data.msg == 201) {
            let resData = data.respData ? data.respData : []
            this.patientsList = resData
            // this.getIndex(this.patientsList)
          } else {
            this.$message({
              message: data.content,
              type: 'warning'
            });
          }
        });
      },
      
    assessDetail(){
      this.$router.push({
        path: '/patient/nursingGradingDetail',
        query: {
          formCode: "PRSE",
          formName:"压疮",
          patientRecordId: this.patientRecordId,
          patientId:this.patientId
        }
      })
    },
    initData() {
      this.time = new Date().format("yyyy-MM-dd")
      this.getMapData()
      this.getData()
    },
    getData() {
      this.loading = true
      this.patientRecordId = this.patientInfo.record.recordId
      this.$axios({
        url: global.url + '/api/icu/pressureManage/queryPressureScoreByDate',
        method: 'post',
        data: {
          patientRecordId: this.patientRecordId,
          durangeTime: this.time
        }
      }).then((res) => {
        if (res.data && res.data.msg === 201) {
          this.tableData = res.data.respData.list || []
        } else {
          this.$message.error(res.data.content);
        }
        this.loading = false
      }).catch(err => {
        console.log(err)
        this.loading = false
      })
    },
    changeHandle() {
      this.getData()
    },
    del(id) {
      if (!id){
        return
      }
        this.$confirm("确认删除这条数据吗?", "提示", {
        type: "warning",
      }).then(()=>{
        this.$axios({
        url: global.url + '/api/icu/pressureManage/deletePressureById/' + id,
        method: 'post',
        data: {
          patientRecordId: this.patientRecordId
        }
      }).then((res) => {
        if (res.data && res.data.msg === 201) {
          this.$message.success('删除成功')
          this.getData()
        } else {
          this.$message.error(res.data.content)
        }
      })
      }).catch(()=>{})
    },
    add() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          const params = {
            ...this.ruleForm,
            patientRecordId: this.patientRecordId
          }
          if (this.dialogType === 'update') {
            params.id = this.selectId
          }
          console.log(params)
          this.$axios({
            url: global.url + '/api/icu/pressureManage/savePressureRecord',
            method: 'post',
            data: params
          }).then((res) => {
            if (res.data && res.data.msg === 201) {
              this.$message.success((this.dialogType == 'add' ? '新增' : '编辑') + '成功')
              this.getData()
              this.getPatientList()
            } else {
              this.$message.error(res.data.content)
            }
            this.dialogVisible = false
          })
        }
      });

    },
    show(type, id) {
      this.dialogType = type
      console.log(type, id)
      if (type === 'update' && id) {
        this.selectId = id
        this.$axios({
          url: global.url + '/api/icu/pressureManage/queryPressureRecordById/' + id,
          method: 'get',
        }).then((res) => {
          if (res.data && res.data.msg === 201) {
            // console.log(res.data)
            const item = res.data.respData
            this.ruleForm = {
              inoutTime: new Date(item.inoutTime),
              pressureTreatment: item.pressureTreatment,
              pressureRange: item.pressureRange,
              sneak: item.sneak?parseInt(item.sneak):"",
              degree:item.degree?parseInt(item.degree):"",
              secretion:item.secretion?parseInt(item.secretion):"",
              pressurePosition: item.pressurePosition?parseInt(item.pressurePosition):"",
              pressureLevel: item.pressureLevel?parseInt(item.pressureLevel):"",
              pressureSource: item.pressureSource?parseInt(item.pressureSource):"",
              pressureNursing: item.pressureNursing?parseInt(item.pressureNursing):"",
              transfer: item.transfer?parseInt(item.transfer):""
            }
            console.log(this.ruleForm)
            this.dialogVisible = true
          } else {
            this.$message.error(res.data.content)
          }
        })
      } else {
        this.ruleForm = {
          
        }
        this.selectId = ''
        this.dialogVisible = true
      }
      
    },
    closeDialog() {
      this.$refs.ruleForm.resetFields()
    },
    getMapData() {
      const params = {
        patientRecordId: this.patientInfo.record.recordId,
        formCode: 'PRSE',
        sourceType:"1"
      }
      this.$axios({
        url: global.url + '/score/queryScoreListDetails',
        method: 'post',
        data: params
      }).then((res) => {
        if (res.data && res.data.msg === 201) {
          this.mapData = res.data.respData.list || []
          this.initMap()
        } else {
          this.$message.error(res.data.content);
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },
    initMap() {
      const myChart = this.echarts.init(document.getElementById('myChart'));
      const data_time = []
      const data = []
      this.mapData.forEach(i => {
        data_time.push(i.createTs)
        data.push(i.score)
      })
      console.log(data)
      const option = {
        grid:{
          left:50,
          top:30,
          right:30,
          bottom:30
        },
        xAxis: {
          type: 'category',
          data: data_time.reverse(),
          axisLabel: {
            show: true,
            color: "rgba(0, 0, 0, 0.45)"
          }
        },
        yAxis: {
          type: 'value',
          nameLocation: 'center',
          nameGap: 30,
          name: '评估分值',
          nameTextStyle: {
            color: 'rgba(0, 0, 0, 0.65)'
          },
          minInterval: 1,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: true,
            color: "rgba(0, 0, 0, 0.45)"
          }
        },
        series: [{
          data: data.reverse(),
          type: 'line',
          label: {
            show: true,
            position: 'top',
            color: 'rgba(0, 0, 0, 0.45)'
          },
          itemStyle: {
            color: '#7972F3'
          }
        }]
      };
      // 绘制图表
      myChart.setOption(option);
      window.onresize = myChart.resize();
    }
  }
}
</script>

<style lang="scss">
.pressureSores{
  .title{
    line-height: 32px;
    .t{
      font-size: 16px;
      font-weight: bold;
      color: rgba(0, 0, 0, 0.87);
    }
  }
  .myChart{
    height: 280px;
    width: 100%;
  }
  .chart{
    margin-bottom: 16px;
  }
  .nodata{
    padding: 100px 0;
    img{
      width: 234px;
    }
  }
  .dialogMain .el-dialog__body .el-form-item{
    margin-bottom: 24px;
  }
  .echart_table_content {
    .el-table th {
      background: rgba(0, 0, 0, 0.02);
      color: #212121;
    }
  }
}
</style>>
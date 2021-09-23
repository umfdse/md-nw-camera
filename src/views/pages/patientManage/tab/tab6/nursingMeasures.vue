<template>
  <div class="nursingMeasuresWrapper">
    <!-- <div class="header">
      <div class="location">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item class="location-other" :to="{ path: '/patient' }">患者管理</el-breadcrumb-item>
          <el-breadcrumb-item class="location-other" :to="{ path: '/patient/list',query:{patientId:patientInfo.patientId} }">患者详情</el-breadcrumb-item>
          <el-breadcrumb-item class="location-current" :to="{ path: '/patient/nursingMeasures' }">护理措施
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div> -->
    <div class="main">
      <div class="back">
        <span class="el-icon-back" @click="goBack"></span>
        <span class="text" v-text="isRescue==1 ? '抢救措施':'护理措施'"></span>
      </div>
      <div class="pageSearch">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-row>
            <el-col :span="5">
              <el-form-item label="患者姓名:">
                <span>{{patientInfo.name}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="性别:">
                <span v-if="patientInfo.sex==1">男</span>
                <span v-else-if="patientInfo.sex==2">女</span>
                <span v-else>未知</span>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="年龄:">
                <span>{{patientInfo.age}}岁</span>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="住院号:">
                <span v-if="patientInfo && patientInfo.record">{{patientInfo.record.inhosNum}}</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row v-if="isRescue==1">
            <el-col :span="24">
              <el-form-item label="抢救开始时间:">
                <span>{{beginRescueForm.startSaveTime}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <!--药物录入-->
          <el-row v-if="isRescue==1">
            <el-col :span="24">
              <el-form-item label="药物录入：">
                <el-link type="primary" class="fastRecord" v-for="(item,index) in usedMedicineList" :key="index"
                         @click="fastRecordSave(2,item.id,item.name,item.content)">{{item.name}}
                </el-link>
              </el-form-item>
            </el-col>
          </el-row>
          <!--措施录入-->
          <el-row v-if="isRescue==1">
            <el-col :span="24">
              <el-form-item label="措施录入：">
                <el-link type="primary" class="fastRecord" v-for="(item,index) in usedMeasuresList" :key="index"
                         @click="fastRecordSave(4,item.id,item.name,item.content)">{{item.name}}
                </el-link>
              </el-form-item>
            </el-col>
          </el-row>
          <!--护理时间-->
          <el-row v-if="isRescue!=1">
            <el-col :span="24">
              <el-form-item label="护理时间:" prop="nursingTime">
                <el-date-picker
                  style="width: 224px"
                  value-format="yyyy-MM-dd HH:mm"
                  format="yyyy-MM-dd HH:mm"
                  :picker-options="pickerOptions"
                  v-model="searchForm.nursingTime"
                  @change="changeNursingTime"
                  type="datetime"
                  placeholder="请选择日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <!--护理操作-->
      <div class="pageHandle">
        <el-button size="small" :disabled="!searchForm.nursingTime && isRescue!=1"
                   @click="showAddDialog('vitalSignsDialog','vitalSignsForm','')">生命体征数据
        </el-button>
        <el-button size="small" :disabled="!searchForm.nursingTime && isRescue!=1"
                   @click="showAddDialog('medicalRecordsDialog','','medicalRecords')">用药记录
        </el-button>
        <el-button size="small" :disabled="!searchForm.nursingTime && isRescue!=1"
                   @click="showAddDialog('checkingDialog','','checking')">检验检查
        </el-button>
        <el-button size="small" :disabled="!searchForm.nursingTime && isRescue!=1"
                   @click="showAddDialog('nursingHandleDialog','nursingHandleForm','')">护理操作
        </el-button>
        <el-button size="small" v-if="isRescue!=1"  class="rescueBtn"
                   @click="showAddDialog('beginRescueDialog','beginRescueForm','')"
                   type="danger">开始抢救
        </el-button>
        <el-button size="small" v-if="isRescue==1"  class="rescueBtn"
                   @click="showAddDialog('endRescueDialog','endRescueForm','')"
                   type="danger">结束抢救
        </el-button>
      </div>
      <div class="pageContent">
        <table-mixin :pageSize="pageSize" :pageNum="pageNum" :total="total" :pagination="pagination">
          <el-table v-loading="tableData.loading" :data="tableData.body">
            <div slot="empty" class="noData"></div>
            <el-table-column  prop="nursingTime" :label="isRescue==1 ? '抢救时间': '时间'"
                             align="left" :formatter="formatter"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column v-for="(item,index) in tableData.head" :prop="item.key" :label="item.name"
                             align="left" :formatter="formatter"
                             :key="index" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="操作" align="left" width="200">
              <template slot-scope="scope">
                <el-link type="primary" @click="editNursing(scope.row)" style="margin-right: 24px;">编辑</el-link>
                <el-link type="primary" @click="deleteNursing(scope.row)">删除</el-link>
              </template>
            </el-table-column>
          </el-table>
        </table-mixin>
      </div>
    </div>
    <!--生命体征数据-->
    <el-dialog title="生命体征数据" :visible.sync="vitalSignsDialog" width="480px" class="vitalSignsDialog">
      <el-form :model="vitalSignsForm" label-width="155px" :rules="vitalSignsRules" ref="vitalSignsForm"
               label-position="right"
               :disabled="vitalDisabled">
        <el-form-item :label="isRescue==1 ? '抢救开始时间':'护理时间:'">
          <span>{{ isRescue==1 ? beginRescueForm.startSaveTime :searchForm.nursingTime}}</span>
        </el-form-item>
        <el-form-item label="录入时间" prop="nursingInputTime">
          <el-date-picker
            style="width: 224px"
            value-format="yyyy-MM-dd HH:mm"
            format="yyyy-MM-dd HH:mm"
            @change="pickerChange_nursingInputTime"
            :picker-options="pickerOptions"
            v-model="vitalSignsForm.nursingInputTime"
            type="datetime"
            placeholder="请选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="选择数据:" prop="vitalSignsId">
          <el-select style="width:224px" v-model="vitalSignsForm.vitalSignsId" @change="changeVitalSign" placeholder="请选择数据"
                     clearable filterable>
            <el-option
              v-for="(item,index) in dataOption"
              :key="index"
              :label="item.inputTime"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="体温(℃):" prop="bodyTemperature" :disabled="vitalSignsForm.datasource==1">
          <el-input v-model="vitalSignsForm.bodyTemperature" placeholder="请输入" maxlength="4"></el-input>
        </el-form-item>
        <el-form-item label="心率(次/每分):" prop="heartRate" :disabled="vitalSignsForm.datasource==1">
          <el-input v-model="vitalSignsForm.heartRate" placeholder="请输入" maxlength="3"></el-input>
        </el-form-item>
        <el-form-item label="血压(mmHG):" prop="pressure" :disabled="vitalSignsForm.datasource==1">
          <el-input style="width:calc(50% - 4px);margin-right: 4px;float: left" maxlength="3"
                    v-model="vitalSignsForm.systolicBloodPressure" placeholder="收缩压"></el-input>
          <el-input style="width:calc(50% - 4px);;margin-left: 4px;float: right" maxlength="3"
                    v-model="vitalSignsForm.diastolicBloodPressure" placeholder="舒张压"></el-input>
        </el-form-item>
        <el-form-item label="平均压(mmHG):" prop="meanPressure">
          <el-input v-model="vitalSignsForm.meanPressure" placeholder="请输入" maxlength="3"></el-input>
        </el-form-item>
        <el-form-item label="血氧饱和度(%):" prop="oxygenSaturation" :disabled="vitalSignsForm.datasource==1">
          <el-input v-model="vitalSignsForm.oxygenSaturation" placeholder="请输入" maxlength="3"></el-input>
        </el-form-item>
        <el-form-item label="中心静脉压(mmH2O):" prop="centralVenousPressure">
          <el-input v-model="vitalSignsForm.centralVenousPressure " placeholder="请输入" maxlength="3"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="vitalSignsDialog = false">取 消</el-button>
        <el-button size="small" style="margin-right: 0" type="primary" @click="saveNursing(1,'vitalSignsDialog')">确 定
        </el-button>
      </div>
    </el-dialog>
    <!--用药记录-->
    <el-dialog title="用药记录" :visible.sync="medicalRecordsDialog" width="840px" class="medicalRecordsDialog">
      <medicalRecords ref="medicalRecords" :patientInfo="patientInfo"></medicalRecords>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="medicalRecordsDialog = false">取 消</el-button>
        <el-button size="small" style="margin-right: 0" type="primary" @click="saveNursing(2,'medicalRecordsDialog')">确
          定
        </el-button>
      </div>
    </el-dialog>
    <!--检验检查-->
    <el-dialog title="检验检查" :visible.sync="checkingDialog" width="840px" class="medicalRecordsDialog">
      <checking ref="checking" :patientInfo="patientInfo"></checking>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="checkingDialog = false">取 消</el-button>
        <el-button size="small" style="margin-right: 0" type="primary" @click="saveNursing(3,'checkingDialog')">确 定
        </el-button>
      </div>
    </el-dialog>
    <!--护理操作-->
    <el-dialog title="护理操作" :visible.sync="nursingHandleDialog" width="840px" class="nursingHandleDialog">
      <el-form :model="nursingHandleForm" label-width="80px" ref="nursingHandleForm" label-position="right">
        <el-form-item label="护理模板:">
          <el-select style="width:224px" v-model="nursingHandleForm.template" @change="templateChange"
                     placeholder="请选择数据" clearable filterable>
            <el-option
              v-for="(item,index) in templateOption"
              :key="index"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="护理内容:">
          <el-input type="textarea" style="width: 620px" v-model="nursingHandleForm.content "
                    placeholder="请输入" maxlength="2000"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="nursingHandleDialog = false">取 消</el-button>
        <el-button size="small" style="margin-right: 0" type="primary" @click="saveNursing(4,'nursingHandleDialog')">确
          定
        </el-button>
      </div>
    </el-dialog>
    <!--开始抢救-->
    <el-dialog title="开始抢救" :visible.sync="beginRescueDialog" width="480px" class="rescueMsgDialog">
      <el-form :model="beginRescueForm" ref="beginRescueForm" :rules="beginRescueRules" label-width="110px" label-position="right">
        <el-form-item label="开始抢救时间:" prop="startSaveTime">
          <el-date-picker
            style="width: 224px"
            value-format="yyyy-MM-dd HH:mm"
            format="yyyy-MM-dd HH:mm"
            @change="pickerChange_startSaveTime"
            :picker-options="pickerOptions"
            v-model="beginRescueForm.startSaveTime"
            type="datetime"
            placeholder="请选择日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="beginRescueDialog = false">取 消</el-button>
        <el-button size="small" style="margin-right: 0" type="primary" @click="beginRescue">确 定</el-button>
      </div>
    </el-dialog>
    <!--结束抢救-->
    <el-dialog title="结束抢救" :visible.sync="endRescueDialog" width="480px" class="rescueMsgDialog">
      <el-form :model="endRescueForm" ref="endRescueForm"  :rules="endRescueRules" label-width="110px" label-position="right">
        <el-form-item label="参与人员:" prop="participants">
          <el-select v-model="endRescueForm.participants" placeholder="请输入" multiple clearable filterable>
            <el-option
              v-for="(item,index) in participantsOptions"
              :key="index"
              :label="item.realName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始抢救时间:" prop="startSaveTime">
          <el-date-picker
            style="width: 224px"
            value-format="yyyy-MM-dd HH:mm"
            format="yyyy-MM-dd HH:mm"
            @change="pickerChange_endRescue_startSaveTime"
            :picker-options="pickerOptions"
            v-model="endRescueForm.startSaveTime"
            type="datetime"
            placeholder="请选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束抢救时间:" prop="endSaveTime">
          <el-date-picker
            style="width: 224px"
            value-format="yyyy-MM-dd HH:mm"
            format="yyyy-MM-dd HH:mm"
            @change="pickerChange_endSaveTime"
            :picker-options="pickerOptions"
            v-model="endRescueForm.endSaveTime"
            type="datetime"
            placeholder="请选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="抢救结果:" prop="saveResult">
          <el-radio v-model="endRescueForm.saveResult" :label="0">存活</el-radio>
          <el-radio v-model="endRescueForm.saveResult" :label="1">死亡</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="endRescueDialog = false">取 消</el-button>
        <el-button size="small" style="margin-right: 0" type="primary" @click="endRescue">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑内容-->
    <el-dialog title="编辑" :visible.sync="editContentDialog" width="840px" class="nursingHandleDialog">
      <el-form :model="editContentForm" label-width="80px" ref="nursingHandleForm" label-position="right">
        <el-form-item label="内容:">
          <el-input type="textarea" style="width: 620px" v-model="editContentForm.content "
                    placeholder="请输入" maxlength="2000"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="editContentDialog = false">取 消</el-button>
        <el-button size="small" style="margin-right: 0" type="primary" @click="saveEditContent()">确
          定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {tableDataMixin} from '../../../../../assets/js/mixin'
  import medicalRecords from './medicalRecords'
  import checking from './checking'
  import eventBus from "@/utils/eventBus.js"

  export default {
    name: "illnessRecords",
    mixins: [tableDataMixin],
    components: {medicalRecords, checking},
    data() {
      let valiRule = {
        int: /^[0-9]\d*$/, //正整数
        decInt: /^\d+$|^\d*\.\d+$/g, //正整数加小数
      };
      let checkheartRate = (rule, value, callback) => {
        setTimeout(() => {
          if (!valiRule.int.test(value)&&value) {
            callback(new Error('请输入正整数'));
          } else {
            if (value < 0) {
              callback(new Error('范围在0-999'));
            } else if(value > 999){
              callback(new Error('范围在0-999'));
            }else {
              callback();
            }
          }
        }, 100);
      }
      let checkbreatheRate = (rule, value, callback) => {
        setTimeout(() => {
          if (!valiRule.int.test(value)&&value) {
            callback(new Error('请输入正整数'));
          } else {
            if (value < 0) {
              callback(new Error('范围在0-999'));
            } else if(value > 999){
              callback(new Error('范围在0-999'));
            }else {
              callback();
            }
          }
        }, 100);
      }
      let checkMeanPressure = (rule, value, callback) => {
        setTimeout(() => {
          if (!valiRule.int.test(value)&&value) {
            callback(new Error('请输入正整数'));
          } else {
            if (value < 0) {
              callback(new Error('范围在0-999'));
            } else if(value > 999){
              callback(new Error('范围在0-999'));
            }else {
              callback();
            }
          }
        }, 100);
      }
      let checkPressure=(rule,value,callback)=>{
        value = this.vitalSignsForm.systolicBloodPressure;
        let value2 = this.vitalSignsForm.diastolicBloodPressure;
        if(!valiRule.int.test(value)&&value) {
          callback(new Error('请输入正整数'))
        }else{
          if (value < 0) {
            callback(new Error('范围在0-999'));
          } else if(value > 999){
            callback(new Error('范围在0-999'));
          }
        }
        if(value&&!value2){
          callback()
        }
        if(!valiRule.int.test(value2)&&value2) {
          callback(new Error('请输入正整数'))
        }else{
          if (value2 < 0) {
            callback(new Error('范围在0-999'));
          } else if(value2 > 999){
            callback(new Error('范围在0-999'));
          }
        }
        if(!value&&value2){
          callback()
        }else{
          callback();
        }
      }
      let checkOxygenSaturation=(rule,value,callback)=>{
        if (!valiRule.int.test(value)&&value) {
          callback(new Error('请输入正整数'));
        } else {
          if (value < 0) {
            callback(new Error('范围在0-100'));
          } else if(value > 100){
            callback(new Error('范围在0-100'));
          }else {
            callback();
          }
        }
      }
      let checkBodyTemperature=(rule,value,callback)=>{
        if (!/^\d+$|^\d*\.\d+$/g.test(value)&&value) {
          callback(new Error('请输入正整数或者小数'));
        } else {
          if (value < 0) {
            callback(new Error('范围在0-45'));
          } else if(value > 45){
            callback(new Error('范围在0-45'));
          }else {
            callback();
          }
        }
      }
      return {
        pickerOptions: {
          disabledDate: (time) => {
            return time.getTime() > new Date().getTime()
          }
        },
        pagination: true,
        tableData: {
          loading: false,
          head: [
            {
              name: '类型',
              key: 'nursingItemName',
              sortable: false
            },
            {
              name: '内容',
              key: 'nursingItemContent',
              sortable: false
            },
            {
              name: '执行人',
              key: 'nursingUserName',
              sortable: false
            }
          ],
          body: [],
          option: [],
          condition: [],
          recordTime: ''
        },
        searchForm: {
          name: '',
          sex: '',
          age: '',
          hisNo: '',
          nursingTime: ''
        },
        //常用药物
        usedMedicineList: [{
          name: '肾上腺素',
          id: '1'
        }],
        //常用措施
        usedMeasuresList: [{
          name: '胸外按压',
          id: '1'
        }],
        patientInfo: '',
        isRescue: 0,
        /*生命体征数据*/
        vitalSignsDialog: false,
        vitalDisabled: false,
        vitalSignsRules: {
          nursingInputTime: [
            {required: true, message: '请选择录入时间', trigger: 'blur'},
          ],
          /*输入框校验*/
          heartRate:[{validator:checkheartRate,trigger:'blur'}],
          breatheRate:[{validator:checkbreatheRate,trigger:'blur'}],
          pressure:[{validator:checkPressure,trigger:'blur'}],
          meanPressure:[ {validator:checkMeanPressure,trigger:'blur'}],
          oxygenSaturation:[{validator:checkOxygenSaturation,trigger:'blur'}],
          bodyTemperature:[ {validator:checkBodyTemperature,trigger:'blur'}],
          centralVenousPressure:[ {validator:checkbreatheRate,trigger:'blur'}],
        },
        vitalSignsForm: {
          vitalSignsId: '',
          bodyTemperature: "",
          breatheRate: "",
          datasource: '', //1来自机器不可编辑 2来自手动录入可编辑
          diastolicBloodPressure: "",
          heartRate: "",
          inputTime: "",
          oxygenSaturation: "",
          patientRecordId: '',
          systolicBloodPressure: "",
          centralVenousPressure: "",
          meanPressure: "",
          nursingInputTime:'' //护理措施手动录入时间
        },
        dataOption: [],
        resIdList: [], //用于反显表格
        isEdit: false,
        currentRow: '',
        /*用药记录*/
        medicalRecordsDialog: false,
        /*检验检查*/
        checkingDialog: false,
        /*护理操作*/
        nursingHandleDialog: false,
        templateOption: [],
        nursingHandleForm: {
          template: '',
          content: '',
          text: ''
        },
        /*抢救信息*/
        beginRescueDialog: false,//开始抢救
        beginRescueForm: {
          startSaveTime: '',
        },
        endRescueDialog: false, //结束抢救
        endRescueForm: {
          participants: '',
          saveResult: 1,
          startSaveTime: '',
          endSaveTime: '',
          isEnd: 1
        },
        beginRescueRules: {
          startSaveTime: [
            {required: true, message: '请选择开始抢救时间', trigger: 'blur'},
          ]
        },
        endRescueRules: {
          startSaveTime: [
            {required: true, message: '请选择开始抢救时间', trigger: 'blur'},
          ],
          endSaveTime: [
            {required: true, message: '请选择结束抢救时间', trigger: 'blur'},
          ],
          participants: [
            {required: true, message: '请选择参与人员', trigger: 'blur'},
          ]
        },

        participantsOptions: [],
        /*编辑内容*/
        editContentDialog: false,
        editContentForm: {
          id: '',
          content: '',
        },
        rescueId: ''
      }
    },
    mounted() {
      let _this = this
      this.$nextTick(()=>{
        this.patientInfo = this.$route.query.patientInfo
        this.isRescue = this.$route.query.isRescue
        this.rescueId = this.$route.query.rescueId ? this.$route.query.rescueId : ''

        if (this.isRescue == 1) {//抢救中
          this.beginRescueForm.startSaveTime = this.$route.query.recordTime ? this.$route.query.recordTime : ''
        } else if(this.isRescue == 2){ //结束抢救
          this.searchForm.nursingTime = this.$route.query.recordTime ? this.$route.query.recordTime : ''
          this.endRescueForm.startSaveTime = this.$route.query.rescueStartTs ? this.$route.query.rescueStartTs : ''
          this.endRescueForm.endSaveTime = this.$route.query.rescueEndTs ? this.$route.query.rescueEndTs:''
        }else { //护理措施
          this.searchForm.nursingTime = this.$route.query.recordTime ? this.$route.query.recordTime : ''
        }
        this.initData()
        this.getVitalSigns()
      })
      eventBus.$on('isEndRescue', () => {
        _this.isEndRescue()
      })
    },
    beforeRouteLeave(to, from, next) {
      if (this.isRescue == 1) { //抢救中的病患
        this.isEndRescue()
      } else {
        next()
      }
    },

    methods: {
      //初始化数据
      initData() {
        if (this.searchForm.nursingTime ||  this.beginRescueForm.startSaveTime) {
          this.search()
        }
        this.getFastTemplate(1) //护理措施
        this.getFastTemplate() //快速用药,抢救措施
        this.getRescuePersonList()
      },
      //是否结束抢救
      isEndRescue() {
        this.$confirm('有病患正在抢救中, 是否结束抢救?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.showAddDialog('endRescueDialog', 'endRescueForm', '')
        }).catch(() => {
        });
      },
      getTableData() {
        let nTime = ''
        if (this.isRescue == 1) {
          nTime = this.beginRescueForm.startSaveTime
        } else {
          nTime = this.searchForm.nursingTime
        }
        let param = {
          patientRecordId: this.patientInfo.record.recordId,
          nursingTime: nTime,
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          isRescue: this.isRescue, //是否抢救
          rescueId:this.rescueId
        }
        this.$axios({
          url: global.url + '/api/nursing/measures/list',
          method: 'get',
          headers: {
            'Content-Type': 'application/json'
          },
          params: param
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
      formatter(row, column, cellValue, index) {
        let formatValue = cellValue
        if (column.property == 'nursingItemName') {
          switch (formatValue) {
            case '1':
              formatValue = '生命体征数据';
              break;
            case '2':
              formatValue = '用药记录';
              break;
            case '3':
              formatValue = '检验检查';
              break;
            case '4':
              formatValue = '护理操作';
              break;
          }
        }

        return formatValue
      },
      //获取生命体征数据
      getVitalSigns(vitalSignsId) {
        let nTime =''
        let rescueStartTs = ''
        let rescueEndTs = ''
        if (this.isRescue == 1) {
          rescueStartTs = this.beginRescueForm.startSaveTime
        } else if (this.isRescue == 2) { //结束抢救
          rescueStartTs = this.endRescueForm.startSaveTime
          rescueEndTs=this.endRescueForm.endSaveTime
        } else {
          nTime = this.searchForm.nursingTime
        }
        let param = {
          patientRecordId: this.patientInfo.record.recordId,
          nursingTime:nTime,
          rescueStartTs:rescueStartTs,
          rescueEndTs:rescueEndTs,
          id:vitalSignsId ? vitalSignsId : ''
        }
     /*   const formData = new FormData()
        Object.keys(param).forEach((key) => {
          formData.append(key, param[key]);
        })*/
        this.$axios({
          url: global.url + '/api/icu/vitalSigns/queryByrecordId',
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          data: param
        }).then((res) => {
          let data = res.data
          if (data.msg == 201) {
            this.dataOption = data.respData ? data.respData : ''
          } else {
            this.$message({
              message: data.content,
              type: 'warning'
            });
          }
        });
      },
      changeVitalSign(val) {
        if (val) {
          this.dataOption.forEach(item => {
            if (val == item.id) {
              for (let vKey in this.vitalSignsForm) {
                this.vitalSignsForm[vKey] = item[vKey]
              }
              this.vitalSignsForm.vitalSignsId = item.id
            }
          })
        } else {
          for (let vKey in this.vitalSignsForm) {
            this.vitalSignsForm[vKey] = ''
          }
        }
      },
      //护理时间change事件
      changeNursingTime(val) {
        let _this = this
        let date = new Date(val)
        if(date.getTime() > Date.now()){
          this.searchForm.nursingTime = ''
          this.$message.error('护理时间不能大于当前时间, 请重新选择')
          return false
        }else if(this.patientInfo.record.outdeptTime && date.getTime() > new Date(this.patientInfo.record.outdeptTime).getTime()){
          this.searchForm.nursingTime = ''
          this.$message.error('护理时间不能大于出科时间, 请重新选择')
          return false
        }
        this.vitalDisabled = false
        // 先重置数据
        for (let sKey in this.vitalSignsForm) {
          this.vitalSignsForm[sKey] = ''
        }

        this.dataOption.forEach(item => {
          if (val == item.inputTime) {
            for (let vKey in this.vitalSignsForm) {
              this.vitalSignsForm[vKey] = item[vKey]
            }
            this.vitalSignsForm.vitalSignsId = item.id
          }
        })

        // 查询列表数据
        this.search()

      },

      //获取药物录入, 抢救措施模板
      getFastTemplate(typeCode) {
        let param = {
          pageSize: 10,
          pageNum: 0,
          data:{
            type: typeCode
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
          let data = res.data
          if (data.msg == 201) {
            let _this = this
            let resLis = data.respData && data.respData.list ? data.respData.list : []
            if(typeCode && typeCode==1){
              this.templateOption = resLis
            }else {
              this.usedMedicineList = []
              this.usedMeasuresList = []
              resLis.forEach(item=>{
                if(item.type==2){
                  _this.usedMedicineList.push(item)
                }else if(item.type==3){
                  _this.usedMeasuresList.push(item)
                }
              })
            }

          } else {
            this.$message({
              message: data.content,
              type: 'warning'
            });
          }
        })
      },
      templateChange(val) {
        this.templateOption.forEach(item => {
          if (val == item.id) {
            this.nursingHandleForm.content = item.content
            this.nursingHandleForm.text = item.name
          }
        })
      },
      //获取抢救人员
      getRescuePersonList() {
        let param = {
          "pageNum": 1,
          "pageSize": 0,
          "userTypes": [3, 4]
        }
        this.$axios({
          url: global.url + '/base/user/list',
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          data: param
        }).then((response) => {
          var data = response.data;
          if (data.msg == 201) {
            this.participantsOptions = data.respData && data.respData.list ? data.respData.list : []
          } else {
            this.$message({
              message: data.content,
              type: 'warning'
            });
          }
        });
      },

      goBack() {
        if (this.isRescue == 1) { //抢救中的病患
          this.$confirm('此病患正在抢救中, 是否结束抢救?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.showAddDialog('endRescueDialog', 'endRescueForm', '')
          }).catch(() => {
          });
        } else {
          //this.$router.go(-1)
          let patientId = this.patientInfo && this.patientInfo.patientId ?　this.patientInfo.patientId:''
          console.log(patientId,8899)
          this.$router.push({
            path: '/patient/list',
            query: {
              patientId: patientId
            }
          })
        }
      },
      showAddDialog(dialog, formName, template) {
        this.isEdit = false
        this.currentRow = ''
        this[dialog] = true
        if (formName) {
          this.$nextTick(() => {
            this.$refs[formName].resetFields()
            if(formName =='vitalSignsForm'){
              this.vitalSignsForm.systolicBloodPressure =''
              this.vitalSignsForm.diastolicBloodPressure =''
              this.getVitalSigns()
            }else if(formName =='endRescueForm'){
              this.endRescueForm.startSaveTime = this.beginRescueForm.startSaveTime
            }
          })
        } else {
          this.$nextTick(() => {
            let tempTime = ''
            if (this.isRescue == 1) {
              tempTime = this.beginRescueForm.startSaveTime
            } else {
              tempTime = this.searchForm.nursingTime
            }
            this.$refs[template].initData(tempTime)
          })
        }
      },
      //开始抢救保存
      beginRescue() {
        this.$refs['beginRescueForm'].validate((valid) => {
          if(valid){
            let param = {
              patientRecordId: this.patientInfo.record.recordId,
              rescueStartTs: this.beginRescueForm.startSaveTime,
              isRescue: 1
            }
            this.$axios({
              url: global.url + '/api/nursing/measures/rescue',
              method: 'post',
              headers: {
                'Content-Type': 'application/json'
              },
              data: param
            }).then(res => {
              if (res.data.msg == 201) {
                this.isRescue = 1
                sessionStorage.setItem('isRescue', this.isRescue)
                this.$message.success(res.data.content)
                this.beginRescueDialog = false
                this.rescueId = res.data.respData
                this.search()
              } else {
                this.$message.error(res.data.content)
              }
            })
          }
        })

      },
      //结束抢救保存
      endRescue() {
        this.$refs['endRescueForm'].validate((valid) => {
          if(valid){
            if (new Date(this.endRescueForm.endSaveTime).getTime() - new Date(this.endRescueForm.startSaveTime).getTime() < 0) {
              this.$message.error('结束时间不能小于开始时间!');
              return;
            }
            let rescueUserIdsList = this.endRescueForm.participants
            let rescueUserNamesList = []
            rescueUserIdsList.forEach(item => {
              this.participantsOptions.forEach(pItem => {
                if (item == pItem.id) {
                  rescueUserNamesList.push(pItem.realName)
                }
              })
            })
            let param = {
              patientRecordId: this.patientInfo.record.recordId,
              rescueStartTs: this.endRescueForm.startSaveTime,
              rescueEndTs: this.endRescueForm.endSaveTime,
              isRescue: 2,
              rescueUserIds: rescueUserIdsList.join(','), //抢救人员
              rescueUserNames: rescueUserNamesList.join(','),
              isDeath: this.endRescueForm.saveResult, //是否死亡
            }
            this.$axios({
              url: global.url + '/api/nursing/measures/rescue',
              method: 'post',
              headers: {
                'Content-Type': 'application/json'
              },
              data: param
            }).then(res => {
              if (res.data.msg == 201) {
                this.isRescue = 2
                sessionStorage.setItem('isRescue', this.isRescue)
                this.$message.success(res.data.content)
                this.endRescueDialog = false
              } else if (res.data.msg == 307) { //已经在其他地方结束抢救
                this.$message.error(res.data.content)
                this.isRescue = 2
                sessionStorage.setItem('isRescue', this.isRescue)
                this.endRescueDialog = false
              } else {
                this.$message.error(res.data.content)
              }
            })
          }
        })
      },
      //编辑护理措施
      editNursing(row) {
        //第一版反显逻辑
        this.isEdit = true
        let nursingType = row.nursingType
        if (nursingType == 1) {
          this.getVitalSigns(row.vitalSignsId)
          this.vitalSignsDialog = true
          this.$nextTick(() => {
            this.$refs['vitalSignsForm'].clearValidate()
            this.$refs['vitalSignsForm'].resetFields()
            this.getDetailData(row.id, 1,row.vitalSignsId)
          })
        } else {
          this.editContentDialog = true
          this.getDetailData(row.id, 2)
        }
      },
      getDetailData(id, type, vitalSignsId) {
        let url = ''
        let param = {}
        if(vitalSignsId){
          url =`/api/icu/vitalSigns/${vitalSignsId}`
        }else {
          param.id=id
          url =`/api/nursing/measures/get`
        }
        this.$axios({
          url: global.url +url ,
          method: 'get',
          headers: {
            'Content-Type': 'application/json'
          },
          params: param
        }).then((res) => {
          let data = res.data
          if (data.msg == 201) {
            this.currentRow = data.respData
            if(type==1){
                  for (let vKey in this.vitalSignsForm) {
                    this.vitalSignsForm[vKey] = data.respData[vKey]
                  }
                  this.vitalSignsForm.vitalSignsId = data.respData.id
            }else {
              this.editContentForm.id = data.respData.id
              this.editContentForm.content = data.respData.nursingItemContent
            }
          } else {
            this.$message({
              message: data.content,
              type: 'error'
            });
          }
        });
      },
      //删除护理措施
      deleteNursing(row) {
        this.$confirm('确认要删除这条数据吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = {
            id: row.id
          }
          this.currentRow = row
          const formData = new FormData()
          Object.keys(param).forEach((key) => {
            formData.append(key, param[key]);
          })
          this.$axios({
            url: global.url + '/api/nursing/measures/disable',
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
      //保存
      saveNursing(type, dialog) {
        let param = {}
        let nTime = ''
        let url = '/api/nursing/measures/save'
        if (this.isRescue == 1) {
          nTime = this.beginRescueForm.startSaveTime
        } else {
          nTime = this.searchForm.nursingTime
        }
        if(type==1){
          this.$refs['vitalSignsForm'].validate((valid) =>{
            if(valid){
              let str1 = this.vitalSignsForm.bodyTemperature ? `体温:${this.vitalSignsForm.bodyTemperature};` : ''
              let str2 = this.vitalSignsForm.heartRate ? `心率:${this.vitalSignsForm.heartRate}次/每分;` : ''
              let str3 = (this.vitalSignsForm.systolicBloodPressure || this.vitalSignsForm.diastolicBloodPressure) ? `血压:${this.vitalSignsForm.systolicBloodPressure}/${this.vitalSignsForm.diastolicBloodPressure}mmHG;` : ''
              let str4 = this.vitalSignsForm.meanPressure ? `平均压:${this.vitalSignsForm.meanPressure}mmHG;` : ''
              let str5 = this.vitalSignsForm.oxygenSaturation ? `血氧饱和度:${this.vitalSignsForm.oxygenSaturation}%;` : ''
              let str6 = this.vitalSignsForm.centralVenousPressure ? `中心静脉压:${this.vitalSignsForm.centralVenousPressure}mmHG;` : ''
              let vitalStr = str1 + str2 + str3 + str4 + str5 + str6
              param.nursingDTO = {
                patientRecordId: this.patientInfo.record.recordId,
                nursingType: 1,
                nursingItemName: "生命体征",
                nursingItemContent: vitalStr.trim(),
                vitalSignsId: this.vitalSignsForm.vitalSignsId,
                nursingTime:nTime,
                isRescue: this.isRescue,
                rescueId: this.rescueId,
                nursingInputTime:this.vitalSignsForm.nursingInputTime
              }
              this.vitalSignsForm.patientRecordId=this.patientInfo.record.recordId
              param.vitalSignsDto = this.vitalSignsForm
              //编辑
              if (this.isEdit) {
                url='/api/nursing/measures/update'
                param.nursingDTO.id = this.currentRow.id
                param.vitalSignsDto.id = this.vitalSignsForm.vitalSignsId
              }
              this.saveHandle(url,param,dialog)
            }else {
              return false
            }
          })
        }else if(type==2){
          let medicineList = this.$refs['medicalRecords'].multipleSelection
          let medicineStr = ''
          let medicalIdList = []
          medicineList.forEach(mItem => {
            medicineStr += (mItem.medicationName +':'+ mItem.medicationAmount + ';')
            medicalIdList.push(mItem.id)
          })
          param.nursingDTO = {
            patientRecordId: this.patientInfo.record.recordId,
            nursingType: 2,
            nursingItemName: "用药记录",
            nursingItemContent: medicineStr,
            nursingTime: nTime,
            /* idList: medicalIdList,*/
            isRescue: this.isRescue,
            rescueId: this.rescueId
          }
          //编辑
          if (this.isEdit) {
            url='/api/nursing/measures/update'
            param.nursingDTO.id = this.currentRow.id
          }
          this.saveHandle(url,param,dialog)
        } else if(type==3){
          let checkList = this.$refs['checking'].multipleSelection
          let checkStr = ''
          let checkingIdList = []
          checkList.forEach(cItem => {
            checkStr += (cItem.name +':'+ cItem.itemValue + cItem.unit + ';')
            checkingIdList.push(cItem.id)
          })
          param.nursingDTO = {
            patientRecordId: this.patientInfo.record.recordId,
            nursingType: 3,
            nursingItemName: "检验检查",
            nursingItemContent: checkStr,
            nursingTime: nTime,
            isRescue: this.isRescue,
            rescueId: this.rescueId
          }
          //编辑
          if (this.isEdit) {
            url='/api/nursing/measures/update'
            param.nursingDTO.id = this.currentRow.id
          }
          this.saveHandle(url,param,dialog)
        } else if(type==4){
          let nursingHandleStr = this.nursingHandleForm.text +':'+ this.nursingHandleForm.content
          let nursingHandleId = this.nursingHandleForm.template
          param.nursingDTO = {
            patientRecordId: this.patientInfo.record.recordId,
            nursingType: 4,
            nursingItemName: "护理操作",
            nursingItemContent: nursingHandleStr,
            nursingTime: nTime,
            isRescue: this.isRescue,
            rescueId: this.rescueId
          }
          //编辑
          if (this.isEdit) {
            url='/api/nursing/measures/update'
            param.nursingDTO.id = this.currentRow.id
          }
          this.saveHandle(url,param,dialog)
        }
      },
      saveHandle(url,param,dialog){
        this.$axios({
          url: global.url +url,
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          data: param
        }).then(res => {
          if (res.data.msg == 201) {
            this.$message.success(res.data.content)
            this[dialog] = false
            this.initData()
          } else {
            this.$message.error(res.data.content)
          }
        })
      },


      //快速录入保存
      fastRecordSave(type, id, name, val) {
        let param = {}
          if (type == 2) {
          param.nursingDTO = {
            patientRecordId: this.patientInfo.record.recordId,
            nursingType: 2,
            nursingItemName: "用药记录",
            nursingItemContent: name+':'+val,
            nursingTime: this.beginRescueForm.startSaveTime,
            isRescue: this.isRescue,
            rescueId: this.rescueId
          }
        } else if (type == 4) {
          param.nursingDTO = {
            patientRecordId: this.patientInfo.record.recordId,
            nursingType: 4,
            nursingItemName: "护理操作",
            nursingItemContent:  name+':'+val,
            nursingTime: this.beginRescueForm.startSaveTime,
            isRescue: this.isRescue,
            rescueId: this.rescueId
          }
        }
        this.$axios({
          url: global.url + '/api/nursing/measures/save',
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          data: param
        }).then(res => {
          if (res.data.msg == 201) {
            this.$message.success(res.data.content)
            this.initData()
          } else {
            this.$message.error(res.data.content)
          }
        })
      },
      //编辑内容保存
      saveEditContent() {
        let param = {
          nursingDTO: {
            id: this.editContentForm.id,
            nursingItemContent: this.editContentForm.content
          }
        }
        this.$axios({
          url: global.url + '/api/nursing/measures/save',
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          data: param
        }).then(res => {
          if (res.data.msg == 201) {
            this.$message.success(res.data.content)
            this.editContentDialog = false
            this.initData()
          } else {
            this.$message.error(res.data.content)
          }
        })
      },
      pickerChange_startSaveTime(val){
        let date = new Date(val)
        if(date.getTime() > Date.now()){
          this.beginRescueForm.startSaveTime = ''
          this.$message.error('开始抢救时间不能大于当前时间, 请重新选择')
          return false
        }else if(this.patientInfo.record.indeptFlag===0 && this.patientInfo.record.outdeptTime && date.getTime() > new Date(this.patientInfo.record.outdeptTime).getTime()){
          this.beginRescueForm.startSaveTime = ''
          this.$message.error('开始抢救时间不能大于出科时间, 请重新选择')
          return false
        }
      },

      pickerChange_endRescue_startSaveTime(val){
        let date = new Date(val)
        if(date.getTime() > Date.now()){
          this.endRescueForm.startSaveTime = ''
          this.$message.error('开始抢救时间不能大于当前时间, 请重新选择')
          return false
        }else if(this.patientInfo.record.indeptFlag===0 &&this.patientInfo.record.outdeptTime && date.getTime() > new Date(this.patientInfo.record.outdeptTime).getTime()){
          this.endRescueForm.startSaveTime = ''
          this.$message.error('开始抢救时间不能大于出科时间, 请重新选择')
          return false
        }
      },
      pickerChange_endSaveTime(val){
        let date = new Date(val)
        if(date.getTime() > Date.now()){
          this.endRescueForm.endSaveTime = ''
          this.$message.error('结束抢救时间不能大于当前时间, 请重新选择')
          return false
        }else if(this.patientInfo.record.indeptFlag===0 &&this.patientInfo.record.outdeptTime && date.getTime() > new Date(this.patientInfo.record.outdeptTime).getTime()){
          this.endRescueForm.endSaveTime = ''
          this.$message.error('结束抢救时间不能大于出科时间, 请重新选择')
          return false
        }
      },
      pickerChange_nursingInputTime(val){
        let date = new Date(val)
        if(date.getTime() > Date.now()){
          this.vitalSignsForm.nursingInputTime = ''
          this.$message.error('手工录入时间不能大于当前时间, 请重新选择')
          return false
        }else if(this.patientInfo.record.indeptFlag===0 && this.patientInfo.record.outdeptTime && date.getTime() > new Date(this.patientInfo.record.outdeptTime).getTime()){
          this.vitalSignsForm.nursingInputTime = ''
          this.$message.error('手工录入时间不能大于出科时间, 请重新选择')
          return false
        }
      },


    }
  }
</script>
<style lang="scss">
  .nursingMeasuresWrapper {
    width: 100%;
    height: 100%;
    padding: 10px 24px;
    background: #F5F5F5;
    box-sizing: border-box;
    .el-button {
      margin-right: 16px;
      margin-left: 0;
    }
    .el-table th {
      background: rgba(0, 0, 0, 0.02);
      color: rgba(0, 0, 0, 0.87);
    }
    .nursingHandleDialog {
      .el-dialog__body {
        display: flex;
        justify-content: center;
        padding-right: 40px !important;
      }
      .el-textarea__inner {
        height: 140px;
      }
    }
    .vitalSignsDialog, .rescueMsgDialog {
      .el-form-item__content {
        width: 224px;
      }
      .el-dialog__body {
        display: flex;
        justify-content: center;
        padding-right: 40px !important;
      }
    }
    .header {
      height: 40px;
      display: flex;
      align-items: center;
      width: 100%;
      .location {
        font-size: 14px;
        .location-other {
          .el-breadcrumb__inner {
            color: rgba(0, 0, 0, 0.87);
          }

        }
        .location-current {
          .el-breadcrumb__inner {
            color: rgba(0, 0, 0, 0.38);

          }
        }
      }
    }
    .main {
      height: calc(100% - 40px);
      background: #FFFFFF;
      padding: 16px 32px;
      box-sizing: border-box;
      .back {
        padding-top: 8px;
        padding-bottom: 20px;
        .el-icon-back {
          font-weight: bold;
          font-size: 20px;
          color: rgba(0, 0, 0, 0.87);
          cursor: pointer;
        }
        .text {
          font-weight: bold;
          font-size: 20px;
          color: rgba(0, 0, 0, 0.87);
          margin-left: 8px;
        }
        .save {
          float: right;
        }
      }
      .pageSearch {
        padding: 0 30px;
        .fastRecord {
          margin-right: 15px;
        }
      }
      .pageHandle {
        width: 100%;
        .rescueBtn {
          float: right;
          margin-right: 0;
        }
      }
      .pageContent {
        margin-top: 16px;
        .el-table {
          min-height: 390px;
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

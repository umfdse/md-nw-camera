<template>
  <div class="patientsListWrapper">
    <!-- <div class="header">
      <div class="location" v-if="nurseShow">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item class="location-other" :to="{ path: '/patient' }">患者管理</el-breadcrumb-item>
          <el-breadcrumb-item class="location-current" :to="{ path: '/patient/list' }">{{active_name}}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div> -->
    <div class="main">
      <div class="side">
        <div v-for="(item,index) in patientsList" :key="index" class="patientItem" @click="changePatient(item,index)"
             :class="{'active_item':currentIndex==index}">
          <el-tooltip>
            <div slot="content" class="name" v-html="item.name"></div>
            <div class="name" v-html="dealOverflowText(item.name)"></div>
          </el-tooltip>
          <div class="bedNo">
            {{item.record.bedNo}}
            <span v-if="item.record.bedNo">床</span>
          </div>
          <div class="msg">
            <el-tooltip>
              <div slot="content" v-html="item.record.inhosNum"></div>
              <div v-html="dealOverflowText(item.record.inhosNum)"></div>
            </el-tooltip>
            <p class="right">
              <span v-if="item.sex==1">男</span>
              <span v-else-if="item.sex==2">女</span>
              <span v-else>未知</span>
              <span class="age" v-if="item.age">{{item.age}}岁</span>
            </p>
          </div>
          <p class="selectedBorder" v-if="currentIndex==index"></p>
        </div>
      </div>
      <div class="content">
        <div class="baseMsg">
          <div class="row_top">
            <span class="name">{{currentPatient.name}}</span>
            <span class="sex">
                 <span v-if="currentPatient.sex==1">男</span>
                 <span v-else-if="currentPatient.sex==2">女</span>
                 <span v-else>未知</span>
            </span>
            <span class="age">{{currentPatient.age}}岁</span>

            <!--血型-->
            <span class="bloodType" v-if="currentPatient.bloodType">
                  {{currentPatient.bloodType}}型
             </span>

            <span class="vitalSign" v-if="currentPatient.record.isNewEntrants">
                  <img src="/static/img/icon_score_new.png" alt="">
             </span>
            <span class="vitalSign" v-if="currentPatient.isAllergy">
                   <img src="/static/img/icon_score_allergy.png" alt="">
                </span>
            <span class="vitalSign" v-if="currentPatient.record.isInspectionCritical">
                   <img src="/static/img/icon_score_danger.png" alt="">
                </span>
            <span class="vitalSign" v-if="currentPatient.record.isUseBloodProducts">
                   <img src="/static/img/icon_score_blood.png" alt="">
                </span>
            <span class="vitalSign" v-if="currentPatient.record.isUseVentilator">
                   <img src="/static/img/icon_score_breath.png" alt="">
                </span>
            <span class="vitalSign" v-if="currentPatient.record.isCatheterScoreHigh">
                   <img src="/static/img/icon_score_catheter.png" alt="">
                </span>
            <span class="vitalSign" v-if="currentPatient.record.isPressureScoreHigh">
                   <img src="/static/img/icon_score_pressure.png" alt="">
                </span>
            <span class="vitalSign" v-if="currentPatient.record.isFallScoreHigh">
                   <img src="/static/img/icon_score_fall.png" alt="">
                </span>
            <span class="vitalSign" v-if="currentPatient.record.isUseMonitor">
                   <img src="/static/img/icon_score_watch.png" alt="">
                </span>
            <div class="handleBtn">
              <el-button size="small" type="danger" :disabled="isDisableHandle" v-if="nurseShow && isRescue!=1"
                         @click="showAddDialog('beginRescueDialog','beginRescueForm','')">开始抢救
              </el-button>
              <el-button size="small" type="danger" :disabled="isDisableHandle" v-if="nurseShow && isRescue==1"
                         @click="showAddDialog('endRescueDialog','endRescueForm','')">结束抢救
              </el-button>
              <el-button size="small" :disabled="isDisableHandle" v-if="nurseShow" @click="circulation">患者流转</el-button>
              <el-button size="small" :disabled="isDisableHandle" v-if="nurseShow" @click="wristPrint">腕带打印</el-button>
              <el-button size="small" :disabled="isDisableHandle" v-if="nurseShow" @click="editPatient">编辑信息</el-button>
              <span v-if="!nurseShow && currentPatient.clusteringVo && currentPatient.clusteringVo.status==1"
                    class="clustering">集束化治疗中</span>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <div class="title">住院号:</div>
              <div class="content">{{currentPatient.record.inhosNum}}</div>
            </div>
            <div class="col">
              <div class="title">入院日期:</div>
              <div class="content">{{currentPatient.record.inhosDate}}</div>
            </div>
            <div class="col">
              <div class="title">主治医生:</div>
              <div class="content">{{currentPatient.record.primaryDoctorName}}</div>
            </div>
            <div class="col">
              <div class="title">责任护士:</div>
              <div class="content">{{currentPatient.record.primaryNurseName}}</div>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <div class="title">来源科室:</div>
              <div class="content">{{currentPatient.record.sourceDept}}</div>
            </div>
            <div class="col">
              <div class="title">护理级别:</div>
              <div class="content">
                <span v-if="currentPatient.record.nursegrade ==1">特级护理</span>
                <span v-else-if="currentPatient.record.nursegrade ==2">I级护理</span>
                <span v-else-if="currentPatient.record.nursegrade ==3">II级护理</span>
                <span v-else-if="currentPatient.record.nursegrade ==4">III级护理</span>
                <span v-else style="display: none"></span>
              </div>
            </div>
            <div class="col">
              <div class="title">饮食级别:</div>
              <div class="content">
                {{currentPatient.record.dietLevelStr}}
              </div>
            </div>
            <div class="col"></div>
          </div>
          <div class="row">
            <div class="col">
              <div class="title">诊断信息:</div>
              <div class="content">{{currentPatient.record.inhosDiagnosis}}</div>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <div class="title">过敏史:</div>
              <div class="content">{{currentPatient.drugAllergyHistory}}</div>
            </div>
          </div>
          <div v-if="showMore">
          <div  class="row" v-for="(item,index) in currentPatient.record.operationList" :key="index">
            <div class="col">
              <div class="title">手术名称:</div>
              <div class="content">
                {{item.operationName}}
              </div>
            </div>
            <div class="col">
              <div class="title">手术时间:</div>
              <div class="content">
                {{item.operationTime}}
              </div>
            </div>
            <div class="col">
              <div class="title">手术级别:</div>
              <div class="content">
                {{item.operationLevelStr}}
              </div>
            </div>
            <div class="col">
              <div class="title">麻醉方式:</div>
              <div class="content">{{item.anesthesiaModeStr}}</div>
            </div>
          </div>
          </div>
          <div v-if="currentPatient.record.operationList.length>0" class="row showMore">
            <div class="moreWrapper" @click="showMore=!showMore">
              <span v-if="!showMore">展开更多信息</span>
              <span v-if="showMore">收起更多信息</span>
              <img class="img" v-if="!showMore" src="/static/img/arrow_down.png" alt="">
              <img class="img" v-if="showMore" src="/static/img/arrow_top.png" alt="">
            </div>
          </div>
          <img v-if="currentPatient.record.isDeath" class="death" src="/static/img/icon_death.png" alt="">
        </div>
        <div class="detailMsg">
          <div v-if="nurseShow" class="patientTabsWrapper">
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="生命体征管理" name="tab_1">
                <tab1 :ref="'tab'+'_1'" :isDisabled="isDisableHandle" :patientInfo="currentPatient"></tab1>
              </el-tab-pane>
              <el-tab-pane label="仪器管理" name="tab_10">
                <tab10 :ref="'tab'+'_10'" :patientInfo="currentPatient" :isDisabled="isDisableHandle"></tab10>
              </el-tab-pane>
              <el-tab-pane label="出入量管理" name="tab_2">
                <tab2 :ref="'tab'+'_2'" :isDisabled="isDisableHandle" :patientInfo="currentPatient"
                      @receiveTime="receiveTimeFlag"></tab2>
              </el-tab-pane>
              <el-tab-pane label="血糖管理" name="tab_3">
                <tab3 :ref="'tab'+'_3'" :isDisabled="isDisableHandle" :patientInfo="currentPatient"></tab3>
              </el-tab-pane>
                 <el-tab-pane label="深静脉血栓管理" name="tab_11">
                <tab11 :ref="'tab'+'_11'" :isDisabled="isDisableHandle" :patientInfo="currentPatient"></tab11>
              </el-tab-pane>
              <el-tab-pane label="压疮管理" name="tab_4">
                <pressure-sores :ref="'tab'+'_4'" :isDisabled="isDisableHandle" :patientInfo="currentPatient"/>
              </el-tab-pane>
              <el-tab-pane label="管路护理" name="tab_5">
                <tab5 :ref="'tab'+'_5'" :patientInfo="currentPatient" :isDisabled="isDisableHandle"></tab5>
              </el-tab-pane>
              <el-tab-pane label="集束化管理" name="tab_9">
                <tab9 :ref="'tab'+'_9'" :recorId="currentPatient.record.recordId" :nurseShow="nurseShow"
                      :isDisabled="isDisableHandle"></tab9>
              </el-tab-pane>
              <el-tab-pane label="病情记录" name="tab_6">
                <illnessRecords :patientInfo="currentPatient" :isDisabled="isDisableHandle"
                                :ref="'tab'+'_6'"></illnessRecords>
              </el-tab-pane>
              <el-tab-pane label="护理评分" name="tab_7">
                <nursing-grading :ref="'tab'+'_7'" :patientInfo="currentPatient" :isDisabled="isDisableHandle"
                                 @goPatient="getPatientList"/>
              </el-tab-pane>
              <el-tab-pane label="护理记录" name="tab_8">
                <el-select v-model="nurseValue" placeholder="请选择" class="nurseClass">
                  <el-option
                    v-for="item in nurseOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <!-- <tab8 :ref="'tab'+'_8'" :patientInfo="currentPatient" v-if="nursingRecordShow&&nurseValue==1"></tab8> -->
                <iframe v-if="nursingRecordShow&&nurseValue==1" ref="iframe" scrolling="no" width="100%" height="100%"
                        frameborder="0" id="bdIframe" :src="nurseSrc"></iframe>
                <iframe v-if="nursingRecordShow&&nurseValue==2" :ref="'myiframe'" class="ifa" scrolling=auto
                        :src="routerSrc" width="100%" height="1000px" frameborder="0"></iframe>
              </el-tab-pane>
            </el-tabs>
          </div>
          <doctorPatientTabs v-if="!nurseShow" :patientInfo="currentPatient"
                             ref="doctorPatientTabs"></doctorPatientTabs>
        </div>
      </div>
    </div>
    <!--编辑病患弹框-->
    <el-dialog title="编辑信息" :visible.sync="dialog_editPatient" width="840px" class="editPatientDialog">
      <el-form :model="editPatientForm" label-width="100px" :rules="editPatientRules" label-position="right"
               ref="editPatientForm">
        <p class="titleTxt">基础信息</p>
        <el-row>
          <el-col :span="12">
              <el-form-item label="预期入院:" prop="planIndept">
                  <el-radio-group v-model="editPatientForm.planIndept">
                  <el-radio  :label="1">是</el-radio>
                  <el-radio  :label="0">否</el-radio>
                </el-radio-group>
            </el-form-item>
            </el-col>
          <el-col :span="12">
            <el-form-item label="入院时间:" prop="inhosDate">
              <el-date-picker
                :picker-options="pickerOptions"
                style="width: 224px"
                value-format="yyyy-MM-dd HH:mm"
                @change="pickerChange_inhosDate"
                format="yyyy-MM-dd HH:mm"
                v-model="editPatientForm.inhosDate"
                type="datetime"
                placeholder="请选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
            <el-form-item label="入科时间:" prop="indeptTime">
              <el-date-picker
                :picker-options="pickerOptions"
                style="width: 224px"
                value-format="yyyy-MM-dd HH:mm"
                @change="pickerChange_indeptTime"
                format="yyyy-MM-dd HH:mm"
                v-model="editPatientForm.indeptTime"
                type="datetime"
                placeholder="请选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="来源科室:" prop="sourceDept">
              <el-select v-model="editPatientForm.sourceDept" placeholder="请选择" clearable filterable>
                <el-option
                  v-for="(item,index) in sourceDeptOption"
                  :key="index"
                  :label="item.deptName"
                  :value="item.deptName">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="护理级别:" prop="nursegrade">
              <el-select v-model="editPatientForm.nursegrade" placeholder="请选择" clearable filterable>
                <el-option
                  v-for="(item,index) in nursegradeOption"
                  :key="index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="饮食级别:" prop="dietLevel">
              <el-select v-model="editPatientForm.dietLevel" placeholder="请选择" clearable filterable>
                <el-option
                  v-for="(item,index) in dietLevelOption"
                  :key="index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
            <el-form-item label="主治医生:" prop="primaryDoctorId">
              <el-select v-model="editPatientForm.primaryDoctorId" placeholder="请选择" clearable filterable>
                <el-option
                  v-for="(item,index) in doctorOption"
                  :key="index"
                  :label="item.realName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
             <el-col :span="12">
             <el-form-item label="责任护士:" prop="primaryNurseId">
              <el-select v-model="editPatientForm.primaryNurseId" placeholder="请选择" clearable filterable>
                <el-option
                  v-for="(item,index) in nurseListOption"
                  :key="index"
                  :label="item.realName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
          <el-form-item label="诊断时间:" prop="inhosDiagnosisTime">
              <el-date-picker
                :picker-options="pickerOptions"
                style="width: 224px"
                value-format="yyyy-MM-dd HH:mm"
                @change="pickerChange_inhosDiagnosisTime"
                format="yyyy-MM-dd HH:mm"
                v-model="editPatientForm.inhosDiagnosisTime"
                type="datetime"
                placeholder="请选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
            <el-col :span="12">
                         <el-form-item label="诊断:">
                                <el-select
                    class="operationName"
                    v-model="editPatientForm.inhosDiagnosis"
                    clearable
                    filterable
                    multiple
                    remote
                    placeholder="请输入关键词"
                    :remote-method="diagnoseMethod"
                    :loading="loading">
                    <el-option
                      v-for="(item,index) in diagnoseNameOption"
                      :key="index"
                      :label="item.diagnosisTest"
                      :value="item.diagnosisTest">
                    </el-option>
                  </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" >
            <el-form-item label="过敏史:" prop="isAllergy">
              <el-radio v-model="editPatientForm.isAllergy" :label="0">无</el-radio>
              <el-radio v-model="editPatientForm.isAllergy" :label="1">有</el-radio>
            </el-form-item>
          </el-col>
          <el-col :offset="1" :span="15">
              <el-input v-if="editPatientForm.isAllergy==1" type="input" maxlength="99" v-model="editPatientForm.drugAllergyHistory" placeholder="请输入过敏史"></el-input>
          </el-col>
        </el-row>

        <p class="titleTxt">手术信息</p>
        <div class="operationItemWrapper" v-for="(oItem, index) in editPatientForm.operationList" :key="index">
             <span class="removeIcon">
               <i v-if="editPatientForm.operationList.length!=1" class="el-icon-remove-outline"
                  style="margin-right: 10px;cursor: pointer;font-size: 18px" @click="removeOperation(index)"></i>
             </span>
          <p class="groupLine"></p>
          <div>
            <el-row>
              <el-col :span="12">
                <el-form-item label="手术名称:" prop="operationName">
                  <el-select
                    class="operationName"
                    v-model="oItem.operationName"
                    clearable
                    filterable
                    multiple
                    remote
                    placeholder="请输入关键词"
                    :remote-method="remoteMethod"
                    :loading="loading">
                    <el-option
                      v-for="(item,index) in operationNameOption"
                      :key="index"
                      :label="item.name"
                      :value="item.name">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="手术级别:" prop="operationLevel">
                  <el-select v-model="oItem.operationLevel" placeholder="请选择" clearable filterable>
                    <el-option
                      v-for="(item,index) in operationLevelOption"
                      :key="index"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="手术时间:" prop="operationTime">
                  <el-date-picker
                    :picker-options="pickerOptions"
                    style="width: 224px"
                    value-format="yyyy-MM-dd HH:mm"
                    @change="pickerChange_operationTime"
                    format="yyyy-MM-dd HH:mm"
                    v-model="oItem.operationTime"
                    type="datetime"
                    placeholder="请选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="麻醉方式:" prop="anesthesiaMode">
                  <el-select v-model="oItem.anesthesiaMode" placeholder="请选择" clearable filterable>
                    <el-option
                      v-for="(item,index) in anesthesiaModeOption"
                      :key="index"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
        <el-form-item label="">
          <el-button size="small" icon="el-icon-plus" @click="addOperation">新增一项手术</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog_editPatient = false;tempDelarr = [];">取 消</el-button>
        <el-button type="primary" @click="savePatient('editPatientForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!--流转-->
    <el-dialog title="流转" :visible.sync="dialog_circulation" width="480px" class="editPatientDialog">
      <el-form :model="circulationForm" label-width="100px" :rules="circulationRules" label-position="right"
               ref="circulationForm">
        <el-form-item label="流转类型:" prop="circulateType">
          <el-select v-model="circulationForm.circulateType" @change="circulateTypeChange" placeholder="请选择" clearable
                     filterable>
            <el-option
              v-for="(item,index) in circulationOption"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <!--转床-->
        <div v-if="circulationForm.circulateType==1">
          <el-form-item label="转入床位:" prop="intoBedNo">
            <el-select v-model="circulationForm.intoBedNo" placeholder="请选择" clearable filterable>
              <el-option
                v-for="(item,index) in intoBedOption"
                :key="index"
                :label="item.bedName"
                :value="item.bedNo">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="转床时间:" prop="circulateTime">
            <el-date-picker
              style="width: 224px"
              :picker-options="pickerOptions"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
              v-model="circulationForm.circulateTime"
              @change="pickerChange_circulateTime"
              type="datetime"
              placeholder="请选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="转床原因:" prop="changeBedReason">
            <el-select v-model="circulationForm.changeBedReason" placeholder="请选择" clearable filterable>
              <el-option
                v-for="(item,index) in changeReasonOption"
                :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="病原菌:" prop="remark" v-if="circulationForm.changeBedReason=='隔离'">
            <el-input v-model="circulationForm.remark" type="textarea" maxlength="99"></el-input>
          </el-form-item>
        </div>
        <!--出科-->
        <div v-if="circulationForm.circulateType==2">
          <el-form-item label="出科性质:" prop="outDeptNature">
            <el-select v-model="circulationForm.outDeptNature" placeholder="请选择" clearable filterable>
              <el-option
                v-for="(item,index) in outDeptNatureOption"
                :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="出科去向:" prop="outDeptDirection">
            <el-input v-model="circulationForm.outDeptDirection" maxlength="99"></el-input>
          </el-form-item>
          <el-form-item label="出科时间:" prop="outDeptTime">
            <el-date-picker
              style="width: 224px"
              :picker-options="pickerOptions"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
              @change="pickerChange_outDeptTime"
              v-model="circulationForm.outDeptTime"
              type="datetime"
              placeholder="请选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="备注:" prop="remark">
            <el-input v-model="circulationForm.remark" type="textarea" maxlength="99"></el-input>
          </el-form-item>
        </div>
        <!--隔离-->
        <div v-if="circulationForm.circulateType==3">
          <el-form-item label="隔离方式:" prop="isolationType">
            <el-select v-model="circulationForm.isolationType" placeholder="请选择" clearable filterable>
              <el-option
                v-for="(item,index) in isolationTypeOption"
                :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择床位:" prop="intoBedNo" v-if="circulationForm.isolationType==2">
            <el-select v-model="circulationForm.intoBedNo" placeholder="请选择" clearable filterable>
              <el-option
                v-for="(item,index) in intoBedOption"
                :key="index"
                :label="item.bedName"
                :value="item.bedNo">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="隔离时间:" prop="circulateTime">
            <el-date-picker
              style="width: 224px"
              :picker-options="pickerOptions"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
              v-model="circulationForm.circulateTime"
              @change="pickerChange_circulateTime"
              type="datetime"
              placeholder="请选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="病原菌:" prop="remark">
            <el-input v-model="circulationForm.remark" type="textarea" maxlength="99"></el-input>
          </el-form-item>
        </div>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog_circulation = false">取 消</el-button>
        <el-button type="primary" @click="saveCirculation('circulationForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!--开始抢救-->
    <el-dialog title="开始抢救" :visible.sync="beginRescueDialog" width="480px" class="rescueMsgDialog">
      <el-form :model="beginRescueForm" ref="beginRescueForm" label-width="120px" :rules="beginRescueRules"
               label-position="right">
        <el-form-item label="开始抢救时间:" prop="startSaveTime">
          <el-date-picker
            style="width: 224px"
            value-format="yyyy-MM-dd HH:mm"
            @change="pickerChange_startSaveTime"
            format="yyyy-MM-dd HH:mm"
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
      <el-form :model="endRescueForm" ref="endRescueForm" :rules="endRescueRules" label-width="120px"
               label-position="right">
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
            :picker-options="pickerOptions"
            @change="pickerChange_endRescue_startSaveTime"
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
            :picker-options="pickerOptions"
            @change="pickerChange_endSaveTime"
            v-model="endRescueForm.endSaveTime"
            type="datetime"
            placeholder="请选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="抢救结果:" prop="saveResult">
          <el-radio v-model="endRescueForm.saveResult" :label="0">存活</el-radio>
          <el-radio v-model="endRescueForm.saveResult" :label="1">死亡</el-radio>
        </el-form-item>
        <!--        <el-form-item label="抢救是否结束:" prop="isEnd">
                  <el-radio v-model="endRescueForm.isEnd" :label="2">是</el-radio>
                  <el-radio v-model="endRescueForm.isEnd" :label="1">否</el-radio>
                </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="endRescueDialog = false">取 消</el-button>
        <el-button size="small" style="margin-right: 0" type="primary" @click="endRescue">确 定</el-button>
      </div>
    </el-dialog>
    <!--腕带扫码-->
    <el-dialog title="腕带打印预览" :visible.sync="wristDialog" width="840px" class="wristDialog">
     <div id="wristPrint">
       <div class="wrist"
            style="display: flex;align-items: center;justify-content: center;width: 100%;font-size: 8px">
         <div class="content" style=" flex: 6; flex-direction: column;">
           <div class="top" style="padding: 20px;display: flex;">
            <span class="patientBaseMsg" style=" flex: 1; min-width: 33.33%;white-space: nowrap;padding-right: 10px;box-sizing: border-box;"><span>病人: </span>
              <span>{{currentPatient.name}}</span>
              <span v-if=" currentPatient.sex || currentPatient.age">(</span>
              <span v-if="currentPatient.sex==1">男</span>
              <span v-else-if="currentPatient.sex==2">女</span>
              <span v-else></span>
              <span v-if="currentPatient.age">/</span>
              <span class="age" v-if="currentPatient.age">{{currentPatient.age}}岁</span>
              <span v-if=" currentPatient.sex || currentPatient.age">)</span>
            </span>
             <span class="" style="flex: 1"><span>血型: </span> <span>{{currentPatient.bloodType}}</span></span>
             <span class="contentItem"
                   style="flex: 1;padding-right: 10px;box-sizing: border-box;"><span>住院号: </span> <span>{{currentPatient.record.inhosNum}}</span></span>
           </div>
           <div class="bot" style="padding: 20px;display: flex;">
            <span class="contentItem"
                  style="flex: 1;padding-right: 10px;box-sizing: border-box;"><span>床位: </span> <span
              v-if="currentPatient.record.bedNo">{{currentPatient.record.bedNo}} 床</span></span>
             <span class="contentItem"
                   style="flex: 1;padding-right: 10px;box-sizing: border-box;"><span>病区: </span> <span>{{currentPatient.record.sourceDept}}</span></span>
             <span style="flex: 1"></span>
           </div>
         </div>
         <div class="codeImg" style="flex: 1;position: relative;padding-right: 30px;display: flex;">
           <div id="codeImg" ref="codeImg"
                style="width: 100%;height: 100%;display: flex;justify-content: flex-end;margin-right: 10px;">
           </div>
           <p class="inhosNum"
                style="writing-mode: vertical-rl; writing-mode: tb-rl;transform:rotate(180deg);display: flex;justify-content: center; position: absolute;right: 10px;height: 100%">
               {{currentPatient.record.inhosNum}}
           </p>
         </div>
       </div>
     </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="wristDialog = false">取 消</el-button>
        <el-button size="small" style="margin-right: 0" type="primary" @click="surePrint">
          确认打印
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

  import {getSessionData} from "@/utils/SimpleSessionStorageService"
  import illnessRecords from './tab/tab6/illnessRecords'
  import NursingGrading from './components/nursingGrading.vue'
  import PressureSores from './components/pressureSores.vue'
  import tab1 from './tab/tab1';
  import tab2 from './tab/tab2';
  import tab3 from './tab/tab3';
  import tab5 from './tab/tab5';
  import tab10 from './tab/tab10';
  import tab11 from './tab/tab11';
  import tab9 from './doctorPages/cluserManage';
  import tab8 from './tab/tab8';

  import doctorPatientTabs from "./doctorPages/patientTabs";
  import eventBus from "@/utils/eventBus.js"
  import QRCode from 'qrcodejs2'
 /* import {getLodop} from "@/utils/LodopFuncs.js"*/

  export default {
    components: {illnessRecords, PressureSores, NursingGrading, tab1, tab2, tab3, tab5, doctorPatientTabs, tab9,tab10,tab8,tab11},
    data() {
      return {
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        showMore: false,
        activeName: "tab_1",
        active_name: "生命体征管理",
        nursingRecordShow: false,
        nurseShow: true,
        iframeWin: null,
        routerSrc: "",
        patientId: '',
        patientType: '',  //病患类型,是否归档
        isDisableHandle: false,  //出科之后是否禁用
        currentIndex: 0,
        /*编辑病患*/
        dialog_editPatient: false,
        editPatientForm: {
          inhosDate: '',
          sourceDept: '',
          /*sourceDeptId: '',*/
          primaryDoctorId: '',
          primaryNurseId: '', //责任护士
          nursegrade: '',
          dietLevel: '',
          operationList: [{
            id: '',
            operationName: [], //手术名称
            operationLevel: '', //手术级别
            operationTime: '', //手术时间
            anesthesiaMode: '', // 麻醉方式
          }],
          isAllergy: 0,
          drugAllergyHistory: '',
          inhosDiagnosis:[],
          indeptTime:'', //入科时间
          planIndept:'',
          inhosDiagnosisTime:'',

        },
        editPatientRules: {},
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
        loading: false,
        sourceDeptOption: [],//来源科室
        doctorOption: [], //医生
        nurseListOption: [],
        nursegradeOption: [
          {
            label: '特级护理',
            value: 1
          }, {
            label: 'Ⅰ级护理',
            value: 2
          }, {
            label: 'Ⅱ级护理',
            value: 3
          }, {
            label: 'Ⅲ级护理',
            value: 4
          }],//护理级别
        dietLevelOption: [
          {
            label: '普食',
            value: 1
          }, {
            label: '半流质',
            value: 2
          }, {
            label: '流质',
            value: 3
          }, {
            label: '软食',
            value: 4
          }
        ], //饮食级别
        operationNameOption: [], //手术名称
        operationLevelOption: [
          {
            label: '一级手术',
            value: 1
          }, {
            label: '二级手术',
            value: 2
          }, {
            label: '三级手术',
            value: 3
          }, {
            label: '四级手术',
            value: 4
          }], //手术级别
        anesthesiaModeOption: [
          {
            label: '全身麻醉',
            value: 1
          }, {
            label: '推管内麻醉',
            value: 2
          }, {
            label: '神经组织麻醉',
            value: 3
          }, {
            label: '局部麻醉',
            value: 4
          },
        ],//麻醉方式

        /* 流转*/
        dialog_circulation: false,
        circulationForm: {
          //转床
          circulateType: 1,
          intoBedNo: '',
          circulateTime: '',
          changeBedReason: '',
          //出科
          outDeptNature: '',
          outDeptDirection: '',
          outDeptTime: '',
          remark: '',
          //隔离
          isolationType: '',//隔离方式

        },
        circulationRules: {
          //转床
          circulateType: [
            {required: true, message: '请选择流转类型', trigger: 'blur'},
          ],
          intoBedNo: [
            {required: true, message: '请选择转入床位', trigger: 'blur'},
          ],
          circulateTime: [
            {required: true, message: '请选择日期', trigger: 'blur'},
          ],
          changeBedReason: [
            {required: true, message: '请输入转床原因', trigger: 'blur'},
          ],
          //出科
          outDeptNature: [
            {required: true, message: '请选择出科性质', trigger: 'blur'},
          ],
          outDeptDirection: [
            {required: true, message: '请输入出科去向', trigger: 'blur'},
          ],
          outDeptTime: [
            {required: true, message: '请选择出科时间', trigger: 'blur'},
          ],
          //隔离
          isolationType: [
            {required: true, message: '请选择隔离原因', trigger: 'blur'},
          ],

        },
        circulationOption: [
          {
            label: '转床',
            value: 1
          },
          {
            label: '出科',
            value: 2
          },
          {
            label: '隔离',
            value: 3
          }],
        isolationTypeOption: [
          {
            label: '床旁隔离',
            value: 1
          },
          {
            label: '转床隔离',
            value: 2
          },
        ], //隔离方式

        intoBedOption: [],
        changeReasonOption: [
          {
            label: '调整',
            value: '调整'
          },
          {
            label: '病情变化',
            value: '病情变化'
          },
          {
            label: '隔离',
            value: '隔离'
          },
        ], //转入床位
        outDeptNatureOption: [
          {
            label: '转科',
            value: 1
          }, {
            label: '转院',
            value: 2
          }, {
            label: '医嘱出院',
            value: 3
          }, {
            label: '自动出院',
            value: 4
          }, {
            label: '死亡',
            value: 5
          }],
        //出科性质
        currentPatient: {
          record: {
            operationList: []
          }
        },
        patientsList: [],
        /*抢救信息*/
        isRescue: 0,
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
        nurseOptions: [
          {
            label: '电子特护单',
            value: '1'
          },
          {
            label: '电子病历',
            value: '2'
          },
        ],
        nurseValue: '1',
        participantsOptions: [],
        nurseSrc: null,
        wristDialog: false,
        tempDelarr:[],
        diagnoseNameOption:[],
      }
    },
    created() {
    },
    beforeRouteLeave(to, from, next) {
      sessionStorage.setItem('activeName_patientTab', this.activeName)
      next();
    },
    beforeDestroy() {

    },
    mounted() {
      //通过用户登录类型判断是医生还是护士类型
      if (getSessionData("userType") == 3) {
        this.nurseShow = false
      } else if (getSessionData("userType") == 4) {
        this.nurseShow = true
      }
      if (getSessionData("typeFace") == "医生端") {
        this.nurseShow = false
      } else if (getSessionData("typeFace") == "护士端") {
        this.nurseShow = true
      }
      eventBus.$on('getTarget', target => {
        console.log(target);
        if (target == "医生端") {
          this.nurseShow = false
        } else if (target == "护士端") {
          this.nurseShow = true
        }
      });
      eventBus.$on('refreshData',target=>{
        this.getPatientList();
      })
      this.routerSrc = "../../../../../../static/electronicRecord/demo2.html"
      this.patientId = this.$route.query.patientId
      let patientType = this.$route.query.patientType
      let patientObj = this.$route.query.patientObj
      if (patientType && patientType == 'archives') { // 档案管理跳到病患列表,只展示带过来的病患
        this.currentIndex = 1
        this.currentPatient = JSON.parse(patientObj)
        this.patientsList = [this.currentPatient]

        //归档病患 出科两天内可操作
        let archiveObj = (patientObj && JSON.parse(patientObj)) ? JSON.parse(patientObj) : ''
        if (archiveObj && (Date.now() - Date.parse(archiveObj.record.outdeptTime) > 60 * 60 * 1000 * 24 * 2)) {
          this.isDisableHandle = true
        } else {
          this.isDisableHandle = false
        }
      } else {
        this.getPatientList(this.nurseShow)
      }
      /*  设置选中tab */
      let activeName_patientTab = sessionStorage.getItem('activeName_patientTab')
      this.activeName = activeName_patientTab ? activeName_patientTab : 'tab_1'
    },
    watch: {
      currentPatient(newVal, oldVal) {
        if (this.currentPatient) {
          this.handleClick()
        }
      },
      nurseValue: {
        handler(newVal) {
          let that = this;
          if (newVal == 2) {
            setTimeout(() => {
              that.iframeWin = that.$refs.myiframe.contentWindow
              that.sendMessage()
            }, 1000)
          } else if (newVal == 1) {
            that.$nextTick(function () {
               that.getIframe();
              // that.$refs['tab_8'].initData();
            })
          }
        },
      },
      activeName(newVal, oldVal) {
        if (newVal != 'tab_2') {
          if (this.timeStamp) {
            clearInterval(this.timeStamp);
          }
        }
      }

    },
    methods: {
      getIframe() {
        let oIframe = document.getElementById('bdIframe');
        let deviceHeight = document.documentElement.clientHeight;
        oIframe.style.height = (Number(deviceHeight)) + 'px'; //数字是页面布局高度差
        this.getNurseSrc();
      },
      getNurseSrc() {
        let that = this;
        let url = '/api/icu/careSheet/template?type=1'
        that.$axios.get(global.url + url).then(function (res) {
          if (res.data.msg == 201) {
            that.nurseSrc = res.data.respData.templateName + '&hospitalCode=' + res.data.respData.hospitalCode + '&patientRecordId=' + that.currentPatient.record.recordId + '&type=2&apiName=thdGu';
            console.log(that.nurseSrc);
            // that.nurseSrc = 'http://172.16.15.100:8075/webroot/decision/view/report?viewlet=GD-G1.cpt'
          } else {
            that.$message({
              message: res.data.content,
              type: 'warning'
            });
          }
        })
      },
      sendMessage() {
        let params = {
          url: global.url,
          token: getSessionData("token"),
          patientRecordId: this.currentPatient.record.recordId,
          archivesid: this.currentPatient.archivesid
        }
        this.iframeWin.postMessage(params, '*')
      },
      init() {
        this.$nextTick(function () {
          this.$refs['tab_1'].initData();
        })
      },
      handleClick(tab, event) {
        console.log(this.activeName)
        if (this.activeName == "tab_1") {
          this.active_name = "生命体征管理"
        } else if (this.activeName == "tab_2") {
          this.active_name = "出入量管理"
        } else if (this.activeName == "tab_3") {
          this.active_name = "血糖管理"
        } else if (this.activeName == "tab_4") {
          this.active_name = "压疮管理"
        } else if (this.activeName == "tab_5") {
          this.active_name = "管路护理"
        } else if (this.activeName == "tab_6") {
          this.active_name = "病情记录"
        } else if (this.activeName == "tab_7") {
          this.active_name = "护理评分"
        } else if (this.activeName == "tab_8") {
          this.active_name = "护理记录"
        } else if (this.activeName == "tab_9") {
          this.active_name = "集束化管理"
        }

        if (this.activeName == "tab_8") {
          this.nursingRecordShow = true
          console.log(this.currentPatient.record.recordId)
          // this.iframeWin=this.$refs.myiframe.contentWindow
          //   this.sendMessage()
          let that = this
          if (this.nurseValue == 2) {
            setTimeout(() => {
              that.iframeWin = that.$refs.myiframe.contentWindow
              that.sendMessage()
            }, 1000)
          } else if (this.nurseValue == 1) {
            that.$nextTick(function () {
              that.getIframe();
              //  that.$refs['tab_8'].initData();
            })
          }
        } else {
          this.nursingRecordShow = false
          let tabRef = this.activeName;
          if (this.$refs[tabRef]) {
            this.$nextTick(() => {
              this.$refs[tabRef].initData();
            })
          }
        }
      },
      changePatient(item, index) {
        this.showMore = false
        this.editPatientForm.operationList = [{
          id: '',
          operationName: [],
          operationLevel: '',
          operationTime: '',
          anesthesiaMode: ''
        }]
        this.currentPatient = item
        this.currentIndex = index
        this.patientId = item.patientId
        this.isRescue = this.currentPatient.record.isRescue
        sessionStorage.setItem('isRescue', this.isRescue)
        if (this.nursingRecordShow == true && this.nurseValue == 2) {
          let that = this
          setTimeout(() => {
            that.iframeWin = that.$refs.myiframe.contentWindow
            that.sendMessage()
            that.iframeWin.changgeSelectForm()
          }, 1000)
        }

      },
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
            this.getIndex(this.patientsList)
          } else {
            this.$message({
              message: data.content,
              type: 'warning'
            });
          }
        });
      },
      //获取空床位列表
      getBedList() {
        let param = {
          hospitalCode: '',
          type: 2
        }
        this.$axios({
          url: global.url + '/api/icu/outindept/queryBedPatientRecords',
          method: 'post',
          data: param
        }).then((response) => {
          var data = response.data;
          if (data.msg == 201) {
            let resData = data.respData && data.respData.list ? data.respData.list : []
            this.intoBedOption = resData
          } else {
            this.$message({
              message: data.content,
              type: 'warning'
            });
          }
        });
      },
      //获取主治医生列表
      getPrimaryDoctorList() {
        let param = {
          "pageNum": 1,
          "pageSize": 0,
          "userTypes": [3]
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
            let resData = data.respData && data.respData.list ? data.respData.list : []
            this.doctorOption = resData
          } else {
            this.$message({
              message: data.content,
              type: 'warning'
            });
          }
        });
      },
      //获取责任护士列表
      getPrimaryNurseList() {
        let param = {
          "pageNum": 1,
          "pageSize": 0,
          "userTypes": [4]
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
            let resData = data.respData && data.respData.list ? data.respData.list : []
            this.nurseListOption = resData
          } else {
            this.$message({
              message: data.content,
              type: 'warning'
            });
          }
        });
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
      //获取来源科室列表
      getSourceDeptList() {
        let param = {
          "pageNum": 1,
          "pageSize": 0,
          "type": '2'
        }
        this.$axios({
          url: global.url + '/base/dept/list',
          method: 'get',
          headers: {
            'Content-Type': 'application/json'
          },
          params: param
        }).then((response) => {
          var data = response.data;
          if (data.msg == 201) {
            let resData = data.respData && data.respData.list ? data.respData.list : []
            this.sourceDeptOption = resData
          } else {
            this.$message({
              message: data.content,
              type: 'warning'
            });
          }
        });
      },
      getIndex(list) {
        if (list && list.length != 0) {
          let _this = this
          if (this.patientId) {
            list.forEach((item, index) => {
              if (item.id == _this.patientId) {
                _this.currentIndex = index
                _this.currentPatient = item
              }
            })
          } else {
            _this.currentIndex = 0
            _this.currentPatient = list[0];
          }
        }
        //急救状态
        this.isRescue = this.currentPatient.record.isRescue
        sessionStorage.setItem('isRescue', this.isRescue)
      },
      editPatient() {
        this.getSourceDeptList()
        this.getPrimaryDoctorList()
        this.getPrimaryNurseList()
        this.dialog_editPatient = true
        this.editPatientForm.operationList = [{
          id: '',
          operationName: [],
          operationLevel: '',
          operationTime: '',
          anesthesiaMode: ''
        }]
        this.$nextTick(() => {
          this.editPatientForm.inhosDate = this.currentPatient.record.inhosDate
          this.editPatientForm.indeptTime = this.currentPatient.record.indeptTime
         /* this.editPatientForm.sourceDeptId = this.currentPatient.record.sourceDeptId ? Number(this.currentPatient.record.sourceDeptId) : ''*/
          this.editPatientForm.sourceDept = this.currentPatient.record.sourceDept
          this.editPatientForm.primaryDoctorId = this.currentPatient.record.primaryDoctorId ? Number(this.currentPatient.record.primaryDoctorId) : ''
          this.editPatientForm.primaryNurseId = this.currentPatient.record.primaryNurseId ? Number(this.currentPatient.record.primaryNurseId) : ''
          this.editPatientForm.nursegrade = this.currentPatient.record.nursegrade
          this.editPatientForm.dietLevel = this.currentPatient.record.dietLevel
          if(this.currentPatient.record.inhosDiagnosis){
               this.editPatientForm.inhosDiagnosis = this.currentPatient.record.inhosDiagnosis.split(',');
          }
          this.editPatientForm.planIndept = this.currentPatient.record.planIndept;
          this.editPatientForm.inhosDiagnosisTime = this.currentPatient.record.inhosDiagnosisTime;
          //是否过敏,过敏史
          this.editPatientForm.isAllergy = this.currentPatient.isAllergy
          this.editPatientForm.drugAllergyHistory = this.currentPatient.drugAllergyHistory
          // 手术信息反显
          let operationList = this.currentPatient.record.operationList.length > 0 ? JSON.parse(JSON.stringify(this.currentPatient.record.operationList)) : [{
            id: '',
            operationName: [], //手术名称
            operationLevel: '', //手术级别
            operationTime: '', //手术时间
            anesthesiaMode: '', // 麻醉方式
          }]
          operationList.forEach(item => {
            if (typeof item.operationName == 'string' && item.operationName) {
              item.operationName = item.operationName.split(',')
            } else if (typeof item.operationName == 'object' && item.operationName.length > 0) {
              item.operationName = item.operationName
            } else {
              item.operationName = []
            }
          })
          this.editPatientForm.operationList = operationList
        })
      },
      //腕带打印
      wristPrint() {
        this.wristDialog = true
        this.$nextTick(() => {
          document.getElementById('codeImg').innerHTML = ''
          console.log(this.currentPatient.record.recordId);
          let qrcode = new QRCode(this.$refs.codeImg, {
            text: String(this.currentPatient.record.recordId), // 需要转换为二维码的内容
            width: 60,
            height: 60,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
          })
        })
      },
      surePrint() {
        this.wristDialog = false
        /*html版*/
    /*    let LODOP = getCLodop();
        LODOP.SET_LICENSES(unescape("\u6606\u660e\u6613\u6781\u4fe1\u606f\u6280\u672f\u6709\u9650\u516c\u53f8"),"055716580837383919278901905623","","");
       // LODOP.NewPage()
        LODOP.SET_PRINT_MODE("WINDOW_DEFPRINTER",'Brother TD-2020'); //设置默认打印机
        // LODOP.SET_SHOW_MODE("LANGUAGE",0); // 去掉水印
        LODOP.SET_PRINT_STYLE("FontSize", 8);
       LODOP.SET_PRINT_PAGESIZE(2,"30mm",'90mm',"腕带打印");//设定纸张大小
        var strFormHtml = "<body>" + document.getElementById('wristPrint').innerHTML + "</body>";
        LODOP.ADD_PRINT_HTM(30, 2, "100%", "100%", strFormHtml);
        //LODOP.NewPage();
        LODOP.SET_PRINT_MODE("CUSTOM_TASK_NAME", "腕带打印");
        LODOP.PRINTAOK();*/
      /*  LODOP.PREVIEW();*/



/*        var LODOP=getCLodop();
        LODOP.SET_LICENSES(unescape("\u6606\u660e\u6613\u6781\u4fe1\u606f\u6280\u672f\u6709\u9650\u516c\u53f8"),"055716580837383919278901905623","","");
        LODOP.SET_PRINT_MODE("WINDOW_DEFPRINTER",'Brother TD-2020'); //设置默认打印机
        LODOP.SET_PRINT_PAGESIZE(2,"10mm","120mm","腕带打印")
        LODOP.SET_PRINT_STYLE("FontSize",8);
        LODOP.NewPage();
        LODOP.ADD_PRINT_TEXT(25,10,150,15, '病人:'+this.currentPatient.name +'('+(this.currentPatient.sex===1?'男':'女') + '/' + this.currentPatient.age+'岁'  +')' );
        LODOP.ADD_PRINT_TEXT(25,130,80,15,'血型:'+this.currentPatient.bloodType);
        LODOP.ADD_PRINT_TEXT(45,10,80,15,'床位:'+this.currentPatient.record.bedNo+'床');
        LODOP.ADD_PRINT_TEXT(45,130,150,15,'病区:'+this.currentPatient.record.sourceDept);
        LODOP.ADD_PRINT_TEXT(45,260,120,15,'住院号:'+this.currentPatient.record.inhosNum);
        LODOP.ADD_PRINT_BARCODE(10,350,70,70,"QRCode",this.currentPatient.record.recordId)
        LODOP.PREVIEWA()*/
       /* LODOP.PRINTAOK()*/
      },

      circulation() {
        this.dialog_circulation = true
        this.getBedList()
        this.$nextTick(() => {
          this.$refs['circulationForm'].clearValidate()
          this.$refs['circulationForm'].resetFields()
        })
      },
      beginRescue() {
        this.$refs['beginRescueForm'].validate((valid) => {
          if (valid) {
            this.isRescue = 1
            sessionStorage.setItem('isRescue', this.isRescue)
            let param = {
              patientRecordId: this.currentPatient.record.recordId,
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
                this.$message.success(res.data.content)
                this.beginRescueDialog = false
                let rescueId = res.data.respData
                this.getPatientList()
                this.$router.push({
                  path: '/patient/nursingMeasures',
                  query: {
                    isRescue: 1,
                    rescueId: rescueId,
                    patientInfo: this.currentPatient,
                    recordTime: this.beginRescueForm.startSaveTime
                  }
                })
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
          if (valid) {
            if (new Date(this.endRescueForm.endSaveTime).getTime() - new Date(this.endRescueForm.startSaveTime).getTime() < 0) {
              this.$message.error('结束时间不能小于开始时间!');
              return;
            }

            this.isRescue = 2
            sessionStorage.setItem('isRescue', this.isRescue)
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
              patientRecordId: this.currentPatient.record.recordId,
              rescueStartTs: this.endRescueForm.startSaveTime,
              rescueEndTs: this.endRescueForm.endSaveTime,
              isRescue: 2, //抢救是否结束
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
                this.$message.success(res.data.content)
                this.endRescueDialog = false
                this.getPatientList()
                /*  this.$router.push({
                    path: '/patient/nursingMeasures',
                    query: {
                      patientInfo: this.currentPatient,
                      recordTime: this.endRescueForm.startSaveTime,
                    }
                  })*/
              } else {
                this.$message.error(res.data.content)
              }
            })
          }
        })
      },
      //开始抢救
      showAddDialog(dialog, formName) {
        if (formName == 'endRescueForm') {
          this.getRescuePersonList()
        }
        this[dialog] = true
        if (formName) {
          this.$nextTick(() => {
            this.$refs[formName].resetFields()
          })
        }
      },
      //保存流转
      saveCirculation(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let param = {
              recordId: this.currentPatient.record.recordId,
              circulateType: this.circulationForm.circulateType,
              outBedNo: this.currentPatient.record.bedNo,
            }
            if (this.circulationForm.circulateType == 1) {
              param.intoBedNo = this.circulationForm.intoBedNo
              param.circulateTime = this.circulationForm.circulateTime
              param.changeBedReason = this.circulationForm.changeBedReason
              param.remark = this.circulationForm.remark
            } else if (this.circulationForm.circulateType == 2) {
              param.outDeptNature = this.circulationForm.outDeptNature
              param.outDeptDirection = this.circulationForm.outDeptDirection
              param.circulateTime = this.circulationForm.outDeptTime
              param.remark = this.circulationForm.remark
            } else if (this.circulationForm.circulateType == 3) {
              param.isolationType = this.circulationForm.isolationType
              param.intoBedNo = this.circulationForm.intoBedNo
              param.circulateTime = this.circulationForm.outDeptTime
              param.remark = this.circulationForm.remark
            }
            this.$axios({
              url: global.url + '/api/icu/outindept/circulation',
              method: 'post',
              headers: {
                'Content-Type': 'application/json'
              },
              data: param
            }).then(res => {
              if (res.data.msg == 201) {
                this.$message.success(res.data.content)
                this.dialog_circulation = false
                this.getPatientList()
              } else {
                this.$message.error(res.data.content)
              }
            })
          }
        })
      },
      //保存病患
      savePatient(formName) {
        /* if (this.editPatientForm.operationName.length > 0) {
           this.editPatientRules.operationTime[0].required = true
         }*/
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let primaryDoctorName = ''
            let primaryNurseName = ''
            let _this = this
            let hasRequired = false
            this.doctorOption.forEach(dItem => {
              if (_this.editPatientForm.primaryDoctorId == dItem.id) {
                primaryDoctorName = dItem.realName
              }
            })
            this.nurseListOption.forEach(nItem => {
              if (_this.editPatientForm.primaryNurseId == nItem.id) {
                primaryNurseName = nItem.realName
              }
            })
     /*       let sourceDeptStr = ''
            this.sourceDeptOption.forEach(item => {
              if (_this.editPatientForm.sourceDeptId == item.id) {
                sourceDeptStr = item.deptName
              }
            })*/
            if(!this.editPatientForm.inhosDiagnosisTime&&this.editPatientForm.inhosDiagnosis.length>0){
                this.$message.error('诊断时间不可为空');
                return false;
            }
             if(this.editPatientForm.inhosDiagnosisTime&&this.editPatientForm.inhosDiagnosis.length==0){
                this.$message.error('诊断不可为空');
                return false;
            }
            let operationList = JSON.parse(JSON.stringify(this.editPatientForm.operationList))

            //手术时间必填
            if (operationList.length == 1 && operationList[0].operationName.length == 0 && !operationList[0].operationLevel && !operationList[0].anesthesiaMode && !operationList[0].operationTime) {
              operationList = []
            } else {
              operationList.forEach((oItem, index) => {
                oItem.operationName = oItem.operationName.join(',')
                if (!oItem.operationName) {
                  this.$message.error(`第${index + 1}组手术名称不能为空!`)
                  hasRequired = true
                  throw new Error(`第${index + 1}组手术名称不能为空!`);//终止循环
                }
                if (!oItem.operationTime) {
                  this.$message.error(`第${index + 1}组手术时间不能为空!`)
                  hasRequired = true
                  throw new Error(`第${index + 1}组手术时间不能为空!`);//终止循环
                }
              })
            }
            if (hasRequired) return false
            this.tempDelarr.forEach(function(item,index){
                operationList.push(item);
            })
            let param = {
              patientId:this.currentPatient.id,
              id: this.currentPatient.record.recordId,
              inhosDate: this.editPatientForm.inhosDate,
              indeptTime: this.editPatientForm.indeptTime,//入科时间
            /*  sourceDeptId: this.editPatientForm.sourceDeptId,*/
              sourceDept: this.editPatientForm.sourceDept,
              primaryDoctorId: this.editPatientForm.primaryDoctorId,
              primaryDoctorName: primaryDoctorName,
              primaryNurseId: this.editPatientForm.primaryNurseId,
              primaryNurseName: primaryNurseName,
              nursegrade: this.editPatientForm.nursegrade,
              dietLevel: this.editPatientForm.dietLevel,
              isAllergy: this.editPatientForm.isAllergy,
              drugAllergyHistory: this.editPatientForm.isAllergy ? this.editPatientForm.drugAllergyHistory : '',
              operationList: operationList,
              inhosDiagnosis:this.editPatientForm.inhosDiagnosis.length>0?this.editPatientForm.inhosDiagnosis.join(','):'',
              inhosDiagnosisTime:this.editPatientForm.inhosDiagnosisTime,
              planIndept:this.editPatientForm.planIndept
            }
            this.$axios({
              url: global.url + '/base/patient/updatePatientRecord',
              method: 'post',
              headers: {
                'Content-Type': 'application/json'
              },
              data: param
            }).then(res => {
              if (res.data.msg == 201) {
                this.$message.success(res.data.content)
                this.dialog_editPatient = false;
                this.tempDelarr = [];
                this.getPatientList()
              } else {
                this.$message.error(res.data.content)
              }
            })
          }
        })
      },
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.getOperationList(query)
          }, 1000);
        } else {
          this.operationNameOption = [];
        }
      },
      //获取手术名称列表
      getOperationList(query) {
        if (!query) {
          return false
        }
        let param = {
          "query": query
        }
        const formData = new FormData()
        Object.keys(param).forEach((key) => {
          formData.append(key, param[key]);
        })
        this.$axios({
          url: global.url + '/base/operation/list',
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          data: formData
        }).then((response) => {
          var data = response.data;
          if (data.msg == 201) {
            this.operationNameOption = data.respData
          } else {
          }
        });
      },

      dealOverflowText(content) {
        if (content && content.length > 8) {
          content = content.slice(0, 8) + ' ···'
        }
        return content
      },
      //接收Tab传过来的定时器
      receiveTimeFlag(timeStamp) {
        this.timeStamp = timeStamp;
      },

      circulateTypeChange() {
        this.$refs.circulationForm.clearValidate()
        //this.$refs.circulationForm.resetFields()
      },
      pickerChange_startSaveTime(val) {
        let date = new Date(val)
        if (date.getTime() > Date.now()) {
          this.beginRescueForm.startSaveTime = ''
          this.$message.error('开始抢救时间不能大于当前时间, 请重新选择')
          return false
        }else if(this.currentPatient.record.indeptFlag===0  && this.currentPatient.record.outdeptTime && date.getTime() > new Date(this.currentPatient.record.outdeptTime).getTime()){
          this.beginRescueForm.startSaveTime = ''
          this.$message.error('开始抢救时间不能大于出科时间, 请重新选择')
          return false
        }
      },

      pickerChange_endRescue_startSaveTime(val) {
        let date = new Date(val)
        if (date.getTime() > Date.now()) {
          this.endRescueForm.startSaveTime = ''
          this.$message.error('开始抢救时间不能大于当前时间, 请重新选择')
          return false
        }else if(this.currentPatient.record.indeptFlag===0  && this.currentPatient.record.outdeptTime && date.getTime() > new Date(this.currentPatient.record.outdeptTime).getTime()){
          this.endRescueForm.startSaveTime = ''
          this.$message.error('开始抢救时间不能大于出科时间, 请重新选择')
          return false
        }
      },
      pickerChange_endSaveTime(val) {
        let date = new Date(val)
        if (date.getTime() > Date.now()) {
          this.endRescueForm.endSaveTime = ''
          this.$message.error('结束抢救时间不能大于当前时间, 请重新选择')
          return false
        }else if(this.currentPatient.record.indeptFlag===0  && this.currentPatient.record.outdeptTime && date.getTime() > new Date(this.currentPatient.record.outdeptTime).getTime()){
          this.endRescueForm.endSaveTime = ''
          this.$message.error('结束抢救时间不能大于出科时间, 请重新选择')
          return false
        }
      },
      pickerChange_inhosDate(val) {
        let date = new Date(val)
        if (date.getTime() > Date.now()) {
          this.editPatientForm.inhosDate = ''
          this.$message.error('入院时间不能大于当前时间, 请重新选择')
          return false
        }else if(this.currentPatient.record.indeptFlag===0  && this.currentPatient.record.outdeptTime && date.getTime() > new Date(this.currentPatient.record.outdeptTime).getTime()){
          this.editPatientForm.inhosDate = ''
          this.$message.error('入院时间不能大于出科时间, 请重新选择')
          return false
        }
      },
      // 手术时间
      pickerChange_operationTime(val) {
        let date = new Date(val)
        if (date.getTime() > Date.now()) {
          this.$message.error('手术时间不能大于当前时间, 请重新选择')
          this.editPatientForm.operationList.forEach(item=>{
            if(item.operationTime == val){
              item.operationTime = ''
            }
          })
          return false
        }else if(this.currentPatient.record.indeptFlag===0  && this.currentPatient.record.outdeptTime && date.getTime() > new Date(this.currentPatient.record.outdeptTime).getTime()){
          this.$message.error('手术时间不能大于当前时间, 请重新选择')
          this.editPatientForm.operationList.forEach(item=>{
            if(item.operationTime == val){
              item.operationTime = ''
            }
          })
          return false
        }
      },

      pickerChange_indeptTime(val) {
        let date = new Date(val)
        if (date.getTime() > Date.now()) {
          this.editPatientForm.indeptTime = ''
          this.$message.error('入科时间不能大于当前时间, 请重新选择')
          return false
        }else if(this.currentPatient.record.indeptFlag===0  && this.currentPatient.record.outdeptTime && date.getTime() > new Date(this.currentPatient.record.outdeptTime).getTime()){
          this.editPatientForm.indeptTime = ''
          this.$message.error('入科时间不能大于出科时间, 请重新选择')
          return false
        }
      },

      pickerChange_circulateTime(val) {
        let date = new Date(val)
        if (date.getTime() > Date.now()) {
          this.circulationForm.circulateTime = ''
          this.$message.error('转床时间不能大于当前时间, 请重新选择')
          return false
        }else if(this.currentPatient.record.indeptFlag===0  && this.currentPatient.record.outdeptTime && date.getTime() > new Date(this.currentPatient.record.outdeptTime).getTime()){
          this.circulationForm.circulateTime = ''
          this.$message.error('转床时间不能大于出科时间, 请重新选择')
          return false
        }
      },
      pickerChange_outDeptTime(val) {
        let date = new Date(val)
        if (date.getTime() > Date.now()) {
          this.circulationForm.outDeptTime = ''
          this.$message.error('出科时间不能大于当前时间, 请重新选择')
          return false
        }else if(this.currentPatient.record.indeptFlag===0 && this.currentPatient.record.outdeptTime && date.getTime() > new Date(this.currentPatient.record.outdeptTime).getTime()){
          this.circulationForm.outDeptTime = ''
          this.$message.error('出科时间不能大于出科时间, 请重新选择')
          return false
        }
      },
      pickerChange_inhosDiagnosisTime(val){
        let date = new Date(val)
        if (date.getTime() > Date.now()) {
          this.editPatientForm.inhosDiagnosisTime = ''
          this.$message.error('诊断时间不能大于当前时间, 请重新选择')
          return false
        }else if(this.currentPatient.record.indeptFlag===0 && this.currentPatient.record.outdeptTime && date.getTime() > new Date(this.currentPatient.record.outdeptTime).getTime()){
          this.editPatientForm.inhosDiagnosisTime = ''
          this.$message.error('诊断时间不能大于出科时间, 请重新选择')
          return false
        }
      },
      //添加手术信息
      addOperation() {
        this.editPatientForm.operationList.push({
          operationName: [], //手术名称
          operationLevel: '', //手术级别
          operationTime: '', //手术时间
          anesthesiaMode: '', // 麻醉方式
        })
      },
      //删除手术信息
      removeOperation(index) {
        if (this.editPatientForm.operationList.length != 1) {
          let obj = {};
          if(this.editPatientForm.operationList[index].id){
            obj.id = this.editPatientForm.operationList[index].id;
            obj.isEnabled = 0;
            this.tempDelarr.push(obj);
          }
          this.editPatientForm.operationList.splice(index, 1);
        }
      },
      //查询诊断下拉选项
      diagnoseMethod(query){
            if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            this.getdiagnoseListFun(query)
            this.loading = false;
          }, 1000);
        } else {
          this.diagnoseNameOption = [];
        }
      },
      getdiagnoseListFun(query){
         if (!query) {
          return false
        };
        let that = this;
        let obj = {};
        obj.icdType = 2;
        obj.diagnosisTest=query;
        let url ="/base/diagnosis/queryDiagnosisDictList";
        that.$axios.post(global.url+url,obj).then(function(res){
            that.diagnoseNameOption = res.data.respData.list;
        })
      }
    }
  }
</script>

<style lang="scss">
  .patientsListWrapper {
    padding-top: 24px;
    box-sizing: border-box;
    .operationName {
      .el-select__tags {
        padding-top: 5px;
      }
      .el-select__tags > span {
        width: 100%;
      }
      .el-tag.el-tag--info {
        width: auto;
        height: auto;
      }
      .el-select__tags-text {
        width: 100%;
        white-space: normal;
      }
    }
    .nurseClass {
      padding: 10px 0;
    }
    width: 100%;
    height: 100%;
    background: #F5F5F5;
    .header {
      height: 40px;
      display: flex;
      align-items: center;
      padding-left: 24px;
      box-sizing: border-box;
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
      padding: 0 24px 24px 24px;
      box-sizing: border-box;
      display: flex;
      box-sizing: border-box;
      .side {
        width: 180px;
        min-height: 100%;
        overflow-y: auto;
        background: #FFFFFF;
        .active_item {
          background: #E7F1FC;
        }
        .patientItem {
          width: 100%;
          height: 88px;
          border-bottom: 1px solid #E6E6E6;
          display: flex;
          flex-direction: column;
          padding: 20px 12px 16px 16px;
          box-sizing: border-box;
          cursor: pointer;
          position: relative;
          .bedNo {
            position: absolute;
            right: 16px;
            top: 20px;
            color: #7F7F7F;
          }
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
            max-width: 110px
          }
          .msg {
            flex: 1;
            display: flex;
            align-items: center;
            .left {
              flex: 1;
              display: flex;
              justify-content: flex-start;
              color: rgba(0, 0, 0, 0.87);
              font-size: 14px;
            }
            .right {
              flex: 1;
              display: flex;
              justify-content: flex-end;
              .age {
                min-width: 30px;
              }
              span {
                margin-left: 12px;
                color: #7F7F7F;
                font-size: 12px;
              }
            }
          }
        }
      }
      .content {
        width: calc(100% - 192px);
        margin-left: 12px;
        height: 100%;

        .baseMsg {
          min-height: 200px;
          background: #FFFFFF;
          display: flex;
          flex-direction: column;
          padding-left: 32px;
          position: relative;
          .death {
            position: absolute;
            right: -22px;
            bottom: -22px;
            width: 104px;
            height: 104px;
          }
          .row_top {
            flex: 1.5;
            display: flex;
            align-items: center;
            position: relative;
            min-height: 60px;
            .name {
              font-size: 20px;
              color: rgba(0, 0, 0, 0.87);
              font-weight: bold;
            }
            .sex {
              color: rgba(0, 0, 0, 0.6);
              font-size: 14px;
              margin-left: 12px;
            }
            .age {
              color: rgba(0, 0, 0, 0.6);
              font-size: 14px;
              margin-left: 12px;
              min-width: 31px;
            }
            .bloodType {
              background: #FDEBEB;
              border-radius: 4px;
              color: #F23C3C;
              font-size: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 4px 7px;
              margin-left: 10px;
            }
            .vitalSign {
              margin-right: 6px;
              padding: 4px;
              box-sizing: border-box;
              min-width: 20px;
              height: 20px;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 12px;
              border-radius: 4px;
              margin-left: 12px;
              img {
                width: 20px;
                height: 20px;
              }
            }
            .handleBtn {
              position: absolute;
              right: 16px;
              top: 16px;;
              .clustering {
                color: #1374E4;
                font-size: 14px;
              }
            }
          }
          .row {
            flex: 1;
            display: flex;
            align-items: center;
            min-height: 32px;
            .col {
              flex: 1;
              display: flex;
              justify-content: flex-start;
              .title {
                color: rgba(0, 0, 0, 0.6);
              }
              .content {
                color: rgba(0, 0, 0, 0.87);
              }
            }
          }
          .showMore {
            display: flex;
            justify-content: center;
            color: #3881FF;
            .moreWrapper {
              color: #3881FF;
              .img {
                width: 10px;
                height: 10px;
                margin-left: 5px;
                display: inline-block;
              }
            }
          }
        }
        .detailMsg {
          box-sizing: border-box;
          margin-top: 12px;
          min-height: calc(100% - 212px);
          background: #FFFFFF;
        }
      }
    }
    .editPatientDialog, .rescueMsgDialog, .wristDialog {
      .el-dialog__body {
        display: flex;
        justify-content: center;
      }
      .operationItemWrapper {
        position: relative;
        .removeIcon {
          position: absolute;
          left: -15px;
          top: calc(50% - 20px);
          i {
            color: #676767
          }
        }
        .groupLine {
          position: absolute;
          height: calc(100% - 20px);
          left: 10px;
          /*    top: 12px;*/
          width: 4px;
          border-left: 1px solid #D9D9D9;
          border-top: 1px solid #D9D9D9;
          border-bottom: 1px solid #D9D9D9;
        }
      }

      .titleTxt {
        width: 100%;
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 30px;
        color: rgba(0, 0, 0, 0.87);
        padding-left: 30px;
      }
      #wristPrint{
        width: 100%;
      }
    }
    /*腕带样式*/
    /*  .wristDialog {
        .wrist {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          border: 1px solid #ccc;
          .content {
            flex: 9;
            flex-direction: column;
            .top {
              padding: 20px;
              display: flex;
            }
            .bot {
              padding: 20px;
              display: flex;
            }
          }
          .codeImg {
            flex: 2;
            position: relative;
            padding-right: 20px;
            display: flex;
            #codeImg {
              width: 100%;
              height: 100%;
              display: flex;
              justify-content: flex-end;
              margin-right: 10px;
            }
            .inhosNum{
              writing-mode: vertical-rl; !*文字从右向左*!
              writing-mode: tb-rl;
              transform:rotate(180deg);
              display: flex;
              justify-content: center;
            }
          }
          .patientBaseMsg{
            min-width: 33.33%;
            white-space: nowrap;
            padding-right: 10px;
            box-sizing: border-box;
          }
          .contentItem {
            flex: 1;
            padding-right: 10px;
            box-sizing: border-box;
          }
        }
      }*/

    .patientTabsWrapper {
      .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
        padding-left: 32px;
      }
      .el-tabs__header {
        margin: 0;
      }
      .el-tabs__content {
        padding: 16px 32px;
      }
    }
  }
</style>

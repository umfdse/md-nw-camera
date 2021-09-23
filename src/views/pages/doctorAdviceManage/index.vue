<template>
  <div class="doctorAdviceManageWrapper">
    <!-- <div class="header">
      <div class="location">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item class="location-other" :to="{ path: '' }">医嘱管理</el-breadcrumb-item>
          <el-breadcrumb-item class="location-other" :to="{ path: '' }">{{active_name}}</el-breadcrumb-item>
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
          <div class="patientTabsWrap">
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="原始医嘱" name="first">
                <longTerm v-if="longTermShow" :ref="'tab'+'_1'" :recordId="recordId"></longTerm>
              </el-tab-pane>
              <!-- <el-tab-pane label="临时医嘱" name="second">
                <temporary v-if="temporaryShow" :ref="'tab'+'_2'" :recordId="recordId"></temporary>
              </el-tab-pane> -->
              <!-- <el-tab-pane label="原始遗嘱" name="third">
                <notSplit v-if="notSplitShow" :ref="'tab'+'_3'" :recordId="recordId"></notSplit>
              </el-tab-pane> -->
              <el-tab-pane label="执行医嘱" name="fouth">
                <splited v-if="splitedShow" :ref="'tab'+'_4'" :patientInfo="currentPatient"
                         :recordId="recordId"></splited>
              </el-tab-pane>

            </el-tabs>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  // import patientTabs from "./patientTabs";
  import longTerm from "./long_term/index"
  // import Temporary from "./temporary/index"
  // import NotSplit from "./notSplit_term/index"
  import Splited from "./splited_term/index"

  export default {
    // components: {patientTabs: patientTabs},
    components: {
      longTerm,
      // Temporary,
      // NotSplit,
      Splited
    },
    data() {
      return {
        activeName: "first",
        active_name: "原始医嘱",
        longTermShow: true,
        temporaryShow: false,
        // notSplitShow:false,
        splitedShow: false,
        currentTab: {},
        patientId: '',
        recordId: '',
        currentIndex: 0,
        currentPatient: {
          record: {
            isNewEntrants: "",
            operationList: []
          }
        },
        bedsList: [],
        patientsList: [],
        showMore: false,
      }
    },

    mounted() {
      this.getPatientList()
      // this.getBedList()
    },
    methods: {
      init() {
        this.$nextTick(function () {
          this.$refs['tab_1'].loadData();
        })
      },
      handleClick(tab, event) {
        console.log(tab, event)
        this.currentTab = tab
        console.log(this.currentTab)
        if (this.activeName == "first") {
          this.longTermShow = true
          this.active_name = "原始医嘱"
        } else {
          this.longTermShow = false
        }
        if (this.activeName == "second") {
          this.temporaryShow = true
          this.active_name = "临时医嘱"

        } else {
          this.temporaryShow = false
        }
        // if(this.activeName=="third"){
        //   this.notSplitShow=true
        // }else{
        //    this.notSplitShow=false
        // }
        if (this.activeName == "fouth") {
          this.splitedShow = true
          this.active_name = "已拆分医嘱"
        } else {
          this.splitedShow = false
        }
      },
      changePatient(item, index) {
        this.showMore = false
        this.currentPatient = item
        this.currentIndex = index
        this.recordId = item.record.recordId
        console.log(this.recordId)
        if (this.longTermShow) {
          this.$nextTick(function () {
            this.$refs['tab_1'].loadData();
          })
        } else if (this.temporaryShow) {
          this.$nextTick(function () {
            this.$refs['tab_2'].loadData();
          })
        } else if (this.notSplitShow) {
          this.$nextTick(function () {
            this.$refs['tab_3'].loadData();
          })
        } else if (this.splitedShow) {
          this.$nextTick(function () {
            this.$refs['tab_4'].loadData();
          })
        }
      },
      getPatientList() {
        let that = this
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
            that.patientsList = resData
            that.recordId = that.patientsList[0].record.recordId
            that.getIndex(that.patientsList)
          } else {
            that.$message({
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
              if (item.id == this.patientId) {
                _this.currentIndex = index
                _this.currentPatient = item
              }
            })
          } else {
            _this.currentIndex = 0
            _this.currentPatient = list[0]
          }
        }
        this.currentPatient = this.patientsList[this.currentIndex]
        this.patientId = this.patientsList[this.currentIndex].id
      },
      getBedList() {
        let param = {
          hospitalCode: '',
          type: "1"
        }
        this.$axios({
          url: global.url + '/api/icu/outindept/queryBedPatientRecords',
          method: 'post',
          data: param
        }).then((response) => {
          var data = response.data;
          if (data.msg == 201) {
            let resData = data.respData && data.respData.list ? data.respData.list : []
            this.bedsList = resData
          } else {
            this.$message({
              message: data.content,
              type: 'warning'
            });
          }
        });
      },
      dealOverflowText(content) {
        if (content && content.length > 8) {
          content = content.slice(0, 8) + ' ···'
        }
        return content
      }
    }
  }
</script>

<style lang="scss">
  .doctorAdviceManageWrapper {
    width: 100%;
    height: 100%;
    padding-top: 24px;
    background: #F5F5F5;
    box-sizing: border-box;
    .header {
      height: 40px;
      width: 100%;
      display: flex;
      align-items: center;
      padding-left: 24px;
      box-sizing: border-box;
      .location {
        font-size: 12px;
        .location-other {
          color: rgba(0, 0, 0, 0.38);
        }
        .location-current {
          color: rgba(0, 0, 0, 0.87);
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
          .patientTabsWrap {

            .el-tabs__nav {
              margin-left: 32px;
            }
          }
        }
      }
    }
  }
</style>

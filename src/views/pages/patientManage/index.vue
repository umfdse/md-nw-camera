<template>
  <div class="patientsBedWrapper">
      <div class="header">
        <el-menu :default-active="activeIndex" class="patientsBedMenu" mode="horizontal" @select="handleSelect">
          <el-menu-item index="1">所有床位
            <span class="countItem"> {{countObj[1]}}</span>
          </el-menu-item>
          <el-menu-item index="2">空床位
            <span class="countItem"> {{countObj[2]}}</span>
          </el-menu-item>
          <el-menu-item index="3">我的床位
            <span class="countItem"> {{countObj[3]}}</span>
          </el-menu-item>
          <el-menu-item index="4">今日出科
            <span class="countItem"> {{countObj[4]}}</span>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="main">
        <div class="bedsContainer">
          <template v-for="(bedsItem,index) in bedsList">
            <div class="bedsItem" :key="index" @click="goPatientList(bedsItem)">
              <!--有病患床位-->
              <div class="hasPatient" v-if="bedsItem.patientInfo">
                <div class="patientItem baseMsg">
                  <el-tooltip>
                    <span class="name" slot="content" v-html="bedsItem.patientInfo.name"></span>
                    <span class="name clamp_1" v-html="dealOverflowText(bedsItem.patientInfo.name)"></span>
                  </el-tooltip>
                  <span class="sex">
                      <span v-if="bedsItem.patientInfo.sex==1">男</span>
                      <span v-else-if="bedsItem.patientInfo.sex==2">女</span>
                      <span v-else>未知</span>
                </span>
                  <span class="age" v-if="bedsItem.patientInfo.age">{{bedsItem.patientInfo.age}}岁</span>
                  <el-tooltip>
                    <span class="archive" slot="content" v-html="bedsItem.record.inhosNum"></span>
                    <span class="archive" v-html="dealOverflowText(bedsItem.record.inhosNum)"></span>
                  </el-tooltip>
                  <div class="bedNo">
                    <span class="num">{{bedsItem.bedNo}}</span>
                    <span class="txt">床</span>
                  </div>
                </div>
                <div class="patientItem baseSigns">
                  <!--血型-->
                  <span class="bloodType" v-if="bedsItem.patientInfo.bloodType">
                  {{bedsItem.patientInfo.bloodType}}型
                </span>
                  <!--护理级别-->
                  <span class="nurseGrade" v-if="bedsItem.record.nursegrade" :style="{'marginLeft':bedsItem.patientInfo.bloodType? '12px':'0'}">
                  <span v-if="bedsItem.record.nursegrade ==1">特级护理</span>
                  <span v-else-if="bedsItem.record.nursegrade ==2">I级护理</span>
                  <span v-else-if="bedsItem.record.nursegrade ==3">II级护理</span>
                  <span v-else-if="bedsItem.record.nursegrade ==4">III级护理</span>
                  <span v-else style="display: none"></span>
                </span>
                  <!--饮食级别-->
                  <div class="nurseGrade" v-if="bedsItem.record.dietLevel">
                    <span v-if="bedsItem.record.dietLevel ==1">普食</span>
                    <span v-else-if="bedsItem.record.dietLevel ==2">半流质</span>
                    <span v-else-if="bedsItem.record.dietLevel ==3">流质</span>
                    <span v-else-if="bedsItem.record.dietLevel ==4">软食</span>
                    <span v-else style="display: none"></span>
                  </div>
                </div>
                <el-divider></el-divider>
                <div class="patientItem flex_row">
                  <span class="title">诊断:</span>
                  <span class="content clamp_2">
                  <span v-if="bedsItem.record.inhosDiagnosis">{{bedsItem.record.inhosDiagnosis}}</span>
                  <span v-else>未诊断</span>
                </span>
                </div>
                <div class="patientItem flex_row">
                  <span class="title">手术:</span>
                  <span class="content clamp_1">
                  <span v-if="bedsItem.record.operationList.length>0">{{bedsItem.record.operationList[0].operationName}}</span>
                  <span v-else></span>
              </span>
                </div>
                <div class="patientItem baseSigns">
                  <!--护理评分图标-->
                  <span class="vitalSign" v-if="bedsItem.record.isNewEntrants">
                  <img src="/static/img/icon_score_new.png" alt="">
                </span>
                  <span class="vitalSign" v-if="bedsItem.patientInfo.isAllergy">
                   <img src="/static/img/icon_score_allergy.png" alt="">
                </span>
                  <span class="vitalSign" v-if="bedsItem.record.isInspectionCritical">
                   <img src="/static/img/icon_score_danger.png" alt="">
                </span>
                  <span class="vitalSign" v-if="bedsItem.record.isUseBloodProducts">
                   <img src="/static/img/icon_score_blood.png" alt="">
                </span>
                  <span class="vitalSign" v-if="bedsItem.record.isUseVentilator">
                   <img src="/static/img/icon_score_breath.png" alt="">
                </span>
                  <span class="vitalSign" v-if="bedsItem.record.isCatheterScoreHigh">
                   <img src="/static/img/icon_score_catheter.png" alt="">
                </span>
                  <span class="vitalSign" v-if="bedsItem.record.isPressureScoreHigh">
                   <img src="/static/img/icon_score_pressure.png" alt="">
                </span>
                  <span class="vitalSign" v-if="bedsItem.record.isFallScoreHigh">
                   <img src="/static/img/icon_score_fall.png" alt="">
                </span>
                  <span class="vitalSign" v-if="bedsItem.record.isUseMonitor">
                   <img src="/static/img/icon_score_watch.png" alt="">
                </span>
                </div>
                <div class="patientItem baseTime">
                  <div class="left">
                    <span>入院日期:</span>
                    <span>{{bedsItem.record.inhosDate}}</span>
                  </div>
                  <div class="right">
                    <span>医生:</span>
                    <span>{{bedsItem.record.primaryDoctorName}}</span>
                  </div>
                </div>
                <img v-if="bedsItem.record.isDeath" class="death" src="/static/img/icon_death.png" alt="">
              </div>
              <!--空床位-->
              <div class="noPatient" v-else>
                <div class="bedNo">
                  <span class="num">{{bedsItem.bedNo}}</span>
                  <span class="txt">床</span>
                </div>
                <div class="addPatient">
                  <img src="/static/img/icon_addPatient.png" alt="">
                  <p>新增患者</p>
                </div>
              </div>
            </div>
          </template>
          <div v-if="bedsList.length==0" class="noData"></div>
        </div>
      </div>
      <!--新增病患弹框-->
      <el-dialog title="新增患者" :visible.sync="dialog_addPatient" width="480px" class="addPatientDialog">
        <el-form :model="addPatientForm" label-width="100px" :rules="rules" label-position="right" ref="addPatientForm">
          <el-form-item label="患者信息:" prop="patientMsg">
            <el-select v-model="addPatientForm.patientMsg" placeholder="请选择病患" clearable filterable>
              <el-option
                v-for="(item,index) in patientsOption"
                @filter-method="filterPatient"
                :key="index"
                :label="item.name+'  '+item.archivesid"
                :value="item.record.recordId">
                <span>{{item.name}}</span>
                <span style="margin-left: 15px">{{item.archivesid}}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialog_addPatient = false">取 消</el-button>
          <el-button type="primary" @click="save('addPatientForm')">确 定</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        roomNum: '',
        dialog_addPatient: false,
        activeIndex: '1',
        state: '1',
        addPatientForm: {
          patientMsg: ''
        },
        rules: {
          patientMsg: [
            {required: true, message: '请选择病患', trigger: 'blur'},
          ]
        },
        bedsList: [
        ],
        patientsOption: [],
        patientList: [],
        currentBed: '',
        countObj: {
          1: '',
          2: '',
          3: '',
          4: ''
        }
      }
    },
    mounted() {
      this.initData()
    },
    methods: {
      initData(){
        this.getBedList()
        this.getBedCount()
      },
      handleSelect(tab, event) {
        switch (tab) {
          case '1':
            this.state = 1
            break;
          case '2':
            this.state = 2
            break;
          case '3':
            this.state = 3
            break;
          case '4':
            this.state = 4
            break;
        }
        this.getBedList()
      },
      goPatientList(item) {
        if(!item.patientInfo){
          this.addPatient(item)
          return
        }
        let patientId = item.patientInfo && item.patientInfo.patientId ?　item.patientInfo.patientId:''
        this.$router.push({
          path: '/patient/list',
          query: {
            patientId: patientId
          }
        })
      },
      getBedCount() {
        let param = {
          hospitalCode: '',
          type: this.state
        }
        this.$axios({
          url: global.url + '/api/icu/outindept/queryCount',
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          data: param
        }).then((response) => {
          var data = response.data;
          if (data.msg == 201) {
            this.countObj = data.respData
          } else {
            this.$message({
              message: data.content,
              type: 'warning'
            });
          }
        });
      },
      getBedList() {
        let param = {
          hospitalCode: '',
          type: this.state
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
      //获取未绑定床位病患列表
      getPatientList() {
        let param = {}
        this.$axios({
          url: global.url + '/base/patient/queryNoBedPatientRecords',
          method: 'get',
          headers: {
            'Content-Type': 'application/json'
          },
          params: param
        }).then(res => {
          if (res.data.msg == 201) {
            let resData = res.data.respData ? res.data.respData : []
            this.patientsOption = resData
          } else {
            this.$message({
              message: data.content,
              type: 'warning'
            });
          }
        })
      },
      addPatient(item) {
        this.dialog_addPatient = true
        this.getPatientList()
        this.$nextTick(()=>{
          this.addPatientForm.patientMsg = ''
        })
        this.currentBed = item
      },
      save(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let patientName = ''
            let _this = this
            this.patientsOption.forEach(item=>{
              if(_this.addPatientForm.patientMsg==item.record.recordId){
                patientName = item.name
              }
            })
            console.log(this.currentBed, 8889999)
            let param = {
              id: this.currentBed.id,
              recordId: this.addPatientForm.patientMsg,
              patientName:patientName
            }
            const formData = new FormData()
            Object.keys(param).forEach((key) => {
              formData.append(key, param[key]);
            })
            this.$axios({
              url: global.url + '/api/icu/outindept/bedAddPatientRecord',
              method: 'post',
              headers: {
                'Content-Type': 'application/json'
              },
              data: formData
            }).then(res => {
              if (res.data.msg == 201) {
                this.$message.success(res.data.content)
                this.dialog_addPatient = false
                this.initData()
              } else {
                this.$message.error(res.data.content)
              }
            })
          }
        })
      },
      //搜索方法
      filterPatient(query) {
        if (query !== '') {
          setTimeout(() => {
            this.patientsOption = this.patientList.filter(item => {
              return item.name.toLowerCase().indexOf(query.toLowerCase()) || item.archivesid.toLowerCase().indexOf(query.toLowerCase()) > -1;
            });
          }, 200);
        } else {
          this.patientsOption = [];
        }
      },
      dealOverflowText(content){
        if(content && content.length>8){
          content = content.slice(0,8) + ' ···'
        }
        return content
      },
    }
  }
</script>

<style lang="scss">
  .patientsBedWrapper {
    width: 100%;
    height: 100%;
    background: #F5F5F5;
    padding: 24px;
    box-sizing: border-box;
    .flex_row {
      display: flex;
    }
    .header {
      height: 48px;
      display: flex;
      align-items: center;
      width: 100%;
      box-sizing: border-box;
      .patientsBedMenu {
        .el-menu-item {
          font-size: 16px;
          color: rgba(0, 0, 0, 0.6);
        }
        .el-menu-item.is-active {
          color: #1374E4;
          font-weight: bold;
        }
      }
      .countItem {
      }
      ul {
        height: 48px;
        line-height: 48px;;
        width: 100%;
        display: flex;
        align-items: center;
        li {
          height: 48px;
          line-height: 48px;;
        }
      }
    }
    .main {
      min-height: calc(100% - 48px);
      background: #FFFFFF;
      padding: 16px 32px;
      box-sizing: border-box;
      .bedsContainer {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
    /*    justify-content: center;*/
        padding-left: 10px;
        .bedsItem:hover {
          transform: translateY(-6px);
          /*top: -6px;*/
          box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.15);
        }
        .bedsItem {
          cursor: pointer;
          display: inline-block;
          width: 316px;
          height: 219px;
          background: #FFFFFF;
          box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.08);
          border-radius: 4px;
          margin-bottom: 20px;
          margin-right: 20px;
          position: relative;
          .bedNo {
            position: absolute;
            top: 0;
            right: 12px;
            width: 60px;
            height: 36px;
            background: #1374E4;
            box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.08);
            border-radius: 0px 0px 4px 4px;
            color: #FFFFFF;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 9px 10px;
            box-sizing: border-box;
            .num {
              font-size: 26px;
              font-weight: 600;
              flex: 1;
            }
            .txt {
              padding-top: 10px;
              font-size: 14px;
              flex: 1;
            }
          }
          .hasPatient {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            position: relative;
            .death{
              position: absolute;
              right: -15px;
              bottom: -15px;
              width: 74px;
              height: 74px;
            }
            .patientItem {
              width: 100%;
              box-sizing: border-box;
              padding: 0 12px 12px 12px;
              .title {
                font-size: 12px;
                color: rgba(0, 0, 0, 0.87);
                font-weight: 600;
                min-width: 36px;
                line-height: 18px;
              }
              .content {
                line-height: 18px;
                span{
                  width: calc(100% - 36px);
                  text-shadow: 0px 1px 8px rgba(0, 0, 0, 0.08);
                  font-size: 12px;
                  font-weight: 400;
                  color: rgba(0, 0, 0, 0.6);
                }
              }
              .clamp_2 {
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
              }
              .clamp_1 {
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
              }
            }
            .baseMsg {
              display: flex;
              justify-content: flex-start;
              padding-top: 16px;
              padding-bottom: 18px;
              align-items: center;
              height: 42px;
              box-sizing: border-box;
              position: relative;
              .name {
                font-size: 20px;
                color: rgba(0, 0, 0, 0.87);
                font-weight: bold;
                max-width:80px;
                height: 42px;
                line-height: 42px;
              }
              .sex {
                color: rgba(0, 0, 0, 0.6);
                font-size: 12px;
                margin-left: 12px;
              }
              .age {
                color: rgba(0, 0, 0, 0.6);
                font-size: 12px;
                margin-left: 12px;
                min-width: 31px;
              }
              .archive {
                color: rgba(0, 0, 0, 0.6);
                font-size: 12px;
                /*margin-left: 12px;*/
              }
            }
            .baseSigns {
              display: flex;
              height: 32px;
              .bloodType {
                background: #FDEBEB;
                box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.08);
                border-radius: 4px;
                color: #F23C3C;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 4px 7px;
              }
              .nurseGrade {
                background: #E7F1FC;
                box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.08);
                border-radius: 4px;
                color: #1777E6;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 4px 7px;
                margin-left: 12px;
              }
              .vitalSign {
                margin-right: 6px;
                img{
                  width: 20px;
                  height: 20px;
                }
              }
            }
            .baseTime {
              display: flex;
              color: #9E9E9E;
              position: relative;
              .left {
                position: absolute;
                left: 12px;
                span {
                  font-size: 12px;
                }
              }
              .right {
                position: absolute;
                right: 12px;
                span {
                  font-size: 12px;
                }
              }
            }
            .el-divider--horizontal {
              margin: 0px 0px 12px 0px;
            }
          }
          .noPatient {
            width: 100%;
            height: 100%;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            .addPatient {
              display: flex;
              flex-direction: column;
              align-items: center;
              img {
                height: 44px;
                width: 44px;
              }
              p {
                font-size: 16px;
                color: #1777E6;
              }
            }
          }
        }
      }
    }
    .addPatientDialog {
      .el-dialog__body {
        display: flex;
        justify-content: center;
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
</style>

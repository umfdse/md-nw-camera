<template>
  <div class="archivesWrapper">
    <div class="header">
      <div class="header-left">
        <el-date-picker
          format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-dd HH:mm"
          v-model="searchForm.dateRange"
          @change="search"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
        <el-input
          style="margin: 0px 16px"
          class="search"
          v-model="searchForm.name"
          placeholder="请输入名字或者病历号搜索"
        >
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"
            @click="search"
          ></i>
        </el-input>
        <el-button type="primary" size="small" @click="search">查询</el-button>
        <el-button type="button" size="small" @click="resetFun">重置</el-button>
      </div>
      <div class="header-right">
        <el-button type="button" size="small" @click="resetFun"
          >刷新数据</el-button
        >
        <el-button type="button" size="small" @click="givenFun"
          >出科撤回</el-button
        >
      </div>
    </div>
    <div class="main clearFix">
      <div class="bedsContainer clearFix">
        <template v-for="(bedsItem, index) in bedsList">
          <div class="bedsItem" :key="index" @click="goPatientList(bedsItem)">
            <div class="hasPatient">
              <div class="patientItem baseMsg">
                <span class="name clamp_1">{{ bedsItem.name }}</span>
                <span class="sex">
                  <span v-if="bedsItem.sex == 1">男</span>
                  <span v-else-if="bedsItem.sex == 2">女</span>
                  <span v-else></span>
                </span>
                <span class="age" v-if="bedsItem.age"
                  >{{ bedsItem.age }}岁</span
                >
                <el-tooltip>
                  <span
                    class="archive"
                    slot="content"
                    v-html="bedsItem.record.inhosNum"
                  ></span>
                  <span
                    class="archive"
                    v-html="dealOverflowText(bedsItem.record.inhosNum)"
                  ></span>
                </el-tooltip>
                <div class="bedNo">
                  <span class="num">{{ bedsItem.record.bedNo }}</span>
                  <span class="txt">床</span>
                </div>
              </div>
              <div class="patientItem baseSigns">
                <div class="outDept" v-if="bedsItem.record.circulationVo &&  bedsItem.record.circulationVo.outDeptNature && bedsItem.record.circulationVo.outDeptNature==1">
                  <span>已出科</span>
                </div>
                <div class="outHospital" v-if="bedsItem.record.circulationVo &&  bedsItem.record.circulationVo.outDeptNature && bedsItem.record.circulationVo.outDeptNature!=1">
                  <span>已出院</span>
                </div>


                <!--                &lt;!&ndash;血型&ndash;&gt;
                <span class="bloodType" v-if="bedsItem.bloodType">
                  {{bedsItem.bloodType}}
                </span>
                &lt;!&ndash;护理级别&ndash;&gt;
                <span class="nurseGrade" v-if="bedsItem.record.nursegrade" :style="{'marginLeft':bedsItem.bloodType? '12px':'0'}">
                  <span v-if="bedsItem.record.nursegrade ==1">特级护理</span>
                  <span v-else-if="bedsItem.record.nursegrade ==2">I级护理</span>
                  <span v-else-if="bedsItem.record.nursegrade ==3">II级护理</span>
                  <span v-else-if="bedsItem.record.nursegrade ==4">III级护理</span>
                  <span v-else style="display: none"></span>
                </span>
                &lt;!&ndash;饮食级别&ndash;&gt;
                <div class="nurseGrade" v-if="bedsItem.record.dietLevel">
                  <span v-if="bedsItem.record.dietLevel ==1">普食</span>
                  <span v-else-if="bedsItem.record.dietLevel ==2">半流质</span>
                  <span v-else-if="bedsItem.record.dietLevel ==3">流质</span>
                  <span v-else-if="bedsItem.record.dietLevel ==4">软食</span>
                  <span v-else style="display: none"></span>
                </div>-->
              </div>
              <el-divider></el-divider>
              <div class="patientItem flex_row">
                <span class="title">诊断:</span>
                <span class="content clamp_2">
                  <span v-if="bedsItem.record.inhosDiagnosis">{{
                    bedsItem.record.inhosDiagnosis
                  }}</span>
                  <span v-else>暂无诊断</span>
                </span>
              </div>
              <div class="patientItem flex_row">
                <span class="title">手术:</span>
                <span class="content clamp_1">
                  <span v-if="bedsItem.record.operationList.length > 0">{{
                    bedsItem.record.operationList[0].operationName
                  }}</span>
                  <span v-else></span>
                </span>
              </div>
              <!-- <div class="patientItem baseSigns">
                &lt;!&ndash;护理评分图标&ndash;&gt;
                <span class="vitalSign" v-if="bedsItem.record.isNewEntrants">
                  <img src="/static/img/icon_score_new.png" alt="">
                </span>
                <span class="vitalSign" v-if="bedsItem.record.isAllergy">
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
                   <img src="/static/img/icon_socre_catheter.png" alt="">
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
              </div>-->
              <div class="patientItem baseTime">
                <div class="left">
                  <span>出院日期:</span>
                  <span>{{ bedsItem.record.outhosTime }}</span>
                </div>
              </div>
              <div class="patientItem baseTime">
                <div class="left">
                  <span>入院日期:</span>
                  <span>{{ bedsItem.record.inhosDate }}</span>
                </div>
                <div class="right">
                  <span>医生:</span>
                  <span>{{ bedsItem.record.primaryDoctorName }}</span>
                </div>
              </div>
              <img
                v-if="bedsItem.record.isDeath"
                class="death"
                src="/static/img/icon_death.png"
                alt=""
              />
            </div>
          </div>
        </template>
        <div v-if="bedsList == 0" class="noData"></div>
      </div>
      <div class="archivesPagination" v-if="pagination">
        <el-pagination
          :current-page="pageNum"
          :page-size="pageSize"
          :page-sizes="pageSizes"
          :total="total"
          :disabled="paginationDisabled"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :layout="pageLayout"
          :class="align"
        >
        </el-pagination>
      </div>
    </div>
    <el-dialog
      title="出科撤回"
      :visible.sync="givenFlag"
      width="30%"
      class="tab_dialog"
      :close-on-click-modal="false"
    >
      <div class="addData">
        <el-form
          ref="givenForm"
          :model="givenForm"
          label-width="160px"
          :rules="rules"
        >
          <el-row>
            <el-col :span="20">
              <el-form-item label="患者信息：" prop="index">
                <el-select v-model="givenForm.index" placeholder="请选择姓名、住院号" @change="getNum">
                  <el-option v-for="(item,index) in givenList" :key="index" :label="item.name+'  '+item.record.inhosNum" :value="index"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
         <el-row>
            <el-col :span="20">
              <el-form-item label="床位：" prop="benId">
                <el-select v-model="givenForm.benId" placeholder="请选择床位">
                  <el-option v-for="(item,index) in givenListBed" :key="index" :label="item.bedNo+'床'" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="addbtn">
          <el-button size="medium" @click="givenCancel()">取消</el-button>
          <el-button size="medium" @click="givenSubmit('givenForm')" type="primary">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tempGivenData:{},
      givenList:[],
      givenListBed:[],
      rules: {
        index: [{  required: true,  trigger: "change", message: "患者信息不能为空",}],
        benId: [{  required: true,  trigger: "change", message: "床位不能为空",}],
      },
      givenFlag: false,
      roomNum: "",
      givenForm: {
        index: "",
        benId:""
      },
      searchForm: {
        name: "",
        dateRange: [],
        outhosTimeEnd: "",
        outhosTimeStart: "",
      },
      bedsList: [],
      patientsOption: [],
      patientList: [],
      currentBed: "",
      /* 分页信息*/
      pageNum: 1,
      pageSize: 10,
      pageSizes: [10, 20, 50],
      pageLayout: "total, sizes, prev, pager, next, jumper",
      total: 0,
      sortName: "",
      sortValue: "",
      pagination: true,
      paginationDisabled: false,
      multipleSelection: [],
      paginationAlign: "right",
    };
  },
  mounted() {
    this.search();
  },
  computed: {
    align() {
      let res;
      switch (this.paginationAlign) {
        case "right":
          res = "textR";
          break;
        case "center":
          res = "textC";
          break;
        default:
          res = "";
      }
      return res;
    },
  },
  methods: {
    getNum(){
      this.tempGivenData = this.givenList[this.givenForm.index].record;
      if(this.tempGivenData.bedState==0){
        this.givenForm.benId = this.tempGivenData.bedId;
      }else{
        this.givenForm.benId = "";
      }
    },
    givenSubmit(formName) {
      let that = this;
         that.$refs[formName].validate((valid) => {
          if (valid) {
            that.givenFlag = false;
            let url = "/api/icu/outindept/recall";
            that.tempGivenData.bedId = this.givenForm.benId;
            that.$axios.post(global.url+url,that.tempGivenData).then(function(res){
              that.givenForm.benId="";
              that.givenForm.index="";
               if(res.data.msg==201){
                  that.$message({
                  message: res.data.content,
                  type: 'success'
                });
                that.search();
               }else{
                 that.$message({
                  message: res.data.content,
                  type: 'info'
                });
               }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    givenBedFun(){
      let that = this;
      let url = "/api/icu/outindept/queryBedPatientRecords";
      let obj = {};
      obj.type = 2;
      that.$axios.post(global.url+url,obj).then(function(res){
         that.givenListBed = res.data.respData.list;
      })
    },
    givenFun() {
      let that = this;
      that.givenFlag = true;
      let url = "/base/patient/queryHistoryRecords"
      let obj = {};
      obj.isRecall = 1;
      that.$axios.post(global.url+url,obj).then(function(res){
         that.givenList = res.data.respData.list;
      })
      that.givenBedFun();
    },
    givenCancel() {
      this.givenFlag = false;
    },
    goPatientList(item) {
      let patientId = item && item.patientId ? item.patientId : "";
      this.$router.push({
        path: "/patient/list",
        query: {
          patientId: patientId,
          patientType: "archives",
          patientObj: JSON.stringify(item),
        },
      });
    },
    getTableData() {
      let param = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        condition: this.searchForm.name,
        outhosTimeStart:
          this.searchForm.dateRange && this.searchForm.dateRange.length > 0
            ? this.searchForm.dateRange[0]
            : "",
        outhosTimeEnd:
          this.searchForm.dateRange && this.searchForm.dateRange.length > 0
            ? this.searchForm.dateRange[1]
            : "",
      };
      this.$axios({
        url: global.url + "/base/patient/queryHistoryRecords",
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        data: param,
      }).then((response) => {
        var data = response.data;
        if (data.msg == 201) {
          let resData =
            data.respData && data.respData.list ? data.respData.list : [];
          this.bedsList = resData;
          this.pageNum = data.respData.pageNum > 0 ? data.respData.pageNum : 1;
          this.pageSize = data.respData.pageSize;
          this.total = data.respData.total;
        } else {
          this.$message({
            message: data.content,
            type: "warning",
          });
        }
      });
    },
    resetFun() {
      this.pageSize = 10;
      this.searchForm.name = "";
      this.searchForm.dateRange = [];
      this.getTableData();
    },
    /* 分页信息*/
    search(val) {
      this.pageNum = 1;
      this.getTableData();
    },
    handleSizeChange(val) {
      this.pageNum = 1;
      this.pageSize = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getTableData();
    },
    dealOverflowText(content) {
      if (content && content.length > 8) {
        content = content.slice(0, 8) + " ···";
      }
      return content;
    },
  },
};
</script>

<style lang="scss">
.archivesWrapper {
  width: 100%;
  background: #f5f5f5;
  box-sizing: border-box;
  .addData .addbtn {
  margin-top: 20px;
  padding: 10px 20px 10px 20px;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}
.tab_dialog .el-dialog__body {
  padding: 30px 0px 0px 0px;
}
  .flex_row {
    display: flex;
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    box-sizing: border-box;
    background: #ffffff;
    padding: 10px 0;
    .search {
      width: 224px;
      .el-icon-search {
        cursor: pointer;
      }
    }
  }
  .main {
    width: 100%;
    background: #ffffff;
    /*  padding: 16px 32px;*/
    /*  box-sizing: border-box;*/
    .bedsContainer {
      width: 100%;
      .bedsItem:hover {
        transform: translateY(-6px);
        /*  top: -6px;*/
        box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.15);
      }
      .bedsItem {
        cursor: pointer;
        display: inline-block;
        float: left;
        width: 316px;
        height: 219px;
        background: #ffffff;
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
          background: rgba(0, 0, 0, 0.38);
          box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.08);
          border-radius: 0px 0px 4px 4px;
          color: #ffffff;
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
        .death {
          position: absolute;
          right: -15px;
          bottom: -15px;
          width: 74px;
          height: 74px;
        }
        .hasPatient {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
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
              span {
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
              max-width: 80px;
              line-height: 42px;
              height: 42px;
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
            .outHospital {
              border-radius: 4px;
              color: #17c37b;
              font-size: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 4px 7px;
              background: #e7f9f1;
              box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.08);
            }
            .outDept{
              border-radius: 4px;
              color: #1F71FF;
              font-size: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 4px 7px;
              background: rgba(76, 142, 255, 0.1);
              box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.08);
            }
            .bloodType {
              background: #fdebeb;
              box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.08);
              border-radius: 4px;
              color: #f23c3c;
              font-size: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 4px 7px;
            }
            .nurseGrade {
              background: #e7f1fc;
              box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.08);
              border-radius: 4px;
              color: #1777e6;
              font-size: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 4px 7px;
              margin-left: 12px;
            }
            .vitalSign {
              margin-right: 6px;
              img {
                width: 20px;
                height: 20px;
              }
            }
          }
          .baseTime {
            display: flex;
            color: #9e9e9e;
            position: relative;
            margin-bottom: 15px;
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
      }
    }
    .archivesPagination {
      width: 100%;
      height: 48px;
      display: flex;
      align-items: center;
      padding-top: 10px;
      justify-content: flex-end;
    }
  }
  .tab_dialog {
    line-height: 1;
  }
  .clearFix:after {
    content: "";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
  .noData {
    margin: 0 auto;
    background-image: url("/static/img/noData_table.png");
    width: 234px;
    height: 224px;
    background-size: 100%;
    background-repeat: no-repeat;
    padding: 0;
  }
}
</style>

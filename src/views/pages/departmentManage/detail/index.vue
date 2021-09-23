<template>
  <div class="turnWorkDetail">
    <div class="header">
      <!-- <div class="location">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item class="location-other" :to="{ path: '/department' }">科室管理</el-breadcrumb-item>
          <el-breadcrumb-item class="location-other" :to="{ path: '/department/turnWork'}">交班管理</el-breadcrumb-item>
          <el-breadcrumb-item class="location-current" >科室交班历史记录</el-breadcrumb-item>
        </el-breadcrumb>
      </div> -->
    </div>
    <div class="fillcontain_turnWorkDetail">
      <div class="contain_turnWork">
          <div class="department_header">
            <div class="department_history">
              <i class="el-icon-back" @click="backTop()"></i>
              <span class="text"  v-if="shiftType==1">科室交班历史记录({{newTime}})({{shiftTimePeriod}})</span>
               <span class="text"  v-if="shiftType==2">重点患者交班历史记录({{newTime}})({{shiftTimePeriod}})</span>
              <!-- <div class="exportBtn"><el-button type="primary" @click="exportBtn">导出</el-button></div> -->
              </div>
            <div class="department_basic">科室概况({{newTime}})({{shiftTimePeriod}})</div>
            <div>
              <el-row :gutter="25">
                <el-col :span="2">
                  <div class="item_name">总人数</div>
                  <div class="item_number">{{totalData.deptTotalNum}}</div>
                </el-col>
                <el-col :span="2">
                  <div class="item_name">新入人数</div>
                  <div class="item_number">{{totalData.inDeptNum}}</div>
                </el-col>
                <el-col :span="2">
                  <div class="item_name">死亡人数</div>
                  <div class="item_number">{{totalData.deathNum}}</div>
                </el-col>
                <el-col :span="2">
                  <div class="item_name">转出人数</div>
                  <div class="item_number">{{totalData.outDeptNum}}</div>
                </el-col>
                <el-col :span="2">
                  <div class="item_name">病危\病重人数</div>
                  <div class="item_number">{{totalData.criticallyNum}}</div>
                </el-col>
                <el-col :span="2">
                  <div class="item_name">手术病人数</div>
                  <div class="item_number">{{totalData.operationNum}}</div>
                </el-col>
                <el-col :span="2">
                  <div class="item_name">特级护理人数</div>
                  <div class="item_number">{{totalData.specialNurseNum}}</div>
                </el-col>
                <!-- <el-col :span="2">
                  <div class="item_name">病情变化人数</div>
                  <div class="item_number">{{totalData.changeNum}}</div>
                </el-col> -->
                <el-col :span="4">
                  <div class="item_name">需重点关注人数</div>
                  <div class="item_number">{{totalData.focusNum}}</div>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="tableOne" v-if="shiftType==1">科室病人交班列表</div>
          <div class="table_container" v-if="shiftType==1">
            <el-table v-loading="loading" :data="tableDataOne" style="width: 100%">
                <div slot="empty" class="noData"></div>
                <el-table-column prop="bedNo" label="床位号"></el-table-column>
                <el-table-column prop="inhosNum" label="住院号"></el-table-column>
                <el-table-column prop="patientName" label="患者姓名"></el-table-column>
                <el-table-column prop="sex" label="性别">
                   <template slot-scope="scope">
                    <span v-if="scope.row.sex == 1">男</span>
                    <span v-else-if="scope.row.sex == 2">女</span>
                    <span v-else>未知</span>
                  </template>
                </el-table-column>
                <el-table-column prop="age" label="年龄"></el-table-column>
                <el-table-column prop="indeptTime" label="入科时间" width="180"></el-table-column>
                <!-- <el-table-column prop="patientType" label="患者类型"></el-table-column> -->
                <el-table-column prop="diagnosisContent" label="诊断"></el-table-column>
                <el-table-column prop="allergicHistory" label="过敏史"></el-table-column>
                <el-table-column prop="primaryDoctorName" label="责任医生"></el-table-column>
                <el-table-column prop="nursegrade" label="护理等级">
                   <template slot-scope="scope">
                    <span v-if="scope.row.nursegrade == 1">特级护理</span>
                    <span v-else-if="scope.row.nursegrade == 2">I级护理</span>
                    <span v-else-if="scope.row.nursegrade == 3">II级护理</span>
                    <span v-else-if="scope.row.nursegrade == 4">III级护理</span>
                    <span v-else>未知</span>
                  </template>
                </el-table-column>
                <el-table-column prop="primaryNurseName" label="责任护士"></el-table-column>
            </el-table>
          </div>
          <div class="tableTwo" v-if="shiftType==1">死亡病人交班</div>
          <div class="table_container" v-if="shiftType==1">
            <el-table v-loading="loading" :data="tableDataTwo" style="width: 100%">
              <div slot="empty" class="noData"></div>
              <el-table-column prop="bedNo" label="床位号"></el-table-column>
              <el-table-column prop="inhosNum" label="住院号"></el-table-column>
              <el-table-column prop="patientName" label="患者姓名"></el-table-column>
              <el-table-column prop="sex" label="性别">
                  <template slot-scope="scope">
                    <span v-if="scope.row.sex == 1">男</span>
                    <span v-else-if="scope.row.sex == 2">女</span>
                    <span v-else>未知</span>
                  </template>
              </el-table-column>
              <el-table-column prop="age" label="年龄"></el-table-column>
              <el-table-column prop="indeptTime" label="入科时间" width="180"></el-table-column>
              <el-table-column prop="deathTime" label="死亡世间"></el-table-column>
              <el-table-column prop="diagnosisContent" label="死亡诊断"></el-table-column>
              <el-table-column prop="rescueProcess" label="抢救过程" ></el-table-column>
              <el-table-column prop="primaryDoctorName" label="责任医生"></el-table-column>
              <el-table-column prop="primaryNurseName" label="责任护士"></el-table-column>
            </el-table>
          </div>
          <div class="tableOne" v-if="shiftType==2">重点患者交班列表</div>
            <div class="table_container" v-if="shiftType==2">
            <el-table v-loading="loading" :data="tableDataThree" style="width: 100%">
              <div slot="empty" class="noData"></div>
              <el-table-column prop="bedNo" label="床位号" ></el-table-column>
              <el-table-column prop="inhosNum" label="住院号" ></el-table-column>
              <el-table-column prop="patientName" label="患者姓名" ></el-table-column>
              <el-table-column prop="sex" label="性别" >
                <template slot-scope="scope">
                    <span v-if="scope.row.sex == 1">男</span>
                    <span v-else-if="scope.row.sex == 2">女</span>
                    <span v-else>未知</span>
                  </template>
              </el-table-column>
              <el-table-column prop="age" label="年龄" ></el-table-column>
              <el-table-column prop="indeptTime" label="入科时间"  width="180"></el-table-column>
              <el-table-column prop="diagnosisContent" label="诊断" ></el-table-column>
              <!-- <el-table-column prop="specialEvent" label="是否存在特殊事件" ></el-table-column> -->
              <el-table-column prop="primaryDoctorName" label="责任医生" ></el-table-column>
              <el-table-column prop="nursegrade" label="护理等级" >
                <template slot-scope="scope">
                    <span v-if="scope.row.nursegrade == 1">特级护理</span>
                    <span v-else-if="scope.row.nursegrade == 2">I级护理</span>
                    <span v-else-if="scope.row.nursegrade == 3">II级护理</span>
                    <span v-else-if="scope.row.nursegrade == 4">III级护理</span>
                    <span v-else>未知</span>
                  </template>
              </el-table-column>
              <el-table-column prop="primaryNurseName" label="责任护士" ></el-table-column>
            </el-table>
          </div>
           <div class="tableTwo" v-if="shiftType==2">重点患者交班备注</div>
            <div class="table_container" v-if="shiftType==2">
            <el-table v-loading="loading" :data="tableDataFour" style="width: 100%">
              <div slot="empty" class="noData"></div>
               <el-table-column prop="bedNo" label="床位号" ></el-table-column>
              <el-table-column prop="inhosNum" label="住院号" ></el-table-column>
              <el-table-column prop="patientName" label="患者姓名" ></el-table-column>
              <el-table-column prop="statusQuo" label="现状" ></el-table-column>
              <el-table-column prop="background" label="背景" ></el-table-column>
              <el-table-column prop="advice" label="建议" ></el-table-column>
              <el-table-column prop="assessment" label="评估" ></el-table-column>
            </el-table>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
  data() {
    return {
      newTime:"",
      turnWork: "1",
      shiftType:"",
      shiftTimePeriod:"",
      totalData:{},
      turnWorks: [
        { label: "全部交班", value: "1" },
        { label: "科室交班", value: "2" },
        { label: "重点患者交班", value: "3" },
      ],
     
      rules: {
        name: [{ required: true, message: "请输入机械类型", trigger: "blur" }],
      },
      tableDataOne: [],
      tableDataTwo: [],
      tableDataTHree: [],
      tableDataFour: [],
      tableHeight: 0,
      loading: true,
      isShow: false,
      isEditShow: false,

      addFundDialog: {
        show: false,
        dialogRow: {},
      },
      editDepartDialog:{
        show: false,
        dialogRow: {},
      },
      editFundDialog: {
        show: false,
        dialogRow: {},
      },
      incomePayData: {
        page: 1,
        limit: 10,
        name: "",
      },
      pageTotal: 0,
      // 用于列表查询
    };
  },
  created() {
 
  },
  mounted() {
    this.newTime =  this.$route.query.newTime
    this.shiftType = this.$route.query.shiftType
    this.shiftTimePeriod = this.$route.query.shiftTimePeriod
    console.log(this.$route.query.newTime)
    this.loadData();
    this.getTotalData()
  },
  methods: {
    exportBtn(){
      let url = "/api/icu/transition/queryTransitionReport"
      let params={

      }
      this.$axios.post(global.url+url,params).then((res)=>{
          if(res.data.msg==201){

          }
        }
      )
    },
    addUser() {
      this.addFundDialog.show = true;
    },
    getTotalData(){
      let that = this;
      let params={
          shiftClass:1,
          shiftDate:this.newTime,
          shiftTimePeriod:this.$route.query.shiftTimePeriod,
          queryHistoryType:"1",
          shiftType:this.$route.query.shiftType,
      }
       let url = "/api/icu/transition/queryTransitionStatistic";
      this.$axios.post(global.url + url,params).then(function (res) {
              if(res.data.msg==201){
                that.totalData = res.data.respData
              }
      });
    },
    backTop(){
      // this.$router.go(-1)
      this.$router.push({
        path:'/department',
        query:{
           activeName:"second"
        }
        })
    },
    onScreeoutMoney(searchForm) {
      this.$refs[searchForm].validate((valid) => {
        if (valid) {
          this.loadData();
        }
      });
    },

    setTableHeight() {
      this.$nextTick(() => {
        this.tableHeight = document.body.clientHeight - 300;
      });
    },
    // 获取列表数据
    loadData() {
      let that = this
      this.loading = false;
     
      let param1 = {
        shiftDate:this.$route.query.newTime,
        queryHistoryType:1,
        shiftClass:1,
        shiftTimePeriod:this.$route.query.shiftTimePeriod,
        shiftType:this.$route.query.shiftType
      }
      if(this.shiftType ==1){
         let url1 = '/api/icu/transition/queryDeptTransitionList'
          this.$axios.post(global.url + url1,param1).then((response)=>{
            let res = response.data
            if(res.msg=="201"){
                that.tableDataOne = res.respData
                console.log(that.tableDataOne)
            }
          })
          let url2 = '/api/icu/transition/queryDeathTransitionList'
          this.$axios.post(global.url + url2,param1).then((response)=>{
            let res = response.data
            if(res.msg=="201"){
              that.tableDataTwo = res.respData
              console.log(that.tableDataTwo)
            }
          })
      }else if(this.shiftType ==2){
        let url3 = "/api/icu/transition/queryFocusTransitionList"
        this.$axios.post(global.url + url3,param1).then((response)=>{
          let res = response.data
          if(res.msg=="201"){
              console.log(res)
              that.tableDataThree = res.respData
              that.tableDataFour = res.respData
          }
        })
      }
      
      
    },
    hideAddFundDialog() {
      this.addFundDialog.show = false;
    },
    hideEditDepartDialog() {
      this.editDepartDialog.show = false;
    },
    hideEditFundDialog() {
      this.editFundDialog.show = false;
    },
    // 上下分页
    handleCurrentChange(val) {
      this.incomePayData.page = val;
      this.loadData();
    },
    // 每页显示多少条
    handleSizeChange(val) {
      this.incomePayData.limit = val;
      this.loadData();
    },
    // 编辑操作方法
    onEditDepart(row) {
      this.editDepartDialog.dialogRow = { ...row };
      // this.showAddFundDialog();
      this.editDepartDialog.show = true;
    },
    onEdit(row) {
      this.editFundDialog.dialogRow = { ...row };
      // this.showAddFundDialog();
      this.editFundDialog.show = true;
    },
    // 删除数据
    onDelete(row) {
      this.$confirm("确认删除该用户吗?", "提示", {
        type: "warning",
      })
        .then(() => {
          let para = { id: row.id };
          let url = Inter.userInfoDel.replace("{id}", para.id);
          this.$api.delete(url, para, (response) => {
            if (response.code == 200) {
              //  this.tableData = response.data.list;
              //  this.pageTotal = response.data.total
              this.$message({
                message: "删除成功",
                type: "success",
              });
              this.loadData();
            } else {
              console.log(response.message);
            }
          });
        })
        .catch(() => {});
    },
  },
  }
</script>

<style lang="scss">
  .turnWorkDetail{
      width: 100%;
      height: 100%;
      background: #F5F5F5;
      padding:0 24px 24px 24px;
      box-sizing: border-box;
      .header{
        height: 24px;
        background: #F5F5F5;
        display: flex;
        align-items: center;
        // padding-left: 24px;
        .location {
          font-size: 14px;
          .location-other {
            .el-breadcrumb__inner{
              color: rgba(0, 0, 0, 0.87);
            }

          }
          .location-current {
            .el-breadcrumb__inner{
              color: rgba(0, 0, 0, 0.38);

            }
          }
        }
      }
    .fillcontain_turnWorkDetail{
        width:calc(100%-48px);
        height:calc(100%-40px);
        // width: 100%;
        // height: 100%;
        padding:24px 32px 24px 32px;
        background: #fff;
        .exportBtn{
          // text-align: right;
          float:right;
        }
        .contain_turnWork{

        .department_history{
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
        }
        .department_basic {
          height: 22px;
          line-height: 22px;
          font-size: 16px;
          margin-top:24px;
        }

        .item_name {
          margin-top: 20px;
          font-size: 14px;
          color: #000;
        }
        .item_number {
          font-size: 28px;
          margin-top: 13px;
        }
        .tableOne {
          margin-top: 32px;
        }
        .tableTwo {
          margin-top: 32px;
        }
        .table_container {
          padding: 20px;
          /* background: #fff; */
          border-radius: 2px;
          .el-table th{
              background: rgba(0, 0, 0, 0.02);
              color: rgba(0, 0, 0, 0.87);
            }
        }
        .pagination {
          text-align: right;
          margin-top: 10px;
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
  }
</style>

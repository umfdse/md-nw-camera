<template>
  <div class="fillcontain_turnWork">
    <div class="department_header">
      <div class="department_basic">科室概况
        <!-- ({{notShiftData[notShiftData.length-1].shiftDate}})( {{notShiftData[notShiftData.length-1].shiftTimePeriod}}) -->
         <!-- ({{newTime}})({{shiftTimePeriod}}) -->
          <!-- <el-select v-model="noShiftData" @change="changgeShiftData()" >
            <el-option
              v-for="item in notShiftData"
              :key="(item.shiftDate)+(item.shiftTimePeriod)"
              :label="(item.shiftDate)+(item.shiftTimePeriod)"
              :value="(item.shiftDate)+(item.shiftTimePeriod)"
            ></el-option>
          </el-select> -->
           <el-dropdown @command="changgeShiftData" class="shiftDateTime">
          <span class="el-dropdown-link">
            {{noShiftData}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown" style="width:150px;height:200px;overflow-y:auto">
            <el-dropdown-item v-for="(item,index) in notShiftData" :key="index" :command="item.shiftDate + item.shiftTimePeriod">{{item.shiftDate}}{{item.shiftTimePeriod}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
         </div>
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
    <div class="tableOne">科室病人交班列表</div>
    <div class="table_container">
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
        <el-table-column prop="indeptTime" label="入科时间"  width="180"></el-table-column>
        <!-- <el-table-column prop="patientType" label="患者类型">
          <template slot-scope="scope">
              <span v-if="scope.row.patientType == 1">科室交班</span>
              <span v-else-if="scope.row.patientType == 2">重点患者交班</span>
               <span v-else-if="scope.row.patientType == 3">死亡交班</span>
                <span v-else-if="scope.row.patientType == 4">新病人交班</span>
                 <span v-else-if="scope.row.patientType == 5">特殊病人交班</span>
              <span v-else>未知</span>
            </template>
        </el-table-column> -->
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
        <el-table-column
          prop="operation"
          align="center"
          label="操作"
          width="180"
          ><template slot-scope="scope">
            <!-- <el-button type="text" size="mini" @click="onEditDepart(scope.row)"
              >编辑</el-button
            > -->
            <el-button
              type="text"
              size="mini"
              @click="onFocus(scope.row, scope.$index)"
              >{{scope.row.shiftType=="1"?'重点关注':'取消重点关注'}}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <editDepartDialog
        v-if="editDepartDialog.show"
        :isEditShow="editDepartDialog.show"
        :dialogEditRow="editDepartDialog.dialogRow"
        :newTime="newTime"
        :shiftTimePeriod="shiftTimePeriod"
        @getFundList="loadData"
        @closeEditDialog="hideEditDepartDialog"
      ></editDepartDialog>
    </div>
    <div class="tableTwo">死亡病人交班</div>
    <div class="table_container">
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
        <el-table-column prop="indeptTime" label="入科时间"  width="180"></el-table-column>
        <el-table-column prop="deathTime" label="死亡时间"  width="180"></el-table-column>
        <el-table-column prop="deathDiagnosis" label="死亡诊断"></el-table-column>
        <el-table-column prop="rescueProcess" label="抢救过程" ></el-table-column>
        <el-table-column prop="primaryDoctorName" label="责任医生"></el-table-column>
        <el-table-column prop="primaryNurseName" label="责任护士"></el-table-column>
         <!-- <el-table-column prop="remark" label="备注"></el-table-column> -->
        <el-table-column
          prop="operation"
          align="center"
          label="操作"
          width="180"
          ><template slot-scope="scope">
            <el-button type="text" size="mini" @click="onEdit(scope.row)"
              >编辑数据</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- <pagination
        :pageTotal="pageTotal"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
      ></pagination> -->
      <editFundDialog
        v-if="editFundDialog.show"
        :isEditShow="editFundDialog.show"
        :dialogEditRow="editFundDialog.dialogRow"
        :newTime ="newTime"
        :shiftTimePeriod="shiftTimePeriod"
        @getFundList="loadData"
        @closeEditDialog="hideEditFundDialog"
      ></editFundDialog>
    </div>
    <div class="submBtn">
       <el-button type="primary" @click="isVisible = true">确认交班</el-button>
    </div>
    <el-dialog
    :visible.sync="isVisible"
    title="确认交班"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :modal-append-to-body="false"
    width="440px"
  >
    <el-form
      ref="form"
      :model="form"
      :label-width="dialog.formLabelWidth"
      style="margin:0 24px; width: auto"
    >

        <el-form-item  label="接班人:">
            <el-select v-model="form.user"  placeholder="请选择" class="inputInner" @change="acceptChange">
            <el-option
              v-for="item in users"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      <el-form-item class="text_right">
        <el-button @click="isVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit()">提 交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  </div>
</template>

<script>
// import moment from "moment";
import EditDepartDialog from "./alert/editDepartDialog";
import EditFundDialog from "./alert/editFundDialog";
// import Pagination from "@/components/pagination";
export default {
  components: {
    EditDepartDialog,
    EditFundDialog,
    // Pagination,
  },
  data() {
    return {
      dialog:{
        formLabelWidth:"120"
      },
      isVisible:false,
      form:{
        user:""
      },
      totalData:{},
      acceptUserName:"",
      users:[],
      newTime:"",
      tableDataOne: [],
      tableDataTwo: [],
      transitionList:[],
      notShiftData:[],
      noShiftData:"",
      tableHeight: 0,
      shiftTimePeriod:"",
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
  created() {},
  mounted() {
    // let dateTime =new Date(new Date().getTime()-24*60*60*1000)
    // let getMouth = (dateTime.getMonth()+1)>10?(dateTime.getMonth()+1):"0"+(dateTime.getMonth()+1)
    // let newDateTime =dateTime.getFullYear()+ "-" + getMouth + "-" + dateTime.getDate();
    // if(new Date().getHours()>=8&&new Date().getHours()<17){
    //   this.shiftTimePeriod="晨"
    //   this.newTime = moment().format("YYYY-MM-DD")
    // }else if(new Date().getHours()<8){
    //   this.shiftTimePeriod="夜"
    //   this.newTime = newDateTime
    // }else if(new Date().getHours()>=17){
    //    this.shiftTimePeriod="夜"
    //    this.newTime = moment().format("YYYY-MM-DD")
    // }
     this.getHisNotShiftData()
    // this.loadData();
    this.getUser();
    // this.getTotalData()
  },
  methods: {
    changgeShiftData(data){
      this.noShiftData = data
      for(let i=0;i<this.notShiftData.length;i++){
        if((this.notShiftData[i].shiftDate+this.notShiftData[i].shiftTimePeriod)==this.noShiftData){
          this.newTime = this.notShiftData[i].shiftDate
          this.shiftTimePeriod = this.notShiftData[i].shiftTimePeriod
        }
      }
      this.loadData()
      this.getTotalData()
    },
    addUser() {
      this.addFundDialog.show = true;
    },
     getHisNotShiftData(){
       let that = this;
      let params={
          shiftClass:1,
          shiftType:1,
      }
       let url = "/api/icu/transition/queryHisNotShiftData";
      this.$axios.post(global.url + url,params).then(function (res) {
              if(res.data.msg==201){
                that.notShiftData = res.data.respData
                that.noShiftData = (that.notShiftData[0].shiftDate)+(that.notShiftData[0].shiftTimePeriod)
                that.newTime = that.notShiftData[0].shiftDate
                that.shiftTimePeriod = that.notShiftData[0].shiftTimePeriod
                that.loadData()
                that.getTotalData()
              }
      });
    },
    getTotalData(){
      let that = this;
      let params={
          shiftClass:1,
          shiftDate:this.newTime,
          shiftTimePeriod:this.shiftTimePeriod,
          queryHistoryType:"2"
      }
       let url = "/api/icu/transition/queryTransitionStatistic";
      this.$axios.post(global.url + url,params).then(function (res) {
              if(res.data.msg==201){
                that.totalData = res.data.respData
              }
      });
    },
    acceptChange(){
      if(this.users.length>0){
        for(let i=0;i<this.users.length;i++){
          if(this.form.user==this.users[i].id){
             this.acceptUserName = this.users[i].value
          }
        }
      }
    },
    onScreeoutMoney(searchForm) {
      this.$refs[searchForm].validate((valid) => {
        if (valid) {
          this.loadData();
        }
      });
    },
    getUser(){
       let that = this;
      let params={
          pageSize: 0,
          pageNum: this.incomePayData.page,
          updateTime:"",
          userName:"",
          userTypes:[4]
      }
       let url = "/base/user/list";
      this.$axios.post(global.url + url,params).then(function (res) {
        that.tableData = res.data.respData.list;
        that.pageTotal = res.data.respData.total;
        if(res.data.respData.list.length>0){
          for(let i=0;i<res.data.respData.list.length;i++){
               that.users.push({id:res.data.respData.list[i].id,value:res.data.respData.list[i].realName})
          }
        }
       
      });
    },
    onSubmit(){
      this.transitionList = this.tableDataOne.concat(this.tableDataTwo)
        if(!this.form.user){
          this.$message.error("接班人不能为空")
          return
        }
        let url = "/api/icu/transition/submitTransition";
        let params={
          transitionList:this.transitionList,
          shiftClass:1,
          shiftType:1,
          shiftDate:this.newTime,
          shiftTimePeriod:this.shiftTimePeriod,
          acceptUserId:this.form.user,
          acceptUserName:this.acceptUserName
        }

        this.$axios.post(global.url+url,params).then((res)=>{
            if(res.data.msg==201){
              this.isVisible = false
              this.$message({
                type:"success",
                message:"交班成功"
              })
               this.getHisNotShiftData()
            }else{
              this.$message.error(res.data.content)
            }
        })
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
      let url1 = '/api/icu/transition/queryDeptTransitionList'
      let param1 = {
        shiftDate:this.newTime,
        shiftTimePeriod:this.shiftTimePeriod,
        shiftClass:"1",//1代表护士端2代表医生端
        queryHistoryType:"2",//是否从历史查询页面进入 1是   2否
      }
      this.$axios.post(global.url + url1,param1).then((response)=>{
        let res = response.data
        if(res.msg=="201"){    
              that.tableDataOne=res.respData
           
        }
      })
      let url2 = '/api/icu/transition/queryDeathTransitionList'
       this.$axios.post(global.url + url2,param1).then((response)=>{
         let res = response.data
        if(res.msg=="201"){
           that.tableDataTwo = res.respData
           
        }
      })
      //  console.log(this.tableDataOne)
      //  console.log(this.tableDataTwo)
      // this.transitionList = this.tableDataOne.concat(this.tableDataTwo)
      // console.log(this.transitionList)

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
      this.editDepartDialog.show = true;
    },
    onEdit(row) {
      this.editFundDialog.dialogRow = { ...row };
      this.editFundDialog.show = true;
    },
    // 取消   重点关注
    onFocus(row) {
      console.log(row)
      let message1 = row.shiftType==1?'重点关注':'取消重点关注'
      let message2 ="确认"+message1+"该患者吗?"
      
       if(row.shiftType==1){
          this.$confirm(message2, "提示", {
        type: "warning",
      })
        .then(() => {
          // let para = { id: row.id };
          // let url = "/api/icu/transition/focus/{id}".replace("{id}",para.id);
          let url = "/api/icu/transition/focus"
          let params={
              shiftDate:this.newTime,
              id:row.id,
              shiftClass:"1",//1代表护士端2代表医生端
              patientRecordId:row.patientRecordId,
              shiftTimePeriod:this.shiftTimePeriod,
          }
          this.$axios.post(global.url + url,params).then((response) => {
            if (response.data.msg == 201) {
              this.$message({
                message: message1+"成功",
                type: "success",
              });
              this.loadData();
              this.getTotalData()
            } else {
              console.log(response.data.msg);
            }
          });
        })
        .catch(() => {});
       }else{
         this.$confirm(message2, "提示", {
        type: "warning",
      })
        .then(() => {
          // let para = { id: row.id };
          // let url = "/api/icu/transition/cancelFocus/{id}".replace("{id}",para.id);
           let url = "/api/icu/transition/cancelFocus";
           let params={
              shiftDate:this.newTime,
              id:row.id,
              shiftClass:"1",//1代表护士端2代表医生端
              patientRecordId:row.patientRecordId,
              shiftTimePeriod:this.shiftTimePeriod,
           }
          this.$axios.post(global.url + url,params).then((response) => {
            if (response.data.msg == 201) {
              this.$message({
                message: message1+"成功",
                type: "success",
              });
              this.loadData();
              this.getTotalData()
            } else {
              console.log(response.data.msg);
            }
          });
        })
        .catch(() => {});
       }
    },
  },
};
</script>

<style lang="scss" >
.fillcontain_turnWork{
.listTable {
  display: flex;
  margin-top: 5px;
  line-height: 30px;
}
.listTable li {
  justify-content: flex-start;

  margin-right: 86px;
}
.department_basic {
  height: 22px;
  line-height: 22px;
  font-size: 16px;
   margin-top:29px; 
}
.el-dropdown-link{
  margin-left:20px!important;
  color:black;
 
}
// .el-table__header-wrapper{
//   height: 54px!important;
//   .el-table__header{
//      height: 54px!important;
//      th{
//         height: 54px!important;
//      }
//   }
// }
.item_name {
  margin-top: 20px;
  font-size: 14px;
  color: #000;
}
.item_number {
  font-size: 28px;
  margin-top: 8px;
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
      padding:0;
    }
}
.pagination {
  text-align: right;
  margin-top: 10px;
}
.submBtn{
  float:right;
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
.text_right{
  text-align: right;
}
}
</style>



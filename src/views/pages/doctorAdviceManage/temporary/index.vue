<template>
  <div class="fillcontain_temAdvice">
    <div class="search_container searchArea">
      <el-form
        :inline="true"
        ref="search_data"
        class="demo-form-inline search-form"
        @submit.native.prevent
      >
       <el-form-item class="btnRight">
          <el-button  @click="reset()">重置</el-button>
        </el-form-item>
        <!-- <el-form-item class="btnRight">
           <el-select v-model="doctorAdvice">
            <el-option
              v-for="item in doctorAdvices"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item> -->
         <el-form-item class="btnRight">
           <el-select v-model="option" @change="changgeStatus()" clearable>
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
         <el-form-item class="btnLeft">
           <el-button type="primary" @click="start()" v-has="`advice:run`">开始执行</el-button>
        </el-form-item>
           <!-- <el-form-item class="btnLeft">
           <el-button  @click="orderSplit()">医嘱拆分</el-button>
        </el-form-item> -->
      </el-form>
    </div>
    <div class="table_container">
      <el-table v-loading="loading" :data="tableData" style="width: 100%"   ref="multipleTable" tooltip-effect="dark" @selection-change="handleSelectionChange">
          <div slot="empty" class="noData"></div>
        <el-table-column type="selection" :selectable='checkboxInit' width="55"></el-table-column>
        <el-table-column prop="orderNo" label="组号" ></el-table-column>
        <el-table-column prop="orderText" label="医嘱名称" ></el-table-column>
        <el-table-column prop="dose" label="剂量" ></el-table-column>
          <el-table-column prop="doseUnit" label="剂量单位" ></el-table-column>
        <el-table-column prop="administration" label="使用方法"  >
             <template slot-scope="scope">
              <span v-if="scope.row.administration == 1">口服</span>
              <span v-else-if="scope.row.administration == 2">静脉</span>
               <span v-else-if="scope.row.administration == 3">泵入</span>
                <span v-else-if="scope.row.administration == 4">皮下注射</span>
                <span v-else-if="scope.row.administration == 5">停用</span>
              <span v-else-if="scope.row.administration == 6">肌肉注射</span>
               <span v-else-if="scope.row.administration == 7">雾化</span>
                <span v-else-if="scope.row.administration == 8">直肠给药</span>
                 <span v-else-if="scope.row.administration == 9">关节腔给药</span>
                  <span v-else-if="scope.row.administration == 10">引道给药</span>
              <!-- <span v-else></span> -->
            </template>
        </el-table-column>
        <el-table-column prop="frequencyId" label="使用频次" ></el-table-column>
        <el-table-column prop="orderStatus" label="执行情况" >
          <template slot-scope="scope">
               <span v-if="scope.row.orderStatus == 1"><span class="orderOne orderI"></span>转抄</span>
              <span v-else-if="scope.row.orderStatus == 2"><span class="orderTwo orderI"></span>停止</span>
               <span v-else-if="scope.row.orderStatus == 3"><span class="orderThree orderI"></span>确认</span>
                <span v-else-if="scope.row.orderStatus == 4"><span class="orderFour orderI"></span>已执行</span>
                <span v-else-if="scope.row.orderStatus == 5"><span class="orderFive orderI"></span>执行中</span>
              <span v-else-if="scope.row.orderStatus == 6"><span class="orderSix orderI"></span>暂停</span>
               <span v-else-if="scope.row.orderStatus == 7"><span class="orderSeven orderI"></span>废弃</span>
                <span v-else-if="scope.row.orderStatus == 8"><span class="orderEight orderI"></span>作废</span>
              <!-- <span v-else></span> -->
            </template>
        </el-table-column>
         <el-table-column prop="orderDoctorName" label="开立医生" ></el-table-column>
         <el-table-column prop="startTime" label="开始时间"  width="180"></el-table-column>
         <el-table-column prop="endTime" label="停止时间"  width="180"></el-table-column>
           <el-table-column prop="executeTime" label="执行时间"  width="180"></el-table-column>
         <el-table-column prop="remark" label="备注" ></el-table-column>
        <el-table-column prop="operation"  label="操作" width="180">
         <template slot-scope="scope">
             <el-button
              type="text"
              size="mini"
              @click="stop(scope.row,scope.$index)"
              :disabled="scope.row.orderStatus!=5||!(scope.row.administration==1||scope.row.administration==2||scope.row.administration==3)"
               v-if="scope.row.orderNo?true:false"
               v-has="`advice:run`"
            >暂停</el-button>
            <el-button v-has="`advice:run`" type="text"  size="mini" @click="onEdit(scope.row)"  v-if="scope.row.orderNo?true:false" :disabled="scope.row.orderStatus!=5||!(scope.row.administration==1||scope.row.administration==2||scope.row.administration==3)">修改</el-button>
            <el-button
            v-has="`advice:run`"
              type="text"
              size="mini"
              @click="onDelete(scope.row,scope.$index)"
              :disabled="scope.row.orderStatus==4||scope.row.orderStatus==7||scope.row.orderStatus==8||scope.row.administration!=2"
               v-if="scope.row.orderNo?true:false"
            >作废</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :pageTotal="pageTotal"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
      ></pagination>
      <el-dialog
        :visible.sync="isVisible"
        title="开始执行医嘱"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :modal-append-to-body="false"
        width="480px"
        top="18vh"
      >
        <div class="form_userAdd">
          <el-form
            ref="form"
            :model="form"
            :rules="rules"
            :label-width="dialog.formLabelWidth"
            width="480px"
            top="18vh"
            style="margin: 10px; width: auto"
          >
            <el-form-item prop="username" label="执行时间:">
               <el-date-picker
               class="inputInner"
                    v-model="form.dateTime"
                    type="datetime"
                    placeholder="选择日期时间"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="realName" label="滴速设定:" v-if="isRateUnit">
              <el-input type="text" v-model="form.rateValue" class=" inputInneI inputInneII " placeholder="请输入" ></el-input>
               <el-select v-model="form.rateUnit"  placeholder="请选择" class="inputInneII">
                  <el-option
                    v-for="item in rateUnits"
                    :key="item.id"
                    :label="item.keyValue"
                    :value="item.value"
                  >
                  </el-option>
              </el-select>
            </el-form-item>
           
            <el-form-item class="text_right">
              <el-button @click="isVisible = false">取 消</el-button>
              <el-button type="primary" @click="onSubmit('form')">提 交</el-button>
            </el-form-item>
          </el-form>
        </div>
  </el-dialog>
  <el-dialog
        :visible.sync="isVisibleEdit"
        title="开始执行医嘱"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :modal-append-to-body="false"
        width="480px"
        top="18vh"
      >
        <div class="form_userAdd">
          <el-form
            ref="form"
            :model="form"
            :rules="rules"
            :label-width="dialog.formLabelWidth"
            width="480px"
            top="18vh"
            style="margin: 10px; width: auto"
          >
            <el-form-item prop="username" label="执行时间:">
               <el-date-picker
               class="inputInner"
                    v-model="form.dateTime"
                    type="datetime"
                    placeholder="选择日期时间"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="realName" label="滴速设定:" v-if="isRateUnitEdit">
              <el-input type="text" v-model="form.rateValue" class=" inputInneI inputInneII " placeholder="请输入" ></el-input>
               <el-select v-model="form.rateUnit"  placeholder="请选择" class="inputInneII">
                  <el-option
                    v-for="item in rateUnits"
                    :key="item.id"
                    :label="item.keyValue"
                    :value="item.value"
                  >
                  </el-option>
              </el-select>
            </el-form-item>
           
            <el-form-item class="text_right">
              <el-button @click="isVisibleEdit = false">取 消</el-button>
              <el-button type="primary" @click="onSubmitEdit('form')">提 交</el-button>
            </el-form-item>
          </el-form>
        </div>
  </el-dialog>
    </div>
  </div>
</template>

<script>
// import AddFundDialog from "./alert/addFundDialog";
// import EditFundDialog from "./alert/editFundDialog";
// import './date.js'
import Pagination from "@/components/pagination";
export default {
  props: ['recordId'],
  components: {
    // AddFundDialog,
    // EditFundDialog,
    Pagination
  },

  // watch:{
  //   patientId(newValue,oldValue){
  //     if(newValue!=oldValue){
  //       this.loadData()
  //     }
  //   }
  // },
  data() {
    
    return {
      dialog: {
        width: "400px",
        formLabelWidth: "120px",
      },
       rules: {
        // realName: [ { required: true, message: '用户姓名不能为空', trigger: 'blur' }],
        // username: [{ required: true, validator: validatePass, trigger: "blur" }],
      },
      isRateUnit:true,
      isRateUnitEdit:true,
      isVisible:false,
      isVisibleEdit:false,
      rateUnits:[
        {id:"1",value:"ml/h",keyValue:"毫升/小时"},
        {id:"2",value:"dtt/min",keyValue:"滴/分"}
      ],
      form: {
        dateTime:"",
        rateValue:"",
        rateUnit:"",
      },
     multipleSelection: [],
     option:"",
     doctorAdvice:"",
     options:[
         {label:"全部执行情况",value:""},
        {label:"转抄",value:"1"},
         {label:"停止",value:"2"},
        {label:"确认",value:"3"},
        {label:"已执行",value:"4"},
        {label:"执行中",value:"5"},
         {label:"暂停",value:"6"},
        {label:"废弃",value:"7"},
        {label:"作废",value:"8"}
     ],
    //  doctorAdvices:[
    //     {label:"全部医嘱",value:""},
    //     {label:"已执行",value:"2"},
    //     {label:"确认",value:"3"},
    //     {label:"作废",value:"4"}
    //  ],
      orderNos:[],
      tableData: [],
      tableHeight: 0,
      loading: true,
      isShow: false,
      isEditShow: false,

      incomePayData: {
        page: 1,
        limit: 10,
        name: ""
      },
      pageTotal: 0
      // 用于列表查询
    };
  },
  created(){

  },
  mounted() {
      this.option = this.options[0].value
      // this.doctorAdvice = this.doctorAdvices[0].label
    this.loadData();
  },
  methods: {
     checkboxInit(row,index){
        if ((row.orderStatus==3||row.orderStatus==6)&&row.orderNo) {//你需要判断的条件
          return 1;//可勾选
        }else{
          return 0;//不可勾选
        }
      },
    onEdit(row) {
       if(row.administration!=2){
        this.isRateUnitEdit = false
      }else{
        this.isRateUnitEdit = true
      }
      this.isVisibleEdit = true
      this.form.dateTime = new Date().format("yyyy-MM-dd hh:mm:ss")
      this.form.rateValue = row.speed
      this.form.rateUnit = row.speedUnit
      this.orderNos=[row.orderNo]
      // this.orderIds.push(row.id)

    },
    start(){
      if(this.multipleSelection.length>0){
        for(let i=0;i<this.multipleSelection.length;i++){
          if(this.multipleSelection[i].administration!=2){
            this.isRateUnit = false
          }else{
             this.isRateUnit = true
          }
        }
         this.isVisible = true
        this.form.dateTime=new Date().format("yyyy-MM-dd hh:mm:ss")
        this.form.rateValue=15
        this.form.rateUnit="dtt/min"
      }else{
        this.$message.error("请选择医嘱!")
      }
    },
     //暂停
    stop(row){
       this.$confirm("确认暂停该液体吗?", "提示", {
        type: "warning"
      }).then(()=>{
        this.orderNos=[]
      let url = "/api/icu/advice/pauseAdvice"
      // if(this.tableData.length>0){
      //   for(let i=0;i<this.tableData.length;i++){
      //     if(row.orderNo==this.tableData[i].orderNo){
      //       this.orderIds.push(this.tableData[i].id)
      //     }
      //   }
      // }
      this.orderNos=[row.orderNo]
      let params = {
        recordId:this.recordId,
        // executeTime:row.executeTime,
        orderNos:this.orderNos,
        // orderNo:row.orderNo,
        orderType:row.orderType,
        // pauseTime:row.pauseTime
      }
       this.$axios.post(global.url + url,params).then(response => {
            if (response.data.msg == 201) {
              this.$message({
                message: "暂停成功",
                type: "success"
              });
              this.loadData();
            } else {
             this.$message.error(response.data.content)
            }
          });
      })
      .catch(() => {});
      
    },
    // 废弃
    onDelete(row) {
      this.$confirm("确认作废该液体吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.orderNos=[]
          let url = "/api/icu/advice/discard"
          // if(this.tableData.length>0){
          //   for(let i=0;i<this.tableData.length;i++){
          //     if(row.orderNo==this.tableData[i].orderNo){
          //       this.orderIds.push(this.tableData[i].id)
          //     }
          //   }
          // }
          this.orderNos=[row.orderNo]
          let params = {
            // executeTime:row.executeTime,
            orderNos:this.orderNos,
            // orderNo:row.orderNo,
            orderType:row.orderType,
            recordId:this.recordId
          }
          this.$axios.post(global.url+url,params).then((res)=>{
            if(res.data.msg==201){
               this.$message({
                message: "作废成功",
                type: "success"
              });
               this.loadData();
            }else{
              this.$message.error(res.data.content)
            }
          })
        })
        .catch(() => {});
    },
      changgeStatus(){
        this.loadData()
      },
      onSubmit(){
         this.orderNos=[]
          if(this.multipleSelection.length>0){
             for(let i=0;i<this.multipleSelection.length;i++){
                if(this.multipleSelection[i].orderNo){
                  this.orderNos.push(this.multipleSelection[i].orderNo)
                }
             }
          }
          else{
          this.$message.error("请选择医嘱！")
          return
        }
        this.$confirm("确认要执行医嘱吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          let params = { 
            recordId:this.recordId,//病患id
            executeTime:this.form.dateTime,
            orderType:"2",
            rateValue:this.form.rateValue,
            rateUnit:this.form.rateUnit,
            orderNos:this.orderNos,//医嘱组号
            };
            console.log(params)
          let url = "/api/icu/advice/executeAdvice";
          this.$axios.post(global.url + url,params).then(response => {
            if (response.data.msg == 201) {
              this.$message({
                message: "执行成功",
                type: "success"
              });
              this.isVisible = false
              this.loadData();
            } else {
             this.$message.error(response.data.content)
            }
          });
        })
        .catch(() => {});

      },
    onSubmitEdit(){
        this.$confirm("确认要执行医嘱吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          let params = { 
            recordId:this.recordId,//病患id
            executeTime:this.form.dateTime,
            orderType:"2",
            rateValue:this.form.rateValue,
            rateUnit:this.form.rateUnit,
            orderNos:this.orderNos,//医嘱id
            };
            console.log(params)
          let url = "/api/icu/advice/updateAdvice";
          this.$axios.post(global.url + url,params).then(response => {
            if (response.data.msg == 201) {
              this.$message({
                message: "执行成功",
                type: "success"
              });
              this.isVisibleEdit = false
              this.loadData();
            } else {
             this.$message.error(response.data.content)
            }
          });
        })
        .catch(() => {});
    },
    orderSplit(){
       this.$confirm("确认要拆分该病患医嘱吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          let params = { 
            recordId:this.recordId,//病患id
            // executeTime:this.form.dateTime,
            // orderId:this.multipleSelection[0].orderSn,//医嘱id
            // orderNo:this.multipleSelection[0].orderNo      //医嘱组号
            };
            console.log(params)
          let url = "/api/icu/advice/splitAdvice";
          this.$axios.post(global.url + url,params).then(response => {
            if (response.data.msg == 201) {
              this.$message({
                message: "拆分成功",
                type: "success"
              });
              this.isVisible = false
              this.loadData();
            } else {
             this.$message.error(response.data.content)
            }
          });
        })
        .catch(() => {});
    },
    reset(){
       this.option=""
      this.loadData()
    },
    onScreeoutMoney(searchForm) {
      this.$refs[searchForm].validate(valid => {
        if (valid) {
          this.loadData();
        }
      });
    },
     handleSelectionChange(val) {
        this.multipleSelection = val;
        console.log(this.multipleSelection)
      },
    setTableHeight() {
      this.$nextTick(() => {
        this.tableHeight = document.body.clientHeight - 300;
      });
    },
    // 获取列表数据
    loadData() {
       this.loading = false;
      let that= this
      let params = {
        recordId:this.recordId,
        orderStatus:this.option,
        orderType:"2",
        pageNum: this.incomePayData.page,
        pageSize: this.incomePayData.limit,
      };
      let url = "/api/icu/advice/getSplitAdvicelist";
      this.$axios.post(global.url + url,params).then(function (res) {
        let arr = res.data.respData.list;
        // debugger
        if(arr.length){
          for(var i=0;i<arr.length;i++){
            for(var j=i+1;j<arr.length;j++){
              if(arr[i].orderNo==arr[j].orderNo){
                arr[j].orderNo=""
              }
            }
         
          }
        }
        that.tableData = res.data.respData.list;
        that.pageTotal = res.data.respData.total;
      });

    },
    hideAddFundDialog(){
        this.addFundDialog.show = false;
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
    enable(){
      this.$confirm("确认启用该用户吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          let para = { id: row.id };
          let url = Inter.userInfoDel.replace("{id}", para.id);
          this.$api.delete(url, para, response => {
            if (response.code == 200) {
              //  this.tableData = response.data.list;
              //  this.pageTotal = response.data.total
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.loadData();
            } else {
              console.log(response.message);
            }
          });
        })
        .catch(() => {});
    },

  }
};
</script>

<style lang="scss">
.fillcontain_temAdvice{
  width: 100%;
  height: 100%;
  // padding:10px;
.table_container {
  padding: 20px;
  /* background: #fff; */
  border-radius: 2px;
}
.el-dialog--small {
  width: 600px !important;
}
.pagination {
  text-align: right;
  margin-top: 10px;
}
.search_container {
  position: relative;
  width:100%;
  height: 32px;
  // height:60px;
  /* margin-bottom: 20px; */
}
.btnLeft {
  float: left;
  margin-left: 10px !important;
   margin-top:10px;
  /* margin-bottom:20px; */
}
.btnRight{
  float: right;
   margin-top:10px;
  margin-right:30px !important
}
.el-input__inner{
  background-color: #fff;
}
.searchArea {
  background: rgba(255, 255, 255, 1);
  border-radius: 2px;
}
.text_right{
    text-align: right;
  }
  .inputInner{
    width:224px!important
  }
   .inputInneI{
    padding-right:10px;
  }
  .inputInneII{
    display: inline-block;
    width:105px!important
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
    .inputInner{
    width:224px!important
  }
  .inputInneI{
    padding-right:10px;
  }
  .inputInneII{
    display: inline-block;
    width:105px!important
  }
  .orderI{
     display: inline-block;
      width: 8px;
      height: 8px;
       border-radius: 50%;
      margin-right:3px;
  }
    .orderOne{
      background-color: #1374E4;
    }
    .orderTwo{
      background-color: #FA3039;
    }
    .orderThree{
      background-color: #F9B344;
    }
    .orderFour{
      background-color: #00B628;
    }
     .orderFive{
      background-color: #64DE7E;
    }
     .orderSix{
      background-color: #BFBFBF;
    }
     .orderSeven{
      background-color: #9254DE;
    }
     .orderEight{
      background-color: #FA3039;
    }
}
</style>



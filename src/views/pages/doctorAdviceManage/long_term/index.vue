<template>
  <div class="fillcontain_longAdvice">
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
         <el-form-item class="btnRight">
           <el-select v-model="doctorAdvice" @change="changeAdvice()" clearable> 
            <el-option
              v-for="item in doctorAdvices"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
          <el-form-item class="btnRight">
            <el-input v-model="adName" placeholder="请输入医嘱内容搜索">
            <i
              class="el-icon-search searchIcon"
              slot="suffix"
              @click="searchName">
            </i>
          </el-input>
        </el-form-item>
         <el-form-item class="btnLeft">
           <!-- <el-button type="primary" @click="isVisible=true">开始执行</el-button> -->
        </el-form-item>
           <el-form-item class="btnLeft">
           <el-button  @click="orderSplit()" v-has="`advice:spit`">医嘱拆分</el-button>
        </el-form-item>
         <el-form-item class="btnLeft">
           <el-button  @click="synchro()">同步</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table_container">
      <el-table v-loading="loading" :data="tableData" style="width: 100%"    tooltip-effect="dark" >
          <div slot="empty" class="noData"></div>
        <!-- <el-table-column type="selection" :selectable='checkboxInit' width="55"></el-table-column> -->
        <el-table-column prop="orderNo" label="组号" ></el-table-column>
         <el-table-column prop="orderType" label="长/临" >
            <template slot-scope="scope">
               <span v-if="scope.row.orderType == 1">长期</span>
              <span v-else-if="scope.row.orderType == 2">临时</span>
            </template>
         </el-table-column>
          <el-table-column prop="orderClass" label="医嘱类型"  >
             <template slot-scope="scope">
              <span v-if="scope.row.orderClass == 1">饮食</span>
              <span v-else-if="scope.row.orderClass == 2">护理</span>
               <span v-else-if="scope.row.orderClass == 3">药物</span>
                <span v-else-if="scope.row.orderClass == 4">治疗</span>
                <span v-else-if="scope.row.orderClass == 5">嘱托</span>
              <span v-else-if="scope.row.orderClass == 6">检验</span>
               <span v-else-if="scope.row.orderClass == 7">检查</span>
            </template>
        </el-table-column>
        <el-table-column prop="orderText" label="医嘱内容" ></el-table-column>
        <!-- <el-table-column prop="dose" label="剂量" ></el-table-column>
          <el-table-column prop="doseUnit" label="剂量单位" ></el-table-column> -->
        <el-table-column prop="administration" label="执行方法"  >
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
              <!-- <span v-else>未知</span> -->
            </template>
        </el-table-column>
        <el-table-column prop="frequencyId" label="执行频次" ></el-table-column>
        <el-table-column prop="dose" label="医嘱剂量" ></el-table-column>
        <el-table-column prop="orderStatus" label="医嘱状态" >
           <template slot-scope="scope">
              <span v-if="scope.row.orderStatus == 1"><span class="orderOne"></span>转抄</span>
              <span v-else-if="scope.row.orderStatus == 2"><span class="orderTwo orderI"></span>停止</span>
               <span v-else-if="scope.row.orderStatus == 3"><span class="orderThree orderI"></span>确认</span>
                <span v-else-if="scope.row.orderStatus == 4"><span class="orderFour orderI"></span>已执行</span>
                <span v-else-if="scope.row.orderStatus == 5"><span class="orderFive orderI"></span>执行中</span>
              <span v-else-if="scope.row.orderStatus == 6"><span class="orderSix orderI"></span>暂停</span>
               <span v-else-if="scope.row.orderStatus == 7"><span class="orderSeven orderI"></span>废弃</span>
                <span v-else-if="scope.row.orderStatus == 8"><span class="orderEight orderI"></span>作废</span>
              <!-- <span v-else>未知</span> -->
            </template>
        </el-table-column>
          <el-table-column prop="startTime" label="开立时间"  width="180"></el-table-column>
         <el-table-column prop="endTime" label="停止时间" ></el-table-column>
         <el-table-column prop="orderDoctorName" label="开立人" ></el-table-column>
       
         <el-table-column prop="remark" label="备注" ></el-table-column>
        <!-- <el-table-column prop="operation"  label="操作" width="180">
          <template slot-scope="scope">
             <el-button
              type="text"
              size="mini"
              @click="stop(scope.row,scope.$index)"
            >暂停</el-button>
            <el-button type="text"  size="mini" @click="onEdit(scope.row)" >修改</el-button>
            <el-button
              type="text"
              size="mini"
              @click="onDelete(scope.row,scope.$index)"
            >废弃</el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <pagination
        :pageTotal="pageTotal"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
      ></pagination>
      <el-dialog
        :visible.sync="isVisible"
        title="滴速设置"
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
            <el-form-item prop="realName" label="滴速设定:">
              <el-input type="text" v-model="form.rateValue" class=" inputInneI inputInneII " placeholder="请输入" ></el-input>
               <el-select v-model="form.rateUnit"  placeholder="请选择" class="inputInneII">
                  <el-option
                    v-for="item in rateUnits"
                    :key="item.id"
                    :label="item.value"
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
    </div>
  </div>
</template>

<script>
// import AddFundDialog from "./alert/addFundDialog";
// import EditFundDialog from "./alert/editFundDialog";
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
      rateUnits:[
        {id:"1",value:"ml/h"},
        {id:"2",value:"dtt/min"}
      ],
       rules: {
        // realName: [ { required: true, message: '用户姓名不能为空', trigger: 'blur' }],
        // username: [{ required: true, validator: validatePass, trigger: "blur" }],
      },
      isVisible:false,
      form: {
        dateTime:"",
        rateValue:"",
        rateUnit:"",
      },
     multipleSelection: [],
     option:"",
     doctorAdvice:"",
     adName:"",
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
      doctorAdvices:[
        {label:"全部医嘱类型",value:""},
        {label:"饮食",value:"1"},
        {label:"护理",value:"2"},
        {label:"药物",value:"3"},
        {label:"治疗",value:"4"},
        {label:"嘱托",value:"5"},
        {label:"检验",value:"6"},
        {label:"检查",value:"7"},
     ],
      tableData: [],
      orderIds:[],
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
      setTimeout(this.loadData,100)
    // this.loadData();
  },
  methods: {
    //  checkboxInit(row,index){
    //     if (row.orderStatus!="确认") {//你需要判断的条件
    //       return 0;//不可勾选
    //     }else{
    //       return 1;//可勾选
    //     }
    //   },
    searchName(){
       this.loadData()
    },
    synchro(){

    },
      changgeStatus(){
        this.loadData()
      },
      changeAdvice(){
        this.loadData()
      },
      onSubmit(){
        let url = "/api/icu/advice/updateOrderData"
        let params = {

        }
        this.$axios.post(global.url+url,params).then((res)=>{
          if(res.data.msg==201){
            this.$message({
              type:"success",
              message:"修改成功"
            })
            this.isVisible=false
          }else{
            this.$message.error(res.data.content)
          }

        })
      //   this.$confirm("确认要执行医嘱"+this.multipleSelection[0].orderText+"吗?", "提示", {
      //   type: "warning"
      // })
      //   .then(() => {
      //     let params = { 
      //       recordId:this.recordId,//病患id
      //       executeTime:this.form.dateTime,
      //       orderId:this.multipleSelection[0].orderSn,//医嘱id
      //       orderNo:this.multipleSelection[0].orderNo      //医嘱组号
      //       };
      //       console.log(params)
      //     let url = "/api/icu/advice/executeAdvice";
      //     this.$axios.post(global.url + url,params).then(response => {
      //       if (response.msg == 201) {
      //         this.$message({
      //           message: "拆分成功",
      //           type: "success"
      //         });
      //         this.isVisible = false
      //         this.loadData();
      //       } else {
      //        this.$message.error(response.data.content)
      //       }
      //     });
      //   })
      //   .catch(() => {});

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
      this.adName=""
      this.doctorAdvice=""
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
        orderText:this.adName,
        recordId:this.recordId,
        orderStatus:this.option,
        orderClass:this.doctorAdvice,
        pageNum: this.incomePayData.page,
        pageSize: this.incomePayData.limit,
      };
      let url = "/api/icu/advice/getOriginalAdvicelist";
      this.$axios.post(global.url + url,params).then(function (res) {
        let arr = res.data.respData.list;
        // debugger
        if(arr.length){
          for(var i=0;i<arr.length;i++){
            // if(arr[i].orderStatus==1){
            //   arr[i].orderStatus="转抄"
            // }else if(arr[i].orderStatus==2){
            //   arr[i].orderStatus="停止"
            // }
            // else if(arr[i].orderStatus==3){
            //   arr[i].orderStatus="确认"
            // }
            // else if(arr[i].orderStatus==4){
            //   arr[i].orderStatus="执行"
            // }
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
    // 编辑操作方法
    onEdit(row) {
      this.isVisible = true
      this.form.dateTime = row.startTime
      this.form.rateValue = row.dose
      this.form.rateUnit = row.doseUnit

    },
    //暂停
    stop(row){
      this.orderIds=[]
      let url = "/api/icu/advice/pauseAdvice"
      if(this.tableData.length>0){
        for(let i=0;i<this.tableData.length;i++){
          if(row.orderNo==this.tableData[i].orderNo){
            this.orderIds.push(this.tableData[i].id)
          }
        }
      }
      let params = {
        recordId:this.recordId,
        // executeTime:row.executeTime,
        orderIds:this.orderIds,
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
    },
    // 废弃
    onDelete(row) {
      this.$confirm("确认废弃该液体吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.orderIds=[]
          let url = "/api/icu/advice/discard"
          if(this.tableData.length>0){
            for(let i=0;i<this.tableData.length;i++){
              if(row.orderNo==this.tableData[i].orderNo){
                this.orderIds.push(this.tableData[i].id)
              }
            }
          }
          let params = {
            // executeTime:row.executeTime,
            orderIds:this.orderIds,
            // orderNo:row.orderNo,
            orderType:row.orderType,
            recordId:this.recordId
          }
          this.$axios.post(global.url+url,params).then((res)=>{
            if(res.data.msg==201){
               this.$message({
                message: "废弃成功",
                type: "success"
              });
               this.loadData();
            }else{
              this.$message.error(res.data.content)
            }
          })
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="scss">
.fillcontain_longAdvice{
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



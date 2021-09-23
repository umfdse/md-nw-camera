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
           <!-- <el-button type="primary" @click="isVisible=true">开始执行</el-button> -->
        </el-form-item>
           <el-form-item class="btnLeft">
           <el-button  @click="orderSplit()">医嘱拆分</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table_container">
      <el-table v-loading="loading" :data="tableData" style="width: 100%"  :span-method="objectSpanMethod" border  ref="multipleTable" tooltip-effect="dark" @selection-change="handleSelectionChange">
          <div slot="empty" class="noData"></div>
        <!-- <el-table-column type="selection" :selectable='checkboxInit' width="55"></el-table-column> -->
        <el-table-column prop="orderNo" label="组号" ></el-table-column>
        <el-table-column prop="orderText" label="医嘱名称" ></el-table-column>
        <el-table-column prop="dose" label="剂量" ></el-table-column>
          <el-table-column prop="doseUnit" label="剂量单位" ></el-table-column>
        <el-table-column prop="useMethod" label="使用方法"  ></el-table-column>
        <el-table-column prop="frequencyId" label="使用频次" ></el-table-column>
        <el-table-column prop="orderStatus" label="执行情况" ></el-table-column>
         <el-table-column prop="orderDoctorName" label="开立医生" ></el-table-column>
         <el-table-column prop="startTime" label="开始时间" ></el-table-column>
         <el-table-column prop="endTime" label="停止时间" ></el-table-column>
         <el-table-column prop="remark" label="备注" ></el-table-column>
        <!-- <el-table-column prop="operation"  label="操作" width="180">
          <template slot-scope="scope">
             <el-button
              type="text"
              size="mini"
              @click="enable(scope.row,scope.$index)"
            >启用</el-button>
            <el-button type="text"  size="mini" @click="onEdit(scope.row)" >角色绑定</el-button>
            <el-button
              type="text"
              size="mini"
              @click="onDelete(scope.row,scope.$index)"
            >用户注销</el-button>
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
            <el-form-item prop="realName" label="泵速/滴速:">
              <el-input type="text" v-model="form.speed" class="inputInner" placeholder="请输入" ></el-input>
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
       rules: {
        // realName: [ { required: true, message: '用户姓名不能为空', trigger: 'blur' }],
        // username: [{ required: true, validator: validatePass, trigger: "blur" }],
      },
      spanArr: [],//用于存放每一行记录的合并数
      pos:0,
      isVisible:false,
      form: {
        dateTime:"",
        speed:"",
      },
     multipleSelection: [],
     option:"",
     doctorAdvice:"",
     options:[
        {label:"全部执行情况",value:""},
        {label:"转抄",value:"1"},
         {label:"停止",value:"2"},
        {label:"确认",value:"3"},
        {label:"执行",value:"4"}
     ],
    //  doctorAdvices:[
    //     {label:"全部医嘱",value:""},
    //     {label:"已执行",value:"2"},
    //     {label:"确认",value:"3"},
    //     {label:"作废",value:"4"}
    //  ],

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
    //  checkboxInit(row,index){
    //     if (row.orderStatus!="确认") {//你需要判断的条件
    //       return 0;//不可勾选
    //     }else{
    //       return 1;//可勾选
    //     }
    //   },
      getSpanArr(data) {
          // data就是我们从后台拿到的数据
        for (var i = 0; i < data.length; i++) {
          if (i === 0) {
            this.spanArr.push(1);
            this.pos = 0;
          } else {
            // 判断当前元素与上一个元素是否相同
            if (data[i].orderNo === data[i - 1].orderNo) {
              this.spanArr[this.pos] += 1;
              this.spanArr.push(0);
            } else {
              this.spanArr.push(1);
              this.pos = i;
            }
          }
          console.log(this.spanArr);
        }
      },
     objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0 ) {
          const _row = this.spanArr[rowIndex];
          const _col = _row > 0 ? 1 : 0;
          console.log(`rowspan:${_row} colspan:${_col}`);
          return {
            // [0,0] 表示这一行不显示， [2,1]表示行的合并数
            rowspan: _row,
            colspan: _col
          };
        }
      },
      changgeStatus(){
        this.loadData()
      },
      onSubmit(){
        this.multipleSelection[0].orderText
        this.$confirm("确认要执行医嘱"+this.multipleSelection[0].orderText+"吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          let params = { 
            recordId:this.recordId,//病患id
            executeTime:this.form.dateTime,
            orderId:this.multipleSelection[0].orderSn,//医嘱id
            orderNo:this.multipleSelection[0].orderNo      //医嘱组号
            };
            console.log(params)
          let url = "/api/icu/advice/executeAdvice";
          this.$axios.post(global.url + url,params).then(response => {
            if (response.msg == 201) {
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
        orderStatu:this.option,
        pageNum: this.incomePayData.page,
        pageSize: this.incomePayData.limit,
      };
      let url = "/api/icu/advice/getOriginalAdvicelist";
      this.$axios.post(global.url + url,params).then(function (res) {
        let arr = res.data.respData.list;
        // debugger
        if(arr.length){
          for(var i=0;i<arr.length;i++){
            if(arr[i].orderStatus==1){
              arr[i].orderStatus="转抄"
            }else if(arr[i].orderStatus==2){
              arr[i].orderStatus="停止"
            }
            else if(arr[i].orderStatus==3){
              arr[i].orderStatus="确认"
            }
            else if(arr[i].orderStatus==4){
              arr[i].orderStatus="执行"
            }
            for(var j=i+1;j<arr.length;j++){
              if(arr[i].orderNo==arr[j].orderNo){
                arr[j].orderNo=""
              }
            }
         
          }
        }
        that.tableData = res.data.respData.list;
        that.pageTotal = res.data.respData.total;
        that.getSpanArr(that.tableData)
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
      this.editFundDialog.dialogRow = { ...row };
      // this.showAddFundDialog();
      this.editFundDialog.show = true;
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
    // 删除数据
    onDelete(row) {
      this.$confirm("确认注销该用户吗?", "提示", {
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



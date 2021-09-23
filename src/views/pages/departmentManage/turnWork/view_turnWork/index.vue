<template>
  <div class="fillcontain_record">
    <div class="search_container searchArea">
      <el-form
        :inline="true"
        :model="search_data"
        :rules="rules"
        ref="search_data"
        class="demo-form-inline search-form"
        @submit.native.prevent
      >
        <el-form-item class="btnLeft">
          <el-date-picker v-model="search_data.shiftDate" type="date" placeholder="选择日期" format="yyyy-MM-dd"  value-format="yyyy-MM-dd" @change="timeChange">
          </el-date-picker>
         
        </el-form-item>
          <el-form-item class="btnLeft">
             <el-select v-model="search_data.shiftType" clearable @change="typeChange">
            <el-option
              v-for="item in turnWorks"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          </el-form-item>
        <el-form-item class="btnLeft">
          <el-input
            v-model="search_data.shiftNurseName"
            placeholder="请输入交班人工号或姓名搜索"
            @keyup.enter.native="onScreeoutMoney('search_data')"
          >
           <i
            class="el-icon-search searchIcon"
            slot="suffix"
            @click="search">
          </i></el-input>
        </el-form-item>
        <!-- <el-form-item class="btnRight">
          <el-button type="primary" @click="addUser()">新建用户</el-button>
        </el-form-item> -->
      </el-form>
    </div>
    <div class="table_container">
      <el-table v-loading="loading"  :data="tableData" style="width: 100%">
       <div slot="empty" class="noData"></div>
        <el-table-column  label="交班日期" >
           <template slot-scope="scope">
             <span>{{scope.row.shiftDate}}({{scope.row.shiftTimePeriod}})</span>
           </template>
        </el-table-column>
        <el-table-column prop="shiftType" label="交班类型" >
           <template slot-scope="scope">
              <span v-if="scope.row.shiftType == 1">科室交班</span>
              <span v-else-if="scope.row.shiftType == 2">重点患者交班</span>
               <span v-else-if="scope.row.shiftType == 3">死亡交班</span>
                <span v-else-if="scope.row.shiftType == 4">新病人交班</span>
                 <span v-else-if="scope.row.shiftType == 5">特殊病人交班</span>
              <span v-else>未知</span>
            </template>
        </el-table-column>
        <el-table-column prop="shiftUserName" label="交班人" ></el-table-column>
        <el-table-column prop="shiftContent" label="交班内容" ></el-table-column>
        <el-table-column prop="operation"  label="操作" width="180" align="center"><template slot-scope="scope">
            <el-button
              type="text"
              icon="edit"
              size="mini"
              @click="onView(scope.row)"
              >查看详情</el-button
            >
            <el-button
              type="text"
              icon="edit"
              size="mini"
              @click="onExport(scope.row)"
              >导出</el-button
            >
            <!-- <el-button
              type="danger"
              icon="delete"
              size="mini"
              @click="onDelete(scope.row, scope.$index)"
              >删除</el-button
            > -->
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :pageTotal="pageTotal"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
      ></pagination>
      <addFundDialog
        v-if="addFundDialog.show"
        :isShow="addFundDialog.show"
        :dialogRow="addFundDialog.dialogRow"
        @getFundList="loadData"
        @closeDialog="hideAddFundDialog"
      ></addFundDialog>
      <editFundDialog
        v-if="editFundDialog.show"
        :isEditShow="editFundDialog.show"
        :dialogEditRow="editFundDialog.dialogRow"
        @getFundList="loadData"
        @closeEditDialog="hideEditFundDialog"
      ></editFundDialog>
    </div>
  </div>
</template>

<script>
import AddFundDialog from "./alert/addFundDialog";
import EditFundDialog from "./alert/editFundDialog";
import Pagination from "@/components/pagination";
export default {
  components: {
    AddFundDialog,
    EditFundDialog,
    Pagination,
  },
  data() {
    return {
      turnWorks: [
        { label: "全部交班", value: "" },
        { label: "科室交班", value: "1" },
        { label: "重点患者交班", value: "2" },
      ],
      activeName: "third",
      roleId: "",
      isUserInfo: true,
      rolePermission: true,
      roleName: "",
      roleUserName: "",
      search_data: {
        shiftDate: "",
        shiftNurseName: "",
        shiftType: "",
      },
      rules: {
        name: [{ required: true, message: "请输入机械类型", trigger: "blur" }],
      },
      tableData: [],
      tableHeight: 0,
      loading: true,
      isShow: false,
      isEditShow: false,

      sortnum: 0,
      addFundDialog: {
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
    this.loadData();
  },
  methods: {

    onView(row){
      console.log(row)
      this.$router.push({
        path:"/department/detail",
        query:{
          newTime:row.shiftDate,
          shiftTimePeriod:row.shiftTimePeriod,
          shiftType:row.shiftType,
          }
        })
    },
    onExport(row){
      //  let url="/api/icu/transition/queryTransitionReport"
           window.location.href = row.templateUrl
          
    },
    search(){
      this.loadData()
    },
    addUser() {
      this.addFundDialog.show = true;
    },
    timeChange(){
      this.loadData()
    },
    typeChange(){
      this.loadData()
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
      this.loading =  false;
      let that = this
       let url1 = '/api/icu/transition/queryTransitionRecord'
      let param1 = {
        "hospitalCode": "",
        "pageNum": this.incomePayData.page,
        "pageSize": this.incomePayData.limit,
        "shiftDate":this.search_data.shiftDate,
        "shiftType":this.search_data.shiftType,
        "keyWord":this.search_data.shiftNurseName,
        "shiftClass":1
      }
      this.tableData = []
      this.$axios.post(global.url + url1,param1).then((response)=>{
        let res = response.data
        if(res.msg=="201"){
            console.log(res)
            that.tableData = res.respData.list
            that.pageTotal = res.respData.total;
        }
      })
    },
    hideAddFundDialog() {
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
};
</script>

<style lang="scss">
.fillcontain_record{
  width: 100%;
  height: 100%;
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
.el-form-item{
  margin-bottom: 0;
}
.pagination {
  text-align: right;
  margin-top: 10px;
}
.search_container {
  position: relative;
  width: 100%;
  height: 32px;
  margin-top: 24px;
  /* margin-bottom: 20px; */
}
.btnLeft {
  float: left;
  margin-left: 15px !important;
  // margin-top: 24px;
  /* margin-bottom:20px; */
}
.btnRight {
  float: right;
  // margin-top: 24px;
  margin-right: 10px !important;
}
.searchArea {
  background: rgba(255, 255, 255, 1);
  border-radius: 2px;
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
</style>



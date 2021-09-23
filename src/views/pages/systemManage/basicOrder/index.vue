<template>
  <div class="observation">
    <!-- <div class="pageSearch">
      <el-input
        v-model="hisAdministration"
        class="obserInput"
        placeholder="请输入原始医嘱执行方式搜索"
      >
        <i class="el-icon-search searchIcon" slot="suffix" @click="loadData">
        </i>
      </el-input>
      <button
        type="button"
        class="el-button el-button--default"
        @click="resetFun"
      >
        重置
      </button>
    </div> -->
     <div class="search_container searchArea">
      <el-form
        :inline="true"
        :model="search_data"
        ref="search_data"
        class="demo-form-inline search-form"
        @submit.native.prevent
      >
        <el-form-item class="btnLeft">
          <el-input
            v-model="search_data.hisAdministration"
            placeholder="请输入原始医嘱执行方式搜索"
            class="inputInner"
          >
          <i
            class="el-icon-search searchIcon"
            slot="suffix"
            @click="loadData">
          </i>
          </el-input>
        </el-form-item>
         <el-form-item class="btnLeft">
           <el-button  @click="searchDataResert()" >重置</el-button>
        </el-form-item>
         <el-form-item class="btnRight">
           <el-button  @click="sysDeploy()">系统执行方式配置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="obserTable">
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        align="center"
      >
        <el-table-column prop="hisAdministration" label="原始医嘱执行方式" ></el-table-column>
        <el-table-column prop="sortName" label="系统执行方式"  ></el-table-column>
        <el-table-column  label="匹配入量计算">
         <template slot-scope="scope">
              <el-switch
                :disabled="true"
                :active-value="1"
                :inactive-value="0"
                v-model="scope.row.isCalculation"
               >
              </el-switch>
               <!-- <el-switch
               :disabled="true"
              v-else-if="scope.row.isCalculation != 1"
                v-model="scope.row.isCalculation"
               >
              </el-switch> -->
            </template>  
        </el-table-column>
        <el-table-column
          prop="operation"
          align="center"
          label="操作"
          width="180"
        >
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="onEdit(scope.row)" >编辑</el-button>
            <el-button
              type="text"
              size="mini"
              @click="deletTable(scope.row, scope.$index)"
              >删除</el-button
            >
          </template>
        </el-table-column>
        <div v-if="!pageTotal" slot="empty" class="noData"></div>
      </el-table>
     <pagination
        :pageTotal="pageTotal"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
      ></pagination>
        <editFundDialog
        v-if="editFundDialog.show"
        :isEditShow="editFundDialog.show"
        :dialogEditRow="editFundDialog.dialogRow"
        @getFundList="loadData"
        @closeEditDialog="hideEditFundDialog"
      ></editFundDialog>
       <editSysDeployDialog
        v-if="editSysDeployDialog.show"
        :isEditShow="editSysDeployDialog.show"
        :dialogEditRow="editSysDeployDialog.dialogRow"
        @getFundList="loadData"
        @closeEditDialog="hideEditSysDeployDialog"
      ></editSysDeployDialog>
    </div>
  </div>
</template>
<script>
import Pagination from "@/components/pagination";
import EditFundDialog from "./alert/editFundDialog";
import EditSysDeployDialog from "./alert/editSysDeployDialog";
export default {
  data() {
    return {
      search_data:{
        hisAdministration: "",
      },
      loading: true,
      incomePayData: {
        page: 1,
        limit: 10,
        name: ""
      },
      pageTotal: 0,
      tableData: [],
       editFundDialog: {
        show: false,
        dialogRow: {}
      },
      editSysDeployDialog:{
        show: false,
        dialogRow: {}
      }
    };
  },
  components: {
    Pagination,
    EditFundDialog,
    EditSysDeployDialog
  },
  mounted() {
    this.loadData();
  },
  methods: {
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
    loadData() {
      let that = this;
      this.loading = false;
      this.tableData = [];
      let url ="/api/icu/advice/dict/getAdministrationDictData"
      let params={
        pageSize: this.incomePayData.limit,
        pageNum: this.incomePayData.page,
        hisAdministration:this.search_data.hisAdministration
      }
      this.$axios.post(global.url +url,params).then(function (res) {
         that.tableData = res.data.respData.list;
          that.pageTotal = res.data.respData.total;
      });
    },
    hideEditFundDialog() {
      this.editFundDialog.show = false;
    },
    hideEditSysDeployDialog(){
      this.editSysDeployDialog.show = false;
    },
    sysDeploy(){
       this.editSysDeployDialog.show = true;
    },
    onEdit(row){
       this.editFundDialog.dialogRow = { ...row };
      // this.showAddFundDialog();
      this.editFundDialog.show = true;
    },
    // 删除数据
    deletTable(row, index) {
      let that = this;
      that
        .$confirm("确认要删除这条数据吗？", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          let para = { id: row.id };
          let url = "/api/icu/advice/dict/deleteAdministrationDictData/{id}".replace("{id}", para.id);
          that.$axios.post(global.url + url).then(function (res) {
            if (res.data.msg == 201) {
              that.$message({
                type: "success",
                message: res.data.content,
              });
              that.loadData();
            } else if (res.data.msg == 302) {
              that.$message({
                type: "info",
                message: res.data.content,
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    searchDataResert() {
      this.search_data.hisAdministration = "";
      this.incomePayData={
        page: 1,
        limit: 10,
        name: ""
      },
      this.pageTotal = 0
      this.loadData();
    },
  },
};
</script>

<style lang="scss">
.observation {
  .search_container {
  position: relative;
  width:100%;
  height:60px;
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
  .el-table th {
    background: rgba(0, 0, 0, 0.02);
    color: rgba(0, 0, 0, 0.87);
  }
}
</style>
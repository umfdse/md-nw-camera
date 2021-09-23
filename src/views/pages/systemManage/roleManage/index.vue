<template>
  <div class="fillcontain_role">
    <div class="search_container searchArea">
      <el-form
        :inline="true"
        :model="search_data"
        ref="search_data"
        class="demo-form-inline search-form"
        @submit.native.prevent
      >
         <el-form-item class="btnRight">
           <el-button  @click="dataSync()">数据同步</el-button>
        </el-form-item>
         <el-form-item class="btnRight">
           <el-button type="primary" @click="addRole()" v-has="`role:add`">新增角色</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table_container">
      <el-table v-loading="loading" :data="tableData" style="width: 100%" >
        <div slot="empty" class="noData"></div>
        <el-table-column prop="name" label="角色名称" ></el-table-column>
        <el-table-column prop="description" label="角色说明" ></el-table-column>
        <el-table-column prop="menuNames" label="权限内容"  ></el-table-column>
        <el-table-column prop="isEnabled" label="状态" >
           <template slot-scope="scope">
              <span v-if="scope.row.isEnabled == 1">已启用</span>
              <!-- <span v-else-if="scope.row.isEnabled == 2">已停用</span> -->
              <span v-else>已停用</span>
            </template>
        </el-table-column>
        <el-table-column prop="operation"  label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="start(scope.row,scope.$index)"
              v-has="`role:update`"
            >{{scope.row.isEnabled=="1"?"停用":"启用"}}</el-button>
            <el-button type="text" size="mini"  @click="onEdit(scope.row)" v-has="`role:update`" >编辑</el-button>
            <el-button
              type="text"
              size="mini"
              @click="onDelete(scope.row,scope.$index)"
              v-has="`role:delete`"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :pageTotal="pageTotal"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
      ></pagination>
      <addFundDialog  v-if="addFundDialog.show" :isShow="addFundDialog.show" :dialogRow="addFundDialog.dialogRow"  @getFundList="loadData"  @closeDialog="hideAddFundDialog"></addFundDialog>
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
    Pagination
  },
  data() {
    return {
      roleId:"",
      isUserInfo:true,
      rolePermission:true,
      roleName:'',
      roleUserName:"",
      search_data: {
        tel: "",
        name: ""
      },
      tableData: [],
      tableHeight: 0,
      loading: true,
      isShow: false,
      isEditShow: false,

      sortnum: 0,
      addFundDialog: {
        show: false,
        dialogRow: {}
      },
      editFundDialog: {
        show: false,
        dialogRow: {}
      },
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
    this.loadData();
  },
  methods: {
    addRole(){
       this.addFundDialog.show = true;
    },
    dataSync(){
      alert("该按钮暂未开放功能！")
    },
    onScreeoutMoney(searchForm) {
      this.$refs[searchForm].validate(valid => {
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

      this.loading = false;
      let that= this
      let params = {
        pageNum: this.incomePayData.page,
        pageSize: this.incomePayData.limit,
      };
      let url = "/base/role/list";
      this.$axios.post(global.url + url,params).then(function (res) {
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
      this.editFundDialog.dialogRow = { ...row };
      // this.showAddFundDialog();
      this.editFundDialog.show = true;
    },
    start(row){
      let that = this
      if(row.isEnabled=="1"){
        this.$confirm("确认停用该角色吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          let para = { id: row.roleId};
          let url ="/base/role/enbale/{roleId}/{status}".replace('{roleId}',para.id).replace('{status}',"0");
          this.$axios.post(global.url + url).then(function (res) {
            let response = res.data
              if (response.msg == 201) {
              that.$message({
                message: "停用成功",
                type: "success"
              });
              that.loadData();
            } else {
              that.$message.error(res.data.content)
            }
      });
        })
        .catch(() => {});
      }else{
        this.$confirm("确认启用该角色吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          let para = { id: row.roleId };
          let url ="/base/role/enbale/{roleId}/{status}".replace('{roleId}',para.id).replace('{status}',"1");
          this.$axios.post(global.url + url).then(function (res) {
            let response = res.data
              if (response.msg == 201) {
              that.$message({
                message: "启用成功",
                type: "success"
              });
              that.loadData();
            } else {
              that.$message.error(res.data.content)
            }
      });
        })
        .catch(() => {});
      }
    },
    // 删除数据
    onDelete(row) {
      this.$confirm("确认删除该角色吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          let para = { id: row.roleId };
          let url = '/base/role/delete/{roleId}'.replace('{roleId}',para.id)
          this.$axios.post(global.url + url).then( (response) => {
            if (response.data.msg == 201) {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.loadData();
            } else {
              that.$message.error(response.data.content)
            }
          });
        })
        .catch(() => {});
    }
  }
};
</script>

<style  lang="scss">
.fillcontain_role{
      width: 100%;
      height: 100%;
      padding:10px;
      box-sizing: border-box;

    .table_container {
       width: 100%;
      height: 100%;
      overflow-y: auto;
       padding: 20px;
      box-sizing: border-box;
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
    .el-input__inner{
      background-color: #fff;
    }
    .searchArea {
      background: rgba(255, 255, 255, 1);
      border-radius: 2px;
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



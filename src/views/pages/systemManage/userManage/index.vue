<template>
  <div class="fillcontain_user">
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
            v-model="search_data.realName"
            placeholder="请输入用户工号或姓名搜索"
            class="inputInner"
          >
          <!-- <i
            class="el-icon-search searchIcon"
            slot="suffix"
            @click="search">
          </i> -->
          </el-input>
        </el-form-item>
        <el-form-item class="btnLeft">
          <el-date-picker v-model="search_data.updateTime" type="date" placeholder="选择日期" class="inputInner" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item class="btnLeft">
           <el-button type="primary" @click="searchData()" >查询</el-button>
        </el-form-item>
         <el-form-item class="btnLeft">
           <el-button  @click="searchDataResert()" >重置</el-button>
        </el-form-item>
         <el-form-item class="btnRight">
           <el-button type="primary" @click="addUser()" v-has="`user:add`">新建用户</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table_container">
      <el-table v-loading="loading" :data="tableData" style="width: 100%" >
        <div slot="empty" class="noData"></div>
        <el-table-column prop="username" label="用户工号" ></el-table-column>
        <el-table-column prop="realName" label="用户姓名" ></el-table-column>
        <el-table-column prop="deptName" label="所属科室"  ></el-table-column>
        <el-table-column prop="updateTime" label="更新时间" ></el-table-column>
        <el-table-column prop="roleName" label="用户角色" ></el-table-column>
         <el-table-column prop="enabledName" label="状态" ></el-table-column>
        <el-table-column prop="operation"  label="操作" width="180">
          <template slot-scope="scope">
             <el-button
              v-has="`user:update`"
              type="text"
              size="mini"
              @click="enable(scope.row,scope.$index)"
            >{{scope.row.isEnabled==1?"停用":"启用"}}</el-button>
            <el-button type="text"  size="mini" @click="onEdit(scope.row)" v-has="`user:update`">编辑</el-button>
            <el-button
              type="text"
              size="mini"
              @click="onDelete(scope.row,scope.$index)"
               v-has="`user:delete`"
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
      search_data: {
        realName:"",
        updateTime:""

      },
      tableData: [],
      tableHeight: 0,
      loading: true,
      isShow: false,
      isEditShow: false,

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
    addUser(){
       this.addFundDialog.show = true;
      // this.$router.push({path:'/demo'})
    },
    searchData(){
      this.loadData();
    },
    searchDataResert(){
      this.search_data.realName=""
      this.search_data.updateTime=""
      this.loadData();
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
      let that = this;
      let params={
          pageSize: this.incomePayData.limit,
          pageNum: this.incomePayData.page,
          updateTime:this.search_data.updateTime,
          userName:this.search_data.realName
      }
       let url = "/base/user/list";
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
    enable(row){
      let that = this
      if(row.isEnabled==1){
        this.$confirm("确认停用该用户吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          let para = { id: row.id};
          let url ="/base/user/enbale/{userId}/{status}".replace('{userId}',para.id).replace('{status}',"0");
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
        this.$confirm("确认启用该用户吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          let para = { id: row.id };
          let url ="/base/user/enbale/{userId}/{status}".replace('{userId}',para.id).replace('{status}',"1");
          this.$axios.post(global.url + url).then(function (res) {
            let response = res.data
              if (response.msg == 201) {
              that.$message({
                message: "启用成功",
                type: "success"
              });
              that.loadData();
            } else {
              console.log(response.message);
            }
      });
        })
        .catch(() => {});
      }
      
    },
    // 删除数据
    onDelete(row) {
      this.$confirm("确认删除该用户吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          let para = { id: row.id };
          let url = "/base/user/delete/{userId}".replace("{userId}", para.id);
         this.$axios.post(global.url + url).then( (response) => {
            if (response.data.msg == 201) {
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

<style lang="scss" >
.fillcontain_user{
  width: 100%;
  // height: 100%;
  overflow-y: auto;
  padding:10px;
.inputInner{
  width:224px;
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



<template>
  <div class="pipecontain">
    <div class="search_container searchArea">
      <div>
        <span class="title">当前科室:<span class="content">{{deptName}}</span></span>
      </div>
      <div>
        <el-button type="primary" @click="addFun()">新增导管</el-button>
      </div>
    </div>
    <div class="table_container">
      <el-table v-loading="loading" :data="tableData" style="width: 100%" align="center">
        <el-table-column prop="type" label="导管分类" align="center">
            <template slot-scope="scope">
               <div v-for="(item,index) in positionList" :key="index">
                  <div v-if="item.value==scope.row.location">
                     <div v-for="(item2,index2) in positionList[index].date" :key="index2">
                        <span v-if="item2.value==scope.row.type">
                            {{item2.name}}
                        </span>
                       </div>
                  </div>
              </div>
            </template>
        </el-table-column>
        <el-table-column prop="name" label="导管名称" align="center"></el-table-column>
        <el-table-column prop="location" label="部位" align="center" >
          <template slot-scope="scope">
              <div v-for="(item,index) in positionList" :key="index">
                  <span v-if="item.value==scope.row.location">
                    {{item.name}}
                  </span>
              </div>
            </template>
        </el-table-column>
        <el-table-column prop="limits" label="管路期限(天)" align="center" ></el-table-column>
        <el-table-column prop="color" label="引流液颜色" align="center" ></el-table-column>
        <el-table-column prop="property" label="引流液性质" align="center" ></el-table-column>
        <el-table-column prop="operation" align="center" label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="onEdit(scope.row)" >修改</el-button>
            <el-button
              type="text"
              size="mini"
              @click="deletTable(scope.row,scope.$index)"
            >删除</el-button>
          </template>
        </el-table-column>
         <div v-if="!page.pageTotal" slot="empty" class="noData" ></div>
      </el-table>
      <pagination
        :pageTotal="page.pageTotal"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
      ></pagination>   
    </div>
    <el-dialog :title="this.isEdit?'编辑导管':'新增导管'" :visible.sync="addPipeFlag" width="30%" class="tab_dialog" :close-on-click-modal="false">
        <add-pipe ref="addPipe" @submit='closeFun' :positionList="positionList"></add-pipe>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/pagination";
import addPipe from './alert/addPipe';
import {getSessionData} from "@/utils/SimpleSessionStorageService.js";
export default {
  data() {
    return {
      deptName:'',
      tableData: [],
      tableHeight: 0,
      loading: true,
      sortnum: 0,
      positionList:[],
      typeList:[],
      page:{
        pageTotal: 0,
        pageNum:1,
        pageSize:10,
      },
      isEdit:false,
      addPipeFlag:false
      // 用于列表查询
    };
  },
  components: {
    Pagination,
    addPipe
  },
  created(){
    this.getconfigData();
  },
  mounted() {
    this.deptName = getSessionData('deptName') ? getSessionData('deptName'): ''
    this.loadData();
  },
  methods: {
    closeFun(flag){
      this.addPipeFlag = false;
      if(flag==1){
      this.loadData();
      }
    },
    addFun(){
        let that = this;
        this.addPipeFlag = true;
        this.isEdit = false;
        that.$nextTick(function(){
           that.$refs.addPipe.clearData();
        })
    },
    // 获取列表数据
    loadData() {
      let that = this;
      this.loading = true;
      this.tableData = [];
       let url = "/base/cannula/query?pageNum="+this.page.pageNum+'&pageSize='+this.page.pageSize;
      this.$axios.get(global.url + url).then(function (res) {
        that.loading = false;
        that.tableData = res.data.respData.list;
        that.page.pageTotal = res.data.respData.total;
      });
    },
     getconfigData() {
      let that = this;
      let url = "/base/cannula/configuration";
      that.$axios.get(global.url + url).then(function (res) {
        that.positionList = res.data.respData.location;
      });
    },
    // 上下分页
    handleCurrentChange(val) {
      this.page.pageNum = val;
      this.loadData();
    },
    // 每页显示多少条
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.loadData();
    },
    // 编辑操作方法
    onEdit(row) {
      this.isEdit = true;
      this.addPipeFlag = true;
      this.$nextTick(()=>{
          this.$refs.addPipe.getInitData(row.id);
      })
    },
    // 删除数据
     deletTable(row, index) {
      let that = this;
      this.$confirm("确认要删除这条数据吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let url = "/base/cannula/delete/" + row.id;
          that.$axios.post(global.url + url).then(function (res) {
            if(res.data.msg==201){
                that.$message({
                type: "success",
                message: "删除成功",
              });
              that.loadData();
            }else{
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
  }
};
</script>

<style lang="scss">
  .pipecontain{
    .el-table th{
      background: rgba(0, 0, 0, 0.02);
      color: rgba(0, 0, 0, 0.87);
    }
  }
</style>

<style lang="scss" scoped>
.pipecontain{
  width: 100%;
  height: 100%;
  padding:10px 0;
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
.table_container {
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
  color: rgba(0, 0, 0, 0.6);
  padding: 5px 0px 15px 0;
  .content{
    margin-left: 10px;
  }

}
.btnLeft {
  float: left;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
}

</style>

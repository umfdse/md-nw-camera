<template>
  <div class="drain">
    <div class="drain_top">
      <div>
        <span>导管名称：</span>
        <span>{{cannulaName}}</span>
        </div>
      <el-button type="primary" @click="addFun" :disabled="status==3">新增数据</el-button>
    </div>
    <div class="drain_table">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="drainageTime" label="记录日期">
        </el-table-column>
        <el-table-column prop="drainageColour" label="引流液颜色"></el-table-column>
        <el-table-column prop="property" label="引流液性状"> </el-table-column>
                <el-table-column prop="drainageAmount" label="引流剂量(mL)">
        </el-table-column>
        <!-- <el-table-column prop="cannulaName" label="导管名称"></el-table-column> -->
        <el-table-column prop="skinStatus" label="周围皮肤情况">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div>
              <el-button
                @click.native.prevent="editTable(scope.$index, scope.row)"
                type="text"
                size="mini"
                >编辑</el-button
              >
              <el-button
                @click.native.prevent="deletTable(scope.$index, scope.row)"
                type="text"
                size="mini"
                >删除</el-button
              >
            </div>
          </template>
        </el-table-column>
        <div v-if="!page.pageTotal" slot="empty" class="noData"></div>
      </el-table>
      <pagination
        v-if="page.pageTotal > 0"
        :pageTotal="page.pageTotal"
        ref="pagination"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
      >
      </pagination>
    </div>
    <el-dialog
      width="30%"
      :title="title"
      :visible.sync="innerVisible"
      :close-on-click-modal="false"
      append-to-body
      class="drain"
    >
      <add-drain
        @submit="closeDialog"
        ref="addDrain"
        :propertyList="propertyList"
        :drainageColourList="drainageColourList"
        :cannulaName="cannulaName"
        :outhosTime="outhosTime"
      ></add-drain>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/pagination";
import addDrain from "./addtab5_4";
export default {
  name: "addtab5_3",
  components: {
    Pagination: Pagination,
    addDrain: addDrain,
  },
  props:['outhosTime'],
  data() {
    return {
      page: {
        pageTotal: 0,
        pageNum: 1,
        pageSize: 10,
      },
      title: "新增引流液记录",
      cannulaId: null, //管道ID
      tableData: [],
      innerVisible: false,
      propertyList: [],
      drainageColourList: [],
      cannulaName: null,
      status:null,
    };
  },
  methods: {
    initFun(row) {
      let that = this;
      that.cannulaId = row.id;
      that.status = row.status;//3代表拔管
      that.page.pageTotal = 0;
      that.page.pageNum = 1;
      that.page.pageSize = 10;
      that.getConfig();
      that.getTableData();
    },
    closeDialog(flag) {
      this.innerVisible = false;
      if (flag == 1) {
        this.getTableData();
      }
    },
    editTable(index, row) {
      let that = this;
      that.innerVisible = true;
      that.title = "编辑引流液记录";
      that.$nextTick(function () {
        that.$refs.addDrain.editInit(row.id);
      });
    },
    deletTable(index, row) {
      let that = this;
      this.$confirm("确认要删除这条数据吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let url = "/api/icu/pipe/drainage/" + row.id + "/delete";
          that.$axios.post(global.url + url).then(function (res) {
            if(res.data.msg==201){
                that.$message({
                  type: "success",
                  message: res.data.content,
                });
                that.getTableData();
            }else{
                  that.$message({
                        message: res.data.content,
                        type: "info",
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
    getConfig() {
      let that = this;
      let url =
        "/api/icu/pipe/drainage/configuration?cannulaId=" + that.cannulaId;
      that.$axios.get(global.url + url).then(function (res) {
        if(res.data.msg==201){
          that.propertyList = res.data.respData.property;
          that.drainageColourList = res.data.respData.color;
          that.cannulaName = res.data.respData.cannulaName;
        }else{
           that.$message({
                message: res.data.content,
                type: "info",
              });
        }
      });
    },
    getTableData() {
      let that = this;
      that.tableData = [];
      let url =
        "/api/icu/pipe/" +
        that.cannulaId +
        "/drainage?pageNum=" +
        that.page.pageNum +
        "&pageSize=" +
        that.page.pageSize;
      that.$axios.get(global.url + url).then(function (res) {
        that.tableData = res.data.respData.list;
        that.page.pageTotal = res.data.respData.total;
      });
    },
    addFun() {
      let that = this;
      that.innerVisible = true;
      that.title = "新增引流液记录";
      that.$nextTick(function () {
        that.$refs.addDrain.init(that.cannulaId);
      });
    },
    // 上下分页
    handleCurrentChange(val) {
      this.page.pageNum = val;
      this.getTableData();
    },
    // 每页显示多少条
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.getTableData();
    },
  },
};
</script>

<style lang="scss">
.drain {
  .el-dialog__header {
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  }
  .drain_top {
    display: flex;
    justify-content: space-between;
    padding-bottom: 15px;
    color: #212121;
    font-weight: 600;
  }
  .el-table {
    th.is-leaf {
      background: rgba(0, 0, 0, 0.02);
      color: #212121;
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
}
</style>

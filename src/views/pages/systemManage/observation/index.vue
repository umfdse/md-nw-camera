<template>
  <div class="observation">
    <div class="pageSearch">
      <el-input
        v-model="searchText"
        class="obserInput"
        placeholder="请输入项目名称搜索"
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
    </div>
    <div class="obserTable">
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        align="center"
      >
        <el-table-column
          prop="project"
          label="项目"
          align="left"
          width="180"
        ></el-table-column>
        <el-table-column prop="content" label="内容" align="left" width="180">
          <template slot-scope="scope">
            <div v-if="scope.row.content">
              {{ scope.row.content }}
            </div>
            <div v-else>－</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="state"
          label="情况"
          align="left"
        ></el-table-column>
        <el-table-column
          prop="operation"
          align="center"
          label="操作"
          width="180"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="deletTable(scope.row, scope.$index)"
              >删除</el-button
            >
          </template>
        </el-table-column>
        <div v-if="!page.pageTotal" slot="empty" class="noData"></div>
      </el-table>
      <pagination
        :pageTotal="page.pageTotal"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
      ></pagination>
    </div>
  </div>
</template>
<script>
import Pagination from "@/components/pagination";
export default {
  data() {
    return {
      searchText: "",
      loading: false,
      page: {
        pageTotal: 0,
        pageNum: 1,
        pageSize: 10,
      },
      tableData: [],
    };
  },
  components: {
    Pagination,
  },
  mounted() {
    this.loadData();
  },
  methods: {
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
    loadData() {
      let that = this;
      this.loading = true;
      this.tableData = [];
      let url =
        "/base/nurse/observation/list?pageNum=" +
        this.page.pageNum +
        "&pageSize=" +
        this.page.pageSize +
        "&name=" +
        that.searchText;
      this.$axios.get(global.url + url).then(function (res) {
        that.loading = false;
        that.tableData = res.data.respData.list;
        that.page.pageTotal = res.data.respData.total;
      });
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
          let url = "/base/nurse/observation/delete/" + row.id;
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
    resetFun() {
      this.searchText = "";
      this.page={
        pageTotal: 0,
        pageNum: 1,
        pageSize: 10,
      },
      this.loadData();
    },
  },
};
</script>

<style lang="scss" scoped>
.observation {
  .pageSearch {
    display: flex;
    padding: 0 !important;
    height: 64px;
    align-items: center;
    .obserInput {
      width: 224px;
      margin-right: 10px;
    }
    .searchIcon {
      margin-top: 9px;
      cursor: pointer;
    }
  }
}
</style>
<style lang="scss">
.observation {
  .el-table th {
    background: rgba(0, 0, 0, 0.02);
    color: rgba(0, 0, 0, 0.87);
  }
}
</style>
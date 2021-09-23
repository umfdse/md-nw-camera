<template>
  <div>
    <div class="pageSearch">
      <el-input
        v-model="searchText"
        class="obserInput"
        placeholder="请输入名称搜索"
      >
        <i class="el-icon-search searchIcon" slot="suffix" @click="loadData(1)">
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
    <div class="pageTable">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="diagnosisCode" label="代码"> </el-table-column>
        <el-table-column prop="diagnosisTest" label="名称"> </el-table-column>
        <el-table-column prop="mnemonic" label="助记符"> </el-table-column>
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
  name: "idc9",
  components: {
    Pagination,
  },
  data() {
    return {
      searchText: "",
      tableData: [],
      page: {
        pageTotal: 0,
        pageNum: 1,
        pageSize: 10,
      },
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    resetFun() {
      let that = this;
      that.searchText = "";
      that.page.pageNum = 1;
      that.page.pageSize = 10;
      that.page.pageTotal = 0;
      that.loadData();
    },
    loadData(num) {
      let that = this;
      let obj = {};
      if (num) {
        obj.pageNum = 1;
        obj.pageSize = 10;
        that.page.pageTotal = 0;
      } else {
        obj.pageNum = that.page.pageNum;
        obj.pageSize = that.page.pageSize;
      }
      obj.diagnosisTest = that.searchText;
      obj.icdType = 1;
      let url = "/base/diagnosis/queryDiagnosisDictList";
      that.$axios.post(global.url + url, obj).then(function (res) {
        that.tableData = res.data.respData.list;
        that.page.pageTotal = res.data.respData.total;
      });
    },
    handleCurrentChange(val) {
      this.page.pageNum = val;
      this.loadData();
    },
    // 每页显示多少条
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.loadData();
    },
  },
};
</script>
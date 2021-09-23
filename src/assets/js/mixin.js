export const tableDataMixin = {
  data() {
    return {
      pageNum: 1,
      pageSize: 10,
      pageSizes: [10, 20, 50],
      total: 0,
      sortName: '',
      sortValue: '',
      pagination: true,
      paginationDisabled:false,
      multipleSelection: [],
    }
  },
  mounted() {
    if (this.$refs.searchForm) {
      let _this = this
      // enter键查询
      this.$refs.searchForm.$el.onkeydown = function(e) {
        let key = window.event.keyCode
        if (key === 13) {
          _this.getTableData()
        }
      }
    }
  },
  methods: {
    search() {
      this.tableData.loading = true
      this.pageNum = 1
      this.getTableData()
    },
    handleSizeChange(val) {
      this.pageNum = 1
      this.pageSize = val
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.getTableData()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleRowClick(row, event, column) {
      this.$refs.table.toggleRowSelection(row)
    },

    dealTableResponse(res) {
      this.tableData.loading = false
      if (res.msg ===201) {
        this.tableData.body = res.respData.list
        this.pageNum = res.respData.pageNum > 0 ? res.respData.pageNum : 1
        this.pageSize = res.respData.pageSize
        this.total = res.respData.total
      } else {
        this.$message.error(res.content)
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.searchTableData()
    }
  }
}

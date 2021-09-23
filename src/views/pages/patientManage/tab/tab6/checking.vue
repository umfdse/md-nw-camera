<template>
  <div class="checkingWrapper">
    <div class="main">
      <div class="pageSearch">
        <span>护理时间: {{nursingTime}}</span>
        <el-input class="search" v-model="searchForm.name"  placeholder="请输入药物名称搜索">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
        </el-input>
      </div>
      <div class="pageContent">
        <table-mixin  :pageSize="pageSize" :pageNum="pageNum" :total="total" :pagination="pagination"
                      :handleSizeChange="handleSizeChange" :handleCurrentChange="handleCurrentChange">
          <el-table v-loading="tableData.loading" :data="tableData.body" @selection-change="handleSelectionChange">
            <div slot="empty" class="noData"></div>
            <el-table-column type="selection"></el-table-column>
            <el-table-column v-for="(item,index) in tableData.head" :prop="item.key" :label="item.name"
                             align="left" :formatter="formatter"
                             :key="index" show-overflow-tooltip>
            </el-table-column>
          </el-table>
        </table-mixin>
      </div>
    </div>
  </div>
</template>
<script>
  import {tableDataMixin} from '../../../../../assets/js/mixin'
  export default {
    name: "medicalRecords",
    mixins: [tableDataMixin],
    props: ['patientInfo','idList'],
    data() {
      return {
        pagination: true,
        tableData: {
          loading: false,
          head: [
            {
              name: '检验类型',
              key: 'name'
            },
            {
              name: '内容',
              key: 'itemValue'
            },
            {
              name: '时间',
              key: 'createTs'
            }
          ],
          body: [],
          option: [],
          condition: [],
          recordTime:''
        },
        searchForm: {
          name:''
        },
        resIdList:[]
      }
    },
    mounted() {

    },
    methods: {
      //初始化数据
      initData(nursingTime) {
        this.nursingTime = nursingTime
        this.search()
      },
      getTableData() {
        let param = {
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          recordId:this.patientInfo.record.recordId,
          name:this.searchForm.name
        }
        this.$axios({
          url: global.url + '/api/icu/lis/queryLisList',
          method: 'get',
          headers: {
            'Content-Type': 'application/json'
          },
          params: param
        }).then((res) => {
          let data = res.data
          if (data.msg == 201) {
            this.dealTableResponse(data)
          } else {
            this.$message({
              message: data.content,
              type: 'warning'
            });
          }
        });
      },
      formatter(row, column, cellValue, index) {
        let formatValue = cellValue
        if(column.property == 'itemValue'){
          formatValue ? (formatValue = formatValue + ' ' + row.unit) : ''
        }
        return formatValue
      },
    }
  }
</script>
<style lang="scss">
  .checkingWrapper {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    .el-button{
      margin-right: 16px;
      margin-left: 0;
    }
    .el-table th{
      background: rgba(0, 0, 0, 0.02);
      color: rgba(0, 0, 0, 0.87);
    }
    .main {
      height: 100%;
      background: #FFFFFF;
      box-sizing: border-box;
      .pageSearch{
        display: flex;
        padding: 0 !important;
        position: relative;
        height: 30px;
        align-items: center;
        color: rgba(0, 0, 0, 0.87);
        font-weight: bold;
        .search{
          float: right;
          position:absolute;
          right: 0;
          top:0;
          .el-icon-search{
            cursor: pointer;
          }
        }
        .el-input{
          width: 224px;
        }
      }
    }
  }
</style>

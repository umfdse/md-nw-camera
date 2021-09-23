<template>
  <div class="medicalRecordsWrapper">
    <div class="main">
      <div class="pageSearch">
        <span>护理时间: {{nursingTime}}</span>
        <el-input class="search" v-model="searchForm.medicineName"  placeholder="请输入药物名称搜索">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
        </el-input>
      </div>
      <div class="pageContent">
        <table-mixin  :pageSize="pageSize" :pageNum="pageNum" :total="total" :pagination="pagination"
                      :handleSizeChange="handleSizeChange" :handleCurrentChange="handleCurrentChange">
          <el-table v-loading="tableData.loading" ref="medicalRecordsTable" :data="tableData.body" @selection-change="handleSelectionChange">
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
    props: ['patientInfo','nursingTime'],
    data() {
      return {
        pagination: true,
        tableData: {
          loading: false,
          head: [
            {
              name: '药物名称',
              key: 'medicationName'
            },
            {
              name: '剂量',
              key: 'medicationAmount'
            },
            {
              name: '用药方式',
              key: 'takeMedicineMethod'
            },
            {
              name: '用药时间',
              key: 'medicationTime'
            }
          ],
          body: [],
          option: [],
          condition: [],
          recordTime:''
        },
        searchForm: {
          medicineName:''
        },
        resIdList:[],
        takeMedicineOptions:[{
          label:'口服',
          value:1
        },{
          label:'静脉',
          value:2
        },{
          label:'泵入',
          value:3
        },{
          label:'皮下注射',
          value:4
        },{
          label:'停用',
          value:5
        },{
          label:'肌肉注射',
          value:6
        },{
          label:'雾化',
          value:7
        },{
          label:'直肠给药',
          value:8
        },{
          label:'关节腔给药',
          value:9
        },{
          label:'引道给药',
          value:10
        }],
    /*    nursingTime:''*/
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
          data:{
            patientRecordId:this.patientInfo.record.recordId,
            medicationName:this.searchForm.medicineName
          }
        }
        this.$axios({
          url: global.url + '/api/nursing/measures/useDrugList',
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          data: param
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
        if (column.property == 'takeMedicineMethod') {
          this.takeMedicineOptions.forEach(item=>{
            if(formatValue==item.value){
              formatValue = item.label
            }
          })
        }
        return formatValue
      }
    }
  }
</script>
<style lang="scss">
  .medicalRecordsWrapper {
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

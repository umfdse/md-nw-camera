<template>
  <div class="nursing-grading-detail">
    <!-- <div class="header">
      <div class="location">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item class="location-other" :to="{ path: '/patient' }">患者管理</el-breadcrumb-item>
          <el-breadcrumb-item class="location-other" :to="{ path: '/patient/list',query:{patientId:$route.query.patientId}}">护理评分</el-breadcrumb-item>
           <el-breadcrumb-item class="location-other" :to="{ path: ''}">护理评分</el-breadcrumb-item>
           <el-breadcrumb-item class="location-other" :to="{ path: '' }">{{title}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div> -->
    <div class="main">
      <div class="title">
        <i class="el-icon-back" @click="goBack"></i>
        <span class="t">{{title}}统计</span>
        <div style="float: right">
          <el-date-picker
            v-model="time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            @change="getData"
    
            value-format="yyyy-MM-dd"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
      </div>
      <div class="chart">
        <div class="myChart" id="myChart"></div>
      </div>
      <div class="title">
        <span class="t">{{title}}数据</span>
        <div style="float: right">
          <el-button type="primary" @click="add" v-has="`score:add`">新增评估</el-button>
        </div>
      </div>
       <div class="echart_table_content">
      <el-table
        :data="tableData"
        v-loading="loading"
      
        height="calc(100% - 48px - 48px - 280px)"
        style="width: 100%">
          <!-- :header-cell-style="{background:'rgba(0, 0, 0, 0.02)',color:'rgba(0, 0, 0, 0.87)',height: '54px', 'font-weight': '500'}"
        :row-style="{height: '54px', color: 'rgba(0, 0, 0, 0.87)'}" -->
        <div slot="empty" class="nodata">
          <img src="/static/img/nodata.png">
        </div>
          <el-table-column prop="updateTs" label="评估时间" min-width="20%"/>
          <el-table-column prop="result" label="评估结果" min-width="30%"/>
          <el-table-column prop="realName" label="执行人" min-width="30%"/>
          <el-table-column label="操作" min-width="20%">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="upd(scope.row)" v-has="`score:update`">编辑</el-button>
              <el-button type="text" size="small" @click="del(scope.row)"  v-has="`score:delete`">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
       </div>
    </div>
    <create-dialog ref="createDialog" @sub="getData" />
  </div>
</template>

<script>
import createDialog from './createDialog'
export default {
  components: { createDialog },
  data() {
    return {
      title: '疼痛分级',
      formCode: '',
      patientRecordId: '',
      time: [],
      tableData: [],
      loading: false,
      labelList: [
        {
          // formCode: 'MYPP',
          // options: [
          //   { value: '0', label: '0度' },
          //   { value: '5', label: 'I度' },
          //   { value: '10', label: 'II度' },
          //   { value: '15', label: 'III度' },
          //   { value: '20', label: 'IV度' },
          // ]
        },
        {
          formCode: 'Killip',
          options: [
            { value: '1', label: 'I级' },
            { value: '2', label: 'II级' },
            { value: '3', label: 'III级' },
            { value: '4', label: 'IV级' },
          ]
        },
        {
          formCode: 'Phle',
          options: [
            { value: '0', label: '0级' },
            { value: '1', label: '1级' },
            { value: '2', label: '2级' },
            { value: '3', label: '3级' },
          ]
        },
        {
          formCode: 'SLLB',
          options: [
            { value: '1', label: 'I级' },
            { value: '2', label: 'II级' },
            { value: '3', label: 'III级' },
          ]
        },
        {
          formCode: 'AASA',
          options: [
            { value: '1', label: '轻度' },
            { value: '2', label: '中度' },
            { value: '3', label: '重度' },
          ]
        },
        {
          formCode: 'CCOS',
          options: [
            { value: '1', label: '轻度' },
            { value: '2', label: '中度' },
            { value: '3', label: '重度' },
            { value: '4', label: '极重度' },
          ]
        },
        {
          formCode: 'MMRC',
          options: [
            { value: '1', label: '轻度' },
            { value: '2', label: '中度' },
            { value: '3', label: '重度' },
            { value: '4', label: '极重度' },
          ]
        },
      ]
    }
  },
  mounted() {
    this.title = this.$route.query.formName
    this.formCode = this.$route.query.formCode
    this.patientRecordId = this.$route.query.patientRecordId
    console.log(this.$route.query)
    this.getData()
  },
  methods: {
     goBack(){
          //  this.$router.go(-1)
          this.$router.push({
            path: '/patient/list',
            query: {
              patientId:this.$route.query.patientId
            }
         
          })
        },
    getData() {
      const params = {
        patientRecordId: this.patientRecordId,
        formCode: this.formCode,
        sourceType:"1",
      }
      if (this.time && this.time.length === 2) {
        params.startTime = this.time[0] + ' 00:00:00'
        params.endTime = this.time[1] + ' 23:59:59'
      }
      this.loading = true
      this.$axios({
        url: global.url + '/score/queryScoreListDetails',
        method: 'post',
        data: params
      }).then((res) => {
        if (res.data && res.data.msg === 201) {
          this.tableData = res.data.respData.list || []
          this.initMap()
        } else {
          this.$message.error(res.data.content);
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },
    add() {
      this.$refs.createDialog.init(this.formCode, 'add', this.patientRecordId)
    },
    del(row) {
       this.$confirm("确认删除这条数据吗?", "提示", {
        type: "warning",
      }).then(()=>{
        this.$axios({
        url: global.url + '/score/deleteScoreRecord/' + row.id,
        method: 'post',
        data: {
          answerId: row.id
        }
      }).then((res) => {
        if (res.data && res.data.msg === 201) {
          this.$message.success("删除成功")
          this.getData()
        } else {
          this.$message.error(res.data.content)
        }
      })
      }).catch(()=>{})  
    },
    upd(row) {
      this.$refs.createDialog.init(this.formCode, 'update', this.patientRecordId, row.id)
    },
    initMap() {
      const data_time = []
      const data = []
      this.tableData.forEach(i => {
        data_time.push(i.createTs)
        data.push(i.score)
      })
      const myChart = this.echarts.init(document.getElementById('myChart'));
      const option = {
        grid:{
          left:50,
          top:30,
          right:30,
          bottom:30
        },
        xAxis: {
          type: 'category',
          data: data_time.reverse(),
          // boundaryGap: false,
          axisLabel: {
            show: true,
            color: "rgba(0, 0, 0, 0.45)",
          },
          axisTick: {
            show: false
          },
        },
        yAxis: {
          type: 'value',
          nameLocation: 'center',
          nameGap: 40,
          name: this.title,
          nameTextStyle: {
            color: 'rgba(0, 0, 0, 0.65)'
          },
          minInterval: 1,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: true,
            color: "rgba(0, 0, 0, 0.45)",
            formatter: (value, index) => {
              // 处理换算逻辑
              const item = this.labelList.find(i => i.formCode === this.formCode)
              if (item) {
                const _item = item.options.find(i => i.value == value)
                if (_item) {
                  return _item.label
                }
              }
              console.log(item, item)
              return value
            }
          }
        },
        series: [{
          data: data.reverse(),
          type: 'line',
          label: {
            show: true,
            position: 'top',
            color: 'rgba(0, 0, 0, 0.45)'
          },
          itemStyle: {
            color: '#7972F3',
            left:20,
          }
        }]
      };
      // 绘制图表
      myChart.setOption(option);
    }
  }
}
</script>

<style lang="scss">
.nursing-grading-detail{
  padding-top:24px;
  width: 100%;
  height: 100%;
  background: #F5F5F5;
  box-sizing: border-box;
  .header{
    height: 40px;
    display: flex;
    align-items: center;
    padding-left: 24px;
    .location {
      font-size: 12px;
      .location-other {
        color: rgba(0, 0, 0, 0.38);
      }
      .location-current {
        color: rgba(0, 0, 0, 0.87);
      }
    }
  }
  .main {
    background: #FFFFFF;
    height: calc(100% - 40px - 24px);
    margin: 0 24px;
    padding: 24px 32px;
    box-sizing: border-box;
    .title{
      line-height: 32px;
      margin-bottom: 16px;
        .el-icon-back {
          font-weight: bold;
          font-size: 20px;
          color: rgba(0, 0, 0, 0.87);
          cursor: pointer;
        }
      .t{
        font-size: 16px;
        font-weight: bold;
        margin-left: 8px;
        color: rgba(0, 0, 0, 0.87);
      }
    }
    .myChart{
      height: 280px;
      width: 100%;
    }
  }
  .nodata{
    padding: 100px 0;
    img{
      width: 234px;
    }
  }
  .echart_table_content {
    .el-table th {
      background: rgba(0, 0, 0, 0.02);
      color: #212121;
    }
  }
}
</style>
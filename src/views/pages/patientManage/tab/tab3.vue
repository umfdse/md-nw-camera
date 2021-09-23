<template>
  <div class="xutang">
    <div chass="echart_img">
      <div class="echart_img_top">
        <div class="echart_img_title title">
          {{ "血糖走势统计（" + dateTime + "）" }}
        </div>
        <div class="echart_img_date">
          <el-date-picker
            v-model="dateTime"
            type="date"
            placeholder="选择日期"
            size="small"
            align="left"
            :clearable="false"
            :default-value="new Date()"
            style="width: 100%"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
             @change="getLisFun"
          >
          </el-date-picker>
        </div>
      </div>
      <div
        id="echart_img_main3"
        style="width: 100%; height: 300px;"
      ></div>
    </div>
    <div class="echart_table">
      <div class="echart_table_top">
        <div class="table_top_title title">血糖数据（{{dateTime}}）</div>
        <div class="table_top_btn">
          <el-button type="primary" size="small" @click="addFun" v-has="`sugar:add`" :disabled="isDisabled"
            >新增数据</el-button
          >
        </div>
      </div>
      <div class="echart_table_content" v-has="`sugar:change`">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="inoutTime" label="时间" width="180">
          </el-table-column>
          <el-table-column prop="bloodSugarValue" label="血糖值" width="180">
          </el-table-column>
          <el-table-column label="药物名称/用量">
            <template slot-scope="scope">
                <div>
                  <span>{{scope.row.medicationName}}</span>
                  <span v-if="scope.row.medicationName&&scope.row.medicationAmount">/</span>
                  <span v-if="scope.row.medicationAmount">{{scope.row.medicationAmount}}{{scope.row.dosageUnit}}</span>
                </div>
            </template>
          </el-table-column>
          <el-table-column label="药物用法">
            <template slot-scope="scope">
                <div v-for="(item,index) in configList" :key="index">
                    <div v-if="item.value==scope.row.takeMedicineMethod">
                      {{item.name}}
                    </div>
                </div>
            </template>
          </el-table-column>
          <el-table-column prop="recorder" label="执行人"> </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <div>
                <el-button
                  @click.native.prevent="editTable(scope.$index, scope.row)"
                  type="text"
                  size="mini"
                  v-has="`sugar:update`"
                  :disabled="isDisabled"
                  >编辑</el-button
                >
                <el-button
                  @click.native.prevent="deletTable(scope.$index, scope.row)"
                  type="text"
                  size="mini"
                  v-has="`sugar:delete`"
                  :disabled="isDisabled"
                  >删除</el-button>
              </div>
            </template>
          </el-table-column>
          <div v-if="tableData.length==0" slot="empty" class="noData" ></div>
        </el-table>
      </div>
    </div>
    <el-dialog :title="title" :visible.sync="addFlag" width="30%" class="tab_dialog" :close-on-click-modal="false">
      <add-data @submit="addSubmit" ref="addData" @refresh="getLisFun" :recordId="patientRecordId" :outhosTime="outhosTime"></add-data>
    </el-dialog>
  </div>
</template>
<script>
import addData from "./alert/addtab3_1";
export default {
  name: "tab3",
  props:['patientInfo','isDisabled'],
  components: {
    addData: addData,
  },
  computed:{
     patientRecordId(){
      return this.patientInfo.record.recordId;
    },
    outhosTime(){
      if(String(this.patientInfo.record.indeptFlag)==="0"){
          return this.patientInfo.record.outdeptTime;
      }else{
         return null;
      }
    }
  },
  data() {
    return {
      dateTime: null,
      addFlag: false,
      tableData: [],
      option: {
          xAxis: {
            type: "category",
            data: [],
          },
          yAxis: {
             type: "value",
               nameGap: 30,
          minInterval: 5,
              nameLocation: 'center',
              name: '血糖',
              nameTextStyle: {
                color: 'rgba(0, 0, 0, 0.65)'
              },
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                show: true,
                color: "rgba(0, 0, 0, 0.45)"
              }
          },
          grid: {
          left:50,
          top:30,
          right:0,
          bottom:30
            },
          color:['#7972F3'],
          series: [
            {
              data: [],
              type: "line",
            },
          ],
        },
      configList: [],
      title:null,
    };
  },
  created() {
  },
  mounted() {
    let that = this;
     window.addEventListener("resize",that.chartFun);
  },
  beforeDestroy(){
    let that = this;
    window.removeEventListener("resize",that.chartFun);
  },
  methods: {
    getConfigData() {
      let that = this;
      let url = "/api/icu/bloodSugar/configuration";
      this.$axios.get(global.url + url).then(function (res) {
        that.configList = res.data.respData.method;
      });
    },
    initData(){
      this.getConfigData();
      this.getNowTime();
      this.getLisFun();
    },
    getNowTime(){
        let myDate = new Date();
        let year = myDate.getFullYear();
        let month = (myDate.getMonth()+1)<10?'0'+(myDate.getMonth()+1):(myDate.getMonth()+1);
        let date = myDate.getDate()<10?'0'+myDate.getDate():myDate.getDate();
        this.dateTime = year+'-'+month+'-'+date;
    },
    deletTable(index, row) {
      let that = this;
      this.$confirm("确认要删除这条数据吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let url ="/api/icu/bloodSugar/deleteBloodSugarRecord/" + row.id;
          that.$axios.post(global.url+url).then(function (res) {
            that.$message({
              type: "success",
              message: res.data.content,
            });
            that.getLisFun();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    editTable(index, row) {
      console.log(global.url);
      let that = this;
      that.title = '编辑血糖数据';
      that.addFlag = true;
      that.$nextTick(function () {
        that.$refs.addData.getInitData(row.id,false);
      });
    },
    getAmoutData() {
      let that = this;
      let url = "/api/icu/inout/configuration";
      this.$axios.get(global.url+url).then(function (res) {
        that.sourceList = res.data.respData;
      });
    },
    getLisFun() {
      let that = this;
      // that.getAmoutData();
      let url ="/api/icu/bloodSugar/getBloodSugarList?patientRecordId="+that.patientRecordId+"&dateTime=" +this.dateTime;
      this.$axios.get(global.url+url).then(function (res) {
        that.tableData = res.data.respData.data;
        let list = res.data.respData.chartData.bloodSugar;
        let xList = [];
        let yList = [];
        list.forEach(function(item,index){
            xList.push(item.x);
            yList.push(item.y);
        })
         that.option.xAxis.data = xList;
         that.option.series[0].data = yList;
        that.chartFun();
      });
    },
    addFun() {
      this.addFlag = true;
      this.title = '新增血糖数据';
      this.$nextTick(function(){
        this.$refs.addData.clearData();
      })
    },
    addSubmit(type) {
      this.addFlag = false;
    },
    chartFun() {
      let that = this;
      let myChart = this.echarts.init(
        document.getElementById("echart_img_main3")
      );
      // 指定图表的配置项和数据
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(that.option);
      myChart.resize();
    },
  },
};
</script>

<style lang="scss">
.xutang {
  .el-dialog {
    min-width: 500px;
  }
  .noData {
        margin:50px auto;
        background-image: url("/static/img/noData_table.png");
        width: 234px;
        height: 224px;
        background-size: 100%;
        background-repeat: no-repeat;
        padding: 0;
      }
  .title{
    font-size: 16px;
    color: rgba(0, 0, 0, 0.87);
    font-weight: bold;
  }
  .echart_img_top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .echart_img_title {
      font-size: 16px;
    }
  }
  .echart_table_top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    .table_top_title {
      font-size: 16px;
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

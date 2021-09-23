<!-- 生命体征 -->
<template>
  <div class="vitlSign">
    <div class="echart_img">
      <div class="echart_img_top">
        <div class="echart_img_title">
          <el-radio-group v-model="type">
            <el-radio-button
              v-for="(item, index) in typeList"
              :key="index"
              :label="item.value"
              >{{ item.text }}</el-radio-button
            >
          </el-radio-group>
        </div>
        <div class="echart_img_date">
          <el-date-picker
            v-model="dateTime"
            type="date"
            placeholder="选择日期"
            size="small"
            align="left"
            :default-value="new Date()"
            style="width: 100%"
            format="yyyy-MM-dd"
            :clearable="false"
            value-format="yyyy-MM-dd"
            @change="changeTime"
          >
          </el-date-picker>
        </div>
      </div>
      <div class="title" v-if="type != 5">
        {{ typeList[type - 1].text }}统计 {{ "（" + dateTime + "）" }}
      </div>
      <div
        v-if="type != 5"
        id="echart_img_main"
        style="width: 100%; height: 300px"
      ></div>
    </div>
    <div class="echart_table" v-if="type != 5">
      <div class="echart_table_top">
        <div class="table_top_title title">生命体征数据（{{ dateTime }}）</div>
        <div class="table_top_btn">
          <el-button
            type="primary"
            size="small"
            @click="addFun"
            :disabled="isDisabled"
            v-has="`vital-signs:add`"
            >手动新增</el-button
          >
          <el-button
            type="primary"
            size="small"
            @click="labourFun()"
            v-has="`vital-signs:update`"
            :disabled="isDisabled"
            >自动单次采集</el-button
          >
          <el-button
            type="primary"
            size="small"
            @click="autoFun()"
            v-has="`vital-signs:update`"
            :disabled="isDisabled"
            >自动循环采集</el-button
          >
        </div>
      </div>
      <div class="echart_table_content">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="inputTime" label="时间" width="150">
          </el-table-column>
          <el-table-column
            prop="heartRate"
            label="心率(次/每分)"
            width="150"
            align="right"
          >
          </el-table-column>
          <el-table-column
            prop="breatheRate"
            label="呼吸(次/每分)"
            width="150"
            align="right"
          >
          </el-table-column>
          <el-table-column label="血压(mmHG)" align="right">
            <template slot-scope="scope">
              <div>
                <span>{{ scope.row.systolicBloodPressure }}</span>
                <span
                  v-if="
                    scope.row.systolicBloodPressure &&
                    scope.row.diastolicBloodPressure
                  "
                  >/</span
                >
                <span>{{ scope.row.diastolicBloodPressure }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="oxygenSaturation"
            label="氧饱和度(%)"
            align="right"
          >
          </el-table-column>
          <el-table-column prop="bodyTemperature" label="体温(℃)" align="right">
          </el-table-column>
          <el-table-column
            prop="centralVenousPressure"
            label="CVP(mmH2O)"
            align="right"
          >
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <div>
                <el-button
                  v-has="`vital-signs:update`"
                  @click.native.prevent="editTable(scope.$index, scope.row)"
                  type="text"
                  :disabled="isDisabled"
                  size="mini"
                  >编辑</el-button
                >
                <el-button
                  v-has="`vital-signs:delete`"
                  @click.native.prevent="deletTable(scope.$index, scope.row)"
                  type="text"
                  :disabled="isDisabled"
                  size="mini"
                  >删除</el-button
                >
              </div>
            </template>
          </el-table-column>
          <div v-if="tableData.length == 0" slot="empty" class="noData"></div>
        </el-table>
      </div>
    </div>
    <div v-if="type == 5">
      <div class="echart_table_top">
        <div class="table_top_title title">
          观察项纪录数据（{{ dateTime }}）
        </div>
        <div class="table_top_btn">
          <el-button
            type="primary"
            size="small"
            @click="obaddFun"
            :disabled="isDisabled"
            v-has="`vital-signs:add`"
            >新增数据</el-button
          >
        </div>
      </div>
      <div class="echart_table_content">
        <el-table :data="tableData2" style="width: 100%" border>
          <el-table-column prop="recordTime" label="时间"> </el-table-column>
          <el-table-column label="项目" prop="project"> </el-table-column>
          <el-table-column label="内容">
            <template slot-scope="scope">
              <div
                v-for="(item, index) in scope.row.content"
                :key="index"
                class="borderContent"
              >
                {{ item }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="情况">
            <template slot-scope="scope">
              <div
                v-for="(item, index) in scope.row.state"
                :key="index"
                class="borderContent"
              >
                {{ item }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <div>
                <el-button
                  @click.native.prevent="obEdittable(scope.$index, scope.row)"
                  type="text"
                  size="mini"
                  v-has="`inout:update`"
                  :disabled="isDisabled"
                  >编辑</el-button
                >
                <el-button
                  @click.native.prevent="obDelettable(scope.$index, scope.row)"
                  type="text"
                  size="mini"
                  v-has="`inout:delete`"
                  :disabled="isDisabled"
                  >删除</el-button
                >
              </div>
            </template>
          </el-table-column>
          <div v-if="tableData2.length == 0" slot="empty" class="noData"></div>
        </el-table>
      </div>
    </div>
    <el-dialog
      :title="title"
      :visible.sync="addFlag"
      width="30%"
      class="tab_dialog"
      :close-on-click-modal="false"
    >
      <add-tab
        @submit="addSubmit"
        @refresh="getLisFun"
        ref="addtab01"
        :recordId="patientRecordId"
        :outhosTime="outhosTime"
      ></add-tab>
    </el-dialog>
    <el-dialog
      :title="title2"
      :close-on-click-modal="false"
      :visible.sync="autoFlag"
      width="30%"
      class="tab_dialog"
      @opened="openTab"
      @closed="closeTab2"
    >
      <add-tab2
        @submit="autoSubmit"
        @refresh="getLisFun"
        ref="addtab02"
      ></add-tab2>
    </el-dialog>
    <el-dialog
      title="新增观察项"
      :close-on-click-modal="false"
      :visible.sync="obFlag"
      width="50%"
      class="tab_dialog"
    >
      <add-tab3
        @submit="autoSubmit"
        @refresh="getListData"
        ref="addtab03"
        :outhosTime="outhosTime"
      ></add-tab3>
    </el-dialog>
  </div>
</template>

<script>
import addtab1 from "./alert/addtab1_1";
import addtab2 from "./alert/addtab1_2";
import addtab3 from "./alert/addtab1_3";
export default {
  name: "tab1",
  components: {
    addTab: addtab1,
    addTab2: addtab2,
    addTab3: addtab3,
  },
  props: {
    patientInfo: {
      type: Object,
      default: function () {
        return {};
      },
    },
    isDisabled: {
      type: Boolean,
      default: function () {
        return false;
      },
    },
  },
  data() {
    return {
      collectType: "0",
      dateTime: null,
      addFlag: false,
      autoFlag: false,
      obFlag: false,
      type: "1",
      chart: {
        option: {
          tooltip: {
            trigger: "axis",
          },
          xAxis: {
            type: "category",
            data: [],
          },
          yAxis: {
            type: "value",
            nameLocation: "center",
            nameGap: 30,
            minInterval: 5,
            nameTextStyle: {
              color: "rgba(0, 0, 0, 0.65)",
            },
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: true,
              color: "rgba(0, 0, 0, 0.45)",
            },
          },
          grid: {
            left: 50,
            top: 30,
            right: 0,
            bottom: 30,
          },
          color: ["#7972F3"],
          series: [
            {
              data: [],
              type: "line",
            },
          ],
        },
        option2: {
          tooltip: {
            trigger: "axis",
          },
          grid: {
            x: 50,
            y: 40,
            x2: 50,
            y2: 30, //距离下边的距离
          },
          legend: {
            data: [],
          },
          color: ["#7972F3", "#00D5A5"],
          xAxis: {
            type: "time",
            axisLabel: {
              formatter: function (val) {
                let date = new Date(val);
                let minutes = date.getMinutes();
                minutes = minutes < 10 ? "0" + minutes : minutes;
                let texts = [date.getHours(), minutes];
                return texts.join(":");
              },
            },
          },
          yAxis: {
            type: "value",
          },
          series: [
            {
              type: "line",
              data: [],
            },
            {
              type: "line",
              data: [],
            },
          ],
        },
      },
      typeList: [
        { text: "心率/呼吸", value: "1" },
        { text: "体温", value: "2" },
        { text: "血压", value: "3" },
        { text: "氧饱和度", value: "4" },
        { text: "观察项", value: "5" },
      ],
      tableData: [],
      tableData2: [],
      sourceList: [],
      myChart: null,
      title: "新增生命体征数据",
      title2: null,
    };
  },
  created() {},
  computed: {
    patientRecordId() {
      return this.patientInfo.record.recordId;
    },
    outhosTime() {
      if(String(this.patientInfo.record.indeptFlag)==="0"){
          return this.patientInfo.record.outdeptTime;
      }else{
         return null;
      }
    },
  },
  mounted() {
    let that = this;
    window.addEventListener("resize", that.chartFun);
  },
  watch: {
    type: function (val) {
      if (val == 2 || val == 4) {
        this.echartData();
        this.getLisFun();
      } else if (val == 1 || val == 3) {
        this.bloodData();
        this.getLisFun();
      } else if (val == 5) {
        this.getListData();
      }
    },
  },
  beforeDestroy() {
    let that = this;
    window.removeEventListener("resize", that.chartFun);
  },
  methods: {
    initData() {
      this.getNowTime();
      this.getListData();
    },
    openTab() {
      this.$nextTick(function () {
        this.$refs.addtab02.getInit(this.patientRecordId, this.collectType);
      });
    },
    closeTab2() {
      this.$nextTick(function () {
        this.$refs.addtab02.initData();
      });
    },
    labourFun() {
      this.autoFlag = true;
      this.title2 = "自动单次采集";
      this.collectType = "1";
    },
    autoFun() {
      this.autoFlag = true;
      this.title2 = "自动循环采集";
      this.collectType = "0";
    },
    getNowTime() {
      let myDate = new Date();
      let year = myDate.getFullYear();
      let month =
        myDate.getMonth() + 1 < 10
          ? "0" + (myDate.getMonth() + 1)
          : myDate.getMonth() + 1;
      let date =
        myDate.getDate() < 10 ? "0" + myDate.getDate() : myDate.getDate();
      this.dateTime = year + "-" + month + "-" + date;
      this.changeTime(this.dateTime);
    },
    changeTime(value) {
      if (this.type == 5) {
        this.getListData();
      } else {
        this.getLisFun();
      }
    },
    obEdittable(index, row) {
      this.obFlag = true;
      this.$nextTick(function () {
        this.$refs.addtab03.getInitData(row.id, this.patientRecordId);
      });
    },
    obDelettable(index, row) {
      let that = this;
      that
        .$confirm("确认要删除这条数据吗？", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          let url = "/api/icu/observation/" + row.id + "/delete";
          that.$axios.post(global.url + url, {}).then(function (res) {
            if (res.data.msg == "201") {
              that.$message({
                type: "success",
                message: res.data.content,
              });
              that.getListData();
            }
          });
        })
        .catch(() => {
          that.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    obaddFun() {
      this.obFlag = true;
      this.$nextTick(function () {
        this.$refs.addtab03.getInit(this.patientRecordId);
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
          let url = "/api/icu/vitalSigns/delete/" + row.id;
          that.$axios.post(global.url + url).then(function (res) {
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
      let that = this;
      that.addFlag = true;
      that.title = "修改生命体征数据";
      that.$nextTick(function () {
        that.$refs.addtab01.getInitData(row.id, false);
      });
    },
    getListData() {
      let that = this;
      let url =
        "/api/icu/observation/query?patientRecordId=" +
        that.patientRecordId +
        "&dateTime=" +
        that.dateTime;
      that.$axios.get(global.url + url).then(function (res) {
        if (res.data.msg == 201) {
          that.tableData2 = res.data.respData;
        }
      });
    },
    getLisFun() {
      let that = this;
      if (that.type == 2 || that.type == 4) {
        that.echartData();
      } else {
        that.bloodData();
      }
      let url =
        "/api/icu/vitalSigns?patientRecordId=" +
        that.patientRecordId +
        "&dateTime=" +
        this.dateTime;
      this.$axios.get(global.url + url).then(function (res) {
        that.tableData = res.data.respData;
      });
    },
    addFun() {
      this.addFlag = true;
      this.title = "新增生命体征数据";
      this.$nextTick(function () {
        this.$refs.addtab01.clearData();
      });
    },
    addSubmit(type) {
      this.addFlag = false;
    },
    autoSubmit() {
      this.autoFlag = false;
      this.obFlag = false;
    },

    chartFun() {
      let that = this;
      if(!document.getElementById("echart_img_main")){
          return false;
      }
      let myChart = this.echarts.init(
        document.getElementById("echart_img_main")
      );
      // 指定图表的配置项和数据
      // 使用刚指定的配置项和数据显示图表。

      myChart.clear({});
      if (that.type == 3 || that.type == 1) {
        myChart.setOption(that.chart.option2);
      } else {
        myChart.setOption(that.chart.option);
      }
      myChart.resize();
    },
    echartData() {
      let that = this;
      let url =
        "/api/icu/vitalSigns/chart?patientRecordId=" +
        that.patientRecordId +
        "&dateTime=" +
        this.dateTime +
        "&type=" +
        this.type;
      this.$axios.get(global.url + url).then(function (res) {
        let list = res.data.respData;
        let xList = [];
        let yList = [];
        list.forEach(function (item, index) {
          xList.push(item.x);
          yList.push(item.y);
        });
        if (that.type == 2) {
          that.chart.option.series[0].name = "体温";
        } else if (that.type == 4) {
          that.chart.option.series[0].name = "氧饱和度";
        }
        that.chart.option.xAxis.data = xList;
        that.chart.option.series[0].data = yList;
        that.chartFun();
      });
    },
    bloodData() {
      let that = this;
      let url =
        "/api/icu/vitalSigns/chart/BloodPressure?patientRecordId=" +
        that.patientRecordId +
        "&dateTime=" +
        this.dateTime +
        "&type=" +
        this.type;
      this.$axios.get(global.url + url).then(function (res) {
        if (that.type == 3) {
          that.chart.option2.legend.data = ["收缩压", "舒张压"];
          that.chart.option2.series[0].name = "收缩压";
          that.chart.option2.series[1].name = "舒张压";
          that.chart.option2.series[0].data =
            res.data.respData.chartData.systolicBloodPressure;
          that.chart.option2.series[1].data =
            res.data.respData.chartData.diastolicBloodPressure;
        } else if (that.type == 1) {
          that.chart.option2.legend.data = ["心率", "呼吸"];
          that.chart.option2.series[0].name = "心率";
          that.chart.option2.series[1].name = "呼吸";
          that.chart.option2.series[0].data =
            res.data.respData.chartData.heartRate;
          that.chart.option2.series[1].data =
            res.data.respData.chartData.breatheRate;
        }
        that.chartFun();
      });
    },
  },
};
</script>

<style lang="scss">
.tab_dialog {
  .el-dialog__body {
    padding: 30px 0px 0px 0px;
  }
}
.vitlSign {
  .borderContent {
    min-height: 44px;
    padding: 10px 10px;
    border-bottom: 1px solid #ebeef5;
    margin: 0px -10px;
  }
  .borderContent:last-of-type {
    border-color: transparent;
  }
  .el-radio-button__inner {
    font-size: 14px;
  }
  .noData {
    margin: 50px auto;
    background-image: url("/static/img/noData_table.png");
    width: 234px;
    height: 224px;
    background-size: 100%;
    background-repeat: no-repeat;
    padding: 0;
  }
  .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    background-color: transparent;
    color: #1f71ff;
    border-color: #1f71ff;
  }
  .title {
    font-size: 16px;
    color: rgba(0, 0, 0, 0.87);
    font-weight: bold;
  }
  .el-dialog {
    min-width: 500px;
  }
  .echart_img_table {
    padding: 10px 0px;
  }
  .echart_img_top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 16px;
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
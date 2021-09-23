<template>
  <div class="inOut">
    <div chass="echart_img">
      <div class="echart_img_top">
        <div class="echart_img_title title">
          {{ "出入量数据（" + dateTime + "）" }}
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
            @change="getChangeFun"
          >
          </el-date-picker>
        </div>
      </div>
      <div class="echart_img">
        <div id="echart_img_main2" style="width: 80%; height: 400px"></div>
        <div id="echart_img2" style="width: 20%; height: 400px"></div>
      </div>
    </div>
    <div class="echart_table">
      <div class="echart_table_top">
        <div class="table_top_title title">出入量数据（{{ dateTime }}）</div>
        <div class="table_top_btn">
          <el-button
            type="primary"
            size="small"
            @click="addFun"
            v-has="`inout:add`"
            :disabled="isDisabled"
            >新增数据</el-button
          >
        </div>
      </div>
      <div class="echart_table_content">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="inoutTime" label="时间" width="180">
          </el-table-column>
          <el-table-column prop="inoutType" label="出入量类型" width="180">
            <template slot-scope="scope">
              <div v-if="scope.row.inoutType == 2">入量</div>
              <div v-if="scope.row.inoutType == 1">出量</div>
            </template>
          </el-table-column>
          <el-table-column prop="inoutAmount" label="出入量估计(mL)">
          </el-table-column>
          <el-table-column prop="inoutSource" label="出入量来源">
            <template slot-scope="scope">
              <div v-if="scope.row.inoutType == 2">
                <div v-for="(item, index) in sourceList.inSource" :key="index">
                  <div v-if="item.value == scope.row.inoutSource">
                    {{ item.name }}
                  </div>
                </div>
              </div>
              <div v-if="scope.row.inoutType == 1">
                <div v-for="(item, index) in sourceList.outSource" :key="index">
                  <div v-if="item.value == scope.row.inoutSource">
                    {{ item.name }}
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="inoutColor" label="颜色">
            <template slot-scope="scope">
              <div v-if="scope.row.inoutType == 1">
                <div v-if="scope.row.inoutSource == 5">
                  {{ scope.row.inoutColor }}
                </div>
                <div
                  v-else
                  v-for="(item, index) in sourceList[
                    'inout_color' + scope.row.inoutSource
                  ]"
                  :key="index"
                >
                  <div v-if="item.value == scope.row.inoutColor">
                    {{ item.name }}
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="inoutShape" label="性状/名称">
          </el-table-column>
          <el-table-column prop="nurseName" label="执行人"> </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <div>
                <el-button
                  @click.native.prevent="editTable(scope.$index, scope.row)"
                  type="text"
                  size="mini"
                  v-has="`inout:update`"
                  :disabled="!scope.row.modify"
                  >编辑</el-button
                >
                <el-button
                  @click.native.prevent="deletTable(scope.$index, scope.row)"
                  type="text"
                  size="mini"
                  v-has="`inout:delete`"
                  :disabled="!scope.row.modify"
                  >删除</el-button
                >
              </div>
            </template>
          </el-table-column>
          <div v-if="tableData.length == 0" slot="empty" class="noData"></div>
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
      <add-data
        @submit="addSubmit"
        ref="addData"
        @refresh="getLisFun"
        :recordId="patientRecordId"
        :outhosTime="outhosTime"
        :close-on-click-modal="false"
      ></add-data>
    </el-dialog>
  </div>
</template>
<script>
import addData from "./alert/addtab2_1";
export default {
  name: "tab2",
  props: ["patientInfo", "isDisabled"],
  components: {
    addData: addData,
  },
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
  data() {
    return {
      timeStamp: null,
      dateTime: null,
      addFlag: false,
      dateNowTime: null,
      tableData: [
        {
          inoutTime: "",
          inoutType: "",
        },
      ],
      option2: {
        tooltip: {
          trigger: "axis",
        },
        grid: [
          {
            left: 50,
            right: 10,
            height: "35%",
          },
          {
            left: 50,
            right: 10,
            top: "60%",
            height: "35%",
          },
        ],
        legend: {
          data: [],
        },
        xAxis: [
          {
            type: "category",
            data: ["0点-12点", "12点-24点"],
            gridIndex: 0,
            splitLine: {
              show: true,
            },
          },
          {
            axisLabel: {
              formatter: function (val) {
                return "";
              },
            },
            type: "category",
            data: ["0点-12点", "12点-24点"],
            gridIndex: 1,
            splitLine: {
              show: true,
            },
            position: "top",
          },
        ],
        yAxis: [
          {
            type: "value",
            gridIndex: 0,
            nameGap: 30,
            minInterval: 5,
            nameLocation: "center",
            name: "出量汇总",
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
            splitLine: {
              show: true,
            },
          },
          {
            type: "value",
            gridIndex: 1,
            inverse: true,
            nameGap: 30,
            minInterval: 5,
            nameLocation: "center",
            name: "入量汇总",
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
            splitLine: {
              show: true,
            },
          },
        ],
        color: ["#00D5A5", "#7972F3"],
        series: [
          {
            name: "出量汇总",
            xAxisIndex: 0, //对应哪个 x 轴
            yAxisIndex: 0,
            type: "bar",
            barWidth : 40,
            data: [100,200],
          },
          {
            name: "入量汇总",
            xAxisIndex: 1, //对应哪个 x 轴
            yAxisIndex: 1,
            barWidth : 40,
            type: "bar",
            data: [50, 100],
          },
        ],
      },
      option: {
        tooltip: {
          trigger: "axis",
        },
        grid: [
          {
            left: 50,
            right: 20,
            height: "35%",
          },
          {
            left: 50,
            right: 20,
            top: "60%",
            height: "35%",
          },
        ],
        legend: {
          data: ["出量", "入量"],
        },
        color: ["#00D5A5", "#7972F3"],
        xAxis: [
          {
            type: "time",
            gridIndex: 0,
            splitLine: {
              show: true,
            },
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
          {
            type: "time",
            gridIndex: 1,
            axisLabel: {
              formatter: function (val) {
                let date = new Date(val);
                let minutes = date.getMinutes();
                minutes = minutes < 10 ? "0" + minutes : minutes;
                let texts = [date.getHours(), minutes];
                // return texts.join(":");
                return "";
              },
            },
            position: "top",
          },
          // {
          //   type: "category",
          //   gridIndex: 2,
          //   data: ["12:00", "23:59"],
          //   // data: (function (){
          //   //     let now = null;
          //   //     var res = [];
          //   //     var len = 25;
          //   //     while (len--) {
          //   //         now = len>23?'00:00':len+':'+'00';
          //   //         res.unshift(now);
          //   //     }
          //   //     console.log(res);
          //   //     return res;
          //   // })(),
          //   position: "top",
          // },
          // {
          //   type: "category",
          //   gridIndex: 3,
          //   data: ["12:00", "23:59"],
          // },
        ],
        yAxis: [
          {
            type: "value",
            gridIndex: 0,
            nameGap: 30,
            minInterval: 5,
            nameLocation: "center",
            name: "出量",
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
            splitLine: {
              show: true,
            },
          },
          {
            type: "value",
            gridIndex: 1,
            inverse: true,
            nameGap: 30,
            minInterval: 5,
            nameLocation: "center",
            name: "入量",
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
            splitLine: {
              show: true,
            },
          },
          // {
          //   type: "value",
          //   gridIndex: 2,
          //   position: "right",
          // },
          // {
          //   type: "value",
          //   inverse: true,
          //   gridIndex: 3,
          //   position: "right",
          // },
        ],
        series: [
          {
            name: "出量",
            xAxisIndex: 0, //对应哪个 x 轴
            yAxisIndex: 0,
            type: "line",
            data: [],
            markPoint: {
              symbol: "circle",
              symbolSize: 20,
              label: {
                show: true,
                fontSize: 10,
                formatter: function (params) {
                  return (
                    params.data.coord[3] +
                    " : " +
                    params.data.coord[1] +
                    params.data.coord[2]
                  );
                },
              },
              itemStyle: {
                color: "rgba(178, 59, 59, 1)",
              },
              data: [],
            },
          },
          {
            name: "入量",
            xAxisIndex: 1, //对应哪个 x 轴
            yAxisIndex: 1,
            type: "line",
            data: [],
          },
          // {
          //   name: "出量汇总",
          //   type: "bar",
          //   barWidth: 30,
          //   xAxisIndex: 2, //对应哪个 x 轴
          //   yAxisIndex: 2,
          //   data: [],
          // },
          // {
          //   name: "入量汇总",
          //   type: "bar",
          //   xAxisIndex: 3, //对应哪个 x 轴
          //   yAxisIndex: 3,
          //   barWidth: 30,
          //   data: [],
          // },
        ],
      },
      sourceList: [],
      title: null,
    };
  },
  created() {},
  mounted() {
    let that = this;
    window.addEventListener("resize", that.chartFun);
  },
  beforeDestroy() {
    let that = this;
    if (this.timeStamp) {
      clearInterval(this.timeStamp);
    }
    window.removeEventListener("resize",that.chartFun);
  },
  methods: {
    getChangeFun() {
      if (this.dateNowTime != this.dateTime) {
        if (this.timeStamp) {
          clearInterval(this.timeStamp);
        }
      } else {
        this.pollRequest();
      }
      this.getLisFun();
    },
    pollRequest() {
      let that = this;
      if (that.timeStamp) {
        clearInterval(that.timeStamp);
      }
      this.timeStamp = setInterval(function () {
        that.getChangeFun();
      }, 120000);
      this.$emit("receiveTime", this.timeStamp);
    },
    initData() {
      this.getNowTime();
      this.getLisFun();
      this.pollRequest();
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
      this.dateNowTime = year + "-" + month + "-" + date;
    },
    deletTable(index, row) {
      let that = this;
      this.$confirm("确认要删除这条数据吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let url = "/api/icu/inout/" + row.id + "/delete";
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
      that.title = "编辑出入量数据";
      that.addFlag = true;
      that.$nextTick(function () {
        that.$refs.addData.getInitData(row.id, false);
      });
    },
    getAmoutData() {
      let that = this;
      let url = "/api/icu/inout/configuration";
      this.$axios.get(global.url + url).then(function (res) {
        that.sourceList = res.data.respData;
      });
    },
    getLisFun() {
      let that = this;
      that.getAmoutData();
      let url =
        "/api/icu/inout?patientRecordId=" +
        that.patientRecordId +
        "&dateTime=" +
        this.dateTime;
      this.$axios.get(global.url + url).then(function (res) {
        that.tableData = res.data.respData.data;
        that.option.series[0].data = res.data.respData.chartData.out;
        that.option.series[1].data = res.data.respData.chartData.in;
        let useDrug = res.data.respData.useDrug;
        that.option.series[0].markPoint.data = [];
        let maxLengthArr = [];
        useDrug.forEach(function (item, index) {
          that.option.series[0].markPoint.data.push({
            coord: [
              item.time,
              item.medicationAmount,
              item.dosageUnit,
              item.medicationName,
            ],
          });
          maxLengthArr.push(item.medicationAmount);
        });
        let ouTotal = res.data.respData.chartData.ouTotal;
        that.option2.series[0].data = [];
        ouTotal.forEach(function (item, index) {
          that.option2.series[0].data.push(item[1]);
        });
        //   that.option.series[2].data[12]=ouTotal[0][1];
        //  that.option.series[2].data[24]=ouTotal[1][1];
         let inTotal = res.data.respData.chartData.inTotal;
         that.option2.series[1].data = [];
        inTotal.forEach(function (item, index) {
          that.option2.series[1].data.push(item[1]);
        });
        let maxList = that.option2.series[0].data.concat(
          that.option2.series[1].data
        ).concat(maxLengthArr);
        that.maxlength = Math.max.apply(null, maxList);
        that.option.yAxis[0].max = that.maxlength;
        that.option.yAxis[1].max = that.maxlength;
        that.option2.yAxis[0].max = that.maxlength;
        that.option2.yAxis[1].max = that.maxlength;
        that.chartFun();
      });
    },
    addFun() {
      this.addFlag = true;
      this.title = "新增出入量数据";
      this.$nextTick(function () {
        this.$refs.addData.clearData();
      });
    },
    addSubmit(type) {
      this.addFlag = false;
    },
    chartFun() {
      this.initEchart("echart_img_main2", this.option);
      this.initEchart("echart_img2", this.option2);
    },
    initEchart(parma, option) {
      let myChart = this.echarts.init(document.getElementById(parma));
      // 指定图表的配置项和数据
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
      myChart.resize();
    },
  },
};
</script>

<style lang="scss">
.inOut {
  .el-dialog {
    min-width: 500px;
  }
  .echart_img {
    display: flex;
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
  .title {
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

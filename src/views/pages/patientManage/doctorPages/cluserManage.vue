<template>
  <div class="cluserManage">
    <div v-if="show">
      <div class="treatHistory">
      <span>历史记录：</span>
      <el-select
        v-model="historyValue"
        placeholder="请选择"
        style="width: 300px"
        @change="changeHistroy"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.name"
          :value="item.value"
          >{{ item.name }}</el-option>
      </el-select>
    </div>
    <div class="treatPlan">
      <div class="treatPlan_left">
        <div class="plan_title">3h集束化治疗完成进度</div>
        <div class="plan_process">
          <div class="plan_steps">
            <div
              class="plan_step"
              v-for="(item, index) in finishedConditionThree"
              :key="index"
            >
              <div class="step_head">
                <div class="step_line">
                  <!-- <i class="step_line_inner"></i> -->
                </div>
                <div
                  class="step_icon"
                  :class="{
                    step_success: item.value == 1,
                    step_timeOut: item.value == 2,
                    step: item.value != 0,
                  }"
                >
                  <i
                    v-if="item.value == 1 || item.value == 2"
                    class="step_icon_inner el-icon-check"
                  ></i>
                </div>
              </div>
              <div class="step_main">
                <div class="step_title">
                  {{ item.name }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="treatPlan_right">
        <div class="plan_title">6h集束化治疗完成进度</div>
        <div class="plan_process">
          <div class="plan_steps">
            <div
              class="plan_step"
              v-for="(item, index) in finishedConditionSix"
              :key="index"
            >
              <div class="step_head">
                <div class="step_line">
                  <!-- <i class="step_line_inner"></i> -->
                </div>
                <div
                  class="step_icon"
                  :class="{
                    step_success: item.value == 1,
                    step_timeOut: item.value == 2,
                    step: item.value != 0,
                  }"
                >
                  <i
                    v-if="item.value == 1 || item.value == 2"
                    class="step_icon_inner el-icon-check"
                  ></i>
                </div>
              </div>
              <div class="step_main">
                <div class="step_title">
                  {{ item.name }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="cluster">
      <div class="cluster_switch">
        <el-radio-group v-model="cluserValue">
          <el-radio-button
            v-for="(item, index) in cluserRadios"
            :key="index"
            :label="item.value">{{ item.label }}</el-radio-button>
        </el-radio-group>
      </div>
      <div class="cluster_title">
            {{cluserRadios[cluserValue-1].label}}统计
      </div>
      <div class="cluster_echart">
        <div id="cluster_echart" style="width: 100%; height: 300px"></div>
      </div>
      <div class="cluster_table">
        <div class="cluster_table_title">
          <div class="title_text">集束化管理数据</div>
          <div>
            <el-button size="small"  @click="getDataFun();" v-has="`jsh-manage:edit`">取消</el-button>
            <!-- <el-button type="primary" size="small" v-if="disabled"  @click="disabled = false" v-has="`jsh-manage:edit`">编辑</el-button > -->
            <el-button type="primary" size="small"  @click="saveData" v-has="`jsh-manage:edit`">保存</el-button>
          </div>
        </div>
        <div class="cluster_table_content">
          <el-table :data="tableData" style="width: 100%">
            <el-table-column
              v-for="(item, index) in tableColumns"
              :key="index"
              :prop="item.prop"
              :label="item.label"
            >
              <template slot-scope="scope">
                <div v-if="item.prop == 'name'">
                  {{ scope.row.name }}
                </div>
                <div v-else-if="item.prop == 'type'">
                  {{ scope.row.type }}
                </div>
                <div v-else>
                  <el-input
                    v-model="scope.row[item.prop]"
                    :type="scope.row.num?'number':'string'"
                    @input="changeOne(this)"
                    :ref="item.prop"
                  ></el-input>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    </div>
    <div v-else class="noData">
        <div v-if="nurseShow" class="doctorWords">
          请联系医生启动集束化管理
        </div>
        <div v-else class="doctorWords">
          暂无数据
        </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "cluserManage",
  props: ["recorId","nurseShow"],
  data() {
    return {
      tableData: [],
      finishedConditionThree: [],
      finishedConditionSix: [],
      historyValue: "",
      cluserValue: 1,
      cluserRadios: [
        { label: "血乳酸", value: "1" },
        { label: "MAP", value: "2" },
        { label: "CVP", value: "3" },
        { label: "ScrO2", value: "4" },
      ],
      options: [],
      disabled: true,
      tableColumns: [],
      clusteringId: null,
      show:true,
      chart: {
        option: {
         tooltip:{
           position:'top',
         },
         grid: {
            x: 70,
            y: 40,
            x2: 70,
            y2: 30 //距离下边的距离
            },
          xAxis: [{
            type: "time",
            gridIndex: 0,
            splitLine: {
              show: false,
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
          }],
          yAxis: {
            type: "value",
          },
          series: [
            {
              data: [],
              itemStyle : {  
                normal : {  
                    lineStyle:{  
                        color:'#7972F3'  
                    }  
                }  
              },
              type: "line",
            },
            {
              data: [],
              itemStyle:{
                normal:{
                    color:['#F65B8D']
                }
                },
              type: "scatter",
            },
          ],
        },
      }
    };
  },
  computed: {
    patientRecordId() {
      return this.recorId;
    },
  },
   mounted() {
    let that = this;
      window.addEventListener("resize",that.chartFun);
  },
  created() {

  },
  watch:{
    cluserValue(newVal,oldVal){
        if(newVal!=oldVal){
          this.getEchartData();
        }
    }
  },
  methods: {
    initData() {
      this.getConfigInfo();
      this.getDataFun();
    },
    changeOne(scope,item,index){
      
    },
    chartFun() {
      let that = this;
      let myChart = this.echarts.init(
        document.getElementById("cluster_echart")
      );
      // 指定图表的配置项和数据
      // 使用刚指定的配置项和数据显示图表。

      myChart.clear({});
      myChart.setOption(that.chart.option);
      myChart.resize();
    },
    changeHistroy(value) {
      this.getDataFun(value);
    },
    getEchartData(){
      let that = this;
      let url = '/api/icu/clustering/queryChart?clusteringId='+that.historyValue+"&type="+that.cluserValue; 
      that.$axios.get(global.url+url).then(function(res){
          let data = res.data.respData;
          if(data){
             that.chart.option.series[0].data=[];
              if(data.coordinate.length>0){
                  data.coordinate.forEach(function(item,index){
                    that.chart.option.series[0].data.push([item.x,item.y]);
                  })
              }
              that.chart.option.series[1].data=[];
              data.label.forEach(function(item,index){
                that.chart.option.series[1].data.push([item.time,item.y,item.data])
              })
              that.chart.option.tooltip.formatter = function(parma){
                let list = null;
                let html = '';
                if(parma.componentSubType=='scatter'){
                    list = parma.data[2];
                    list.forEach(function(item,index){
                        html+=`<div style="display:flex;padding:5px;"><div>${item.name}</div><div style="padding-left:10px;">${item.value}</div></div>`
                    })
                }else if(parma.componentSubType=='line'){
                  console.log(parma);
                  html=`<div style="display:flex;padding:5px;"><div>${parma.data[0]}</div><div style="padding-left:10px;">${parma.data[1]}</div></div>`
                }
                return html;
              }
              that.chartFun();
          }
      })
    },
    getConfigInfo() {
      let that = this;
      let url = "/api/icu/clustering/queryHistoryTime/" + that.patientRecordId;
      that.$axios.post(global.url + url, {}).then(function (res) {
        if (res.data.msg == 201) {
          let list = res.data.respData;
          if (list.length > 0) {
            list.forEach(function (item, index) {
              item.name =
                item.name +
                "集束化治疗" +
                (list.length - index < 10
                  ? "0" + (list.length - index)
                  : list.length - index);
            });
          }
          that.options = list;
        }
      });
    },
    getDataFun(value) {
      let that = this;
      let url = null;
      if (value) {
        url = "/api/icu/clustering/query?clusteringId=" + value;
      } else {
        url =
          "/api/icu/clustering/query?patientRecordId=" + that.patientRecordId;
      }
      that.$axios.get(global.url + url).then(function (res) {
        if (res.data.msg == 201) {
          let respData = res.data.respData;
          if(!respData){
             that.show = false;
             that.$emit("getClusteringId", null, null);
             return false;
          }
          that.show = true;
          that.historyValue = String(respData.id);
          that.$emit("getClusteringId", that.historyValue, respData.status);
          that.finishedConditionThree = respData.finishedConditionThree;
          that.finishedConditionSix = respData.finishedConditionSix;
          that.tableColumns = [
            { label: "项目", prop: "name" },
            { label: "3h/6h集束化治疗", prop: "type" },
            {
              label: respData.recordTimeOne,
              prop: "recordOne",
              isEdit: 1,
            },
            {
              label: respData.recordTimeTwo,
              prop: "recordTwo",
              isEdit: 1,
            },
            {
              label: respData.recordTimeThree,
              prop: "recordThree",
              isEdit: 1,
            },
            {
              label: respData.recordTimeFour,
              prop: "recordFour",
              isEdit: 1,
            },
            {
              label: respData.recordTimeFive,
              prop: "recordFive",
              isEdit: 1,
            },
            {
              label: respData.recordTimeSix,
              prop: "recordSix",
              isEdit: 1,
            },
          ]
          that.tableData = respData.detail;
          that.getEchartData();
        }
      });
    },
    saveData() {
      let that = this;
      let url = "/api/icu/clustering/save";
      that.$axios.post(global.url + url, that.tableData).then(function (res) {
        if (res.data.msg == 201) {
          // that.disabled = true;
          that.getDataFun(that.historyValue);
          that.$message({ type: "success", message: res.data.content });
        } else {
          that.$message({ type: "info", message: res.data.content });
        }
      });
    },
  },
    beforeDestroy() {
     let that = this;
      window.removeEventListener('resize',that.chartFun)
  },
};
</script>
<style lang="scss">
.cluserManage {
     .noData {
        margin:50px auto;
        background-image: url("/static/img/noData_table.png");
        width: 234px;
        height: 205px;
        background-size: 100%;
        background-repeat: no-repeat;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        .doctorWords{
          text-align: center;
          font-size: 15px;
          color: rgba(0, 0, 0, 0.6);
          letter-spacing: 1px;
          margin-bottom: -15px;
        }
      }
      input::-webkit-outer-spin-button, input::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }
    // .el-input.is-error{
    //     .el-input__inner{
    //         border-color:#F56C6C;
    //     }
    // }
    input[type="number"] {
      -moz-appearance: textfield;
    }
  .cluster {
    .cluster_title {
      padding: 25px 0 0 0;
      font-size: 16px;
      font-weight: bold;
    }
  }
  .cluster_table {
    .cluster_table_title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 30px 0px 25px 0;
      .title_text {
        font-size: 16px;
        font-weight: bold;
      }
    }
    .el-table th {
      background: rgba(0, 0, 0, 0.02);
      color: #212121;
    }
  }
  .treatHistory {
    padding: 15px 0 10px 0;
  }
  .treatPlan {
    padding: 15px 0;
    display: flex;
    justify-content: space-between;
    .treatPlan_left,
    .treatPlan_right {
      flex: 1;
    }
    .treatPlan_right {
      padding-left: calc(50% - 400px);
    }
    .plan_process {
      padding: 10px 10px 10px 15px;
      margin-left: -60px;
    }
    .plan_title {
      padding: 5px 0;
      font-size: 16px;
      font-weight: bold;
    }
  }
  .plan_steps {
    display: flex;
  }
  .plan_step:last-of-type {
    // flex-basis: 100px;
  }
  .plan_step {
    position: relative;
    flex-basis: 150px;
    flex-shrink: 1;
    text-align: center;
    .step_head {
      position: relative;
      width: 100%;
      .step_icon {
        position: relative;
        z-index: 1;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 11px;
        height: 11px;
        font-size: 12px;
        box-sizing: border-box;
        border-radius: 12px;
        border: 2px solid #c0c4cc;
        margin: 3px 0px;
        background: #ffffff;
      }
      .step {
        width: 17px;
        height: 17px;
        margin: 0px;
        border-width: 0;
        color: #fff;
      }
      .step_timeOut {
        background: #f23c3c;
      }
      .step_success {
        background: #1374e4;
      }
      .step_line {
        position: absolute;
        border-color: inherit;
        background-color: #c0c4cc;
        height: 2px;
        top: 7px;
        left: 0;
        right: 0;
        .step_line_inner {
          display: block;
          border-width: 1px;
          border-style: solid;
          /* border-color: inherit; */
          box-sizing: border-box;
          width: 100%;
          height: 1px;
        }
      }
    }
    .step_main {
      padding: 4px 0;
      .step_title {
        font-size: 14px;
        line-height: 22px;
      }
    }
  }
  .plan_step:first-of-type .step_line {
    left: 50%;
  }
  .plan_step:last-of-type .step_line {
    right: 50%;
  }
}
</style>
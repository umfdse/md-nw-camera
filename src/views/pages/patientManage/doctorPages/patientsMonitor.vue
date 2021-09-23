<template>
  <div class="patientsMonitorWrapper">
    <div class="monitorTop">
      <div class="monitorDevice">
        <div class="monitorTitle">监护设备</div>
        <div class="monitorContent">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="呼吸机" name="first">
              <breatheMonitoring v-if="activeName=='first'" :patientInfo="patientInfo" ref="monitor_first"></breatheMonitoring>
            </el-tab-pane>
            <el-tab-pane label="监护仪" name="second">
              <ecgMonitoring  v-if="activeName=='second'"  :patientInfo="patientInfo" ref="monitor_second"></ecgMonitoring>
            </el-tab-pane>
    <!--        <el-tab-pane label="CRRT" name="third">
              <CRRTMonitoring v-if="activeName=='third'"  :patientInfo="patientInfo" ref="monitor_third"></CRRTMonitoring>
            </el-tab-pane>-->
          </el-tabs>
        </div>
      </div>

      <div class="monitorTable">
        <div class="monitorTitle">历史情况</div>
        <table>
          <tr v-for="(tr,index) in tableData" :key="index">
            <td class="label">{{tr.label}}</td>
            <td class="content">{{tr.value +' ' + (tr.value ? tr.unit:'') }}</td>
          </tr>
        </table>
      </div>
    </div>
    <div class="bodyTitle">人体导管图</div>
    <div class="monitorEchart">
      <div class="echart_left">
        <div>
          <div id="bodyFront" style="width:250px;height:400px;"></div>
          <div class="front_title">人体正面</div>
        </div>
      </div>
      <div class="echart_right">
        <div>
          <div id="bodyBack" style="width:250px;height:400px;"></div>
          <div class="back_title">人体背面</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import ecgMonitoring from './ecgMonitoring'
  import breatheMonitoring from './breatheMonitoring'
  export default {
    name: 'patientsMonitor',
    props: ['patientInfo'],
    components: {ecgMonitoring,breatheMonitoring},
    data() {
      return {
        tableData:[
          {field:'apacheIIScore',label:'APACHEⅡ评分',value:'',unit:'分'},
          {field:'deathRate',label:'死亡率',value:'',unit:''},
          {field:'sofaScore',label:'SOFA评分',value:'',unit:'分'},
          {field:'out',label:'出入量',value:'',unit:'ml/24h'},
          {field:'antibiotic',label:'抗生素使用情况',value:'',unit:''},
        ],
        myChart: null,
        options: [
          {label: '全部', value: ""},
          {label: '新置', value: '1'},
          {label: '换管', value: '2'},
          {label: '拔管', value: '3'}
        ],
        status: '',
        id: null,
        num: null, //1拔管 2换管
        drainFlag: false,//查看引流液
        title: '新增插管',
        backEchartList: [
          {value: '15', point: [[10, 12, 15]], name: '肛门'},
          {value: '14', point: [[1.5, 11, 14], [18.5, 11, 14]], name: '手部'},
          {value: '13', point: [[10, 16, 13]], name: '后背'},
        ],
        tempBack: {
          green: [],
          red: []
        },
        frontEchartList: [
          {value: '10', point: [[5, 12.5, 10], [14.8, 12.5, 10]], name: '臂部'},
          {value: '12', point: [[8.4, 1, 12], [11, 1, 12]], name: '足部'},
          {value: '8', point: [[10, 12, 8]], name: '腹部'},
          {value: '9', point: [[10, 13, 9]], name: '胸部'},
          {value: '3', point: [[10, 17, 3]], name: '颈部'},
          {value: '7', point: [[10, 17.6, 7]], name: '鼻腔'},
          {value: '6', point: [[10, 18.2, 6]], name: '口腔'},
          {value: '4', point: [[10, 19.5, 4]], name: '头部'},
          {value: '5', point: [[8.2, 18.5, 5], [11.5, 18.5, 5]], name: '耳朵'},
          {value: '11', point: [[11.5, 9, 11]], name: '腿部'},
        ],
        tempFront: {
          green: [],
          red: []
        },
        tempPoint: {
          redFornt: [],
          redBack: [],
        },
        html: null,
        html2: null,
        option: {
          grid: {
            x: 0,
            y: 0,
            width: 255,
            height: 400
          },
          xAxis: {
            show: false,
            splitLine: {show: false},
            min: 0,
            max: 20
          },
          yAxis: {
            show: false,
            splitLine: {show: false},
            min: 0,
            max: 20
          },
          tooltip: {
            position: 'right',
            triggerOn: 'mousemove',
            position: ['105%', '30%'],
            textStyle: {
              color: "#000"
            },
            borderColor: "#D9D9D9",
            borderWidth: 1,
            backgroundColor: '#FFFFFF',
          },
          series: [
            {
              name: '',
              data: [[10, 12, 15], [14.8, 12.5, 10]],
              type: 'scatter',
              symbolSize: 10,
              emphasis: {
                focus: 'self'
              },
              itemStyle: {
                normal: {
                  color: ['green']
                }
              },
              label: {
                show: true,
                formatter: function (param) {
                  return '';
                },
                position: 'left',
                minMargin: 10
              }
            },
            {
              name: '',
              data: [],
              type: 'scatter',
              symbolSize: 10,
              emphasis: {
                focus: 'self'
              },
              itemStyle: {
                normal: {
                  color: ['red']
                }
              },
              labelLine: {
                show: true,
                length: 2,
                length2: 10,
                lineStyle: {
                  color: '#bbb'
                }
              },
              label: {
                show: false,
                formatter: function (param) {
                  return '';
                },
                position: 'left',
                minMargin: 100
              }
            }
          ]
        },
        option2: {
          xAxis: {
            show: false,
            splitLine: {show: false},
            min: 0,
            max: 20
          },
          yAxis: {
            show: false,
            splitLine: {show: false},
            min: 0,
            max: 20
          },
          tooltip: {
            position: 'right',
            triggerOn: 'mousemove',
            position: ['105%', '30%'],
            textStyle: {
              color: "#000"
            },
            borderColor: "#D9D9D9",
            borderWidth: 1,
            backgroundColor: '#FFFFFF',
          },
          series: [{
            name: '',
            data: [],
            type: 'scatter',
            symbolSize: 10,
            emphasis: {
              focus: 'self'
            },
            itemStyle: {
              normal: {
                color: ['green']
              }
            },
            label: {
              show: true,
              formatter: function (param) {
                return '';
              },
              position: 'left',
              minMargin: 10
            }
          },
            {
              name: '',
              data: [],
              type: 'scatter',
              symbolSize: 10,
              emphasis: {
                focus: 'self'
              },
              itemStyle: {
                normal: {
                  color: ['red']
                }
              },
              labelLine: {
                show: true,
                length: 2,
                length2: 10,
                lineStyle: {
                  color: '#bbb'
                }
              },
              label: {
                show: true,
                formatter: function (param) {
                  return '';
                },
                position: 'left',
                minMargin: 100
              }
            }
          ]
        },
       /* 设备检测*/
        activeName:'first',
        timer:null
      }
    },
    mounted() {
      let that = this;
      window.addEventListener("resize",that.echartInit2);
    },
    watch:{
      patientInfo(newVal,oldVal){
        this.$nextTick(()=>{
          this.$refs['monitor_'+this.activeName].initData()
        })
      }
    },
    beforeDestroy(){
    let that = this;
    this.clearTimer()
    window.removeEventListener("resize",that.echartInit2)
    },

    methods: {
      clearTimer(){
        if(this.timer){
          clearInterval(this.timer)
        }
      },
      initData() {
        this.getEchartData()
        this.getHistoryData()
        this.$nextTick(()=>{
          this.$refs['monitor_'+this.activeName].initData()
        })
      },
      getHistoryData(){
        let _this = this
        let param = {
          "recordId": this.patientInfo.record.recordId,
        }
        this.$axios({
          url: global.url + '/patient/check/historyData',
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          data: param
        }).then((response) => {
          var data = response.data
          if (data.msg == 201) {
            this.tableData.forEach(item=>{
              item.value = ''
              for(let key in data.respData){
                if(item.field==key){
                  item.value = _this.dealNull(data.respData[key])
                }
                //死亡率
                if(item.field== 'deathRate' && data.respData['minDeathRate'] && data.respData['maxDeathRate']){
                 item.value = _this.dealNull(data.respData['minDeathRate']).toFixed(3) +'%' + '～' + _this.dealNull(data.respData['maxDeathRate']).toFixed(3)+'%'
                }
              }
            })
          } else {
            this.$message({
              message: data.content,
              type: 'error'
            })
          }
        });
      },

      dealNull(val){
        return  (val || val===0) ? val: ''
      },
      getEchartData() {
        let that = this;
        let url = '/api/icu/pipe/queryTheStatusOfHumanIntubation?patientRecordId=' + that.patientInfo.record.recordId;
        that.$axios.get(global.url + url).then(function (res) {
          let list = res.data.respData ? res.data.respData: [] ;
          that.tempFront.green = [];
          that.tempFront.red = [];
          that.tempPoint.redFront = [];
          let green = [];
          that.frontEchartList.forEach(function (item) {
            list.forEach(function (item2) {
              if (item.value == item2.value) {
                that.tempPoint.redFront.push(item.value);
                item.point.forEach(function (item3) {
                  that.tempFront.red.push(item3);
                })
                green = that.frontEchartList.filter(function (item4) {
                  return item.value != item4.value;
                })
              }
            })
          })
          green.forEach(function (item) {
            item.point.forEach(function (item2) {
              that.tempFront.green.push(item2);
            })
          })
          that.option.series[0].data = that.tempFront.green;
          that.option.series[1].data = that.tempFront.red;
          that.option.tooltip.formatter = function (param) {
            let flag = that.tempPoint.redFront.some(function (item, index) {
              return item == param.data[2];
            })
            if (flag) {
              ;
              that.findPart(param.data[2]);
              return that.html;
            } else {
              return '';
            }
          }
          that.echartInit();
          that.tempBack.green = [];
          that.tempBack.red = [];
          that.tempPoint.redBack = [];
          let backgreen = [];
          that.backEchartList.forEach(function (item) {
            list.forEach(function (item2) {
              if (item.value == item2.value) {
                that.tempPoint.redBack.push(item.value);
                item.point.forEach(function (item3) {
                  that.tempBack.red.push(item3);
                })
                backgreen = that.backEchartList.filter(function (item4) {
                  return item.value != item4.value;
                })
              }
            })
          })
          backgreen.forEach(function (item) {
            item.point.forEach(function (item2) {
              that.tempBack.green.push(item2);
            })
          })
          that.option2.series[0].data = that.tempBack.green;
          that.option2.series[1].data = that.tempBack.red;
          that.option2.tooltip.formatter = function (param) {
            let flag = that.tempPoint.redBack.some(function (item, index) {
              return item == param.data[2];
            })
            if (flag) {
              that.findPart(param.data[2], 2);
              return that.html2;
            } else {
              return '';
            }
          }
          that.echartInit2();
        });
      },
      async findPart(type, num) {
        let that = this;
        let url = '/api/icu/pipe/querySummary?patientRecordId=' + that.patientInfo.record.recordId + '&type=' + type;
        let html = await that.$axios.get(global.url + url).then(function (res) {
          let data = res.data.respData;
          html = `<div style="font-weight:600;padding:5px;">${data.name}</div>`;
          data.data.forEach(function (item, index) {
            html += `<div style="padding:5px;"><span>${item.name}</span><span style="display:inline-block;padding:0 10px">${item.days}天</span>`
            if (item.drainage) {
              html += `<span>${item.drainage}ml</span></div>`
            } else {
              html += `</div>`
            }
          })
          return html;
        })
        if (num == 2) {
          that.html2 = html;
        } else {
          that.html = html;
        }

      },
      echartInit() {
        let that = this;
        let myChart = this.echarts.init(document.getElementById("bodyFront"))
        myChart.setOption(that.option)
        myChart.resize()
      },
      echartInit2() {
        let myChart = this.echarts.init(document.getElementById("bodyBack"))
        //     let data=[
        //         [[10,16],[1.5,11],[18.5,11],[10,12]],
        //    ]
        myChart.setOption(this.option2);
        myChart.resize();
      },
      handleClick(val){

      },
    }
  }
</script>

<style lang="scss">
  .patientsMonitorWrapper {
    .noData {
      margin: 50px auto;
      background-image: url("/static/img/noData_table.png");
      width: 234px;
      height: 224px;
      background-size: 100%;
      background-repeat: no-repeat;
      padding: 0;
    }
    .bodyTitle{
      font-size: 16px;
      padding: 16px 0;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.87);
      margin-top: 30px;
    }
    .monitorEchart {
      padding: 0px 150px 10px 150px;
      display: flex;
      margin-top: 60px;
      border-bottom: 1px solid #E8E8E8;

      #bodyFront {
        background: url('/static/img/bodyFront.png') no-repeat center center;
        background-size: 95%;
        border: 1px dotted black;
      }
      #bodyBack {
        background: url('/static/img/bodyBack.png') no-repeat center center;
        background-size: 95%;
        border: 1px dotted black;
      }
      .echart_left, .echart_right {
        width: 50%;
        display: flex;
        justify-content: center;
      }
      .front_title, .back_title {
        text-align: center;
        padding: 16px 0;
        font-size: 14px;
        font-weight: bold;
      }
    }

   .monitorTop{
     width: 100%;
     display: flex;
     padding-bottom: 20px;
     height: 420px;
     .monitorTitle{
       font-size: 16px;
       padding: 16px 0;
       font-weight: 600;
       color: rgba(0, 0, 0, 0.87);
     }

     .monitorDevice{
       flex: 6;

       .monitorContent{
         height: 420px;
         background-image: url("/static/img/device_bg.png");
        /* background-size: cover;*/
         background-size:100% 100%;
         background-repeat: no-repeat;
         padding: 32px;
         box-sizing: border-box;
         .el-tabs{
           height: 100%;
          .el-tabs__content{
            height: calc(100% - 40px);
            padding:0;
            .el-tab-pane{
              width: 100%;
              height: 100%;
            }
          }
         }
         .el-tabs__item{
           color: #46E1EA;
         }
         .el-tabs__item.is-active{
           color: #46E1EA;
         }
         .el-tabs__nav-wrap::after{
           height: 0 !important;
         }
         .el-tabs__active-bar{
           height: 2px;
           background-color: #46E1EA;
         }
         .el-tabs__active-bar::after{
           content: "";
           position: absolute;
           bottom: 0;
           left: 0;
           height: 2px;
           background-color: #1374E4;
           z-index: 1;
           transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
           list-style: none;
         }
       }
     }
     .monitorTable{
       flex: 4;
       padding-left: 15px;
       table {
         border: 1px solid #F0F0F0;
         width: 100%;
         tr{
           height: 84px;
           .label{
             color: rgba(0, 0, 0, 0.87);
             font-weight: 600;
             background: rgba(0, 0, 0, 0.02);
             padding: 20px 15px;
             width: 160px;
           }
           .content{
             background: #FFFFFF;
             color: rgba(0, 0, 0, 0.87);
             padding-left: 10px;
           }
         }
       }
     }
   }
  }
</style>

<template>
  <div class="xueshuan">
    <div chass="echart_img">
      <div class="echart_img_top">
        <div class="echart_img_title title">
          <!-- {{ "深静脉血栓统计（" + dateTime + "）" }} -->
          深静脉血栓统计
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
        id="echart_img_main11"
        style="width: 100%; height: 300px;"
      ></div>
    </div>
    <div class="echart_table">
      <div class="echart_table_top">
        <div class="table_top_title title">深静脉血栓管理数据（{{dateTime}}）</div>
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
          <el-table-column label="博动情况" width="180" >
               <template slot-scope="scope">
                <div >
                   <p>
                    <span v-if="scope.row.poplitealArteryPulsationLeft==1">腘动脉搏动(左)正常</span>
                    <span v-else-if="scope.row.poplitealArteryPulsationLeft==2">腘动脉搏动(左)减弱</span>
                     <span v-else-if="scope.row.poplitealArteryPulsationLeft==3">腘动脉搏动(左)消失</span> 
                     <span v-else></span>  
                    </p>
                   <p>
                    <span v-if="scope.row.poplitealArteryPulsationRight==1">腘动脉搏动(右)正常</span>
                    <span v-else-if="scope.row.poplitealArteryPulsationRight==2">腘动脉搏动(右)减弱</span>
                    <span v-else-if="scope.row.poplitealArteryPulsationRight==3">腘动脉搏动(右)消失</span>  
                    <span v-else></span> 
                    </p>
                    
                   <p>
                    <span v-if="scope.row.footPulsationLeft==1">足背动脉搏动(左)正常</span>
                    <span v-else-if="scope.row.footPulsationLeft==2">足背动脉搏动(左)减弱</span>
                    <span v-else-if="scope.row.footPulsationLeft==3">足背动脉搏动(左)消失</span>  
                    <span v-else></span>  
                    </p>
                   <p>
                    <span v-if="scope.row.footPulsationRight==1">足背动脉搏动(右)正常</span>
                    <span v-else-if="scope.row.footPulsationRight==2">足背动脉搏动(右)减弱</span>
                    <span v-else-if="scope.row.footPulsationRight==3">足背动脉搏动(右)消失</span>
                    <span v-else></span>     
                    </p>
                </div>
            </template>
          </el-table-column>
           <el-table-column  label="下肢皮肤颜色" >
               <template slot-scope="scope">
                   <span v-if="scope.row.lowerLimbSkinColor==1">正常</span>
                   <span v-else-if="scope.row.lowerLimbSkinColor==2">淡红</span>
                   <span v-else-if="scope.row.lowerLimbSkinColor==3">紫色</span>
                   <span v-else-if="scope.row.lowerLimbSkinColor==4">红色</span>
                    <span v-else></span>     
               </template>
          </el-table-column>
           <el-table-column  label="Homans征" >
                 <template slot-scope="scope">
                   <span v-if="scope.row.homanStatus==1">+</span>
                   <span v-else-if="scope.row.homanStatus==2">-</span>
                    <span v-else></span>     
               </template>
          </el-table-column>
           <el-table-column prop="painScore" label="疼痛评分尺" >
          </el-table-column>
           <el-table-column  label="肿胀" >
                <template slot-scope="scope">
                   <span v-if="scope.row.lowerLimbSwelling==0">无</span>
                   <span v-else-if="scope.row.lowerLimbSwelling==1">I度</span>
                   <span v-else-if="scope.row.lowerLimbSwelling==2">II度</span>
                   <span v-else-if="scope.row.lowerLimbSwelling==3">III度</span>
                    <span v-else></span>     
               </template>
          </el-table-column>
          <el-table-column prop="skinTemperature" label="肤温(℃)" >
          </el-table-column>
            <el-table-column  label="麻痹感">
                  <template slot-scope="scope">
                   <span v-if="scope.row.lowerLimbParalysis==1">+</span>
                   <span v-else-if="scope.row.lowerLimbParalysis==2">-</span>
                    <span v-else></span>     
               </template>
          </el-table-column>
            <el-table-column prop="result" label="评估结果" >
                <template slot-scope="scope">
                   <span v-if="scope.row.result==1">未发现问题</span>
                   <span v-else-if="scope.row.result==2">待进一步评估</span>
                   <span v-else-if="scope.row.result==3">疑似血栓形成</span>
                   <span v-else-if="scope.row.result==4">血栓形成</span>
                    <span v-else></span>     
               </template>
          </el-table-column>
            <el-table-column prop="preventMessure" label="预防措施" width="180">
                  <!-- <template slot-scope="scope">
                   <p v-if="scope.row.preventMessure.indexOf('1')>0">足底静脉泵VEP</p>
                   <p v-if="scope.row.preventMessure.indexOf('2')>0">抗血栓形成药物</p>
                   <p v-if="scope.row.preventMessure.indexOf('3')>0">梯度压力弹力袜GCS</p>
                   <p v-if="scope.row.preventMessure.indexOf('4')>0">间歇充气加压装置IPC</p>    
               </template> -->
          </el-table-column>
           <el-table-column  prop="diagnosisMessure" label="治疗措施" width="180">
                 <!-- <template slot-scope="scope">
                   <p v-if="scope.row.diagnosisMessure.indexOf('1')>0">抗凝、抗血小板形成</p>
                   <p v-if="scope.row.diagnosisMessure.indexOf('2')>0">下腔静脉滤器</p>
                   <p v-if="scope.row.diagnosisMessure.indexOf('3')>0">溶栓</p>
                   <p v-if="scope.row.diagnosisMessure.indexOf('4')>0">手术</p>
                    <p v-if="scope.row.diagnosisMessure.indexOf('5')>0">机械血栓清除术</p>    
               </template> -->
          </el-table-column>
          <!-- <el-table-column label="药物名称/用量">
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
          <el-table-column prop="recorder" label="执行人"> </el-table-column> -->
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
    <el-dialog :title="title" :visible.sync="addFlag" width="840px" class="tab_dialog" :close-on-click-modal="false">
      <add-data @submit="addSubmit" ref="addData" @refresh="getLisFun" :recordId="patientRecordId" :outhosTime="outhosTime"></add-data>
    </el-dialog>
  </div>
</template>
<script>
import addData from "./alert/addtab11_1";
export default {
  name: "tab11",
  props:['patientInfo','isDisabled'],
  components: {
    addData: addData,
  },
  computed:{
     patientRecordId(){
      return this.patientInfo.record.recordId;
    },
    outhosTime(){
       return this.patientInfo.record.outhosTime;
    }
  },
  data() {
    return {
      dateTime: null,
      addFlag: false,
      tableData: [],
      // option: {
      //     xAxis: {
      //       type: "category",
      //       data: [],
      //     },
      //     yAxis: {
      //        type: "value",
      //          nameGap: 20,
      //     minInterval: 5,
      //         nameLocation: 'center',
      //         name: '深静脉血栓',
      //         nameTextStyle: {
      //           color: 'rgba(0, 0, 0, 0.65)'
      //         },
      //         axisLine: {
      //           show: false
      //         },
      //         axisTick: {
      //           show: false
      //         },
      //         axisLabel: {
      //           show: true,
      //           color: "rgba(0, 0, 0, 0.45)"
      //         }
      //     },
      //     grid: {
      //     left:50,
      //     top:30,
      //     right:0,
      //     bottom:30
      //       },
      //     color:['#7972F3'],
      //     series: [
      //       {
      //         data: [],
      //         type: "line",
      //       },
      //     ],
      //   },
      option:{
          tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
        },
        legend: {
          data: ["留置率", "ICU患者血管内置管天数"],
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        toolbox: {
          // feature: {
          //     dataView: {show: true, readOnly: false},
          //     magicType: {show: true, type: ['line', 'bar']},
          //     restore: {show: true},
          //     saveAsImage: {show: true}
          // }
        },
        xAxis: {
          type: "category",
          boundaryGap: true,
          // data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日','周一', '周二', '周三', '周四', '周五']
          data: [],
        },
        yAxis: [
          {
            type: "value",
            name: "深静脉血栓",
            nameLocation: 'center',
            nameGap: 40,
            min: 0,
            max: 25,
            interval: 5,
            axisLabel: {
              formatter: "{value}",
            },
          },
        ],
        color: ["#F9B344", "#7972F3"],
        series: [],
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
          let url ="/api/icu/dvt/delete/" + row.id;
          let params = {
              patientRecordId:this.patientInfo.record.recordId,
              id:row.id
          }
          that.$axios.post(global.url+url,params).then(function (res) {
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
      console.log(row)
      let that = this;
      that.title = '编辑深静脉血管数据';
      that.addFlag = true;
      that.$nextTick(function () {
        that.$refs.addData.getInitData(row.id,row,false);
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
    //   let that = this;
    //   // that.getAmoutData();
    //   let url ="/api/icu/bloodSugar/getBloodSugarList?patientRecordId="+that.patientRecordId+"&dateTime=" +this.dateTime;
    //   this.$axios.get(global.url+url).then(function (res) {
    //     that.tableData = res.data.respData.data;
    //     let list = res.data.respData.chartData.bloodSugar;
    //     let xList = [];
    //     let yList = [];
    //     list.forEach(function(item,index){
    //         xList.push(item.x);
    //         yList.push(item.y);
    //     })
    //      that.option.xAxis.data = xList;
    //      that.option.series[0].data = yList;
    //     that.chartFun();
    //   });
   
     let that = this;
    let url = "/api/icu/dvt/getDvtList"
    let params ={
        patientRecordId:this.patientInfo.record.recordId,
        durangeTime:this.dateTime
    }
    this.$axios.post(global.url + url,params).then(function(res){
        if(res.data.msg==201){
             that.tableData = res.data.respData.list
        }
        
        
    })

    let url1 = "/api/icu/dvt/queryWellsAndDvtScoreList"
     this.$axios.post(global.url+url1,params).then(function(res){
          if(res.data.msg==201){
            that.option.xAxis.data = res.data.respData.dateList
            let arrData = [
              {name:"Wells评分",type:"bar",barwidth:30,data:res.data.respData.wellsList},
              {name:"Auther评分",type:"bar",barwidth:30,data:res.data.respData.autarList},
            ]
            that.option.series = arrData
             that.chartFun();
          }
          
    })
    },
    addFun() {
      this.addFlag = true;
      this.title = '新增深静脉血管数据';
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
        document.getElementById("echart_img_main11")
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
.xueshuan {
  .el-dialog {
    min-width: 500px;
  }
  .el-input{
      width:224px!important
  }
  .el-select{
      width:224px!important
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

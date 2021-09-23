<template>
  <div class="routineIconWrapper">
    <div class="search_data">
      <div class="search_content">
        <!-- <p>数据管理</p> -->
        <el-form
          :inline="true"
          :model="search_data"
          ref="search_data"
          class="demo-form-inline search-form"
          @submit.native.prevent
        >
          <el-form-item class="btnLeft" label="科室">
            <el-select
              v-model="search_data.department"
              placeholder="请选择"
              clearable
              filterable
              class="selectSearch"
            >
              <el-option
                v-for="(item, index) in departments"
                :key="index"
                :label="item.deptName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开始时间" size="mini" class="btnLeft">
            <el-date-picker
              v-model="search_data.startDate"
              format="yyyy-MM"
              type="month"
              placeholder="选择月份"
              :clearable="false"
              :picker-options="pickerOptionsOne"
              @change="changeStartDate"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" size="mini" class="btnLeft">
            <el-date-picker
              v-model="search_data.endDate"
              format="yyyy-MM"
              type="month"
              placeholder="选择月份"
              :clearable="false"
              :picker-options="pickerOptionsTwo"
              @change="changeEndDate"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item class="btnLeft searBtn">
            <el-button type="primary" @click="viewBtn()" v-has="`user:add`"
              >查询</el-button
            >
          </el-form-item>
          <el-form-item class="btnLeft">
            <el-button @click="viewReset()" v-has="`user:add`">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="headerName">ICU床位使用情况和患者收治情况统计</div>
    <div class="container">
      <el-row :gutter="20">
        <el-col :span="12" class="LeftContent">
          <div class="left">
            <div class="floatDiv"></div>
            <div class="oneContent oneContentOne">
              <div class="item">
                <div class="itemLeft">
                  <img src="/static/img/ICUBed.png" alt="" />
                </div>
                <div class="itemRight">
                  <p class="itemRightP">ICU床位数</p>
                  <p class="itemData">{{ basicQcData.bedNum }}</p>
                </div>
              </div>
              <div class="item">
                <div class="itemLeft">
                  <img src="/static/img/docBed.png" alt="" />
                </div>
                <div class="itemRight">
                  <p class="itemRightP">医生床位比</p>
                  <p class="itemData">{{ basicQcData.doctorBedRate }}</p>
                </div>
              </div>
              <div class="item">
                <div class="itemLeft">
                  <img src="/static/img/ICUDoc.png" alt="" />
                </div>
                <div class="itemRight">
                  <p class="itemRightP">ICU医生数</p>
                  <p class="itemData">{{ basicQcData.doctorNum }}</p>
                </div>
              </div>
            </div>
            <div class="oneContent oneContentTwo">
              <div class="item">
                <div class="itemLeft">
                  <img src="/static/img/nursBed.png" alt="" />
                </div>
                <div class="itemRight">
                  <p class="itemRightP">护士床位比</p>
                  <p class="itemData">{{ basicQcData.nurseBedRate }}</p>
                </div>
              </div>
              <div class="item">
                <div class="itemLeft">
                  <img src="/static/img/patient.png" alt="" />
                </div>
                <div class="itemRight">
                  <p class="itemRightP">收治患者数</p>
                  <p class="itemData">{{ basicQcData.patientNum }}</p>
                </div>
              </div>
              <div class="item">
                <div class="itemLeft">
                  <img src="/static/img/diePatient.png" alt="" />
                </div>
                <div class="itemRight">
                  <p class="itemRightP">死亡患者数</p>
                  <p class="itemData">{{ basicQcData.patientDeathNum }}</p>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="twoContent">
            <div class="item">
              <div class="itemFloat">床位使用率</div>
              <el-progress
                type="circle"
                color="#1374E4"
                :stroke-width="strokeWidth"
                :width="progressWidth"
                :percentage="basicQcData.bedUseRate"
              ></el-progress>
            </div>
            <div class="item">
              <div class="itemFloatTwo">24H重返患者率</div>
              <el-progress
                type="circle"
                color="#F9B344"
                :stroke-width="strokeWidth"
                :width="progressWidth"
                :percentage="basicQcData.comeback24hRate"
              ></el-progress>
            </div>
            <div class="item">
              <div class="itemFloatThree">48H重返患者率</div> 
              <el-progress
                type="circle"
                color="#44C0F6"
                :stroke-width="strokeWidth"
                :width="progressWidth"
                :percentage="basicQcData.comeback48hRate"
              ></el-progress>
            </div>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="secondLeftContent">
        <el-col :span="12">
          <div class="secondContent">
            <div class="secondTitle">患者来源分布</div>
            <div
              class="myChartA"
              id="myChartA"
              :style="{ height: '300px' }"
            ></div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="secondContent">
            <div class="secondTitle">出科性质分布</div>
            <div
              class="myChartB"
              id="myChartB"
              :style="{ height: '300px' }"
            ></div>
          </div>
        </el-col>
      </el-row>
      <div class="threeContent">
        <div class="threeLeftContent">
          <div class="threeTitle">平均住院天数和转科患者人数分布</div>
          <div class="myChartOne" id="myChartOne"></div>
        </div>
      </div>
      <div class="fourthContent">
        <div class="fourthLeftContent">
          <div class="fourthTitle">ICU患者留置导尿情况统计</div>
          <div class="myChartTwo" id="myChartTwo"></div>
        </div>
      </div>
      <div class="fiveContent">
        <div class="fiveLeftContent">
          <div class="fiveTitle">ICU患者血管内导管留置情况统计</div>
          <div class="myChartThree" id="myChartThree"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import eventBus from "@/utils/eventBus.js"
// import moment from "moment";
// import StrokeThromZkDetailVue from "../../../green/Stroke/StrokeThromZkDetail.vue";
export default {
  data() {
    return {
      pickerOptionsOne: {
        disabledDate: (time) => {
          if (
            this.search_data.endDate != null &&
            this.search_data.endDate != ""
          ) {
            return (
              time.getTime() > this.search_data.endDate ||
              time.getTime() > new Date().getTime()
            );
          } else {
            return false;
          }
        },
      },
      pickerOptionsTwo: {
        disabledDate: (time) => {
          if (
            this.search_data.startDate != null &&
            this.search_data.startDate != ""
          ) {
            return (
              time.getTime() < this.search_data.startDate ||
              time.getTime() > new Date().getTime()
            );
          } else {
            return false;
          }
        },
      },
      search_data: {
        department: "",
        startDate: "",
        endDate: "",
        // updateTime:[]
      },
      departments: [],
      strokeWidth: 10,
      progressWidth: 160,
      myChartAArr: [
        // {value:245, name:'心内科 45% 245人'},
        //  {value:356, name:'心胸外科 55% 356人'},
      ],
      myChartAArray: [],
      myChartBArr: [
        // {value:15, name:'死亡 '},
        //  {value:20, name:'转科 '},
      ],
      myChartBArray: [],
      myChartANumber: "",
      myChartBNumber: "",
      beginDate: "",
      endDate: "",
      sourceDeptName: "",
      userId: "",
      formData: {},
      basicQcData: {},
      catheterIndwellingData: {},
      inHosAndTrans: {},
      patientIndwellingAndUrethralData: {},
      patientOutDept: [],
      patientSource: [],
    };
  },
  created() {
    this.search_data.startDate = new Date().format("yyyy-MM");
    this.search_data.endDate = new Date().format("yyyy-MM");
  },
  mounted() {
    //  eventBus.$on('routine',target=>{
    //     // this.beginDate = (target.updateTime[0]&&target.updateTime.length>0)?target.updateTime[0]:""
    //     // this.endDate = (target.updateTime[1]&&target.updateTime.length>0)?target.updateTime[1]:""
    //     // this.sourceDeptName =target.department
    //     this.beginDate = target.startDate
    //     this.endDate = target.endDate
    //     this.sourceDeptName =target.department
    //     this.loadData()
    //  })
    this.loadData();
    this.getDepartment();
    // this.getEchart()
    // this.initMap();
  },
  // inject:['data'],
  methods: {
    changeStartDate() {
      let year = this.search_data.startDate.getFullYear();
      let mouth =
        this.search_data.startDate.getMonth() + 1 >= 10
          ? this.search_data.startDate.getMonth() + 1
          : "0" + (this.search_data.startDate.getMonth() + 1);
      this.search_data.startDate = year + "-" + mouth;
      // this.search_data.startDate = this.search_data.startDate.format("YYYY-MM")
      console.log(this.search_data.startDate);
    },
    changeEndDate() {
      let year = this.search_data.endDate.getFullYear();
      let mouth =
        this.search_data.endDate.getMonth() + 1 >= 10
          ? this.search_data.endDate.getMonth() + 1
          : "0" + (this.search_data.endDate.getMonth() + 1);
      this.search_data.endDate = year + "-" + mouth;
    },
    getDepartment() {
      // let that = this
      //  let url ="/icu/api/queryDept "
      // let params = {
      //   type:"2"
      // }
      //   this.$axios.get(global.url+url,params).then(function(res){
      //       if(res.data.msg==201){

      //       }
      //    })
      let param = {
        type: "1",
      };
      this.$axios({
        url: global.url + "/icu/api/queryDept",
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
        params: param,
      }).then((res) => {
        let data = res.data;
        if (data.msg === 201) {
          // this.departmentOption = data.respData && data.respData.list ? data.respData.list : []
          this.departments = data.respData;
        } else {
          this.$message.error(data.content);
        }
      });
    },
    viewBtn() {
      this.loadData();
    },
    viewReset() {
      this.search_data.startDate = new Date().format("yyyy-MM");
      this.search_data.endDate = new Date().format("yyyy-MM");
      this.search_data.department = "";
      this.loadData();
    },
    loadData() {
      let that = this;
      let url = "/icu/report/getGeneralQcReportData";
      let params = {
        beginDate: this.search_data.startDate,
        endDate: this.search_data.endDate,
        deptId: this.search_data.department,
      };
      this.$axios.post(global.url + url, params).then(function (res) {
        //   that.tableData = res.data.respData.list;
        that.formData = res.data.respData;
        that.basicQcData = that.formData.basicQcData;
        let str = "%"
         if(that.basicQcData.bedUseRate.indexOf(str)){
              that.basicQcData.bedUseRate= Number(that.basicQcData.bedUseRate.slice(0,that.basicQcData.bedUseRate.indexOf(str)))
          }
          if(that.basicQcData.comeback24hRate.indexOf(str)){
              that.basicQcData.comeback24hRate= Number(that.basicQcData.comeback24hRate.slice(0,that.basicQcData.comeback24hRate.indexOf(str)))
          }
          if(that.basicQcData.comeback48hRate.indexOf(str)){
            that.basicQcData.comeback48hRate= Number(that.basicQcData.comeback48hRate.slice(0,that.basicQcData.comeback48hRate.indexOf(str)))
          }
        that.catheterIndwellingData = that.formData.catheterIndwellingData;
        that.inHosAndTrans = that.formData.inHosAndTrans;
        that.patientIndwellingAndUrethralData =
          that.formData.patientIndwellingAndUrethralData;
        that.myChartBArr = that.formData.patientOutDept;
        that.myChartAArr = that.formData.patientSource;
        var sumA = 0;
        var sumB = 0;
        for (let i = 0; i < that.myChartBArr.length; i++) {
          that.myChartBArray.push(that.myChartBArr[i].name);
          sumB = sumB + that.myChartBArr[i].value;
        }
        for (let i = 0; i < that.myChartAArr.length; i++) {
          that.myChartAArray.push(that.myChartAArr[i].name);
          sumA = sumA + that.myChartAArr[i].value;
        }
        that.myChartANumber = sumA;
        that.myChartBNumber = sumB;
        console.log(that.myChartANumber, that.myChartBNumber);
        that.getEchart();
        that.initMap();
      });
    },
    initMap() {
      const myChartOne = this.echarts.init(
        document.getElementById("myChartOne")
      );
      const myChartTwo = this.echarts.init(
        document.getElementById("myChartTwo")
      );
      const myChartThree = this.echarts.init(
        document.getElementById("myChartThree")
      );
      const data = [20, 30, 40, 70];
      //   this.mapData.forEach(i => {
      //     data_time.push(i.createTs)
      //     data.push(i.score)
      //   })
      console.log(data);
      const optionOne = {
        // title: {
        //   text: "折线图堆叠",
        // },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["平均住院天数", "转科患者人数"],
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        // toolbox: {
        //     feature: {
        //         saveAsImage: {}
        //     }
        // },
        xAxis: {
          type: "category",
          boundaryGap: true,
          // data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          data: this.inHosAndTrans.x,
        },
        yAxis: [
          {
            type: "value",
            name: "天数",
            nameLocation: 'center',
            nameGap: 40,
            min: 0,
            max: 100,
            interval: 20,
            axisLabel: {
              formatter: "{value}",
            },
          },
        ],
        color: ["#7972F3", "#44C0F6"],
        // series: [
        //     {
        //         name: '平均住院天数',
        //         type: 'line',
        //         // stack: '总量',
        //         data: [100, 250, 470, 790, 990, 330, 260]
        //     },
        //     {
        //         name: '转科患者人数',
        //         type: 'line',
        //         // stack: '总量',
        //         data: [140, 920, 500, 680, 390, 360, 110]
        //     },

        // ]
        series: this.inHosAndTrans.seriesData,
      };
      const optionTwo = {
        //  title: {
        //     text: '折线图堆叠'
        // },
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
          // data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          data: this.patientIndwellingAndUrethralData.x,
        },
        yAxis: [
          {
            type: "value",
            name: "天数",
            nameLocation: 'center',
            nameGap: 40,
            min: 0,
            max: 100,
            interval: 20,
            axisLabel: {
              formatter: "{value}",
            },
          },
          {
            type: "value",
            name: "留置率",
            nameLocation: 'center',
            nameGap: 40,
            min: 0,
            max: 100,
            interval: 20,
            axisLabel: {
              formatter: "{value}%",
            },
          },
        ],
        color: ["#F9B344", "#44C0F6"],
        // series: [
        //     {
        //         name: '留置率',
        //         type: 'line',
        //         // stack: '天数',
        //         data: [100, 250, 470, 290, 190, 330, 260]
        //     },
        //     {
        //         name: 'ICU患者血管内置管天数',
        //         type: 'bar',
        //         barWidth : 30,
        //         // stack: '天数',
        //         data: [140, 220, 300, 180, 390, 360, 110]
        //     },

        // ]
        series: this.patientIndwellingAndUrethralData.seriesData,
      };
      const optionThree = {
        //  title: {
        //     text: '折线图堆叠'
        // },
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
          data: this.catheterIndwellingData.x,
        },
        yAxis: [
          {
            type: "value",
            name: "天数",
            nameLocation: 'center',
            nameGap: 40,
            min: 0,
            max: 100,
            interval: 20,
            axisLabel: {
              formatter: "{value}",
            },
          },
          {
            type: "value",
            name: "留置率",
             nameLocation: 'center',
            nameGap: 40,
            min: 0,
            max: 100,
            interval: 20,
            axisLabel: {
              formatter: "{value}%",
            },
          },
        ],
        color: ["#F9B344", "#7972F3"],
        // series: [
        //     {
        //         name: '留置率',
        //         type: 'line',
        //         // stack: '天数',
        //         data: [100, 250, 470, 290, 190, 330, 260]
        //     },
        //     {
        //         name: 'ICU患者血管内置管天数',
        //         type: 'bar',
        //         // stack: '天数',
        //          barWidth : 30,
        //         data: [140, 220, 300, 180, 390, 360, 110]
        //     },

        // ]
        series: this.catheterIndwellingData.seriesData,
      };
      // 绘制图表
      myChartOne.setOption(optionOne);
      myChartTwo.setOption(optionTwo);
      myChartThree.setOption(optionThree);
      window.onresize = myChartOne.resize();
      window.onresize = myChartTwo.resize();
      window.onresize = myChartThree.resize();
    },
    getEchart() {
      let optionA = {
        title: {
          //标题组件
          textStyle: {
            color: "#333333",
            fontSize: 12,
          },
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
          textStyle: {
            //图例文字的样式
            color: "#fff", //文字颜色
            fontSize: 10, //文字大小
          },
        },
        graphic: [
          {
            type: "text",
            top: "40%",
            left: "center",
            style: {
              text: "总人数",
              fill: "#333333",
              fontSize: 20,
              fontWeight: "normal",
            },
          },
          {
            type: "text",
            top: "53%",
            left: "center",
            style: {
              text: this.myChartANumber,
              fill: "#333333",
              fontSize: 18,
              fontWeight: "normal",
            },
          },
        ],
        color: ["#7972F3", "#FB5E91","#F9B344", "#44C0F6","#1374E4"],
        // 图例
        legend: {
          // 图例选择的模式，控制是否可以通过点击图例改变系列的显示状态。默认开启图例选择，可以设成 false 关闭。
          selectedMode: true, //图例在垂直方向上面显示居中
          /* orient: 'vertical', */
          /*  x : 'right',   //图例显示在右边
                    y: 'center',  */ bottom: 30,
          itemWidth: 10, //图例标记的图形宽度
          itemHeight: 10, //图例标记的图形高度
          // data:['心内科','心胸外科',],
          data: this.myChartAArray,
          textStyle: {
            //图例文字的样式
            color: "#A6A8B6", //文字颜色
            fontSize: 10, //文字大小
          },
        },
        series: [
          {
            name: "", //代表a的值，系列名称
            type: "pie",
            center: ["50%", "45%"], //饼图的中心（圆心）坐标，数组的第一项是横坐标，第二项是纵坐标。
            radius: ["50%", "60%"], //饼图的半径，数组的第一项是内半径，第二项是外半径。[ default: [0, '75%'] ]
            avoidLabelOverlap: true, //是否禁用动画效果
            /*  animation: false, */ label: {
              normal: {
                show: true, //是否显示标签
                position: "left",
                //a（系列名称），b（数据项名称），c（数值）, d（百分比）
                formatter: "{b}:{c}人（{d}%）",
              },
              emphasis: {
                //鼠标放在圆环上显示的标签样式
                show: true,
                textStyle: {
                  fontSize: "12",
                  fontWeight: "bold",
                },
              },
            },
            labelLine: {
              normal: {
                show: true, //是否显示引导线
                length: 10, //百分比引导线
                length2: 20, //视觉引导项第二段的长度。
              },
            },
            itemStyle: {
              normal: {
                borderColor: "#FFFFFF",
                borderWidth: 1,
                label: {
                  show: true,
                  formatter: "{d}%",
                },
              },
            },
            // 系列中的数据内容数组。
            // data:[
            //       {value:245, name:'心内科'},
            //     {value:356, name:'心胸外科'},
            // ]
            data: this.myChartAArr,
          },
        ],
      };
      let optionB = {
        title: {
          //标题组件
          textStyle: {
            color: "#333333",
            fontSize: 12,
          },
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
          textStyle: {
            //图例文字的样式
            color: "#fff", //文字颜色
            fontSize: 10, //文字大小
          },
        },
        graphic: [
          {
            type: "text",
            top: "40%",
            left: "center",
            style: {
              text: "总人数",
              fill: "#333333",
              fontSize: 20,
              fontWeight: "normal",
            },
          },
          {
            type: "text",
            top: "53%",
            left: "center",
            style: {
              text: this.myChartBNumber,
              fill: "#333333",
              fontSize: 18,
              fontWeight: "normal",
            },
          },
        ],
        color: ["#F9B344", "#44C0F6","#7972F3", "#FB5E91","#1374E4"],
        // 图例
        legend: {
          // 图例选择的模式，控制是否可以通过点击图例改变系列的显示状态。默认开启图例选择，可以设成 false 关闭。
          selectedMode: true, //图例在垂直方向上面显示居中
          /* orient: 'vertical', */
          /*  x : 'right',   //图例显示在右边
                    y: 'center',  */ bottom: 30,
          itemWidth: 10, //图例标记的图形宽度
          itemHeight: 10, //图例标记的图形高度
          // data:['死亡','转科'],
          data: this.myChartBArray,
          textStyle: {
            //图例文字的样式
            color: "#A6A8B6", //文字颜色
            fontSize: 10, //文字大小
          },
        },
        series: [
          {
            name: "", //代表a的值，系列名称
            type: "pie",
            center: ["50%", "45%"], //饼图的中心（圆心）坐标，数组的第一项是横坐标，第二项是纵坐标。
            radius: ["50%", "60%"], //饼图的半径，数组的第一项是内半径，第二项是外半径。[ default: [0, '75%'] ]
            avoidLabelOverlap: true, //是否禁用动画效果
            /*  animation: false, */ label: {
              normal: {
                show: true, //是否显示标签
                position: "left",
                //a（系列名称），b（数据项名称），c（数值）, d（百分比）
                formatter: "{b}:{c}人（{d}%）",
              },
              emphasis: {
                //鼠标放在圆环上显示的标签样式
                show: true,
                textStyle: {
                  fontSize: "12",
                  fontWeight: "bold",
                },
              },
            },
            labelLine: {
              normal: {
                show: true, //是否显示引导线
                length: 10, //百分比引导线
                length2: 20, //视觉引导项第二段的长度。
              },
            },
            itemStyle: {
              normal: {
                borderColor: "#FFFFFF",
                borderWidth: 1,
                label: {
                  show: true,
                  formatter: "{d}%",
                },
              },
            },
            // 系列中的数据内容数组。
            // data:[
            //     {value:15, name:'死亡'},
            //     {value:20, name:'转科'},
            // ]
            data: this.myChartBArr,
          },
        ],
      };
      let myChartA = this.echarts.init(document.getElementById("myChartA"));
      let myChartB = this.echarts.init(document.getElementById("myChartB"));
      myChartA.setOption(optionA);
      myChartB.setOption(optionB);
    },
  },
};
</script>

<style lang="scss">
.routineIconWrapper {
  margin-top: 16px;
  .headerName {
    margin-top: 16px;
    padding-left: 32px;
  }
  .container {
    box-sizing: border-box;
  }
  .LeftContent {
    padding: 32px;
    .left {
      height: 100%;
      position: relative;
      padding-left: 32px;
      // border-right:1px solid #E8E8E8;
      .floatDiv {
        position: absolute;
        right: -10px;
        width: 1px;
        height: 100%;
        background-color: #e8e8e8;
      }
    }
  }
  .oneContent {
    display: flex;
    justify-content: space-between;
    padding-right: 20px;
    .item {
      display: flex;
      .itemRight {
        margin-left: 16px;
        .itemData {
          font-size: 28px;
          line-height: 30px;
        }
        .itemRightP {
          padding-bottom: 8px;
        }
      }
      img {
        width: 54px;
        height: 54px;
      }
    }
  }

  .oneContentTwo {
    margin-top: 48px;
  }
  .twoContent {
    display: flex;
    justify-content: space-between;
    padding: 32px;
    .item {
      width: 160px;
      height: 160px;
      position: relative;
      .itemFloat {
        position: absolute;
        top: 60px;
        left: 48px;
      }
      .itemFloatTwo {
        position: absolute;
        top: 60px;
        left: 39px;
      }
      .itemFloatThree {
        position: absolute;
        top: 60px;
        left: 39px;
      }
      .el-progress__text {
        top: 60% !important;
      }
    }
  }
  .secondLeftContent {
    background-color: #f5f5f5;
    padding-top: 16px;
  }
  .secondContent {
    height: 300px;
    padding-left: 32px;
    padding-top: 16px;
    background-color: #fff;
    .myChartA {
      position: relative;
      // margin:0 auto;
    }
  }
  .threeContent {
    background-color: #f5f5f5;
    padding-top: 16px;

    .threeLeftContent {
      padding-top: 16px;
      padding-left: 32px;
      height: 400px;
      background-color: #fff;
      .myChartOne {
        height: 280px;
        width: 100%;
      }
      .threeTitle {
        padding-bottom: 72px;
      }
    }
  }
  .fourthContent {
    background-color: #f5f5f5;
    padding-top: 16px;
    .fourthLeftContent {
      padding-top: 16px;
      padding-left: 32px;
      height: 400px;
      background-color: #fff;
      .myChartTwo {
        height: 280px;
        width: 100%;
      }
      .fourthTitle {
        padding-bottom: 72px;
      }
    }
  }
  .fiveContent {
    background-color: #f5f5f5;
    padding-top: 16px;
    .fiveLeftContent {
      padding-top: 16px;
      padding-left: 32px;
      height: 400px;
      background-color: #fff;
      .myChartThree {
        height: 280px;
        width: 100%;
      }
      .fiveTitle {
        padding-bottom: 72px;
      }
    }
  }
  .search_data {
    width: 100%;
    height: 132px;
    padding: 8px 24px;
    // overflow:hidden;
    box-sizing: border-box;
    .search_content {
      width: 100%;
      height: 100%;
      // padding:24px 32px;
      background-color: #fff;
      box-sizing: border-box;
    }
  }
  .btnLeft {
    float: left;
    margin-top: 24px;
    /* margin-bottom:20px; */
    .selectSearch {
      width: 224px !important;
    }
    .dateSearch {
      width: 342px !important;
    }
  }
}
</style>
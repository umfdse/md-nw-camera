<template>
  <div class="healCommissionIconWrapper">
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
            <el-select v-model="search_data.department" placeholder="请选择"  clearable filterable class="selectSearch">
                <el-option
                    v-for="(item,index) in departments"
                    :key="index"
                    :label="item.deptName"
                    :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
             <el-form-item label="开始时间" size="mini" class="btnLeft">
                        <el-date-picker
                                v-model="search_data.startDate"
                                value-format="yyyy-MM"
                                format="yyyy-MM"
                                type="month"
                                placeholder="选择月份"
                                :clearable="false"
                                :picker-options="pickerOptions1"
                                @change="changeStartDate">
                        </el-date-picker>
                    </el-form-item>
                     <el-form-item label="结束时间" size="mini" class="btnLeft">
                        <el-date-picker
                                v-model="search_data.endDate"
                                 value-format="yyyy-MM"
                                format="yyyy-MM"
                                type="month"
                                placeholder="选择月份"
                                 :clearable="false"
                                :picker-options="pickerOptions2"
                                @change="changeEndDate">
                        </el-date-picker>
                    </el-form-item>
         <el-form-item class="btnLeft  searBtn">
           <el-button type="primary" @click="viewBtn()" v-has="`user:add`">查询</el-button>
        </el-form-item>
           <el-form-item class="btnLeft">
           <el-button  @click="viewReset()" v-has="`user:add`">重置</el-button>
        </el-form-item>
      </el-form>
       </div>
    </div>
    <div class="headerName">ICU床位使用情况和患者收治情况统计</div>
    <div class="container">
      <el-row :gutter="20">
        <el-col :span="6" class="oneContent">
          <div class="item">
            <div class="itemRight">
              <p class="itemTitle">ICU收治率</p>
              <!-- <div class="itemData" id="myEchartOne"></div> -->
              <div class="itemData">
                <el-progress type="circle" color="#00D5A5" :stroke-width="strokeWidth" :percentage="formData.icuReceiveRate"></el-progress>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="6" class="oneContent">
          <div class="item">
            <div class="itemRight">
              <p class="itemTitle">ICU患者收治床日率</p>
              <div class="itemData" >
                <el-progress type="circle" color="#44C0F6" :stroke-width="strokeWidth" :percentage="formData.icuPatientsReceiveBedRate"></el-progress>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="6" class="oneContent">
          <div class="item">
            <div class="itemRight">
              <p class="itemTitle">48H重返重症医学科人数</p>
              <div class="itemData itemNumber" >
                <div class="itemNum">{{formData.comingBackToIcuPatientOf48H}}人</div>
                <span class="itemWz">重返率</span>
                <el-progress type="circle" color="#F9B344" :stroke-width="strokeWidth" :percentage="formData.comingBackToIcuRateOf48H"></el-progress>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="6" class="oneContent">
          <div class="item">
            <div class="itemRight">
              <p class="itemTitle">非计划转入ICU人数</p>
              <div class="itemData itemNumber" >
                 <div class="itemNum">{{formData.isNotPlanToTransferToIcuCount}}人</div>
                <span class="itemWz">重返率</span>
                <el-progress type="circle" color="#7972F3" :stroke-width="strokeWidth" :percentage="formData.isNotPlanToTransferToIcuRate"></el-progress>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="twoLeftContent">
        <div class="nameTwo">ICU患者死亡情况</div>
        <el-col :span="6" class="twoContent">
          <div class="item">
            <div class="itemRight">
              <p class="itemTitle">预计病死数</p>
              <div class="itemData">{{formData.expectDeathPatientCount}}</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6" class="twoContent">
          <div class="item">
            <div class="itemRight">
              <p class="itemTitle">预计病死率</p>
              <div class="itemData">{{formData.expectDeathPatientRate}}</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6" class="twoContent">
          <div class="item">
            <div class="itemRight">
              <p class="itemTitle">实际病死数</p>
              <div class="itemData">{{formData.realityDeathPatientCount}}</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6" class="twoContent">
          <div class="item">
            <div class="itemRight">
              <p class="itemTitle">标化病死指数</p>
              <div class="itemData">{{formData.standardizedMortalityIndex}}</div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="secondLeftContent">
        <el-col :span="12">
          <div class="secondContent secondContentLeft">
            <div class="secondTitle">
              APACHE Ⅱ≥15分的患者收治率（入ICU 24H内）
            </div>
            <div class="myChartA" id="myChartA" :style="{ height: '300px' }">
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="secondContent">
            <div class="secondTop">
              <p class="secondTitle">感染性休克集束化（bundle）完成情况统计</p>
               <div class="secondPercentage">
                    <span class="SecondLeft">感染性休克3H完成集束化治疗bundle完成率</span>
                    <span class="percentage"><el-progress :stroke-width="strokeWidth" :percentage="formData.finishedBundleRateOf3H" :color="customColor1"></el-progress></span>
                    <span class="percentageFooter">{{formData.finishedBundleOf3H}}人</span>
                </div>
                <div class="secondPercentage">
                      <span class="SecondLeft ">感染性休克6H完成集束化治疗bundle完成率</span>
                    <span class="percentage"><el-progress :stroke-width="strokeWidth" :percentage="formData.finishedBundleRateOf6H" :color="customColor2"></el-progress></span>
                    <span class="percentageFooter">{{formData.finishedBundleOf6H}}人</span>
                </div>
            </div>
            <div class="secondCenter">
              <p class="secondTitle">ICU抗菌药物治疗前病原学送检情况统计</p>
                <div class="secondPercentage">
                    <span class="SecondLeft secondLeftOne">ICU抗菌药物治疗前病原学送检率</span>
                    <span class="percentage"><el-progress :stroke-width="strokeWidth" :percentage="formData.etiologicalExaminationRateBeforeToICU" :color="customColor3"></el-progress></span>
                    <!-- <span class="percentageFooter">245人</span> -->
                </div>
            </div>
            <div class="secondFooter">
              <p class="secondTitle">ICU深静脉血栓（DVT）预防情况统计</p>
                <div class="secondPercentage">
                    <span class="SecondLeft secondLeftTwo">ICU深静脉血栓（DVT）预防率</span>
                    <span class="percentage"><el-progress  :stroke-width="strokeWidth" :percentage="formData.preventDvtRateOfIcu" :color="customColor4"></el-progress></span>
                    <span class="percentageFooter">{{formData.preventDvtCountOfIcu}}人</span>
                </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="threeContent">
        <div class="nameThree">ICU患者气管插管情况</div>
        <el-col :span="12" class="threeLeftContent">
          <div class="item">
            <div class="itemLeft">
              <div class="itemChrats">
                 <div class="itemFloat">拔管率</div>
                 <el-progress type="circle" color="#F9B344" :stroke-width="strokeWidth" :percentage="formData.isNotPlanCannualOutRateOfIcu"></el-progress>
              </div>
            </div>
            <div class="itemRight">
              <p class="itemTitle">ICU非计划气管插管拔管人数</p>
              <p class="itemData">{{formData.isNotPlanCannualOutCountOfIcu}}人</p>
            </div>
          </div>
        </el-col>
        <el-col :span="12" class="threeLeftContent">
          <div class="item">
            <div class="itemLeft">
              <div class="itemChrats">
                <div  class="itemFloat">再插率</div>
                 <el-progress type="circle" color="#00D5A5" :stroke-width="strokeWidth" :percentage="formData.isNotPlanCountOfIcuRepeatCannualRateOf48H"></el-progress>
              </div>
            </div>
            <div class="itemRight">
              <p class="itemTitle">ICU非计划气管拔管后48H内再插人数</p>
              <p class="itemData">{{formData.isNotPlanCannualOutCountOfIcuRepeatCannualOf48H}}人</p>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
// import eventBus from "@/utils/eventBus.js"
// import moment from 'moment'
import {getSessionData} from "@/utils/SimpleSessionStorageService"
export default {
  data() {
    return {
       pickerOptions1: {
                    disabledDate:(time)=> {
                        if (this.search_data.endDate != null && this.search_data.endDate != "") {
                            return time.getTime() > this.search_data.endDate||time.getTime()>new Date().getTime();
                        } else {
                            return false;
                        }
                    }
                },
                pickerOptions2: {
                    disabledDate:(time)=> {
                        if (this.search_data.startDate != null && this.search_data.startDate != "") {
                            return time.getTime() < this.search_data.startDate||time.getTime()>new Date().getTime();
                        } else {
                            return false;
                        }
                    }
                },
            search_data:{
                department:"",
                startDate: '',
                endDate: '',
                // updateTime:[]
            },
            departments:[],
       strokeWidth:10,
      percentage1:85,
      customColor1:"#44C0F6",
      percentage2:35,
      customColor2:"#00D5A5",
      percentage3:45,
      customColor3:"#7972F3",
      percentage4:45,
      customColor4:"#F9B344",
      beginDate:"",
      endDate:"",
      sourceDeptName:"",
      userId:"",
      formData:{
        icuReceiveRate:"",
        icuPatientsReceiveBedRate:"",
        comingBackToIcuRateOf48H:"",
        comingBackToIcuPatientOf48H:"",
        isNotPlanToTransferToIcuCount:"",
        isNotPlanToTransferToIcuRate:"",
        expectDeathPatientCount:"",
        expectDeathPatientRate:"",
        realityDeathPatientCount:"",
        standardizedMortalityIndex:"",
        apacheiiScoreLessThan15ReceiveCount:"",
        apacheiiScoreMoreThan15ReceiveCount:"",
        apacheiiScoreLessThan15ReceiveRate:"",
        apacheiiScoreMoreThan15ReceiveRate:"",
        icuReceiveTotal:"",
        finishedBundleOf3H:"",	
        finishedBundleOf6H:"",	
        finishedBundleRateOf3H:"",
        finishedBundleRateOf6H:"",
        etiologicalExaminationRateBeforeToICU:"",
        preventDvtCountOfIcu:"",	
        preventDvtRateOfIcu:"",
        isNotPlanCannualOutCountOfIcu:"",
        isNotPlanCannualOutCountOfIcuRepeatCannualOf48H:"",
        isNotPlanCannualOutRateOfIcu:"",
        isNotPlanCountOfIcuRepeatCannualRateOf48H:"",

        
      },
      totalNumber:"",
    };
  },
  // inject:['data'],
  created(){
      this.search_data.startDate = new Date().format("yyyy-MM")
       this.search_data.endDate = new Date().format("yyyy-MM")
    },
  mounted() {
    this.userId = getSessionData("userId")
    // eventBus.$on('healCommission',target=>{
    //       this.beginDate = target.startDate
    //       this.endDate = target.endDate
    //       this.sourceDeptName =target.department
    //       this.loadData()
    // })
    this.loadData()
    this.getDepartment()
  },
  // inject:['data'],
  methods: {
    changeStartDate(){
          let year =this.search_data.startDate.getFullYear()
          let mouth = (this.search_data.startDate.getMonth()+1)>=10?(this.search_data.startDate.getMonth()+1):"0"+(this.search_data.startDate.getMonth()+1)
          this.search_data.startDate = year+'-'+mouth
          // this.search_data.startDate = this.search_data.startDate.format("YYYY-MM")
          console.log(this.search_data.startDate)
        },
        changeEndDate(){
           let year =this.search_data.endDate.getFullYear()
          let mouth = (this.search_data.endDate.getMonth()+1)>=10?(this.search_data.endDate.getMonth()+1):"0"+(this.search_data.endDate.getMonth()+1)
          this.search_data.endDate = year+'-'+mouth
        },
        getDepartment(){
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
          type:'1'
        }
        this.$axios({
          url: global.url + '/icu/api/queryDept',
          method: 'get',
          headers: {
            'Content-Type': 'application/json'
          },
          params: param
        }).then(res => {
          let data=res.data
          if (data.msg ===201) {
            // this.departmentOption = data.respData && data.respData.list ? data.respData.list : []
            this.departments = data.respData
          } else {
            this.$message.error(data.content)
          }
        })
        },
        viewBtn(){
          this.loadData();
        },
        viewReset(){
           this.search_data.startDate = new Date().format("yyyy-MM");
          this.search_data.endDate = new Date().format("yyyy-MM");
          this.search_data.department = "";
          this.loadData();
        },
    loadData(){
      let url = "/icu/report/queryNHCAccusationStatistics";
      let params = {
            beginDate:this.search_data.startDate,
              endDate:this.search_data.endDate,
              deptId:this.search_data.department,
          // userId:this.userId
      }
      let that = this
      this.$axios.post(global.url+url,params).then(function(res){
        if(res.data.msg==201){
          // that.formData= res.data.respData
          let str = "%"
          for(let key in res.data.respData){
            if(!res.data.respData[key]){
              res.data.respData[key]=0
            }
          }
          console.log(res.data.respData)
           if(res.data.respData.finishedBundleRateOf3H.indexOf(str)){
            res.data.respData.finishedBundleRateOf3H= Number(res.data.respData.finishedBundleRateOf3H.slice(0,res.data.respData.finishedBundleRateOf3H.indexOf(str)))
          }
           if(res.data.respData.finishedBundleRateOf6H.indexOf(str)){
            res.data.respData.finishedBundleRateOf6H= Number(res.data.respData.finishedBundleRateOf6H.slice(0,res.data.respData.finishedBundleRateOf6H.indexOf(str)))
          }
           if(res.data.respData.icuReceiveRate.indexOf(str)){
            res.data.respData.icuReceiveRate= Number(res.data.respData.icuReceiveRate.slice(0,res.data.respData.icuReceiveRate.indexOf(str)))
          }
           if(res.data.respData.icuPatientsReceiveBedRate.indexOf(str)){
            res.data.respData.icuPatientsReceiveBedRate= Number(res.data.respData.icuPatientsReceiveBedRate.slice(0,res.data.respData.icuPatientsReceiveBedRate.indexOf(str)))
          }
           if(res.data.respData.comingBackToIcuRateOf48H.indexOf(str)){
            res.data.respData.comingBackToIcuRateOf48H= Number(res.data.respData.comingBackToIcuRateOf48H.slice(0,res.data.respData.comingBackToIcuRateOf48H.indexOf(str)))
          }
           if(res.data.respData.isNotPlanCannualOutRateOfIcu.indexOf(str)){
            res.data.respData.isNotPlanCannualOutRateOfIcu= Number(res.data.respData.isNotPlanCannualOutRateOfIcu.slice(0,res.data.respData.isNotPlanCannualOutRateOfIcu.indexOf(str)))
          }
           if(res.data.respData.isNotPlanCountOfIcuRepeatCannualRateOf48H.indexOf(str)){
            res.data.respData.isNotPlanCountOfIcuRepeatCannualRateOf48H= res.data.respData.isNotPlanCountOfIcuRepeatCannualRateOf48H.slice(0,res.data.respData.isNotPlanCountOfIcuRepeatCannualRateOf48H.indexOf(str))
          }
          if(res.data.respData.isNotPlanToTransferToIcuRate.indexOf(str)){
            res.data.respData.isNotPlanToTransferToIcuRate= Number(res.data.respData.isNotPlanToTransferToIcuRate.slice(0,res.data.respData.isNotPlanToTransferToIcuRate.indexOf(str)))
          }
          if(res.data.respData.etiologicalExaminationRateBeforeToICU.indexOf(str)){
            res.data.respData.etiologicalExaminationRateBeforeToICU= Number(res.data.respData.etiologicalExaminationRateBeforeToICU.slice(0,res.data.respData.etiologicalExaminationRateBeforeToICU.indexOf(str)))
          }
           if(res.data.respData.preventDvtRateOfIcu.indexOf(str)){
            res.data.respData.preventDvtRateOfIcu= Number(res.data.respData.preventDvtRateOfIcu.slice(0,res.data.respData.preventDvtRateOfIcu.indexOf(str)))
          }
          
          that.formData=res.data.respData
          that.totalNumber = that.formData.apacheiiScoreMoreThan15ReceiveCount + that.formData.apacheiiScoreLessThan15ReceiveCount
          console.log(that.formData,that.totalNumber)
          that.getEchart()
        }  
      })
    },
    getEchart(){
           let optionA = {
                    title: {//标题组件
                   textStyle: {    
                   color: "#333333",    
                   fontSize: 12,   
                   }
                },
    		    tooltip: {
    		        trigger: 'item',
    		        formatter: "{a} <br/>{b}: {c} ({d}%)",
    		        textStyle:{    //图例文字的样式
                        color:'#fff',  //文字颜色
                        fontSize:10    //文字大小
                    }
    		    },
    		    graphic:[		       	       
    		         {
    		      		type: 'text',              
    		      		top: '40%',           
    		      		left: 'center',          
    		      		style: {
    		      		   text: '总人数',      
    		      		   fill: '#333333',       
    		      		   fontSize: 20,          
    		      		   fontWeight: 'normal'
    		      		}  		      		        
    		      	},{
    		      		type: 'text',              
    		      		top: '53%',           
    		      		left: 'center',          
    		      		style: {
    		      		   text: this.totalNumber,      
    		      		   fill: '#333333',       
    		      		   fontSize: 18,          
    		      		   fontWeight: 'normal'
    		      		}  		      		        
    		      	},      
    		    ],
                 color: [ '#7972F3','#FB5E91'],
    		    // 图例
    		    legend: {
    		    	// 图例选择的模式，控制是否可以通过点击图例改变系列的显示状态。默认开启图例选择，可以设成 false 关闭。
    		    	selectedMode: true, 
    		        /* orient: 'vertical', */
    		       /*  x : 'right',   //图例显示在右边
                    y: 'center',  */  //图例在垂直方向上面显示居中
                    bottom:30,
                    itemWidth:10,  //图例标记的图形宽度
                    itemHeight:10, //图例标记的图形高度
    		        data:['<15分','>=15分',],
    		        textStyle:{    //图例文字的样式
                        color:'#A6A8B6',  //文字颜色
                        fontSize:10    //文字大小
                    }
    		    },   		  
    		    series: [
    		        {
    		            name:'',//代表a的值，系列名称
    		            type:'pie',
    		            center:['50%','45%'], //饼图的中心（圆心）坐标，数组的第一项是横坐标，第二项是纵坐标。
    		            radius: ['50%', '60%'],//饼图的半径，数组的第一项是内半径，第二项是外半径。[ default: [0, '75%'] ]
    		            avoidLabelOverlap: true,
    		           /*  animation: false, */  //是否禁用动画效果
    		            label: {
    		                normal: {
    		                    show: true,//是否显示标签
    		                    position: 'left',                 
    		                    //a（系列名称），b（数据项名称），c（数值）, d（百分比）
    		                    formatter: "{b}:{c}人（{d}%）",
    		                },
    		                emphasis: {
    		                	//鼠标放在圆环上显示的标签样式
    		                    show: true,
    		                    textStyle: {
    		                        fontSize: '12',
    		                        fontWeight: 'bold'
    		                    }
    		                }
    		            },
    		            labelLine: {
    		                normal: {
    		                    show: true,//是否显示引导线
  	               		        length:10,  //百分比引导线
  	               		        length2:20    //视觉引导项第二段的长度。
    		                }
    		            },
    		            itemStyle: {
                            normal: {
                                borderColor: "#FFFFFF", 
                                borderWidth: 1, 
                                label:{  
                                    show:true,  
                                    formatter:'{d}%'  
                                },  
                            }
                        },
                        // 系列中的数据内容数组。
    		            data:[
                              {value:this.formData.apacheiiScoreLessThan15ReceiveCount, name:'<15分'},
                            {value:this.formData.apacheiiScoreMoreThan15ReceiveCount, name:'>=15分'},
    		            ]
    		        }
    		    ]
            }
            let myChartA = this.echarts.init(document.getElementById("myChartA"));
            myChartA.setOption(optionA); 

        }
  },
};
</script>

<style lang="scss">
.healCommissionIconWrapper {
  margin-top: 16px;
  .headerName {
    margin-top: 16px;
    padding-left: 32px;
    // font-size: 16px;
    color: #000;
  }
  .container {
    box-sizing: border-box;
  }

  .oneContent {
    padding-top: 32px;
    padding-bottom: 24px;
    box-sizing: border-box;
    .item {
      border-right: 1px solid #f5f5f5;
      .itemRight {
        text-align: center;
        .itemTitle {
          color: #000000;
          // font-size: 16px;
          line-height: 22px;
          padding-bottom: 16px;
        }
        .itemData {
          margin: 0 auto;
          // margin-top: 16px;
          width: 120px;
          height: 120px;
          // border:1px solid salmon;
        }
        .itemNumber{
          position: relative;
           .itemNum{
            position: absolute;
            top:40px;
            left:52px;
            // font-size: 28px;
            line-height: 16px;
          }
          .itemWz{
            position: absolute;
            top:70px;
            left:25px;
            font-size: 14px;
            line-height: 22px;
          }
          .el-progress__text{
              top: 64%!important;
              left:19%!important;
          }
        }
      }
    }
  }
  .el-progress-bar{
            width: 90%!important
        }
  .twoLeftContent {
    background-color: #f5f5f5;
    padding-top: 16px;
    .nameTwo {
      background-color: #fff;
      padding-top: 16px;
      padding-left: 42px;
      //  font-size: 16px;
      color: #000;
    }
  }
  .twoContent {
    padding-top: 32px;
    padding-bottom: 24px;
    box-sizing: border-box;
    background-color: #fff;
    .item {
      border-right: 1px solid #f5f5f5;

      .itemRight {
        text-align: center;
        .itemTitle {
          color: #000000;
          // font-size: 16px;
          line-height: 22px;
        }
        .itemData {
          margin-top: 16px;
        }
      }
    }
  }
  .secondLeftContent {
    background-color: #f5f5f5;
    padding-top: 16px;
  }
  .secondContentLeft {
    background-color: #fff;
    padding-left: 32px;
    padding-top: 16px;
  }
  .secondContent {
    // padding-left:32px;
    // padding-top:16px;
    height: 401px;
    // background-color: #fff;
    .secondPercentage{
        width: 100%;
        padding-bottom: 24px;
        .SecondLeft{
            padding-right:16px;
            // display: inline-block;
            // width: 30%;
        }
        .secondLeftOne{
          padding-right: 72px;
        }
        .secondLeftTwo{
          padding-right: 72px;
        }
        .percentage{
            display: inline-block;
            width:40%;
        }
        .percentageFooter{
            display: inline-block;
            width:10%;
        }
    }
    .secondTitle{
      padding-bottom: 32px;
    }
    .secondTop {
      box-sizing: border-box;
      width: 100%;
      height: 148px;
      padding-top: 16px;
      padding-left: 32px;
      background-color: #fff;
    }
    .secondCenter {
      //  box-sizing: border-box;
      width: 100%;
      height: 104px;
      margin-top: 16px;
      padding-top: 16px;
      padding-left: 32px;
      background-color: #fff;
    }
    .secondFooter {
      // box-sizing: border-box;
      width: 100%;
      height: 117px;
      margin-top: 16px;
      padding-top: 16px;
      padding-left: 32px;
      background-color: #fff;
    }
  }
  .threeContent {
    background-color: #f5f5f5;
    padding-top: 16px;
    padding-bottom: 24px;
  }
  .nameThree {
    padding-top: 16px;
    padding-left: 42px;
    background-color: #fff;
  }
  .threeLeftContent {
    //  padding-top:32px;
    padding-bottom: 24px;
    background-color: #fff;
    .item {
      display: flex;
      padding-left:32px;
      border-right: 1px solid #f5f5f5;

      justify-content: center;
      // width: ;
      height: 120px;
      .itemChrats {
        width: 120px;
        height: 120px;
        position: relative;
        .itemFloat{
          position: absolute;
          top:42px;
          left:42px;
        }
         .el-progress__text{
              top: 60%!important;
          }
        // border: 1px solid red;
      }
      .itemRight {
        margin-left: 24px;
        .itemTitle {
          color: #000000;
          font-size: 16px;
          line-height: 22px;
          margin-top: 20px;
        }
        .itemData {
          font-size: 28px;
          line-height: 16px;
          margin-top: 24px;
        }
      }
    }
  }
  .search_data{
            width:100%;
            height: 132px;
            padding:8px 24px;
            // overflow:hidden;
            box-sizing: border-box;
            .search_content{
                width:100%;
                height: 100%;
                // padding:24px 32px;
                 background-color: #fff;
                  box-sizing: border-box;
            }
        }
         .btnLeft {
            float: left;
            margin-top:24px;
            /* margin-bottom:20px; */
            .selectSearch{
              width: 224px !important;
            }
            .dateSearch{
              width:342px !important; ;
            }
        }
}
</style>
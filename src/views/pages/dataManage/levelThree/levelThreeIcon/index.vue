<template>
  <div class="levelThreeIconWrapper">
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
     <div class="headerName">
         ICU床位使用情况和患者收治情况统计
     </div>
     <div class="container">
         <el-row :gutter="20">
            <el-col :span="6" class="oneContent">
                <div class="item">
                    <div class="itemLeft">
                        <div class="itemChrats">
                            <div class="itemTop">重返率</div>
                            <el-progress type="circle" color="#F9B344" :stroke-width="strokeWidth" :percentage="formData.hoursUnexpectedReturnICURate24" ></el-progress>
                        </div>
                    </div>
                    <div class="itemRight">
                        <p class="itemTitle">非预期24H重返重症医学科人数</p>
                        <p class="itemData">{{formData.hoursUnexpectedReturnICUNum24}}人</p>
                    </div> 
                  </div>
            </el-col>
            <el-col :span="6" class="oneContent">
                <div class="item">
                    <div class="itemLeft">
                        <div class="itemChrats">
                            <div class="itemTop">重返率</div>
                            <el-progress type="circle" color="#F9B344" :stroke-width="strokeWidth" :percentage="formData.hoursUnexpectedReturnICURate48"></el-progress>
                        </div>
                    </div>
                    <div class="itemRight">
                        <p class="itemTitle">非预期48H重返重症医学科人数</p>
                        <p class="itemData">{{formData.hoursUnexpectedReturnICUNum48}}人</p>
                    </div> 
                  </div>
            </el-col>
            <el-col :span="6" class="oneContent">
                <div class="item">
                    <div class="itemLeft">
                        <div class="itemChrats">
                             <div  class="itemTop">发生率</div>
                             <el-progress type="circle" color="#00D5A5"  :stroke-width="strokeWidth" :percentage="formData.pressureUlcerRate"></el-progress>
                        </div>    
                    </div>
                    <div class="itemRight">
                        <p class="itemTitle">重症患者压疮发生人数</p>
                        <p class="itemData">{{formData.pressureNum}}人</p>
                    </div> 
                  </div>
            </el-col>
            <el-col :span="6" class="oneContent">
                <div class="item">
                    <div class="itemLeft">
                        <div class="itemChrats">
                              <div  class="itemTop">发生率</div>
                             <el-progress type="circle" color="#7972F3" :stroke-width="strokeWidth" :percentage="formData.windpipeFallOffRate"></el-progress>
                        </div>
                    </div>
                    <div class="itemRight">
                        <p class="itemTitle">人工气道脱出例数</p>
                        <p class="itemData">{{formData.windpipeFallOffNum}}例</p>
                    </div> 
                  </div>
            </el-col>
        </el-row>

         <el-row :gutter="20" class="secondLeftContent">
              <el-col :span="12" >
                  <div class="secondContent">
                      <div class="secondTitle">
                          呼吸机相关肺炎（VAP）统计
                      </div>
                      <div class="secondPercentage">
                          <span class="SecondLeft">预防率</span>
                          <span class="percentage"><el-progress :stroke-width="strokeWidth" :percentage="formData.vapPreventionRate" :color="customColor1"></el-progress></span>
                          <span>{{formData.vapPreventionNum}}人</span>
                      </div>
                      <div class="secondPercentage">
                           <span class="SecondLeft">发病率</span>
                          <span class="percentage">
                              <!-- <el-progress :stroke-width="strokeWidth" :percentage="formData.peopleWithVAPRate" :color="customColor2"></el-progress> -->
                              <progress :value="formData.peopleWithVAPRate" max="1000" style="width:70%"></progress>
                              </span>
                              <span>{{formData.peopleWithVAPRate}}‰</span>
                          <span>{{formData.peopleWithVAPNum}}例</span>
                      </div>
                  </div>
              </el-col>
              <el-col :span="12" >
                   <div class="secondContent">
                      <div class="secondTitle">
                          留置导管感染统计
                      </div>
                       <div class="secondPercentage">
                          <span class="SecondLeft">中心静脉置管相关血流感染发生率</span>
                          <span class="percentageRight">
                              <!-- <el-progress :stroke-width="strokeWidth" :percentage="formData.centralVenousCatheterRate" :color="customColor3"></el-progress> -->
                               <progress :value="formData.centralVenousCatheterRate" max="1000" style="width:90%"></progress>
                              </span>
                              <span>{{formData.centralVenousCatheterRate}}‰</span>
                          <span>{{formData.centralVenousCatheterNum}}例</span>
                      </div>
                      <div class="secondPercentage">
                           <span class="SecondLeft">留置导尿相关泌尿系感染发病率</span>
                          <span class="percentageRight">
                              <!-- <el-progress :stroke-width="strokeWidth" :percentage="formData.urinaryTubeInfectionRate" :color="customColor4"></el-progress> -->
                               <progress :value="formData.urinaryTubeInfectionRate" max="1000" style="width:90%"></progress>
                              </span>
                              <span>{{formData.urinaryTubeInfectionRate}}‰</span>
                          <span>{{formData.urinaryTubeInfectionNum}}例</span>
                      </div>
                  </div>
              </el-col>
         </el-row>
     </div>
  </div>
</template>

<script>
//   import eventBus from "@/utils/eventBus.js"
// import moment from 'moment'
export default {
    data(){
        return{
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
            formData:{
                hoursUnexpectedReturnICUNum24:"",
                hoursUnexpectedReturnICURate24:"",
                hoursUnexpectedReturnICUNum48:"",
                hoursUnexpectedReturnICURate48:"",
                pressureUlcerRate:"",
                peopleWithVAPNum:"",
                peopleWithVAPRate:"",
                pressureNum:"",
                windpipeFallOffNum:"",//气管脱落数
                windpipeFallOffRate:"",//气管脱落率
                vapPreventionNum:"",
                vapPreventionRate:"",
                centralVenousCatheterNum:"",
                centralVenousCatheterRate:"",
                urinaryTubeInfectionNum:"",
                urinaryTubeInfectionRate:""
            },
            strokeWidth:10,
            customColor1:"#7972F3",
            customColor2:"#FB5E91",
            customColor3:"#44C0F6",
            customColor4:"#F9B344",
            beginDate:"",
            endDate:"",
            sourceDeptName:"",
            userId:"",
        }
    },
    // inject:['data'],
     created(){
      this.search_data.startDate = new Date().format("yyyy-MM")
       this.search_data.endDate = new Date().format("yyyy-MM")
    },
    mounted(){
        // eventBus.$on('levelThree',target=>{
        //      this.beginDate = target.startDate
        //     this.endDate = target.endDate
        //     this.sourceDeptName =target.department
        //     this.loadData()
        //  })
        this.loadData()
        this.getDepartment()
    },
    methods:{
        // format(percentage){
        //     return percentage =`${percentage}‰`
        // },
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
            this.loadData()
        },
        viewReset(){
            this.search_data.startDate = new Date().format("yyyy-MM");
            this.search_data.endDate = new Date().format("yyyy-MM");
            this.search_data.department = "";
            this.loadData();
        },
        loadData(){
            let that = this
          let url ="/icu/report/queryLevel3HospitalChargesStatistics"
          let params = {
              beginDate:this.search_data.startDate,
              endDate:this.search_data.endDate,
              deptId:this.search_data.department,
          }
          console.log(params)
            this.$axios.post(global.url+url,params).then(function(res){
                //   that.tableData = res.data.respData.list;
                let str = "%"
                let strr="‰"
                for(let key in res.data.respData){
                    if(!res.data.respData[key]){
                    res.data.respData[key]=0
                    }
                }
                console.log(res.data.respData)
                if(res.data.respData.peopleWithVAPRate.indexOf(strr)){
                    res.data.respData.peopleWithVAPRate= Number(res.data.respData.peopleWithVAPRate.slice(0,res.data.respData.peopleWithVAPRate.indexOf(strr)))
                }
                 if(res.data.respData.pressureUlcerRate.indexOf(str)){
                    res.data.respData.pressureUlcerRate= Number(res.data.respData.pressureUlcerRate.slice(0,res.data.respData.pressureUlcerRate.indexOf(str)))
                }
                 if(res.data.respData.vapPreventionRate.indexOf(str)){
                    res.data.respData.vapPreventionRate= Number(res.data.respData.vapPreventionRate.slice(0,res.data.respData.vapPreventionRate.indexOf(str)))
                }
                 if(res.data.respData.windpipeFallOffRate.indexOf(str)){
                    res.data.respData.windpipeFallOffRate= Number(res.data.respData.windpipeFallOffRate.slice(0,res.data.respData.windpipeFallOffRate.indexOf(str)))
                }
                 if(res.data.respData.hoursUnexpectedReturnICURate24.indexOf(str)){
                    res.data.respData.hoursUnexpectedReturnICURate24= Number(res.data.respData.hoursUnexpectedReturnICURate24.slice(0,res.data.respData.hoursUnexpectedReturnICURate24.indexOf(str)))
                }
                 if(res.data.respData.hoursUnexpectedReturnICURate48.indexOf(str)){
                    res.data.respData.hoursUnexpectedReturnICURate48= Number(res.data.respData.hoursUnexpectedReturnICURate48.slice(0,res.data.respData.hoursUnexpectedReturnICURate48.indexOf(str)))
                }
                  if(res.data.respData.centralVenousCatheterRate.indexOf(str)){
                    res.data.respData.centralVenousCatheterRate= Number(res.data.respData.centralVenousCatheterRate.slice(0,res.data.respData.centralVenousCatheterRate.indexOf(str)))
                }
                  if(res.data.respData.urinaryTubeInfectionRate.indexOf(str)){
                    res.data.respData.urinaryTubeInfectionRate= Number(res.data.respData.urinaryTubeInfectionRate.slice(0,res.data.respData.urinaryTubeInfectionRate.indexOf(str)))
                }
                that.formData = res.data.respData
             })
        },
          //获取科室列表数据
        //   getDept(){
        //      let url = "/icu/report/queryIcuDeptList" 
        //      this.$axios.post(global.url+url).then(function(res){
        //         //   that.tableData = res.data.respData.list;
        //      })
        //   }

    }
}
</script>

<style lang="scss">
    .levelThreeIconWrapper{
        margin-top:16px;
        .headerName{
            margin-top:16px;
            padding-left:32px;
            font-size: 16px;
            color:#000;
        }
        .container{
            box-sizing: border-box;
        }
 
        .oneContent{
           padding-top:32px;
            padding-bottom: 24px;
          .item{
            display: flex;
            border-right:1px solid #F5F5F5;
           
            justify-content: center;
            // width: ;
            height: 120px;
            .itemChrats{
              width: 120px;
              height: 120px;
              position: relative;
              .itemTop{
                  position: absolute;
                  top:42px;
                  left:42px;
              }
               .el-progress__text{
                    top: 60%!important;
                }
            }
            .itemRight{
              margin-left:24px;
              .itemTitle{
                color:#000000;
                font-size: 16px;
                line-height: 22px;
                margin-top:20px;
              }
              .itemData{
                font-size: 28px;
                line-height: 16px;
                margin-top:24px;
              }
            }
          }
        }
        .el-progress-bar{
            width: 80%!important
        }
        .secondLeftContent{
            background-color: #F5F5F5;
            padding-top:16px;
        }
        .secondContent{
            height: 138px;
            padding-left:32px;
            padding-top:16px;
            background-color: #fff;
            .secondTitle{
                padding-bottom: 34px;
            }
            .secondPercentage{
                width: 100%;
                padding-bottom: 24px;
                .SecondLeft{
                    padding-right:16px;
                }
               
                .percentageRight{
                     display: inline-block;
                    width:55%;
                }
                .percentage{
                    display: inline-block;
                    width:80%;
                }
            }
        }
        // .threeContent{
        //       background-color: #F5F5F5;
        //     padding-top:16px;
        //     .threeLeftContent{
        //         padding-top:16px;
        //         padding-left:32px;
        //         height: 400px;
        //         background-color: #fff;
        //     }
        // }
        // .fourthContent{
        //       background-color: #F5F5F5;
        //     padding-top:16px;
        //      .fourthLeftContent{
        //         padding-top:16px;
        //         padding-left:32px;
        //         height: 400px;
        //         background-color: #fff;
        //     }
        // }
        //  .fiveContent{
        //       background-color: #F5F5F5;
        //     padding-top:16px;
        //      .fiveLeftContent{
        //         padding-top:16px;
        //         padding-left:32px;
        //         height: 400px;
        //         background-color: #fff;
        //     }
        // }
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
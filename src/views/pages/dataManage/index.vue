<template>
  <div class="dataWrapper">
      <!-- <div class="header">
      <div class="location">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item class="location-other" :to="{ path: '/dataManage' }">数据管理</el-breadcrumb-item>
          <el-breadcrumb-item class="location-current" >{{dataManageData}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div> -->
    <!-- <div class="search_data">
        <div class="search_content">
        <p>数据管理</p>
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
    </div> -->
    <div class="details">
        <div class="dataTabsWrapper">
              <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="常规质控指标统计"  name="first" >
                  <routine  v-if="routineShow" ></routine>
                </el-tab-pane>
                <el-tab-pane label="三级综合医院指标统计"  name="second">
                  <levelThree  v-if="levelThreeShow" ></levelThree>
                </el-tab-pane>
                <el-tab-pane label="卫健委质控统计"  name="third">
                  <healCommission  v-if="healCommissionShow"  ></healCommission>
                </el-tab-pane>
              </el-tabs>
        </div>
    </div>
  </div>
</template>

<script>
  // import eventBus from "@/utils/eventBus.js"
import Routine from "./routine/index"
import LevelThree from "./levelThree/index"
import HealCommission from "./healCommission/index"
// import moment from 'moment'
export default {
    components:{
        Routine,LevelThree,HealCommission
    },
    data(){
        return{    
                // pickerOptions1: {
                //     disabledDate:(time)=> {
                //         if (this.search_data.endDate != null && this.search_data.endDate != "") {
                //             return time.getTime() > this.endDate||time.getTime()>new Date().getTime();
                //         } else {
                //             return false;
                //         }
                //     }
                // },
                // pickerOptions2: {
                //     disabledDate:(time)=> {
                //         if (this.search_data.startDate != null && this.search_data.startDate != "") {
                //             return time.getTime() < this.search_data.startDate||time.getTime()>new Date().getTime();
                //         } else {
                //             return false;
                //         }
                //     }
                // },
            activeName: "first",
            search_data:{
                department:"",
                startDate: '',
                endDate: '',
                // updateTime:[]
            },
           dataManageData:"常规指控指标统计" ,
           departments:[],
           routineShow:true,
           levelThreeShow:false,
           healCommissionShow:false,


        }
    },
    // provide(){
    //   return{
    //     data:this.search_data
    //   }
      
    // },
    created(){
      this.search_data.startDate = new Date().format("yyyy-MM")
       this.search_data.endDate = new Date().format("yyyy-MM")
    },
    mounted(){
      // this.getDepartment()
    },
    methods:{
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
          // hospitalCode: '',
          // pageSize: 0,
          // pageNum: 1,
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
        viewBtn(){
          // if(this.search_data.startDate!=moment().format("YYYY-MM")){
          //    let year =this.search_data.startDate.getFullYear()
          //   let mouth = (this.search_data.startDate.getMonth()+1)>=10?(this.search_data.startDate.getMonth()+1):0+(this.search_data.startDate.getMonth()+1)
          //   this.search_data.startDate = year+'-'+mouth
          // }
          // if(this.search_data.endDate!=moment().format("YYYY-MM")){
          //    let year =this.search_data.endDate.getFullYear()
          //   let mouth = (this.search_data.endDate.getMonth()+1)>=10?(this.search_data.endDate.getMonth()+1):0+(this.search_data.endDate.getMonth()+1)
          //   this.search_data.endDate = year+'-'+mouth
          // }
          if(this.routineShow){
             eventBus.$emit('routine', this.search_data); 
          }else if(this.levelThreeShow){
             eventBus.$emit('levelThree', this.search_data); 
          }else if(this.healCommissionShow){
             eventBus.$emit('healCommission', this.search_data); 
          }     
        },
        viewReset(){
          this.search_data.startDate = new Date().format("yyyy-MM")
          this.search_data.endDate = new Date().format("yyyy-MM")
          this.search_data.department = ""
            if(this.routineShow){
             eventBus.$emit('routine', this.search_data); 
          }else if(this.levelThreeShow){
             eventBus.$emit('levelThree', this.search_data); 
          }else if(this.healCommissionShow){
             eventBus.$emit('healCommission', this.search_data); 
          }     
        },
        handleClick(tab, event) {
        console.log(tab, event)
        // this.currentTab = tab
        // console.log(this.currentTab)
        if(this.activeName=="first"){
          this.routineShow=true
          this.dataManageData = "常规指控指标统计"
        }else{
           this.routineShow=false
        }
        if(this.activeName=="second"){
          this.levelThreeShow=true
          this.dataManageData = "三级综合医院指标统计"
        }else{
           this.levelThreeShow=false
        }
        if(this.activeName=="third"){
          this.healCommissionShow=true
          this.dataManageData = "卫健委指控统计"
        }else{
           this.healCommissionShow=false
        }
      },
    }
}
</script>

<style lang="scss">
    .dataWrapper{
        width: 100%;
        height: 100%;
        background: #F5F5F5;
        .header {
            height: 24px;
            display: flex;
            align-items: center;
            padding-left: 24px;
            box-sizing: border-box;
            .location {
                font-size: 14px;
                .location-other {
                .el-breadcrumb__inner {
                    color: rgba(0, 0, 0, 0.87);
                }

                }
                .location-current {
                .el-breadcrumb__inner {
                    color: rgba(0, 0, 0, 0.38);

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
                padding:24px 32px;
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
        .details{
            width:100%;
            padding:24px;
            box-sizing: border-box;
            .dataTabsWrapper{
                width: 100%;
                height: 100%;
                // padding-left:32px;
                 box-sizing: border-box;
                background-color: #fff;
            }
            .el-tabs__nav-wrap{
              padding-left:32px;
            }
        }
    }
</style>
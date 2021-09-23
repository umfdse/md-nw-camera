<template>
  <div class="healCommissionFormWrapper">
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
           <el-form-item class="btnRight">
            <el-button @click="exportBtn()">导出</el-button>
        </el-form-item>
      </el-form>
       </div>
    </div>
    <div class="tableHead">
      <template v-for="(i, j) in tableHead">
        <el-row :key="j">
          <el-col
            :span="i.children ? 15 : 24"
            :style="i.children ? extent(i.children) : 'height:50px'"
            >
            {{ i.name }}
            
            </el-col
          >
          <el-col v-if="i.children" :span="9">
            <template v-for="(g, k) in i.children">
              <el-row :key="k">{{ g.name }}</el-row>
            </template>
          </el-col>
        </el-row>
      </template>
    </div>
    <div class="tableBody">
      <template v-for="(i, j) in tableBody">
        <el-row :key="j" class="singleRow">
          <template v-for="(g, k) in i">
            <el-col :span="24" class="column" :key="k">
              <div style="width: 120px">{{ g }}</div>
            </el-col>
          </template>
        </el-row>
      </template>
    </div>
  </div>
</template>

<script>
// import eventBus from "@/utils/eventBus.js"
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
          loading:true,
          tableData:[],
          spanArr: [],//用于存放每一行记录的合并数
          pos:0,
          beginDate:"",
          endDate:"",
          sourceDeptName:"",
          tableHead: [
        { name: "种类", id: 0, children: [{ name: "指标", id: 0 - 0 }] },
        {
          name: "ICU患者收治情况",
          id: 1,
          children: [
            { name: "ICU收治患者总数", id: 1 - 0 },
            { name: "非计划转入ICU患者人数（率）", id: 1 - 1 },
            { name: "48H重返ICU患者数（率）", id: 1 - 2 },
            { name: "同期医院收治患者总数", id: 1 - 3 },
            { name: "ICU患者收治率", id: 1 - 4 },
            { name: "同期医院收治患者总床日数", id: 1 - 5 },
            { name: "ICU患者实际占床总天数", id: 1 - 6 },
            { name: "ICU患者收治床日率", id: 1 - 7 },
          ],
        },
        {
          name: "急性生理与慢性健康评分（APACHE Ⅱ）≥15分的患者收治率（入ICU 24H内）",
          id: 4,
          children: [
            { name: "APACHE Ⅱ≥15分患者数", id: 2 - 0 },
            { name: "APACHE Ⅱ≥15分患者收治率", id: 2 - 1 },
          ],
        },

        {
          name: "感染性休克集束化（bundle）完成情况",
          id: 3,
          children: [
            { name: "3H完成集束化治疗bundle完成患者数", id: 3 - 0 },
            { name: "3H集束化治疗bundle完成率", id: 3 - 1 },
            { name: "6H完成集束化治疗bundle完成患者数", id: 3 - 2 },
            { name: "6H集束化治疗bundle完成率", id: 3 - 3 },
            { name: "同期ICU诊断为感染性休克总数", id: 3 - 4 },
          ],
        },
        {
          name: "ICU患者压疮发生情况",
          id: 2,
          children: [
            { name: "重症患者压疮发生人数", id: 4 - 0 },
            { name: "重症患者压疮发生率", id: 4 - 1 },
          ],
        },
         {
          name: "ICU治疗性抗菌药物使用前病原学送检情况",
          id: 3,
          children: [
            { name: "使用抗菌药物前病原学检验标本送检病例数（率）", id:5 - 0 },
            { name: "同期使用抗菌药物治疗总数", id: 5 - 1 },
          ],
        },
         {
          name: "ICU深静脉血栓（DVT）预防情况",
          id: 3,
          children: [
            { name: "进行深静脉血栓（DVT）预防的患者总数", id: 6 - 0 },
            { name: "ICU深静脉血栓（DVT）预防率", id: 6 - 1 },
          ],
        },
         {
          name: "ICU患者死亡情况",
          id: 3,
          children: [
            { name: "ICU收治患者预计病死人数", id: 7 - 0 },
            { name: "ICU收治患者预计病死率", id: 7 - 1 },
            { name: "ICU死亡人数", id: 7 - 2 },
            { name: "ICU患者标化病死指数", id: 7 - 3 },
          ],
        },
         {
          name: "ICU患者气管插管情况",
          id: 3,
          children: [
            { name: "非计划气管插管拔管人数", id: 8 - 0 },
            { name: "ICU非计划气管插管拔管率", id: 8 - 1 },
            { name: "气管插管非计划拔管后48H仔插管人数", id: 8 - 2 },
            { name: "ICU气管插管非计划拔管后48H仔插管率", id: 8 - 3 },
            { name: "ICU气管插管总人数", id: 8 - 4 },
          ],
        },
      ],
      tableBody: [],
        }
      },
      created(){
      this.search_data.startDate = new Date().format("yyyy-MM")
       this.search_data.endDate = new Date().format("yyyy-MM")
  },
      //  inject:['data'],
      mounted(){
        // eventBus.$on('healCommission',target=>{
        //   this.beginDate = target.startDate
        //   this.endDate = target.endDate
        //   this.sourceDeptName =target.department
        //   this.loadData()
        // })
        this.loadData()
        this.getDepartment()
      },
      methods:{
         exportBtn(){
            let url="/icu/report/exportNhcTable"
            let params = {
                    beginDate:this.search_data.startDate,
                    endDate:this.search_data.endDate,
                    deptId:this.search_data.department,
            }
            this.$axios.post(global.url + url,params).then((res) => {
              if(res.data.msg==201){
                let url  = res.data.content
                  window.location.href = url
                //  window.open(url)
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
        extent(list) {
          var height = 50 * list.length;
          return `height: ${height}px; line-height: ${height}px;`;
        },
        exportHeal(){
            let url="/icu/report/exportNhcTable"
            let params = {
             beginDate:this.search_data.startDate,
              endDate:this.search_data.endDate,
              deptId:this.search_data.department,
            }
            this.$axios.post(global.url + url,params).then((res) => {
              if(res.data.msg==201){
                let url  = res.data.content
                window.location.href = url
                // window.open(url)
              }
            })
        },
        loadData(){
          this.loading = false;
          let url = "/icu/report/queryNHCAccusationTable"
          let params = {
              beginDate:this.search_data.startDate,
              endDate:this.search_data.endDate,
              deptId:this.search_data.department,
            // userId:this.userId
          }
          let that = this
          this.$axios.post(global.url+url,params).then(function(res){
            that.tableBody = res.data.respData
          })
  
        },

      }
}
</script>

<style lang="scss">
    .healCommissionFormWrapper{
      padding:16px 80px 32px 32px;
     .exportBtn {
    text-align: right;
    padding-bottom: 10px;
  }
  .tableHead {
    width: 840px;
    float: left;
  }
  .tableBody {
    display: flex;
    // float:left;
    overflow-x: auto;
    white-space: nowrap;
  }
  .singleRow {
    width: 120px;
  }
  .el-row {
    margin: -1px -1px -1px -1px; /*解决边框重叠*/
    text-align: center;
    font-size: 14px;
    line-height: 50px;
    border: 1px solid #e6e6e6;
  }
  .column {
    border: 1px solid #e6e6e6;
    height: 51px;
    // border-top: none;
    border-left: none;
  }
  .search_data{
            width:100%;
            height: 132px;
            // padding:8px 24px;
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
        .btnRight{
          float:right;
           margin-top:24px;
        }
     
    }
</style>
.<template>
  <div class="levelThreeFormWrapper">
    <!-- <div class="table_container">
         <el-table v-loading="loading" :data="tableData" :span-method="objectSpanMethod" border >
        <div slot="empty" class="noData"></div>
        <el-table-column prop="id" label="种类" ></el-table-column>
        <el-table-column prop="name" label="指标" ></el-table-column>
        <el-table-column  :prop="item.mouth" :label="item.mouth"></el-table-column>
        <el-table-column prop="amount1" label="2021-2" ></el-table-column>
        <el-table-column prop="amount1" label="2021-3" ></el-table-column>
        <el-table-column prop="amount1" label="2021-4" ></el-table-column>
        <el-table-column prop="amount1" label="2021-5" ></el-table-column>
        <el-table-column v-for="(item, index) in mouthData"
                 :key="index"
                 :label="item">
          <template slot-scope="scope">
            <div v-if="editIndex === scope.$index">
              <el-input v-model="scope.row[item]"
                        class="changeInput"></el-input>
            </div>
            <div v-else>
              {{scope.row[item]}}
            </div>
          </template>
          </el-table-column>

      </el-table>



    </div> -->
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
            :span="i.children ? 12 : 24"
            :style="i.children ? extent(i.children) : 'height:50px'"
            >{{ i.name }}</el-col
          >
          <el-col v-if="i.children" :span="12">
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
// import eventBus from "@/utils/eventBus.js";
// import moment from 'moment'
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
      loading: true,
      // tableData:[],
      //  spanArr: [],//用于存放每一行记录的合并数
      //  pos:0,
      beginDate: "",
      endDate: "",
      sourceDeptName: "",
      userId: "",
      mouthData: [],
      tableHead: [
        { name: "种类", id: 0, children: [{ name: "指标", id: 0 - 0 }] },
        {
          name: "ICU患者收治情况",
          id: 1,
          children: [
            { name: "非预期约24H重返重症医学科人数", id: 1 - 0 },
            { name: "非预期约24H重返重症医学科返回率", id: 1 - 1 },
            { name: "非预期约48H重返重症医学科人数", id: 1 - 2 },
            { name: "非预期约48H重返重症医学科返回率", id: 1 - 3 },
          ],
        },
        {
          name: "ICU患者压疮发生情况",
          id: 4,
          children: [
            { name: "重症患者压疮发生人数", id: 2 - 0 },
            { name: "重症患者压疮发生率", id: 2 - 1 },
          ],
        },

        {
          name: "ICU患者留置导管情况",
          id: 3,
          children: [
            { name: "气管脱落数", id: 3 - 0 },
            { name: "气管脱落率", id: 3 - 1 },
            { name: "中心静脉置管相关血流感染（CRBSI）发生人数", id: 3 - 2 },
            { name: "中心静脉置管相关血流感染（CRBSI）发生率", id: 3 - 3 },
            { name: "留置导尿相关泌尿系感染（CAUTI）发生人数", id: 3 - 4 },
            { name: "留置导尿相关泌尿系感染（CAUTI）发生率", id: 3 - 5 },
          ],
        },
        {
          name: "ICU患者呼吸机相关肺炎发病情况",
          id: 2,
          children: [
            { name: "呼吸机相关肺炎（VAP）发病人数", id: 4 - 0 },
            { name: "呼吸机相关肺炎（VAP）发病率", id: 4 - 1 },
            { name: "呼吸机相关肺炎（VAP）预防率", id: 4 - 2 },
            { name: "呼吸机相关肺炎（VAP）预防人数", id: 4 - 3 },
          ],
        },
      ],
      tableBody: [
        // {
        //     name:'投标1',
        //     issue:5,
        //     theSameCreatePer:'是',
        //     theSameAmendPer:'是',
        //     ipTheSame:'是',
        //     macTheSame:'是',
        //     existMatter:'是',
        //     personRep:'是',
        //     elsePer:'是',
        //     err:'是',
        //     quote:'是',
        //     theRest:'无'
        // },
        // {
        //     name:'投标2',
        //     issue:10,
        //     theSameCreatePer:'否',
        //     theSameAmendPer:'否',
        //     ipTheSame:'否',
        //     macTheSame:'否',
        //     existMatter:'否',
        //     personRep:'否',
        //     elsePer:'否',
        //     err:'否',
        //     quote:'否',
        //     theRest:'有'
        // },
      ],
    };
  },
  // inject: ["data"],
  created(){
      this.search_data.startDate = new Date().format("yyyy-MM")
       this.search_data.endDate = new Date().format("yyyy-MM")
  },
  mounted() {
    // eventBus.$on("levelThree", (target) => {
    //   this.beginDate = target.startDate;
    //   this.endDate = target.endDate;
    //   this.sourceDeptName = target.department;
    //   this.spanArr = [];
    //   this.loadData();
    // });
    this.loadData();
    this.getDepartment()
  },
  methods: {
    changeStartDate(){
          this.beginDate = this.search_data.startDate
          let year =this.search_data.startDate.getFullYear()
          let mouth = (this.search_data.startDate.getMonth()+1)>=10?(this.search_data.startDate.getMonth()+1):"0"+(this.search_data.startDate.getMonth()+1)
          this.search_data.startDate = year+'-'+mouth
          // this.search_data.startDate = this.search_data.startDate.format("YYYY-MM")
          console.log(this.search_data.startDate,this.search_data.startDate.getTime())
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
    exportBtn(){
      let url="/icu/report/exportLevel3HospitalTable"
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
    loadData() {
      this.loading = false;
      let url = "/icu/report/queryLevel3HospitalChargesTable";
      let params = {
        beginDate:this.search_data.startDate,
        endDate:this.search_data.endDate,
        deptId:this.search_data.department,
        // userId:""
      };
      console.log(params);
      let that = this;
      this.$axios.post(global.url + url, params).then((res) => {
        that.tableBody = res.data.respData;
      });
      //   this.tableData = [
      //       {
      //   id: "ICU患者收治情况",
      //   name: "ICU收治患者总数",
      //   amount1: "234"
      // },
      // {
      //   id: "ICU患者收治情况",
      //   name: "非计划转入ICU患者人数（率）",
      //   amount1: "165"
      // },
      // {
      //   id: "ICU患者收治情况",
      //   name: "48H重返ICU患者数（率）",
      //   amount1: "324"
      // },
      // {
      //   id: "ICU患者收治情况",
      //   name: "同期医院收治患者总数",
      //   amount1: "621"
      // },
      // {
      //   id: "ICU患者收治情况",
      //   name: "ICU患者收治率",
      //   amount1: "539"
      // },
      //  {
      //   id: "急性生理与慢性健康评分（APACHE Ⅱ）≥15分的患者收治率（入ICU 24H内）",
      //   name: "APACHE Ⅱ≥15分患者数",
      //   amount1: "539"
      // },
      //  {
      //   id: "急性生理与慢性健康评分（APACHE Ⅱ）≥15分的患者收治率（入ICU 24H内）",
      //   name: "APACHE Ⅱ≥15分患者收治率",
      //   amount1: "539"
      // },
      //  {
      //   id: "感染性休克集束化（bundle完成情况",
      //   name: "3H完成集束化治疗bundle完成患者数",
      //   amount1: "539"
      // },
      //  {
      //   id: "感染性休克集束化（bundle完成情况",
      //   name: "3H集束化治疗bundle完成率",
      //   amount1: "539"
      // },
      //  {
      //   id: "感染性休克集束化（bundle完成情况",
      //   name: "6H完成集束化治疗bundle完成患者数",
      //   amount1: "539"
      // }

      //   ],
      // this.getSpanArr(this.tableData)
    },
    //     getSpanArr(data) {
    //     // data就是我们从后台拿到的数据
    //   for (var i = 0; i < data.length; i++) {
    //     if (i === 0) {
    //       this.spanArr.push(1);
    //       this.pos = 0;
    //     } else {
    //       // 判断当前元素与上一个元素是否相同
    //       if (data[i].id === data[i - 1].id) {
    //         this.spanArr[this.pos] += 1;
    //         this.spanArr.push(0);
    //       } else {
    //         this.spanArr.push(1);
    //         this.pos = i;
    //       }
    //     }
    //     console.log(this.spanArr);
    //   }
    // },
    // objectSpanMethod({ row, column, rowIndex, columnIndex }) {
    //   if (columnIndex === 0 ) {
    //     const _row = this.spanArr[rowIndex];
    //     const _col = _row > 0 ? 1 : 0;
    //     console.log(`rowspan:${_row} colspan:${_col}`);
    //     return {
    //       // [0,0] 表示这一行不显示， [2,1]表示行的合并数
    //       rowspan: _row,
    //       colspan: _col
    //     };
    //   }
    // }
  },
};
</script>

<style lang="scss">
.levelThreeFormWrapper {
  padding: 16px 80px 32px 32px;
  // .table_container{
  //    .el-table th{
  //       background: rgba(0, 0, 0, 0.02);
  //       color: rgba(0, 0, 0, 0.87);
  //     }
  // }
  .exportBtn {
    text-align: right;
    padding-bottom: 10px;
  }
  .tableHead {
    width: 600px;
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
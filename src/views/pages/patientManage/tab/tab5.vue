<template>
    <div class="pipeNurse">
         <div class="pipeTitle">人体导管图</div>
        <div class="pipeEchart">
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
        <div class="pipeTable">
            <div class="pipeTable_top">
                <div class="top_left">
                    患者导管情况
                </div>
                <div class="top_right">
                    <el-button @click="toLink">管路脱落危险评分</el-button>
                        <el-select v-model="status" placeholder="全部导管状态" @change="changeStatusFun">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                    <el-button type="primary" @click="addPipeFun"  :disabled="isDisabled" v-has="`cannula:add`" >新增插管</el-button>
                </div>
            </div>
            <div class="pipeTable_content">
                 <el-table :data="tableData" style="width: 100%">
                    <el-table-column  label="部位">
                        <template slot-scope="scope">
                            <div v-for="(item,index) in cannulaLocationList" :key="index">
                                <div v-if="item.value==scope.row.cannulaLocation">
                                    {{item.name}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="导管分类">
                        <template slot-scope="scope">
                            <div v-for="(item,index) in cannulaLocationList" :key="index">
                                <div v-if="item.value==scope.row.cannulaLocation">
                                   <div v-for="(item2,index2) in cannulaLocationList[index].date" :key="index2">
                                       <div v-if="item2.value==scope.row.cannulaType">
                                           {{item2.name}}
                                       </div>
                                   </div>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="cannulaName"  label="导管名称" width="160">
                    </el-table-column>
                    <el-table-column  label="危险度">
                        <template slot-scope="scope">
                            <div v-if="scope.row.dangerLevel==1">
                                低危
                            </div>
                            <div v-if="scope.row.dangerLevel==2">
                                中危
                            </div>
                               <div v-if="scope.row.dangerLevel==3">
                                高危
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column  prop="cannulaTime"  label="插管时间" width="150">
                    </el-table-column>
                     <el-table-column prop="cannulaCycle"  label="插管天数">
                         <template slot-scope="scope">
                             <div :style="{color:scope.row.alert?'red':''}">
                                 {{ scope.row.cannulaCycle }}
                             </div>
                         </template>
                    </el-table-column>
                     <el-table-column label="导管来源" >
                        <template  slot-scope="scope">
                            <div v-for="(item,index) in cannulaSourceList" :key="index">
                                <div v-if="item.value==scope.row.cannulaSource">
                                    {{item.name}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                      <el-table-column  label="导管状态">
                          <template slot-scope="scope">
                              <div v-if="scope.row.status==1">
                                  <span style="color:#FA3039;">●</span>
                                  <span>新置</span>
                              </div>
                              <div v-if="scope.row.status==2">
                                  <span style="color:#1374E4;">●</span>
                                  <span>换管</span>
                              </div>
                              <div v-if="scope.row.status==3">
                                  <span style="color:gray;">●</span>
                                  <span>拔管</span>
                              </div>
                                <div v-if="scope.row.status==5">
                                  <span style="color:#F9B344;">●</span>
                                  <span>使用中</span>
                              </div>
                          </template>
                    </el-table-column>
                    <el-table-column  prop="length" label="置管深度">
                        <template slot-scope="scope">
                            <span v-if="scope.row.length">
                                {{scope.row.length}} cm
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="感染管控" >
                        <template  slot-scope="scope">
                            <div v-for="(item,index) in manageList" :key="index">
                                <div v-if="item.value==scope.row.infectionControl">
                                    {{item.name}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                     <el-table-column label="操作" width="205">
                         <template slot-scope="scope">
                            <div>
                                <el-button @click.native.prevent="pullPipeFun(scope.$index, scope.row,1)" type="text" size="mini" v-has="`cannula:update`" :disabled="isDisabled">管路管理</el-button>
                                <!-- <el-button @click.native.prevent="pullPipeFun(scope.$index, scope.row,0)" type="text" size="mini" v-has="`cannula:update`" :disabled="isDisabled">换管</el-button> -->
                                <el-button @click.native.prevent="editTable(scope.$index, scope.row)"  type="text" size="mini"  v-has="`cannula:update`" :disabled="isDisabled">编辑</el-button>
                                <el-button v-if="scope.row.drainageState" @click.native.prevent="findFun(scope.row)" type="text" size="mini" v-has="`cannula:view`" :disabled="isDisabled">引流液情况</el-button>
                            </div>
                            </template>
                    </el-table-column>
                    <div v-if="tableData.length==0" slot="empty" class="noData" ></div>
                    </el-table>
             <pagination :pageTotal="page.pageTotal"
                @handleCurrentChange="handleCurrentChange"
                @handleSizeChange="handleSizeChange">
             </pagination> 
            </div>
        </div>
         <el-dialog :title="title" :visible.sync="addPipeFlag" width="30%" class="tab_dialog" :close-on-click-modal="false">
            <add-pipe @submit="addSubmit" ref="addPipe" :cannulaLocation="cannulaLocationList" :cannulaSource="cannulaSourceList" :recordId="patientRecordId" :outhosTime="outhosTime"></add-pipe>
        </el-dialog>
         <el-dialog title="管路管理" :visible.sync="pullPipeFlag" width="30%" class="tab_dialog" :close-on-click-modal="false">
            <add-pipe2 @submit="pullSubmit" :changeReasonList="changeReasonList" :manageList="manageList" :id="id" ref="addPipe2" :recordId="patientRecordId" :outhosTime="outhosTime"></add-pipe2>
        </el-dialog>
        <el-dialog title="引流液情况" :visible.sync="drainFlag" width="80%" :close-on-click-modal="false">
            <add-pipe3 ref="addPipe3" :outhosTime="outhosTime"></add-pipe3>
        </el-dialog>
    </div>
</template>

<script>
import addtab from "./alert/addtab5";
import addtab2 from "./alert/addtab5_2";
import addtab3 from "./alert/addtab5_3";
import Pagination from "@/components/pagination";
export default {
    name:'tab5',
    props:['patientInfo','isDisabled'],
    components: {
        addPipe: addtab,
        addPipe2: addtab2,
        addPipe3: addtab3,
        pagination:Pagination
    },
    computed:{
     patientRecordId(){
      return this.patientInfo.record.recordId;
    },
    patientId(){
        return this.patientInfo.id;
    },
     outhosTime(){
       return this.patientInfo.record.outhosTime;
    }
  },
    data(){
        return{
            myChart:null,
            options:[
                {label:'全部',value:""},
                {label:'新置',value:'1'},
                {label:'使用中',value:'5'},
                {label:'换管',value:'2'},
                {label:'拔管',value:'3'}
            ],
            status:'',
            addPipeFlag:false,
            pullPipeFlag:false,
            page:{
                pageTotal: 0,
                pageNum:1,
                pageSize:10,
            }, 
            tableData:[],
            cannulaLocationList:[], //插管部位
            cannulaSourceList:[],  //导管来源
            changeReasonList:[], //导管原因
            manageList:[],//管理方式
            id:null,
            num:null, //1拔管 2换管
            drainFlag:false,//查看引流液
            title:'新增插管',
            backEchartList:[
                {value:'15',point:[[10,12,15]],name:'肛门'},
                {value:'14',point:[[1.5,11,14],[18.5,11,14]],name:'手部'},
                {value:'13',point:[[10,16,13]],name:'后背'},
            ],
            tempBack:{
                green:[],
                red:[]
            },
            frontEchartList:[
                {value:'10',point:[[5,12.5,10],[14.8,12.5,10]],name:'臂部'},
                {value:'12',point:[[8.4,1,12],[11,1,12]],name:'足部'},
                {value:'8',point:[[10,12,8]],name:'腹部'},
                {value:'9',point:[[10,13,9]],name:'胸部'},
                {value:'3',point:[[10,17,3]],name:'颈部'},
                {value:'7',point:[[10,17.6,7]],name:'鼻腔'},
                {value:'6',point:[[10,18.2,6]],name:'口腔'},
                {value:'4',point:[[10,19.5,4]],name:'头部'},
                {value:'5',point:[[8.2,18.5,5],[11.5,18.5,5]],name:'耳朵'},
                {value:'11',point:[[11.5,9,11]],name:'腿部'},
            ],
             tempFront:{
                green:[],
                red:[]
            },
            tempPoint:{
                redFornt:[],
                redBack:[],
            },
            html:null,
            html2:null,
            option:{
                grid:{
                    x:0,
                    y:0,
                    width:255,
                    height:400
                },
                xAxis: {
                    show :false,
                    splitLine: { show: false },
                    min:0,
                    max:20  
                },
                yAxis: {
                    show : false,
                    splitLine: { show: false },
                    min:0,
                    max:20
                },
                tooltip: {
                    position:'right',
                    triggerOn:'mousemove',
                    position:['105%', '30%'],
                    textStyle:{
                        color:"#000"
                    },
                    borderColor: "#D9D9D9",
                    borderWidth: 1,
                    backgroundColor:'#FFFFFF',
                    // borderColor:'#D9D9D9'
                },
                series: [
                    {
                    name: '',
                    data: [[10,12,15],[14.8,12.5,10]],
                    type: 'scatter',
                    symbolSize: 10,
                    emphasis: {
                        focus: 'self'
                    },
                    itemStyle:{
                        normal:{
                            color:['green']
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
                    itemStyle:{
                        normal:{
                            color:['red']
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
            option2:{
            xAxis: {
                show : false,
                splitLine: { show: false },
                min:0,
                max:20  
            },
            yAxis: {
                show : false,
                splitLine: { show: false },
                min:0,
                max:20
            },
            tooltip: {
                position:'right',
                triggerOn:'mousemove',
                position:['105%', '30%'],
                textStyle:{
                    color:"#000"
                },
                borderColor: "#D9D9D9",
                borderWidth: 1,
                backgroundColor:'#FFFFFF',
            },
            series: [{
                name: '',
                data: [],
                type: 'scatter',
                symbolSize: 10,
                emphasis: {
                    focus: 'self'
                },
                itemStyle:{
                    normal:{
                        color:['green']
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
                itemStyle:{
                    normal:{
                        color:['red']
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
                }
        }
    },
    created(){},
    mounted(){
        let that = this;
        window.addEventListener("resize",that.echartInit2);
    },
    beforeDestroy(){
     let that = this;
     window.removeEventListener("resize",that.echartInit2);
   },
    methods:{
        initData(){
           this.getEchartData(); 
           this.typeListFun();//获取配置信息
           this.getDataFun();
        },
        findFun(row){//查看引流液
           let that = this;
           that.drainFlag = true;
           that.$nextTick(function(){
               that.$refs.addPipe3.initFun(row);
           })
        },
        editTable(index,row){
            let that = this;
            that.title = "编辑插管";
            that.addPipeFlag = true;
            that.$nextTick(function(){
                that.$refs.addPipe.editInit(row.id);
            })
        },
        toLink(row) {
            this.$router.push({
            path: '/patient/nursingGradingDetail',
            query: {
                formCode: 'PPFO',
                formName: '管路脱落危险评分',
                patientRecordId:this.patientRecordId,
                patientId:this.patientId
            }
            })
        },
        pullPipeFun(index,row,num){ // 1拔管 2换管
            let that = this;
            that.pullPipeFlag = true;
            that.id = row.id;
            that.num = num;
            that.$nextTick(function(){
                that.$refs.addPipe2.init(num);
            })
        },
        pullSubmit(value){
            this.pullPipeFlag = false;
            if(value!=1){
                this.getDataFun();
                this.getEchartData();
            }
        },
        changeStatusFun(){
            this.page.pageTotal = 0;
            this.page.pageNum = 1;
            this.page.pageSize = 10;
            this.getDataFun();
        },
        typeListFun(){
          let that = this;
          let url = "/api/icu/pipe/configuration";
          this.$axios.get(global.url + url).then(function (res) {
              if(res.data.msg==201){
                that.cannulaLocationList = res.data.respData.type;
                that.cannulaSourceList = res.data.respData.source;
                that.changeReasonList = res.data.respData.changeReason;
                that.manageList = res.data.respData.wayOfInfection
              }else if(res.data.msg==302){
                  that.$message({
                  message: res.data.content,
                  type: 'info'
                });
              }
          }); 
        },
        getDataFun(){
             let that = this;
            this.loading = false;
            this.tableData = [];
            let url = "/api/icu/pipe/query?patientRecordId="+that.patientRecordId+"&pageNum="+this.page.pageNum+'&pageSize='+this.page.pageSize+'&status='+this.status;
            this.$axios.get(global.url + url).then(function (res) {
                that.tableData = res.data.respData.list;
                that.page.pageTotal = res.data.respData.total;
            });
        },
        addSubmit(flag){
            this.addPipeFlag = false;
            if(flag==1){
              this.getDataFun();
              this.getEchartData();
            }
        },
        addPipeFun(){
            let that = this;
            that.title = "新增插管";
            that.addPipeFlag = true;
            that.$nextTick(function(){
                that.$refs.addPipe.init();
            })
        },
        getEchartData(){
            let that = this;
            let url = '/api/icu/pipe/queryTheStatusOfHumanIntubation?patientRecordId='+that.patientRecordId;
             that.$axios.get(global.url + url).then(function (res) {
                 let list = res.data.respData;
                 that.tempFront.green=[];
                 that.tempFront.red = [];
                 that.tempPoint.redFront=[];
                 let green = [];
                 that.frontEchartList.forEach(function(item){
                     list.forEach(function(item2){
                         if(item.value==item2.value){
                            that.tempPoint.redFront.push(item.value);
                             item.point.forEach(function(item3){
                                 that.tempFront.red.push(item3);
                             })
                            green = that.frontEchartList.filter(function(item4){
                                return item.value != item4.value;
                            })
                         }
                     })
                 })
                green.forEach(function(item){
                    item.point.forEach(function(item2){
                        that.tempFront.green.push(item2);
                    })
                 })
                 console.log(that.tempFront);
                 that.option.series[0].data = that.tempFront.green;
                 that.option.series[1].data = that.tempFront.red;
                 that.option.tooltip.formatter = function(param){
                     let flag = that.tempPoint.redFront.some(function(item,index){
                            return item==param.data[2];
                     })
                     if(flag){;
                       that.findPart(param.data[2]);
                       return that.html;
                     }else{
                         return '';
                     }
                 }
                 that.echartInit();
                 that.tempBack.green=[];
                 that.tempBack.red = [];
                 that.tempPoint.redBack=[];
                 let backgreen = [];
                 that.backEchartList.forEach(function(item){
                     list.forEach(function(item2){
                         if(item.value==item2.value){
                             that.tempPoint.redBack.push(item.value);
                             item.point.forEach(function(item3){
                                 that.tempBack.red.push(item3);
                             })
                            backgreen = that.backEchartList.filter(function(item4){
                                return item.value != item4.value;
                            })
                         }
                     })
                 })
                 backgreen.forEach(function(item){
                    item.point.forEach(function(item2){
                        that.tempBack.green.push(item2);
                    })
                 })
                that.option2.series[0].data = that.tempBack.green;
                that.option2.series[1].data = that.tempBack.red;
                that.option2.tooltip.formatter = function(param){
                     let flag = that.tempPoint.redBack.some(function(item,index){
                            return item==param.data[2];
                     })
                     if(flag){
                       that.findPart(param.data[2],2);
                       return that.html2;
                     }else{
                        return '';
                     }
                 }
                that.echartInit2();
            });
        },
        async findPart(type,num){
            let that = this;
            let url = '/api/icu/pipe/querySummary?patientRecordId='+that.patientRecordId+'&type='+type;
            let html= "";
            await that.$axios.get(global.url + url).then(function(res){
                   let data =  res.data.respData;
                   html = `<div style="font-weight:600;padding:5px;">${data.name}</div>`;
                   data.data.forEach(function(item,index){
                       html+=`<div style="padding:5px;"><span>${item.name}</span><span style="display:inline-block;padding:0 10px">${item.days}天</span>`
                       if(item.drainage){
                        html+=`<span>${item.drainage}ml</span></div>`
                       }else{
                        html+=`</div>`
                       }
                   })
                   return html;
            })
            if(num==2){
                that.html2 = html;
            }else{
                that.html = html;
            }
            
        },
        echartInit(){
            let that = this;
            let myChart = this.echarts.init(document.getElementById("bodyFront"));
        //     let data=[
        //         [[5,12.5],[14.8,12.5],[8.4,1],[11,1],[8.2,18.5],[11.5,18.5],[10,17],[10,17.6],[10,18.2],[10,19.5],[10,12],[11.5,9]],
        //    ]
             myChart.setOption(that.option);
             myChart.resize();
        },
        echartInit2(){
            let myChart = this.echarts.init(document.getElementById("bodyBack"));
        //     let data=[
        //         [[10,16],[1.5,11],[18.5,11],[10,12]],
        //    ]
             myChart.setOption(this.option2);
             myChart.resize();
        },
         // 上下分页
        handleCurrentChange(val) {
            this.page.pageNum = val;
            this.initData();
        },
        // 每页显示多少条
        handleSizeChange(val) {
            this.page.pageSize = val;
            this.initData();
        },
        }
}
</script>

<style lang="scss" scoped>
    .pipeNurse{
      .noData {
        margin:50px auto;
        background-image: url("/static/img/noData_table.png");
        width: 234px;
        height: 224px;
        background-size: 100%;
        background-repeat: no-repeat;
        padding: 0;
      }
      .pipeTitle{
        font-size: 16px;
        font-weight: bold;
        padding-bottom: 10px ;
      }
        .pipeEchart{
            padding: 0px  150px 10px 150px;
            display: flex;
            border-bottom:1px solid #E8E8E8;
            #bodyFront {
                background: url('/static/img/bodyFront.png') no-repeat center center;
                background-size: 95%;
                border:1px dotted black;
            }
            #bodyBack {
                background: url('/static/img/bodyBack.png') no-repeat center center;
                background-size: 95%;
                border:1px dotted black;
            }
            .echart_left,.echart_right{
               width: 50%;
               display: flex;
               justify-content: center;
            }
            .front_title, .back_title{
                text-align: center;
                padding: 16px 0;
                font-size: 14px;
                font-weight: bold;
            }
        }
        .pipeTable{
            .top_left{
                font-size: 16px;
                font-weight: bold;
            }
           .pipeTable_top{
               display: flex;
               justify-content: space-between;
               align-items: center;
               padding: 20px 10px 10px 10px ;
           }

        }
    }
</style>
<style lang="scss">
    .pipeTable_content{
        .el-table {
            th.is-leaf {
                background: rgba(0, 0, 0, 0.02);
                color: #212121;
            }
        }
    }
</style>
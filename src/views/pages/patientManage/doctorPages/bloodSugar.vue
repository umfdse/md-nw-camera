<template>
    <div class="bloodSugar">
        <div class="bloodSugar_title">
            <div class="title_left">
                血糖管理统计（{{dateTime}}）
            </div>
            <div class="title_right">
                <el-date-picker
                    v-model="dateTime"
                    type="date"
                    placeholder="选择日期"
                    size="small"
                    align="left"
                    :default-value="new Date()"
                    style="width: 100%"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    @change="getLisFun"
                >
                </el-date-picker>
            </div>
        </div>
        <div class="bloodSugar_echart">
            <div id="bloodSugar_echart" style="width: 100%; height: 300px"></div>
        </div>
        <div class="bloodSuar_table">
            <div class="table_title">
                <div class="title_left">
                    血糖管理数据（{{dateTime}}）
                </div>
                <div class="title_right" v-if="tableData.length>0">
                      <el-button size="small"  @click="init();disabled = true" v-has="`sugar:update`">取消</el-button>
                      <el-button type="primary" size="small" v-if="disabled"  @click="disabled = false" v-has="`sugar:update`">编辑</el-button >
                      <el-button type="primary" size="small" v-if="!disabled"  @click="saveData" v-has="`sugar:update`">保存</el-button>
                </div>
            </div>
            <div class="table_content">
                  <el-table
                    :data="tableData"
                    style="width: 100%">
                    <el-table-column
                        prop="inoutTime"
                        label="时间"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="bloodSugarValue"
                        label="血糖值"
                        width="180">
                    </el-table-column>
                    <el-table-column  prop="medicationName" label="药物名称">
                        <template slot-scope="scope">
                            <div>
                                <el-input v-model="scope.row.medicationName" :disabled="disabled"></el-input>
                            </div>
                        </template>
                    </el-table-column>
                     <el-table-column label="剂量">
                        <template slot-scope="scope" >
                            <div class="isAfter"  :class="{'is-error':!scope.row.checkout}">
                                <el-row>
                                  <el-col :span="15">
                                       <el-input :class="{'is-error':!scope.row.checkout}" v-model="scope.row.medicationAmount" type="number" :disabled="disabled" @input="checkout(scope.$index,scope.row.medicationAmount)"></el-input>
                                  </el-col>
                                    <el-col :span="8" :offset="1">
                                        <el-select v-model="scope.row.dosageUnit" size="small" :disabled="disabled">
                                        <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                        </el-option>
                                    </el-select>
                                    </el-col>
                                </el-row>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="用法">
                        <template slot-scope="scope">
                             <el-select v-model="scope.row.takeMedicineMethod" clearable size="small" :disabled="disabled">
                                        <el-option
                                        v-for="item in drugConfig"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="Number(item.value)">
                                        </el-option>
                            </el-select>
                            <!-- <div v-for="(item,index) in drugConfig" :key="index" >
                                <span v-if="item.value==scope.row.takeMedicineMethod">
                                    {{item.name}}
                                </span>
                            </div> -->
                        </template>
                    </el-table-column>
                    <div v-if="tableData.length==0" slot="empty" class="noData" ></div>
                    </el-table>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name:'bloodSugar',
    props:['recorId'],
    data(){
        return{
            dateTime:'',
            disabled:true,
            tableData:[],
            drugConfig:[],
            options:[
                { name: "mg", value: "mg" },
                { name: "u", value: "u" },
                ],
            chart: {
                option: {
                tooltip:{
                position:'right',
                },
                grid: {
                    x: 50,
                    y: 40,
                    x2: 50,
                    y2: 50 //距离下边的距离
                    },
                xAxis: {
                    type: "category",
                    data:[],
                },
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
                    }
                ],
                },
            },
        }
    },
  computed: {
    patientRecordId() {
      return this.recorId;
    },
  },
  mounted(){
    this.getNowTime();
  },
    methods:{
        init(){
            this.getBloodconfig();
            this.getLisFun();
        },
        checkout(index,value){
            if(value>100||value<0){
                this.$set(this.tableData[index],'checkout',false)
            }else{
                this.$set(this.tableData[index],'checkout',true)
            }
        },
         getNowTime(){
                let myDate = new Date();
                let year = myDate.getFullYear();
                let month = (myDate.getMonth()+1)<10?'0'+(myDate.getMonth()+1):(myDate.getMonth()+1);
                let date = myDate.getDate()<10?'0'+myDate.getDate():myDate.getDate();
                this.dateTime = year+'-'+month+'-'+date;
            },
        getBloodconfig(){
            let that = this;
            let url = '/api/icu/doctor/bloodSugar/configuration';
             that.$axios.get(global.url+url).then(function(res){
                 if(res.data.msg==201){
                     that.drugConfig = res.data.respData.method||[];
                 }
             })
        },
        getLisFun(){
            let that = this;
            let url = '/api/icu/doctor/bloodSugar/getBloodSugarList?patientRecordId='+that.patientRecordId+'&dateTime='+that.dateTime;
             that.$axios.get(global.url+url).then(function(res){
                 if(res.data.msg==201){
                    that.tableData =  res.data.respData.data||[];
                    that.tableData.forEach(function(item,index){ //增加自主验证值
                        item.checkout = true;
                    })
                    let list =  res.data.respData.chartData.bloodSugar;
                    let xList = [];
                    let yList = [];
                    list.forEach(function(item,index){
                        xList.push(item.x);
                        yList.push(item.y);
                    })
                    that.chart.option.xAxis.data = xList;
                    that.chart.option.series[0].data = yList;
                    that.chartFun();
                 }
             })
        },
        saveData(){
            let that = this;
            let url = "/api/icu/doctor/bloodSugar/save";
            let flag = that.tableData.some(function(item,index){
                    return item.checkout == false;
            })
            if(flag){
                //  that.$message({ type: "info", message: '剂量取值范围0-100' });
                 return false;
            }
            that.$axios.post(global.url+url,that.tableData).then(function(res){
                    if(res.data.msg==201){
                        that.disabled = true;
                        that.$message({ type: "success", message: res.data.content });
                    }else{
                        that.$message({ type: "info", message: res.data.content });
                    }
            })
        },
         chartFun() {
            let that = this;
            let myChart = this.echarts.init(
                document.getElementById("bloodSugar_echart")
            );
            // 指定图表的配置项和数据
            // 使用刚指定的配置项和数据显示图表。
            myChart.clear({});
            myChart.setOption(that.chart.option);
            myChart.resize();
            },
    }
}
</script>
<style lang="scss">
    .bloodSugar{
        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button {
            -webkit-appearance: none;
        }

        input[type="number"] {
            -moz-appearance: textfield;
        }
        .el-input.is-error{
            .el-input__inner{
                border-color:#F56C6C;
            }
        }
        .isAfter{
            padding-bottom: 3px;
        }
        .isAfter.is-error::after{
            position: absolute;;
            left: 10px;
            top:40px;
            color:#F56C6C;
            content: '剂量取值范围0-100';
            font-size: 1px;

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
         .el-table th {
            background: rgba(0, 0, 0, 0.02);
            color: #212121;
            }
        .el-select{
            width: 100%;
        }
         .title_left{
            font-size: 16px;
            font-weight: bold;
            }
        .bloodSugar_title{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 0;
        }
        .table_title{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
        }
    }
</style>

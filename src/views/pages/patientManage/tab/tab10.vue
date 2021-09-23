<!-- 仪器管理 -->
<template>
  <div class="instrument">
    <div class="in_top">
      <div class="in_top_l">
        <!-- <el-radio-group v-model="type">
          <el-radio-button
            v-for="(item, index) in typeList"
            :key="index"
            :label="item.value"
            >{{ item.text }}</el-radio-button>
        </el-radio-group> -->
      </div>
      <div class="in_top_r">
        <el-date-picker
          v-model="dateTime"
          type="date"
          placeholder="选择日期"
          size="small"
          align="left"
          :default-value="new Date()"
          style="width: 100%"
          format="yyyy-MM-dd"
          :clearable="false"
          value-format="yyyy-MM-dd"
          @change="changeTime"
        >
        </el-date-picker>
      </div>
    </div>
    <div class="in_bottom">
      <div class="in_bo_title">
        {{ typeList[type - 1].text }}数据 {{ "（" + dateTime + "）" }}
      </div>
      <div class="in_bo_btn">
          <el-button type="primary" size="small" @click="addSubmit" :disabled="isDisabled" v-has="`vital-signs:add`" >新增数据</el-button>
      </div>
    </div>
    <div class="in_content">
          <el-table
                :data="tableData"
                border
                style="width: 100%">
                <el-table-column
                fixed
                prop="recordTime"
                label="日期"
                width="200">
                </el-table-column>
                <el-table-column prop="breathingMethod" label="呼吸方式" width="150">
                   <template slot-scope="scope">
                     <div v-for="(item,index) in configObj.ventilator_way" :key="index">
                        <div v-if="item.value==scope.row.breathingMethod">
                            {{item.name}}
                        </div>
                     </div>
                  </template>
                </el-table-column>
                <el-table-column prop="rtimes" label="R(次/分)" width="150"></el-table-column>
                <el-table-column prop="spo2" label="Spo2%" width="150"></el-table-column>
                <el-table-column prop="mode" label="模式" width="150">
                   <template slot-scope="scope">
                     <div v-for="(item,index) in configObj.ventilator_mode" :key="index">
                        <div v-if="item.value==scope.row.mode">
                            {{item.name}}
                        </div>
                     </div>
                  </template>
                </el-table-column>
                <el-table-column prop="fio2" label="Fio2%" width="150"></el-table-column>
                <el-table-column prop="ttimes" label="F(次/分)" width="150"></el-table-column>
                <el-table-column prop="vt" label="VT(ml)"></el-table-column>
                <el-table-column prop="peep" label="PEEP(cmH2O)" width="150"></el-table-column>
                <el-table-column prop="ps" label="PS(cmH2O)" width="150" ></el-table-column>
                <el-table-column
                fixed="right"
                width="150"
                label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="editTable(scope.row)">编辑</el-button>
                    <el-button type="text" size="small" @click="delTable(scope.row)">删除</el-button>
                </template>
                </el-table-column>
                <div v-if="tableData.length==0" slot="empty" class="noData"></div>
            </el-table>
    </div>
      <el-dialog :title="title" :visible.sync="addFlag" width="30%" class="tab_dialog" :close-on-click-modal="false">
      <add-tab @submit="closeSubmit" @refresh="getListFun" ref="addtab" :config="configObj" :recordId="patientRecordId"></add-tab>
    </el-dialog>
  </div>
</template>
<script>
import addtab1 from "./alert/addtab10_1";
export default {
  name: "tab10",
  components: {
    addTab: addtab1
  },
  props: {
    patientInfo: {
      type: Object,
      default: function () {
        return {};
      },
    },
    isDisabled: {
      type: Boolean,
      default: function () {
        return false;
      },
    },
  },
  data() {
    return {
      dateTime: null,
      type: 1,
      typeList: [
        { text: "呼吸机", value: 1 },
        { text: "输液泵", value: 2 },
        { text: "CRRT", value: 3 },
        { text: "ECMO", value: 4 },
      ],
      tableData:[],
      addFlag:false,
      title:"新增数据",
      configObj:{},
    };
  },
  computed:{
    patientRecordId(){
      return this.patientInfo.record.recordId;
    }
  },
  methods: {
    initData() {
      this.getNowTime();
      this.getConfigInfo();
    },
    changeTime() {
        this.getListFun(); 
    },
    getConfigInfo(){
      let that = this;
      let url = "/api/icu/instrument/configuration";
      this.$axios.get(global.url + url).then(function (res) {
         let data = res.data.respData;
         that.configObj = data;
      });
    },
    getListFun(){
      let that = this;
      let url = "/api/icu/instrument/query?patientRecordId="+that.patientRecordId+"&dateTime=" + this.dateTime;
      this.$axios.get(global.url + url).then(function (res) {
          that.tableData = res.data.respData;
      });
    },
    getNowTime() {
      let myDate = new Date();
      let year = myDate.getFullYear();
      let month = myDate.getMonth() + 1 < 10? "0" + (myDate.getMonth() + 1): myDate.getMonth() + 1;
      let date = myDate.getDate() < 10 ? "0" + myDate.getDate() : myDate.getDate();
      this.dateTime = year + "-" + month + "-" + date;
      this.changeTime();
    },
    addSubmit(){
      let that = this;
      this.addFlag = true;
      that.$nextTick(function () {
        that.$refs.addtab.clearData();
      });
    },
    closeSubmit(){
      this.addFlag = false;
    },
    handleClick(row) {
        console.log(row);
      },
    editTable(row){
      let that = this;
      this.addFlag = true;
      this.title="编辑数据";
      that.$nextTick(function(){
        that.$refs.addtab.initData(row.id);
      })
    },
    delTable(row){
      let that = this;
      that.$confirm("确认要删除这条数据吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
        let url = "/api/icu/instrument/delete/"+row.id;
        that.$axios.post(global.url+url,{}).then(function(res){
            if(res.data.msg=="201"){
              that.$message({
              type: "success",
              message: res.data.content,
            });
              that.getListFun();
            }
        })
        })
        .catch(() => {
          that.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    }
  },
};
</script>
<style lang="scss">
.instrument {
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
  .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    background-color: transparent;
    color: #1f71ff;
    border-color: #1f71ff;
  }
  .el-radio-button__inner {
    font-size: 14px;
  }
  .in_top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 16px;
  }
  .in_bottom{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding:10px 0;
    .in_bo_title {
        font-size: 16px;
        color: rgba(0, 0, 0, 0.87);
        font-weight: bold;
    }
  }
 
}
</style>
<template>
  <div class="nursing-grading">
    <el-button type="primary" style="float: right;margin-bottom: 16px" @click="showDialog" v-has="`score:add`" :disabled="isDisabled">新增评估</el-button>
     <div class="echart_table_content">
    <el-table
    :data="tableData"
    v-loading="loading"
    style="width: 100%">
     <!-- :header-cell-style="{background:'rgba(0, 0, 0, 0.02)',color:'rgba(0, 0, 0, 0.87)',height: '54px', 'font-weight': '500'}"
    :row-style="{height: '54px', color: 'rgba(0, 0, 0, 0.87)'}" -->
      <el-table-column prop="formName" label="评估项目" min-width="22%"/>
      <el-table-column prop="updateTs" label="最近评估时间" min-width="20%"/>
      <el-table-column prop="result" label="最近评估结果" min-width="20%"/>
      <el-table-column prop="realName" label="执行人" min-width="20%"/>
      <el-table-column label="操作" min-width="18%">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small" v-has="`score:add`"  :disabled="isDisabled">新增评分</el-button>
          <el-button @click="toLink(scope.row)" type="text" size="small" v-has="`score:view`"  :disabled="isDisabled">查看历史详情</el-button>
        </template>
      </el-table-column>
      <div slot="empty" class="nodata">
        <img src="/static/img/nodata.png">
      </div>
    </el-table>
     </div>
  <create-dialog ref="createDialog" @sub="subHandler"  />
  <el-dialog
    title="新增评估项目"
    :visible.sync="dialogVisible"
    width="480px"
    class="dialogMain"
    :close-on-click-modal="false"
  >
  <el-form label-width="150px" class="form">
    <el-form-item label="评估项目：" class="">
      <el-select v-model="formType" style="width: 248px">
        <el-option v-for="i in options" :key="i.code" :label='i.name' :value='i.code' ></el-option>
      </el-select>
    </el-form-item>
  </el-form>
   <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSub">确 定</el-button>
    </span>
  </el-dialog>
  </div>
</template>

<script>
import createDialog from './createDialog'
export default {
  components: { createDialog },
  props:['patientInfo','isDisabled'],
  computed:{
    //  patientRecordId(){
    //   return this.patientInfo.record.recordId;
    // },
    patientId(){
        return this.patientInfo.id;
    }
  },
  data() {
    return {
      patientRecordId: "",
      tableData: [],
      dialogVisible: false,
      formType: null,
      options: [],
      loading: false
    }
  },
  mounted() {
    this.patientRecordId = this.patientInfo.record.recordId
  },
  methods: {
    initData() {
      this.getDic()
      this.getData()
    },
     //获取未绑定床位病患列表
      getPatientList() {
        this.$axios({
          url: global.url + '/base/patient/queryPatientRecords',
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          data: {}
        }).then((response) => {
          var data = response.data;
          if (data.msg == 201) {
            let resData = data.respData ? data.respData : []
            this.patientsList = resData
            // this.getIndex(this.patientsList)
          } else {
            this.$message({
              message: data.content,
              type: 'warning'
            });
          }
        });
      },
    getData() {
      this.loading = true
      this.$axios({
        url: global.url + '/score/queryAllTypeScoreList',
        method: 'post',
        data: {
          sourceType:"1",
          patientRecordId: this.patientInfo.record.recordId
        }
      }).then((res) => {
        if (res.data && res.data.msg === 201) {
          this.tableData = res.data.respData.list || []
        } else {
          this.$message.error(res.data.content);
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },
    getDic() {
       let url = "/score/queryAllFormNameAndCode" ;
      let params = {
        sourceType:"1"
      }
      let that = this
      this.$axios.post(global.url+url,params).then(function(res){
          if (res.data && res.data.msg === 201) {
          that.options = res.data.respData || []
        }
      })
      // this.$axios({
      //   url: global.url + '/score/queryAllFormNameAndCode',
      //   method: 'post'
      // }).then((res) => {
      //   if (res.data && res.data.msg === 201) {
      //     this.options = res.data.respData || []
      //   }
      // })
    },
    handleClick(row) {
      this.$refs.createDialog.init(row.formCode, 'add', this.patientInfo.record.recordId)
    },
    toLink(row) {
      this.$router.push({
        path: '/patient/nursingGradingDetail',
        query: {
          formCode: row.formCode,
          formName: row.formName,
          patientRecordId: this.patientInfo.record.recordId,
           patientId:this.patientId
        }
      })
    },
    showDialog() {
      this.dialogVisible = true
    },
    handleSub() {
      console.log(this.formType)
      if (!this.formType) {
        this.$message.info('请选择评分类型');
        return 
      }
      this.$refs.createDialog.init(this.formType, 'add', this.patientInfo.record.recordId)
    },
    subHandler() {
      this.dialogVisible = false
      this.getData()
      this.$emit("goPatient")
    }
  }
}
</script>

<style lang="scss">
.nursing-grading{
  .nodata{
    padding: 100px 0;
    img{
      width: 234px;
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
<template>
  <div class="page_systemInforms">
    <div class="pageContent">

      <div class="pageContent-search">
        <div class="pageTitle">消息中心</div>
        <el-form :model="searchForm" class="searchForm" :inline="true" ref="searchForm" label-position="right"
                 label-width="85px"
                 size="small">
          <el-form-item prop="queryTime" label="时间选择：" class="searchFormItem">
            <el-date-picker
              style="width: 224px"
              v-model="searchForm.queryTime"
              type="date"
              align="right"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="类型选择:" prop="type" class="searchFormItem">
            <el-select
              v-model="searchForm.type"
              filterable
              clearable
              placeholder="请选择类型">
              <el-option
                v-for="(item,index) in msgTypeOptions"
                :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态选择:" prop="status" class="searchFormItem">
            <el-select
              v-model="searchForm.status"
              filterable
              clearable
              placeholder="请选择状态">
              <el-option
                v-for="(item,index) in msgStatusOptions"
                :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="handleBtn">
            <el-button type="primary" size="small" @click="search">查询</el-button>
            <el-button size="small" @click="resetForm('searchForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 表格体 -->
      <div class="pageContent-table">
        <div class="tableHandle">
          <span class="left">
            <el-button size="small" :disabled="multipleSelection.length==0" @click="seMessageStatus">批量阅读</el-button>
            <el-button size="small" :disabled="true" @click="">批量处理</el-button>
          </span>
          <span class="right">
            <span>更新时间:<span>{{refreshTime}}</span></span>
            <el-button class="refresh" size="small" @click="search">刷新</el-button>
          </span>
        </div>
        <table-mixin :pageSize="pageSize" :pageNum="pageNum" :total="total" :pagination="pagination"
                     :handleSizeChange="handleSizeChange" :handleCurrentChange="handleCurrentChange">
          <el-table v-loading="tableData.loading" :data="tableData.body" @selection-change="handleSelectionChange">
            <div slot="empty" class="noData"></div>
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column prop="type" label="类型" align="left" :formatter="formatter" show-overflow-tooltip></el-table-column>
            <el-table-column prop="content" label="内容" align="left"  show-overflow-tooltip></el-table-column>
            <el-table-column label="状态" align="left" width="120">
              <template slot-scope="scope">
                <p  v-if="scope.row.state==0">
                  <span class="red"></span>
                  <span>未查看</span>
                </p>
                <p v-else-if="scope.row.state==1">
                  <span  class="gray"></span>
                  <span>已查看</span>
                </p>
                <p v-else></p>
              </template>
            </el-table-column>
            <el-table-column prop="createTs" label="时间" align="left" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" align="left" width="200">
              <template slot-scope="scope">
                <el-link type="primary" style="margin-right: 24px;padding-right: 0" @click="goDetail(scope.row)">查看详情
                </el-link>
              </template>
            </el-table-column>
          </el-table>
        </table-mixin>
      </div>
    </div>
    <!--消息详情-->
    <el-dialog title="查看详情" :visible.sync="msgDetailDialog" width="480px" class="msgDetailDialog">
      <el-form :model="msgDetailForm" label-width="100px" label-position="right" ref="msgDetailForm">
        <el-form-item label="类型:" prop="type">
          <span>{{msgDetailForm.type}}</span>
        </el-form-item>
        <el-form-item label="状态:" prop="status">
          <span>{{msgDetailForm.status}}</span>
        </el-form-item>
        <el-form-item label="内容:" prop="content">
          <span>{{msgDetailForm.content}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="msgDetailDialog = false">取 消</el-button>
        <el-button size="small" style="margin-right: 0" type="primary" @click="msgDetailDialog = false">确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {saveSessionData, getSessionData, removeSessionData} from "@/utils/SimpleSessionStorageService.js";
  import {tableDataMixin} from '../../../../assets/js/mixin'
  import eventBus from "@/utils/eventBus.js"
  export default {
    name: 'message',
    mixins: [tableDataMixin],
    data() {
      return {
        pickerOptions: {
          disabledDate: (time) => {
            return time.getTime() > new Date().getTime();
          }
        },
        msgDetailDialog: false,
        refreshTime: '',
        searchForm: {
          queryTime: '',
          type: '',
          status: ''
        },
        msgTypeOptions: [
          {
            label: '任务',
            value: '1'
          }, {
            label: '危急值',
            value: '2'
          },],
        msgStatusOptions: [
          {
            label: '未查看',
            value: '0'
          },
          {
            label: '已查看',
            value: '1'
          },
          {
            label: '已处理',
            value: '2'
          },
        ],
        msgDetailForm: {
          type: '',
          status: '',
          content: ''
        },
        pageNum: 1,
        pageSize: 10,
        total: 0,
        sortName: '',
        sortValue: '',
        pagination: true,
        tableData: {
          loading: false,
          head: [
            {
              name: '类型',
              key: 'type',
              sortable: false
            },
            {
              name: '内容',
              key: 'content',
              sortable: false
            },
            {
              name: '状态',
              key: 'state',
              sortable: false
            },
            {
              name: '时间',
              key: 'createTs',
              sortable: false
            }
          ],
          body: [],
          option: [],
          condition: []
        },
        hospital_options: [], //医院列表
        userId: '',
        hospitalCode: ''
      }
    },
    computed: {},

    watch: {
      msgChange(val) {
        if (val) {
          /*     this.search()*/
          console.log(val)
        }
      }
    },

    mounted() {
      this.userId = getSessionData('userId')
      this.hospitalCode = getSessionData('hospitalCode')
      this.search()
      eventBus.$emit('noticeMsgChange')
      eventBus.$on('noticeMsgChange', data => {
        this.search()
      })
    },
    methods: {
      getTableData() {
        let param = {
          hospitalCode: this.hospitalCode,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          queryTime: this.searchForm.queryTime, //时间
          type: this.searchForm.type, //类型
          state: this.searchForm.status, //状态
          userId: this.userId
        }

        this.tableData.loading = true
        this.$axios({
          url: global.url + '/base/message/list',
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          data: param
        }).then(res => {
          let resData = res.data
          if (resData.msg == 201) {
            this.dealTableResponse(resData)
            this.getCurrentTime()
          } else {
            this.$message.error(resData.content)
          }
        })
      },
      formatter(row, column, cellValue, index) {
        let formatValue = cellValue
        if (column.property == 'type') {
          this.msgTypeOptions.forEach(item => {
            if (formatValue == item.value) {
              formatValue = item.label
            }
          })
        }
        if (column.property == 'state') {
          this.msgStatusOptions.forEach(mItem => {
            if (formatValue == mItem.value) {
              formatValue = mItem.label
            }
          })
        }
        return formatValue
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
        this.search()
      },
      goDetail(row) {
        this.msgDetailDialog = true
        let typeStr = ''
        let stateStr = ''
        this.msgTypeOptions.forEach(item => {
          if (row.type == item.value) {
            typeStr = item.label
          }
        })
        this.msgStatusOptions.forEach(mItem => {
          if (row.state == mItem.value) {
            stateStr = mItem.label
          }
        })
        this.msgDetailForm.type = typeStr
        this.msgDetailForm.status = stateStr
        this.msgDetailForm.content = row.content
      },
      seMessageStatus() {
        let ids= []
        this.multipleSelection.forEach(item=>{
          ids.push(item.id)
        })
        let param = {
          ids: ids,
          state: 1
        }
        this.$axios({
          url: global.url + '/base/message/updateStateBatch',
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          data: param
        }).then(res => {
          if (res.data.msg == 201) {
            this.$message.success(res.data.content)
            this.search()
            eventBus.$emit('listMsgChange')
          } else {
            this.$message.error(res.content)
          }
        })
      },
      getCurrentTime() {
        let date = new Date();
        let separator = "-";
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let curDate = date.getDate();
        let curHours = date.getHours();
        let curMinutes = date.getMinutes();
        let curSeconds = date.getSeconds();

        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (curDate >= 0 && curDate <= 9) {
          curDate = "0" + curDate;
        }
        if (curHours >= 0 && curHours <= 9) {
          curHours = "0" + curHours;
        }
        if (curMinutes >= 0 && curMinutes <= 9) {
          curMinutes = "0" + curMinutes;
        }
        if (curSeconds >= 0 && curSeconds <= 9) {
          curSeconds = "0" + curSeconds;
        }
        let currentdate = year + '-' + month + '-' + curDate + ' ' + curHours + ':' + curMinutes + ':' + curSeconds;
        this.refreshTime = currentdate;
      },
    }
  }
</script>

<style lang="scss">
  .page_systemInforms {
    height: 100%;
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    background: rgba(0, 0, 0, 0.04);
    overflow-y: auto;
    overflow-x: hidden;
    width: 100%;
    .pageContent {
      width: 100%;
      .pageContent-search {
        background: #FFFFFF;
        border-radius: 2px;
        margin-bottom: 10px;
        padding: 10px 20px;
        .pageTitle {
          font-size: 20px;
          font-weight: 600;
          color: rgba(0, 0, 0, 0.87);
          margin-bottom: 20px;
          margin-top: 14px;
        }
        .searchForm {
          padding-top: 10px;
          .searchFormItem {
            margin-right: 35px;
          }
        }
        .handleWrapper {
          width: 100%;
          height: 40px;
          .handleBtn {
            float: right;
            padding-right: 0;
            width: 198px;
          }
        }

      }
      .pageContent-table {
        background: #FFFFFF;
        border-radius: 2px;
        padding: 10px 20px;
        min-height: 660px;
        .red{
          width: 8px;
          height: 8px;
          background: #FA3039;
          border-radius: 100%;
          display: inline-block;
        }
        .gray{
          width: 8px;
          height: 8px;
          background:#BFBFBF;
          border-radius: 100%;
          display: inline-block;
        }
        .yellow{
          width: 8px;
          height: 8px;
          background: #F9B344;
          border-radius: 100%;
          display: inline-block;
        }
        .status-icon-red {
          width: 8px;
          height: 8px;
          background: #F22C2C;
          border-radius: 13px;
          margin-right: 16px;
        }
        .status-icon-gray {
          width: 8px;
          height: 8px;
          background: rgba(0, 0, 0, 0.15);
          border-radius: 13px;
          margin-right: 16px;
        }
        .column-message-icon {
          text-align: right;
          align-items: flex-end;
        }
        .column-message {
          height: 54px;
          line-height: 20px;
          .column-message-title {
            font-size: 14px;
            font-weight: 600;
            color: #000000;
            margin-bottom: 5px;
          }
          .column-message-content {
            font-size: 14px;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.5);
          }
          .column-message-btn {
            /*   width: 64px;
               height: 20px;*/
            margin-bottom: 5px;
          }
          .column-message-time {
            color: rgba(0, 0, 0, 0.3);
          }
        }
        .readAll {
          position: absolute;
          bottom: 0;
          height: 32px;
          width: 88px;
          line-height: 30px;
        }
        .tableHandle {
          height: 40px;
          color: rgba(0, 0, 0, 0.6);
          .left {
            float: left;
          }
          .right {
            float: right;
            .refresh {
              margin-left: 12px;
            }
          }
        }
      }
    }
    .msgDetailDialog {

    }
    .noData {
      margin: 0 auto;
      background-image: url("/static/img/noData_table.png");
      width: 234px;
      height: 224px;
      background-size: 100%;
      background-repeat: no-repeat;
      padding: 0;
      margin-top: 50px;
    }
    .el-table {
      th {
        background: rgba(0, 0, 0, 0.02);
      }
    }

  }
</style>

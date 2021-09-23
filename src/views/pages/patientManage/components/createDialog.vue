<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    :width="dialogWidth"
    :close-on-click-modal="false"
    class="dialogMain"
  >

    <el-form
      :model="ruleForm"
      :label-width="labelWidth"
      ref="ruleForm"
    >
      <dynamic-form
        v-for="item in formJSON.questions"
        :key="item.id"
        :config="item"
        :value="ruleForm[item.id]"
        :type="type"
        @input="handleInput($event, item.id)"
      />
      <div v-if="code === 'Autar'" class="tip t1" :style="{'margin-left': labelWidth}">
        1、≥15者根据活动内容的改变及时评估（每三天至少一次） <br>
        2、＜14分者每周评估一次
      </div>
      <div v-if="code === 'SLLB'" class="tip" :style="{'margin-left': labelWidth}">
        <p style="color: rgba(0, 0, 0, 0.6); padding: 0 0 0 20px; margin: 0; position: relative;"><i style="position: absolute; top: 4px; left: 0; font-size: 14px;" class="el-icon-info"></i>注意：<br />当患者未发生深静脉血栓时，应协商病人进行踝泵锻炼，按摩下肢，促进下肢循环，预防深静脉血栓形成；当患者发生深静脉血栓形成或可疑时，严禁按摩及热敷，避免下肢静脉穿刺。</p>
      </div>
      <div v-if="code === 'PRSE'" class="tip" :style="{'margin-left': labelWidth}">
        <p style="color: rgba(0, 0, 0, 0.6); padding: 0 0 0 20px; margin: 0; position: relative;"><i style="position: absolute; top: 4px; left: 0; font-size: 14px;" class="el-icon-info"></i>注：参照Braden压疮风险评估表<br />1、潮湿度1分，1-2H更换衣裤、床单、局部使用保护用品；2分每班更换1次；3分每天更换1次；4分常规更换。<br />2、如果有其他主要的危险因素存在，如高龄、饮食量少影响蛋白质的摄入、舒张压低于60MMHg、血流动力<br />学不稳定严重水肿等，可列入比高一级的危险水平。<br />3、减压装置：酌情；Braden评分频度：每周一次；翻身频度：1次/2-4H</p>
      </div>
      <div v-if="code === 'MORSE'" class="tip" :style="{'margin-left': labelWidth}">
        <p style="color: #F23C3C; padding: 0 0 0 20px; margin: 0; position: relative;">轻度危险：每周评估一次；中度危险：每3天评估一次；高度危险：每天评估一次</p>
      </div>
      <div v-if="code === 'BARTHEL'" class="tip t1" :style="{'margin-left': labelWidth}">
        重度依赖：≤40分，每天评估一次；中度依赖：41~60分，3天评估一次；轻度依赖：61~99分，1周评估一次；无需依赖：100分
      </div>
      <div v-if="code === 'PPFO'" class="tip t1" :style="{'margin-left': labelWidth}">
        评估时机：入院时、转入时、手术后留置各种导管的，进行首次评估，以后高危（Ⅲ度）导管每班评估，<br />中危（Ⅱ度）导管每天评估，低危导管（Ⅰ度）导管每周评估导管每周评估2次，有异常情况随时评估，直至拔管。
      </div>
      <div v-if="code === 'MEWS'" class="tip t1" :style="{'margin-left': labelWidth}">
        &lt;4分：病情稳定；4分：病情可能恶化；5-7分：病情重，潜在危险大；≥8分：病情危重
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm" :loading="isLoading">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import dynamicForm from './dynamic-form.vue'
export default {
  components: { dynamicForm },
  data() {
    return {
      title: '', // 标题
      dialogWidth: '', // 弹框宽度
      labelWidth: '', // 表单样式
      code: '',
      isLoading: false,
      dataStyle: [
        {"code":"PAIN","dialogWidth":"480px","labelWidth":"91px"},
        {"code":"MYPP","dialogWidth":"840px","labelWidth":"237px"},
        {"code":"Killip","dialogWidth":"480px","labelWidth":"18px"},
        {"code":"Autar","dialogWidth":"840px","labelWidth":"150px"},
        {"code":"Wells","dialogWidth":"480px","labelWidth":"90px"},
        {"code":"Phle","dialogWidth":"480px","labelWidth":"50px"},
        {"code":"MMT","dialogWidth":"480px","labelWidth":"30px"},
        {"code":"SLLB","dialogWidth":"480px","labelWidth":"18px"},
        {"code":"AASA","dialogWidth":"480px","labelWidth":"26px"},
        {"code":"PRSE","dialogWidth":"840px","labelWidth":"157px"},
        {"code":"MORSE","dialogWidth":"840px","labelWidth":"163px"},
        {"code":"RAMSAY","dialogWidth":"480px","labelWidth":"56px"},
        {"code":"CCOS","dialogWidth":"480px","labelWidth":"20px"},
        {"code":"MMRC","dialogWidth":"480px","labelWidth":"20px"},
        {"code":"BARTHEL","dialogWidth":"840px","labelWidth":"94px"},
        {"code":"PPFO","dialogWidth":"840px","labelWidth":"80px"},
        {"code":"MEWS","dialogWidth":"840px","labelWidth":"214px"}
      ],
      type: '', // 类型 
      dialogVisible: false,
      ruleForm: {},
      formJSON: {},
      dialogType: 'add', // add 新增 update 修改
      patientRecordId: '', // 病患id
      answerId: '', // 详情id
    }
  },
  methods: {
    // 根据不同的类型 创建不同的弹框
    init(code = "PAIN", dialogType = 'add', patientRecordId, answerId) {
      this.code = code
      this.dialogType = dialogType
      this.patientRecordId = patientRecordId
      this.answerId = answerId
      this.isLoading = false
      let url, params
      if (dialogType === 'add') {
        url =  global.url + '/score/queryFormAttributeByFormCode/' + code
      } else if (dialogType === 'update') {
        url = global.url + '/score/getForm'
        params = {
          code: code,
          patientRecordId: patientRecordId,
          answerId: answerId
        }
      }
      if(url.indexOf('/score/getForm')!=-1){
        this.getScoreData_post(url,params)
      }else {
        this.getScoreData_get(url,params)
      }
    },
    getScoreData_get(url,params){
      this.$axios({
        url: url,
        method: 'get',
        params: params
      }).then((res) => {
        if (res.data && res.data.msg === 201) {
          if (res.data.respData && res.data.respData.length > 0) {
            this.handlerJSON(res.data.respData[0])
          } else {
            this.$message.error('系统错误')
          }
        } else {
          this.$message.error(res.data.content)
        }
      })
    },
    getScoreData_post(url,params){
      this.$axios({
        url: url,
        method: 'post',
        data: params
      }).then((res) => {
        if (res.data && res.data.msg === 201) {
          if (res.data.respData && res.data.respData.length > 0) {
            this.handlerJSON(res.data.respData[0])
          } else {
            this.$message.error('系统错误')
          }
        } else {
          this.$message.error(res.data.content)
        }
      })
    },
    handleClose() {
      this.dialogVisible = false
    },
    handlerJSON(data) {
      this.formJSON = data.sections[0] || {}
      if(this.formJSON.questions.length === 1) {
        this.type = 'only'
      } else {
        this.type = ''
      }
      this.title = (this.dialogType === 'add' ? '新增' : '修改') + this.formJSON.title
      this.dialogWidth = data.dialogWidth
      this.labelWidth = data.labelWidth
      this.dialogVisible = true
      // console.log(JSON.stringify(this.formJSON))
      this.setDefaultValue() // 表单初始化
    },
    submitForm() {
      this.isLoading = true
      // console.log(JSON.stringify(this.ruleForm))
      const params = {
        formCode: this.code,
        sourceType:"1",
        details: [],
        patientRecordId: this.patientRecordId,
      }
      if (this.dialogType === 'update') {
        params.id = this.answerId
      }
      for (const key in this.ruleForm) {
        if (!this.ruleForm[key]) {
          this.$message.info('请填写完表单再提交')
          this.isLoading = false
          return
        }
        // let option = 
        params.details.push({
          questionId: key,
          option: Array.isArray(this.ruleForm[key]) ? this.ruleForm[key] : [this.ruleForm[key]]
        })
      }
      this.$axios({
        url: global.url + '/score/saveAnswer',
        method: 'POST',
        data: params
      }).then((res) => {
        if (res.data && res.data.msg === 201) {
          this.$message.success((this.dialogType === 'add' ? '新增' : '修改') + '成功')
          this.dialogVisible = false
          this.$emit('sub')
        } else {
          this.$message.error(res.data.content)
        }
        this.isLoading = false
      })
    },
    handleInput(val, key) {
      this.ruleForm[key] = val
    },
    setDefaultValue() {
      const formData = {}
      this.formJSON.questions.forEach((item) => {
        let _item = []
        if (item.optionIdList && item.optionIdList.length > 0) {
          _item = item.optionIdList.map(i => {
            return item.options.find(_i => _i.id == i)
          })
        }
        console.log(_item[0] || "1")
        if (item.type === 'checkbox') {
          formData[item.id] = _item || []
        } else {
          formData[item.id] = _item[0] || ''
        }
      })
      console.log(formData)
      this.ruleForm = formData
    }
  }
}
</script>
<style lang="scss">
.dialogMain {
  .el-dialog__body {
    overflow-y:inherit!important;
    .el-radio {
      color: rgba(0, 0, 0, 0.87);
      line-height: 32px;
    }
    .el-form-item__label {
      color: rgba(0, 0, 0, 0.87);
      font-weight: 400;
    }

    .el-radio-group{
      width: 100%;
    }
    .tip{
      font-size: 12px;
      line-height: 20px;
      &.t1{
        color: #F23C3C;
      }
      p{
        font-size: 12px;
      }
    }
    .el-form-item{
      margin-bottom: 14px;
      &:last-child{
        margin-bottom: 0;
      }
    }
    .el-radio__input{
      vertical-align: top;
      margin-top: 9px;
    }
    .el-radio__label{
      display: inline-block;
      line-height: 20px;
      white-space: normal;
    }
  }
}
</style>

<template>
    <div class="enter-main">
      <div class="top">
        <div class="back">
          <i class="el-icon-back" @click="goBack"></i>
          <span class="text">出院患者护理评估</span>
        </div>
        <el-form :model="ruleForm" :inline="true" label-width="120px" class="form">
          <p class="t t1">基本信息</p>
          <el-row>
            <el-col :span="6">
              <el-form-item label="患者姓名：" class="">
                {{ patientInfo.name }}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="性别：" class="">
                <span v-if="patientInfo.sex==1">男</span>
                <span v-else-if="patientInfo.sex==2">女</span>
                <span v-else>未知</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="年龄：" class="">
                {{ patientInfo.age }}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="住院号：" class="">
                {{ ruleForm.inhosNum }}
              </el-form-item>
            </el-col>
          </el-row>
          <p class="t t2">出院评估</p>
          <div>
            <el-form-item label="出院日期：" class="">
              <!-- <el-date-picker
                v-model="ruleForm.leaveHospitalDate"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker> -->
               <el-date-picker
                    v-model="ruleForm.leaveHospitalDate"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd  HH:mm:ss"
                    type="datetime"
                    placeholder="选择日期时间">
                  </el-date-picker>
            </el-form-item>
            <el-form-item label="出院诊断：" class="">
              <el-input v-model="ruleForm.leaveHospitalTreat" style="width: 570px" placeholder="请输入内容"></el-input>
            </el-form-item>
          </div>
          <el-row>
            <el-form-item label="伤口愈合：" class="">
              <el-radio-group v-model="ruleForm.woundHealing">
                <el-radio label="1">I期愈合</el-radio>
                <el-radio label="2">II期愈合</el-radio>
                <el-radio label="3">III期愈合</el-radio>
                <el-radio label="4">拆线</el-radio>
                <el-radio label="5">未拆线</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="病愈情况：" class="">
              <el-radio-group v-model="ruleForm.recovery">
                 <el-radio label="6">治愈</el-radio>
                <el-radio label="7">好转</el-radio>
                <el-radio label="8">未愈</el-radio>
                <el-radio label="9">其他</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="活动能力：" class="">
              <el-radio-group v-model="ruleForm.exerciseEnergy">
                <el-radio label="10">自理</el-radio>
                <el-radio label="11">部分自理</el-radio>
                <el-radio label="12">不能自理</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="出院方式：" class="">
              <el-radio-group v-model="ruleForm.leaveHospitalWay">
                  <el-radio label="13">步行</el-radio>
                <el-radio label="14">轮椅</el-radio>
                <el-radio label="15">平车</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-row>
          <p class="t t2">出院病人健康指导</p>
          <el-row>
            <el-form-item label="一般指导：" class="">
              <el-checkbox-group v-model="generalGuideList" stype="width:100%">
                <el-checkbox label="16" class="guide">1、修养环境应清洁舒适，保持室内空气新鲜 </el-checkbox>
                <el-checkbox label="17" class="guide">2、保持良好心境，有利康复</el-checkbox>
                <el-checkbox label="18" class="guide">3、根据自身情况适当锻炼增强体质</el-checkbox>
                <el-checkbox label="19" class="guide">4、注意营养饮食，有利机体康复</el-checkbox>
               
                <el-checkbox label="20" class="guide">5、伤口拆线后若发现伤口红肿、有硬结、疼痛或发热等及时到医院就诊</el-checkbox>
                <el-checkbox label="21" class="guide">6、按医生预约时间随诊</el-checkbox>
             
                <el-checkbox label="22" class="guide"   @change="val=>selectGuide(val)">7、出院带药指导：</el-checkbox>
            
                <el-input
                  type="textarea"
                  :rows="3"
                  style="width: 700px"
                  placeholder="请输入内容"
                  v-model="ruleForm.takeMedicineGuide">
                </el-input>
              </el-checkbox-group>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="专科指导：" class="">
              <el-input
                type="textarea"
                :rows="3"
                style="width: 700px"
                placeholder="请输入内容"
                v-model="ruleForm.professialGuide">
              </el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="个体指导：" class="">
              <el-input
                type="textarea"
                :rows="3"
                style="width: 700px"
                placeholder="请输入内容"
                v-model="ruleForm.personalityGuide">
              </el-input>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
      <div>
        <el-button type="primary" class="btn" @click="submit">提交</el-button>
      </div>
    </div>
</template>

<script>
    export default {
      data () {
        return {
          patientInfo:"",
          textarea:"",
          generalGuideList:[],
          ruleForm: {
            "name":"",
            "sex":"",
            "age":"",
            "inhosNum":"",
            "job":"",
            "nation":"",
            "education":"",
            "height":"",
            "leaveHospitalTreat":"",
            "leaveHospitalDate":"",
            "weight":"",
            "woundHealing":"",
            "recovery":"",
            "exerciseEnergy":"",
            "generalGuide":"",
            "takeMedicineGuide":"",
            "professialGuide":"",
            "personalityGuide":"",
            "patientRecordId":"",
            "archivesid":"",
            "leaveHospitalWay":""
          }
        };
      },
      created () {
      
      },
      mounted(){
        this.patientInfo = this.$route.query.patientInfo //传入过来的病患信息
        this.ruleForm.patientRecordId = this.patientInfo.record.recordId
        this.ruleForm.name =this.patientInfo.name
        this.ruleForm.age =this.patientInfo.age
        this.ruleForm.sex =this.patientInfo.sex
        this.ruleForm.inhosNum =this.patientInfo.record.inhosNum
        this.ruleForm.archivesid =this.patientInfo.archivesid
        console.log(this.patientInfo)
        this.getData()
      },
      methods: {
        goBack(){
          //  this.$router.go(-1)
           this.$router.push({
            path: '/patient/list',
            query: {
              patientId:this.$route.query.patientId
            }
         
          })
        },
        getData(){
          
          let params={
            patientRecordId:this.ruleForm.patientRecordId,
            archivesid:this.ruleForm.archivesid,

          }
          let url="/api/icu/extimate/queryOutputHospitalEstimateDetail"
          let that = this
          this.$axios.post(global.url+url,params).then((res)=>{
              if(res.data.msg==201){
                that.ruleForm = res.data.respData
                that.ruleForm.archivesid = that.patientInfo.archivesid
                if(that.ruleForm.generalGuide){
                  that.generalGuideList = that.ruleForm.generalGuide.split(",")
                }
              }
          })
        },

        submit(){
           if(this.generalGuideList.length>0){
            this.ruleForm.generalGuide = this.generalGuideList.toString()
          }else{
            this.ruleForm.generalGuide = ""
          }
          let param = this.ruleForm
            this.$axios({
              url: global.url + '/api/icu/extimate/saveOutPutHospitalEstimate',
              method: 'post',
              headers: {
                'Content-Type': 'application/json'
              },
              data: param
            }).then((res) => {
              let data = res.data
              if (data.msg == 201) {
                   this.$message({
                  message: "提交成功",
                  type: 'success'
                });
                this.goBack()
              } else {
                this.$message({
                  message: data.content,
                  type: 'warning'
                });
              }
            });
        }
      }
    };
</script>

<style lang="scss">
  .enter-main {
    margin: 10px 24px 24px;
    height: calc(100% - 10px - 24px);
    background: #FFFFFF;
    overflow: hidden;
    box-sizing: border-box;
    .back {
        padding-top: 8px;
        padding-bottom: 20px;
        .el-icon-back {
          font-weight: bold;
          font-size: 20px;
          color: rgba(0, 0, 0, 0.87);
          cursor: pointer;
        }
        .text {
          font-weight: bold;
          font-size: 20px;
          color: rgba(0, 0, 0, 0.87);
          margin-left: 8px;
        }
    }
    .top{
      padding: 24px 0 32px 32px;
      // border-bottom: 1px solid #E8E8E8;
      height: calc(100% - 48px - 24px - 32px + 1px);
      .form{
        height: 100%;
        overflow: auto;
      }
      .row{
        margin-bottom: 24px;
      }
      .t{
        color: rgba(0, 0, 0, 0.85);
        font-size: 16px;
        font-weight: 500;
        line-height: 16px;
        &.t1{
          margin: 24px 0;
        }
        &.t2{
          margin: 0 0 24px;
        }
      }
      .msg{
        font-size: 14px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.87);
        line-height: 20px;
        height: 20px;
        span{
          display: inline-block;
          width: 200px;
        }
      }
    }
    .title {
      line-height: 28px;
      i{
        font-size: 20px;
      }
      span{
        color: rgba(0, 0, 0, 0.87);
        font-size: 20px;
        font-weight: 500;
        margin-left: 8px;
      }
    }
    .el-select, .el-input{
      width: 240px;
    }
    .el-form-item{
      margin-bottom: 24px;
    }
    .btn{
      float:right;
      width:66px;
      margin: 6px 32px;
    }
    .guide{
      display: block !important;
      padding-bottom: 20px!important
    }
  }
</style>

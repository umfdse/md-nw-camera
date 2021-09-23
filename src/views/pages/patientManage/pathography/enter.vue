<template>
    <div class="enter-main">
      <div class="top">
        <div class="back">
          <i class="el-icon-back" @click="goBack"></i>
          <span class="text">入院患者护理评估</span>
        </div>
        <el-form :model="ruleForm" label-width="120px" class="form">
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
          <el-row>
            <el-col :span="8">
              <el-form-item label="民族：" class="">
                <!-- <el-input v-model="ruleForm.nation" placeholder="请输入内容"></el-input> -->
                <el-select v-model="ruleForm.nation">
                   <el-option  label='汉族' value='汉族'></el-option>
                  <el-option  label='蒙古族' value='蒙古族'></el-option>
                  <el-option  label='回族' value='回族'></el-option>
                  <el-option  label='藏族' value='藏族'></el-option>
                  <el-option  label='维吾尔族' value='维吾尔族'></el-option>
                  <el-option  label='苗族' value='苗族'></el-option>
                  <el-option  label='彝族' value='彝族'></el-option>
                  <el-option  label='壮族' value='壮族'></el-option>
                  <el-option  label='布依族' value='布依族'></el-option>
                  <el-option  label='朝鲜族' value='朝鲜族'></el-option>
                  <el-option  label='满族' value='满族'></el-option>
                  <el-option  label='侗族' value='侗族'></el-option>
                  <el-option  label='瑶族' value='瑶族'></el-option>
                  <el-option  label='白族' value='白族'></el-option>
                  <el-option  label='土家族' value='土家族'></el-option>
                  <el-option  label='哈尼族' value='哈尼族'></el-option>
                  <el-option  label='哈萨克族' value='哈萨克族'></el-option>
                  <el-option  label='傣族' value='傣族'></el-option>
                  <el-option  label='黎族' value='黎族'></el-option>
                  <el-option  label='傈傈族' value='傈傈族'></el-option>
                  <el-option  label='佤族' value='佤族'></el-option>
                  <el-option  label='拉祜族' value='拉祜族'></el-option>
                  <el-option  label='高山族' value='高山族'></el-option>
                  <el-option  label='水族' value='水族'></el-option>
                  <el-option  label='东乡族' value='东乡族'></el-option>
                  <el-option  label='纳西族' value='纳西族'></el-option>
                  <el-option  label='景颇族' value='景颇族'></el-option>
                  <el-option  label='柯尔克孜族' value='柯尔克孜族'></el-option>
                  <el-option  label='土族' value='土族'></el-option>
                  <el-option  label='达翰尔族' value='达翰尔族'></el-option>
                  <el-option  label='仫佬族' value='仫佬族'></el-option>
                  <el-option  label='羌族' value='羌族'></el-option>
                  <el-option  label='布朗族' value='布朗族'></el-option>
                  <el-option  label='撒拉族' value='撒拉族'></el-option>
                  <el-option  label='毛南族' value='毛南族'></el-option>
                  <el-option  label='仡佬族' value='仡佬族'></el-option>
                  <el-option  label='锡伯族' value='锡伯族'></el-option>
                  <el-option  label='阿昌族' value='阿昌族'></el-option>
                  <el-option  label='土族普米族' value='土族普米族'></el-option>
                  <el-option  label='塔吉克族' value='塔吉克族'></el-option>
                  <el-option  label='怒族' value='怒族'></el-option>
                  <el-option  label='乌孜别克族' value='乌孜别克族'></el-option>
                  <el-option  label='俄罗斯族' value='俄罗斯族'></el-option>
                  <el-option  label='鄂温克族' value='鄂温克族'></el-option>
                  <el-option  label='崩龙族' value='崩龙族'></el-option>
                  <el-option  label='保安族' value='保安族'></el-option>
                  <el-option  label='裕固族' value='裕固族'></el-option>
                   <el-option  label='京族' value='京族'></el-option>
                  <el-option  label='塔塔尔族' value='塔塔尔族'></el-option>
                  <el-option  label='独龙族' value='独龙族'></el-option>
                  <el-option  label='鄂伦春族' value='鄂伦春族'></el-option>
                  <el-option  label='赫哲族' value='赫哲族'></el-option>
                  <el-option  label='门巴族' value='门巴族'></el-option>
                   <el-option  label='珞巴族' value='珞巴族'></el-option>
                  <el-option  label='基洛族' value='基洛族'></el-option>
                  <el-option  label='其他' value='其他'></el-option>
                  <el-option  label='外国血统' value='外国血统'></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="职业：" class="">
                <!-- <el-input v-model="ruleForm.job" placeholder="请输入内容"></el-input> -->
                  <el-select v-model="ruleForm.job">
                   <el-option  label='国家机关、党群组织、企事业单位负责人' value='国家机关、党群组织、企事业单位负责人'></el-option>
                   <el-option  label='各类专业技术人员' value='各类专业技术人员'></el-option>
                  <el-option  label='办事人员和有关人员' value='办事人员和有关人员'></el-option>
                  <el-option  label='商业及服务型工作人员' value='商业及服务型工作人员'></el-option>
                  <el-option  label='农、林、牧、渔、水利业生产人员' value='农、林、牧、渔、水利业生产人员'></el-option>
                  <el-option  label='生产工人，运输工人和相关人员' value='生产工人，运输工人和相关人员'></el-option>
                  <el-option  label='下岗或无业' value='下岗或无业'></el-option>
                  <el-option  label='离退休' value='离退休'></el-option>
                  <el-option  label='学生' value='学生'></el-option>
                  <el-option  label='军人' value='军人'></el-option>
                  <el-option  label='不便分类的其他从业人员' value='不便分类的其他从业人员'></el-option>
                  </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="文化程度：" class="">
                <!-- <el-input v-model="ruleForm.education" placeholder="请输入内容"></el-input> -->
                 <el-select v-model="ruleForm.education">
                   <el-option  label='没上过学' value='没上过学'></el-option>
                   <el-option  label='小学' value='小学'></el-option>
                  <el-option  label='初中' value='初中'></el-option>
                  <el-option  label='高中或中专（中技）' value='高中或中专（中技）'></el-option>
                  <el-option  label='大专' value='大专'></el-option>
                  <el-option  label='本科及以上' value='本科及以上'></el-option>
                  <el-option  label='不详' value='不详'></el-option>
                  </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="体重(kg)：" class="">
                <el-input v-model="ruleForm.weight" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="身高(cm)：" class="">
                <el-input v-model="ruleForm.height" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="入科时间：" class="">
                <!-- <el-input v-model="ruleForm.admissionTime" placeholder="请输入内容"></el-input> -->
                 <!-- <el-date-picker
                    v-model="ruleForm.admissionTime"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd "
                    placeholder="选择日期">
                  </el-date-picker> -->
                   <el-date-picker
                    v-model="ruleForm.admissionTime"
                    type="datetime"
                    placeholder="选择日期时间">
                  </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-form-item label="入院诊断：" class="">
                <el-input  v-model="ruleForm.treatment" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否预期入院：" class="">
                <!-- <el-select v-model="ruleForm.isExpectToHospital"  :disabled="true">
                  <el-option  label='是' value='是'></el-option>
                  <el-option  label='否' value='否'></el-option>
                </el-select> -->
                <p>{{ruleForm.isExpectToHospital}}</p>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-form-item label="入院主诉：" class="">
                <el-input v-model="ruleForm.mainComplain" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="入院方式：" class="">
              <el-radio-group v-model="ruleForm.toHospitalWay">
                <el-radio label="1">步行</el-radio>
                <el-radio label="2">扶行</el-radio>
                <el-radio label="3">轮椅</el-radio>
                <el-radio label="4">平车</el-radio>
                <el-radio label="5">救护车</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-row>
          <p class="t t2">生命体征</p>
          <el-row>
            <el-col :span="6">
              <el-form-item label="体温(℃)：" class="">
                <el-input style="width: 60%" v-model="ruleForm.temperature" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="脉搏(次/分钟)：" class="">
                <el-input style="width: 60%" v-model="ruleForm.pluseRate" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="呼吸(次/分钟)：" class="">
                <el-input style="width: 60%" v-model="ruleForm.breatheRate" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="血压(mmHg)：" class="">
                <el-input style="width: 40%" v-model="blood" placeholder="请输入内容" class="halfInput"></el-input >/
                 <el-input style="width: 40%" v-model="pressure" placeholder="请输入内容" class="halfInput"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="意识：" class="">
              <el-radio-group v-model="ruleForm.conscious">
                <el-radio label="6">清醒</el-radio>
                <el-radio label="7">嗜睡</el-radio>
                <el-radio label="8">意识模糊</el-radio>
                <el-radio label="9">昏迷</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="面部表情：" class="">
              <el-radio-group v-model="ruleForm.facialExpression">
                <el-radio label="10">正常</el-radio>
                <el-radio label="11">淡漠</el-radio>
                <el-radio label="12">痛苦面容</el-radio>
                <el-radio label="13">慢性病面容</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="精神状态：" class="">
              <el-radio-group v-model="ruleForm.mindState">
                <el-radio label="14">良好</el-radio>
                <el-radio label="15">抑郁</el-radio>
                <el-radio label="16">焦虑</el-radio>
                <el-radio label="17">幻觉</el-radio>
                <el-radio label="18">妄想</el-radio>
                <el-radio label="19">躁动</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="语言沟通：" class="">
              <el-radio-group v-model="ruleForm.verbalCommunication">
                <el-radio label="20">正常</el-radio>
                <el-radio label="21">言语不清</el-radio>
                <el-radio label="22">言语困难</el-radio>
                <el-radio label="23">失语</el-radio>
                <el-radio label="24">普通话</el-radio>
                <el-radio label="25">方言</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-row>
          <p class="t t2">既往史</p>
          <el-row>
            <el-col :span="16">
              <el-form-item label="既往史：" class="">
                <el-input style="width: 855px" v-model="ruleForm.pastMedicalHistory" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-form-item label="药物过敏史：" class="">
                <el-input style="width: 855px" v-model="ruleForm.drugAllergyHistory" placeholder="" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-form-item label="过敏物质：" class="">
                <el-input style="width: 855px" v-model="ruleForm.allergyMateria" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-form-item label="饮酒史：" class="">
                <el-input style="width: 855px" v-model="ruleForm.alcoholHistory" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="吸烟史：" class="" style="float:left">
                <el-input style="width: 855px" v-model="ruleForm.smokingHistory" placeholder="请输入内容"></el-input>
              </el-form-item>
              <el-form-item label-width="200px" label="是否生活在吸烟环境：" class="" style="float:left">
                <el-radio-group v-model="ruleForm.isLiveSmokeEnv">
                  <el-radio label="26">是</el-radio>
                  <el-radio label="27">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <p class="t t2">生活史</p>
          <el-row>
            <el-col :span="12">
              <el-form-item label="饮食：" class="">
                <el-input style="width: 448px" v-model="ruleForm.diet" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="嗜好：" class="">
                <el-input style="width: 448px" v-model="ruleForm.hobby" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="营养：" class="">
                <el-input style="width: 448px" v-model="ruleForm.nutrition" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="口腔粘膜：" class="">
                <el-input style="width: 448px" v-model="ruleForm.mouthMucosa" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="食欲：" class="">
                <el-input style="width: 448px" v-model="ruleForm.appetite" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="睡眠：" class="">
                <el-input style="width: 448px" v-model="ruleForm.sleep" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="辅助睡眠：" class="">
                <el-input style="width: 448px" v-model="ruleForm.assitSleep" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="自理程度：" class="">
                <el-input style="width: 448px" v-model="ruleForm.selfCareLevel" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <p class="t t2">体格情况</p>
          <el-row>
            <el-col :span="12">
              <el-form-item label="活动：" class="">
                <el-select v-model="ruleForm.exercise">
                   <el-option  label='蹒跚步态' value='蹒跚步态'></el-option>
                  <el-option  label='醉酒步态' value='醉酒步态'></el-option>
                  <el-option  label='慌张步态' value='慌张步态'></el-option>
                  <el-option  label='共济失调步态' value='共济失调步态'></el-option>
                  <el-option  label='跨阈步态' value='跨阈步态'></el-option>
                  <el-option  label='剪刀步态' value='剪刀步态'></el-option>
                  <el-option  label='随意运动' value='随意运动'></el-option>
                  <el-option  label='不随意运动' value='不随意运动'></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="体位：" class="">
                <el-select v-model="ruleForm.position">
                  <el-option  label='半卧位' value='半卧位'></el-option>
                  <el-option  label='平卧位' value='平卧位'></el-option>
                  <el-option  label='交替卧位' value='交替卧位'></el-option>
                  <el-option  label='自由体位' value='自由体位'></el-option>
                  <el-option  label='被动体位' value='被动体位'></el-option>
                  <el-option  label='强迫体位' value='强迫体位'></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="皮肤粘膜：" class="">
                <el-select v-model="ruleForm.skinMucousMembrane">
                   <el-option  label='苍白' value='苍白'></el-option>
                  <el-option  label='蜡黄' value='蜡黄'></el-option>
                  <el-option  label='潮红' value='潮红'></el-option>
                  <el-option  label='紫绀' value='紫绀'></el-option>
                  <el-option  label='黄染' value='黄染'></el-option>
                  <el-option  label='紫癜' value='紫癜'></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <p class="t t2">目前情况</p>
          <el-row>
            <el-col :span="12">
              <el-form-item label="排便：" class="">
                <el-input style="width: 448px" v-model="ruleForm.defecation" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="排尿：" class="">
                <el-input style="width: 448px" v-model="ruleForm.micturition" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
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
          blood:"",
          pressure:"",
          ruleForm: {
            "name":"",
            "sex":"",
            "age":"",
            "inhosNum":"",
            "job":"",
            "nation":"",
            "education":"",
            "height":"",
            "weight":"",
            "admissionTime":"",
            "treatment":"",
            "mainComplain":"",
            "toHospitalWay":"",
            "temperature":"",
            "pluseRate":"",
            "breatheRate":"",
            "bloodPressure":"",
            "conscious":"",
            "facialExpression":"",
            "mindState":"",
            "verbalCommunication":"",
            "pastMedicalHistory":"",
            "drugAllergyHistory":"",
            "allergyMateria":"",
            "smokingHistory":"",
            "isLiveSmokeEnv":"",
            "diet":"",
            "hobby":"",
            "nutrition":"",
            "mouthMucosa":"",
            "appetite":"",
            "sleep":"",
            "assitSleep":"",
            "selfCareLevel":"",
            "exercise":"",
            "position":"",
            "skinMucousMembrane":"",
            "defecation":"",
            "micturition":"",
            "patientRecordId":"",
            "archivesid":"",
            "isExpectToHospital":"",
            "alcoholHistory":""
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
        getData(){
          
          let params={
            patientRecordId:this.ruleForm.patientRecordId,
            archivesid:this.ruleForm.archivesid,

          }
          let url="/api/icu/extimate/queryInputHospitalEstimateDetail"
          let that = this
          this.$axios.post(global.url+url,params).then((res)=>{
              if(res.data.msg==201){
                that.ruleForm = res.data.respData
                if(that.ruleForm.bloodPressure){
                  that.blood = that.ruleForm.bloodPressure.slice(0,that.ruleForm.bloodPressure.indexOf('/'))
                  that.pressure = that.ruleForm.bloodPressure.slice(that.ruleForm.bloodPressure.indexOf('/')+1,that.ruleForm.bloodPressure.length)
                }
                that.ruleForm.archivesid =that.patientInfo.archivesid
              }else{
                this.$message.error(res.data.content)
              }
          })
        },
      
        goBack(){
          //  this.$router.go(-1)
          this.$router.push({
            path: '/patient/list',
            query: {
              patientId:this.$route.query.patientId
            }
         
          })
        },
        submit(){
          this.ruleForm.bloodPressure = this.blood+'/'+this.pressure
          let param = this.ruleForm
            this.$axios({
              url: global.url + '/api/icu/extimate/saveToHospitalEstimate',
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
    .halfInput{
      display: inline-block;
      width:30% !important
    }
  }
</style>

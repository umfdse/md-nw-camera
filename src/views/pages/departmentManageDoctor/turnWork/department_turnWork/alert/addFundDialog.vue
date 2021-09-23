<template>
  <el-dialog
    :visible.sync="isVisible"
    title="新增特殊病人"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :modal-append-to-body="false"
    width="500px"
    top="18vh"
    @close="closeDialog"
    v-dialogDrag
  >
    <div class="form">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        :label-width="dialog.formLabelWidth"
        width="500px"
        top="18vh"
        style="margin: 10px; width: auto"
      >
        <!-- <el-form-item prop="userNumber" label="用户工号:">
          <el-input type="text" v-model="form.userNumber"></el-input>
        </el-form-item>
        <el-form-item prop="userName" label="用户姓名:">
          <el-input
            type="text"
            v-model="form.userName"
          ></el-input>
        </el-form-item> -->
        <el-form-item prop="patientInfo" label="患者信息:">
          <el-select v-model="form.patientInfo" placeholder="请选择" @change="AddSelectDept" >
            <el-option
              v-for="item in patientInfos"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
          <!-- <el-form-item prop="diagnosisContent" label="诊断:">
          <el-input
            type="text"
            v-model="form.diagnosisContent"
          ></el-input>
        </el-form-item>  -->
          <el-form-item prop="specialEvent" label="特殊情况:">
          <el-input
            type="textarea"
            :rows="2"
            v-model="form.specialEvent"
            :maxlength="200"
          ></el-input>
        </el-form-item> 
        <!-- <el-form-item prop="role" label="接班人:">
           <el-select v-model="role" placeholder="请选择">
            <el-option
              v-for="item in roles"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item class="text_right">
          <el-button @click="isVisible = false">取 消</el-button>
          <el-button type="primary" @click="onSubmit('form')">提 交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
//    import { mapState, mapGetters } from 'vuex'
//    import { addMoney,updateMoney } from "@/api/money";
//    import AreaJson from "@/assets/datas/area.json"
// import moment from "moment";
export default {
  name: "addFundDialogs",
  data() {
    return {
      // newTime:"",
      patientInfos:[],
      role:"",
      deptName:"",
      bedNo:"",
      areaData: [],
      isVisible: this.isShow,
      form: {
        patientInfo: "",
        diagnosisContent: "",
        specialEvent: "",
      },

      rules: {

        // phone: [{ required: true, validator: checkTel, trigger: "blur" }],
        // unit: [{ required: true, validator: checkUnitName, trigger: "blur" }],
        // psWord: [{ required: true, validator: validatePass, trigger: "blur" }],
        // isPassWord: [
        //   { required: true, validator: validatePass2, trigger: "blur" },
        // ],
        // email: [{ required: true, validator: checkEmail, trigger: "blur" }],
        // sysName: [
        //   { required: true, validator: checkSystemName, trigger: "blur" },
        // ],
      },
      //详情弹框信息
      dialog: {
        width: "400px",
        formLabelWidth: "120px",
      },
    };
  },
  props: {
    isShow: Boolean,
    newTime:String,
    shiftTimePeriod:String,

  },
  //   computed:{
  //     ...mapGetters(['addFundDialog']),
  //   },
  created() {
    // this.areaData = AreaJson
  },
  mounted() {
    // this.newTime = new Date().format("yyyy-MM-dd")
    console.log(this.newTime)
    console.log(this.shiftTimePeriod)
    this.getDept()
  },
  methods: {
    AddSelectDept () {
       for(let i =0;i<this.patientInfos.length;i++){
         if(this.patientInfos[i].value==this.form.patientInfo){
            this.deptName = this.patientInfos[i].label
         }
         this.bedNo = this.deptName.slice(0,this.deptName.indexOf('、'))
       }
    },

    getDept(){
        let url = "/api/icu/transition/querySpecialCandidatePatientList"
        let params ={
          shiftClass:2,
          shiftTimePeriod:this.shiftTimePeriod,
          shiftDate:this.newTime
        }
        let that = this
        this.$axios.post(global.url+url,params).then(function(res){
              let obj = res.data.respData
              for(let k in obj){
                that.patientInfos.push({value:k,label:obj[k]})
              }
              console.log(that.patientInfos)

        })
    },

    closeDialog() {
      this.$emit("closeDialog");
    },
    //表单提交
    onSubmit(form) {
      console.log(this.$refs[form]);
      this.$refs.form.validate((valid) => {
        if (valid) {
          //表单数据验证完成之后，提交数据;
          let url="/api/icu/transition/editDoctorTransition"
          let params = {
            bedNo:this.bedNo,
            patientRecordId:this.form.patientInfo,
            shiftType:5,
            shiftClass:2,
            shiftDate:this.newTime,
            shiftTimePeriod:this.shiftTimePeriod,
            specialEvent:this.form.specialEvent,
            // diagnosisContent:this.form.diagnosisContent

          };
          this.$axios.post(global.url+url,params).then(res=>{
            if(res.data.msg==201){
              this.$message({
                type: "success",
                message: "新增成功",
              });
              this.isVisible = false
              this.$emit("getFundList");
            }else{
                this.$message.error(res.data.content)
            }
          })
          // this.$api.put(Inter.register, user, (response) => {
          //   if (response.code == 200) {
          //     this.$message({
          //       type: "success",
          //       message: "注册成功",
          //     });
          //     this.loginIn = true;
          //   } else {
          //     console.log(response);
          //   }
          // });
        }
      });
    },
  },
};
</script>

<style  lang="scss" scoped>
.search_container {
  margin-bottom: 20px;
}
.btnRight {
  float: right;
  margin-right: 0px !important;
}
.searchArea {
  background: rgba(255, 255, 255, 1);
  border-radius: 2px;
  padding: 18px 18px 0;
}
  .text_right{
    text-align: right;
}
</style>

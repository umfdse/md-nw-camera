<template>
  <el-dialog
    :visible.sync="isVisible"
    title="新增药品"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :modal-append-to-body="false"
    width="480px"
    top="18vh"
    @close="closeDialog"
    v-dialogDrag
  >
    <div class="form_userAdd">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        :label-width="dialog.formLabelWidth"
        width="480px"
        top="18vh"
        style="margin: 10px; width: auto"
      >
        <el-form-item prop="originalName" label="药品通用名:">
          <el-input type="text" v-model="form.originalName" class="inputInner" ></el-input>
        </el-form-item>
        <!-- <el-form-item prop="realName" label="用户姓名:">
          <el-input type="text" v-model="form.realName" class="inputInner"  ></el-input>
        </el-form-item> -->
         <el-form-item prop="specification" label="规格:">
          <!-- <el-select v-model="form.userType"  placeholder="请选择" class="inputInner">
            <el-option
              v-for="item in userTypes"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            >
            </el-option>
          </el-select> -->
            <el-input type="text" v-model="form.specification" class="inputInner" ></el-input>
        </el-form-item>
        <el-form-item prop="unit" label="单位:">
          <el-select v-model="form.unit"  placeholder="请选择" class="inputInner">
            <el-option
              v-for="item in doseUnits"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item prop="transferDose" label="入量转化:">
          <el-input type="text" v-model="form.transferDose" class="inputInner"  ></el-input>
        </el-form-item>
        <!-- <el-form-item prop="role" label="角色名:">
           <el-select v-model="form.role"  placeholder="请选择" class="inputInner">
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item prop="unit" label="权限内容:">
          
          
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


export default {
  name: "addFundDialogs",
  data() {
    var validatePass = (rule, value, callback) => {
      let regPass =/[0-9a-zA-Z]/;
      if (value === "") {
        callback(new Error("用户工号不能为空"));
      } else if (!regPass.test(value)) {
        callback(new Error("请输入字母或数字"));
      } else {
        // if (this.loginForm.isPassword !== "") {
        //   this.$refs.loginForm.validateField("isPassword");
        // }
        callback();
      }
    };
    //  var checkRealName = (rule, value, callback) => {
    //   if (value == "") {
    //     callback(new Error("用户姓名不能为空"));
    //   } else {
    //     callback();
    //   }
    // };
    
    return {
      userTypes:[
        {id:3,value:"医生"},
        {id:4,value:"护士"}
      ],
      unit:"",
      doseUnits:[
        {value:"盒",name:"盒"},
        {value:"支",name:"支"},
        {value:"瓶",name:"瓶"},
        {value:"袋",name:"袋"},
        {value:"mg",name:"mg"},
        {value:"g",name:"g"}
      ],
      roles:[],
      areaData: [],
      isVisible: this.isShow,
      form: {
        originalName:"",
        specification:"",
        unit:"",
         transferDose:"",
      },

      rules: {
        originalName: [{ required: true, message: '药品通用名不能为空', trigger: "blur" }],
        specification: [{ required: true, message: '规格不能为空', trigger: "blur" }],
        unit: [{ required: true, message: '单位不能为空', trigger: "blur" }],
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
    dialogRow: Object,
  },
  //   computed:{
  //     ...mapGetters(['addFundDialog']),
  //   },
  created() {
    // this.areaData = AreaJson
  },
  mounted() {

  },
  methods: {
    getCascaderObj(val, opt) {
      return val.map(function (value, index, array) {
        for (var item of opt) {
          if (item.value == value) {
            opt = item.children;
            return item.label;
          }
        }
        return null;
      });
    },


    closeDialog() {
      this.$emit("closeDialog");
    },
    //表单提交
    onSubmit(form) {
      let that = this
      console.log(this.$refs[form]);
      this.$refs.form.validate((valid) => {
        if (valid) {
          //表单数据验证完成之后，提交数据;
          let params = {
              originalName:this.form.originalName,
              specification:this.form.specification,
              transferDose:this.form.transferDose,
              unit:this.form.unit,
          
          };
          let url = "/api/icu/advice/dict/addAdviceTransferDictData"
          this.$axios.post(global.url + url,params).then((response) => {
            if (response.data.msg == 201) {
              that.$message({
                type: "success",
                message: "新增药品成功",
              });
               that.isVisible = false;
                that.$emit("getFundList");
            } else {
              that.$message.error(response.data.content)
            }
          });
        }
      });
    },
  },
};
</script>

<style  lang="scss" scoped>
  .form_userAdd{
     .search_container {
    margin-bottom: 20px;
  }
  .searchArea {
    background: rgba(255, 255, 255, 1);
    border-radius: 2px;
    padding: 18px 18px 0;
  }

  .text_right{
    text-align: right;
  }
  .inputInner{
    width:224px!important
  }
  }
 
</style>

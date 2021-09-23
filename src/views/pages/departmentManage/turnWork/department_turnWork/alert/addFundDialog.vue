<template>
  <el-dialog
    :visible.sync="isVisible"
    title="新增用户"
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
        <el-form-item prop="userNumber" label="用户工号:">
          <el-input type="text" v-model="form.userNumber"></el-input>
        </el-form-item>
        <el-form-item prop="userName" label="用户姓名:">
          <el-input
            type="text"
            v-model="form.userName"
          ></el-input>
        </el-form-item>
        <el-form-item prop="isDerpartment" label="所属科室:">
          <el-select v-model="isDerpartment" placeholder="请选择">
            <el-option
              v-for="item in derpartments"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="role" label="角色名:">
           <el-select v-model="role" placeholder="请选择">
            <el-option
              v-for="item in roles"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="unit" label="权限内容:">
          
          
        </el-form-item>
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

export default {
  name: "addFundDialogs",
  data() {
    var checkUserName = (rule, value, callback) => {
      let regName = /^[\da-zA-Z0-9]{4,20}$/;
      if (value == "") {
        callback(new Error("用户工号不能为空"));
      } else {
        if (!regName.test(value)) {
          callback(new Error("用户名由4到20位数字字母中文组成"));
        }
      }
    };
    var checkTel = (rule, value, callback) => {
      let regPhone = /^1\d{10}$/;
      if (value == "") {
        callback(new Error("电话号码不能为空"));
      } else {
        if (!regPhone.test(value)) {
          callback(new Error("请输入正确的手机号"));
        }
      }
    };
    var checkUnitName = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("单位名称不能为空"));
      } else {
        callback();
      }
    };
    var checkEmail = (rule, value, callback) => {
      let regEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      if (value == "") {
        callback(new Error("邮箱不能为空"));
      } else {
        if (!regEmail.test(value)) {
          callback(new Error("请输入正确的邮箱号"));
        }
      }
    };
    var checkSystemName = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("系统账号不能为空"));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      let regPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+|\\\<>?`\-=\[\]{},./:\";'])[\dA-Za-z~!@#$%^&*()_+|\<>?`\\\-=\[\]{},./:\";']{8,20}$/;
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (!regPass.test(value)) {
        callback(new Error("请输入8-20位大写字母+小写字母+数字+符号的密码"));
      } else {
        // if (this.loginForm.isPassword !== "") {
        //   this.$refs.loginForm.validateField("isPassword");
        // }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.psWord) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      isDerpartment:"",
      role:"",
      derpartments: [
        {
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
        {
          value: "选项3",
          label: "蚵仔煎",
        },
        {
          value: "选项4",
          label: "龙须面",
        },
        {
          value: "选项5",
          label: "北京烤鸭",
        },
      ],
      roles: [
        {
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
        {
          value: "选项3",
          label: "蚵仔煎",
        },
        {
          value: "选项4",
          label: "龙须面",
        },
        {
          value: "选项5",
          label: "北京烤鸭",
        },
      ],
      areaData: [],
      isVisible: this.isShow,
      form: {
        userNumber:"",
        userName: "",
        psWord: "",
        isPassWord: "",
        phone: "",
        unit: "",
        email: "",
        sysName: "",
      },

      rules: {
        userName: [
          { required: true, validator: checkUserName, trigger: "blur" },
        ],
        phone: [{ required: true, validator: checkTel, trigger: "blur" }],
        unit: [{ required: true, validator: checkUnitName, trigger: "blur" }],
        psWord: [{ required: true, validator: validatePass, trigger: "blur" }],
        isPassWord: [
          { required: true, validator: validatePass2, trigger: "blur" },
        ],
        email: [{ required: true, validator: checkEmail, trigger: "blur" }],
        sysName: [
          { required: true, validator: checkSystemName, trigger: "blur" },
        ],
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
  mounted() {},
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
    handleChange(value) {
      console.log([...value]); // ["120000", "120200", "120223"]
      this.form.address = [...value];
      let vals = this.getCascaderObj([...value], this.areaData); // arr
      this.form.tableAddress = vals.join(",").replace(/,/g, "");
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
          let user = {
            userName: this.form.userName,
            passWord: this.form.psWord,
            // isPassWord: this.loginForm2.isPassWord,
            tel: this.form.phone,
            unit: this.form.unit,
            email: this.form.email,
            sysName: this.form.sysName,
          };
          this.$api.put(Inter.register, user, (response) => {
            if (response.code == 200) {
              this.$message({
                type: "success",
                message: "注册成功",
              });
              this.loginIn = true;
            } else {
              console.log(response);
            }
          });
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
</style>

<template>
  <el-dialog
    :visible.sync="isVisible"
    title="新增用户"
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
        <el-form-item prop="username" label="用户工号:">
          <el-input type="text" v-model="form.username" class="inputInner" ></el-input>
        </el-form-item>
        <el-form-item prop="realName" label="用户姓名:">
          <el-input type="text" v-model="form.realName" class="inputInner"  ></el-input>
        </el-form-item>
         <el-form-item prop="userType" label="用户类型:">
          <el-select v-model="form.userType"  placeholder="请选择" class="inputInner">
            <el-option
              v-for="item in userTypes"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="isDept" label="所属科室:">
          <el-select v-model="form.isDept"  placeholder="请选择" class="inputInner">
            <el-option
              v-for="item in derpartments"
              :key="item.id"
              :label="item.deptName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="role" label="角色名:">
           <el-select v-model="form.role"  placeholder="请选择" class="inputInner">
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
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
      derpartments:[],
      roles:[],
      areaData: [],
      isVisible: this.isShow,
      form: {
        userType:"",
        username:"",
        realName:"",
         isDept:"",
          role:"",
      },

      rules: {
        role: [{ required: true, message: '角色名不能为空', trigger: "blur" }],
        userType: [{ required: true, message: '用户类型不能为空', trigger: "blur" }],
        isDept: [{ required: true, message: '所属科室不能为空', trigger: "blur" }],
        realName: [ { required: true, message: '用户姓名不能为空', trigger: 'blur' }],
        username: [{ required: true, validator: validatePass, trigger: "blur" }],
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
    this.getDept()
    this.getRole()
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
     //获取科室列表
    getDept(){
   /*   let url = "/base/user/getDepts"
      let that = this
      this.$axios.get(global.url + url).then(function (res) {
          that.derpartments = res.data.respData
      });*/
      let param = {
        hospitalCode: '',
        pageSize: 0,
        pageNum: 1,
        type:'1'
      }
      this.$axios({
        url: global.url + '/base/dept/list',
        method: 'get',
        headers: {
          'Content-Type': 'application/json'
        },
        params: param
      }).then(res => {
        let data=res.data
        if (data.msg ===201) {
          this.derpartments = data.respData && data.respData.list ? data.respData.list : []
        } else {
          this.$message.error(data.content)
        }
      })

    },
      //获取角色列表
    getRole(){
      let that = this
      let url = "/base/user/getRoles"
      this.$axios.get(global.url + url).then(function (res) {
          that.roles = res.data.respData
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
      let that = this
      console.log(this.$refs[form]);
      this.$refs.form.validate((valid) => {
        if (valid) {
          //表单数据验证完成之后，提交数据;
          let params = {
              userType:this.form.userType,
              realName:this.form.realName,
              username:this.form.username,
              deptIds:[this.form.isDept],
              roleIds:[this.form.role],
          };
          let url = "/base/user/addDoctorUser"
          this.$axios.post(global.url + url,params).then((response) => {
            if (response.data.msg == 201) {
              that.$message({
                type: "success",
                message: "新增用户成功",
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

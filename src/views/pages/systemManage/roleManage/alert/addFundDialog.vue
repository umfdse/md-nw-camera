<template>
  <el-dialog
    :visible.sync="isVisible"
    title="新增角色"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :modal-append-to-body="false"
    width="1040px"
    @close="closeDialog"
    v-dialogDrag
  >
    <el-form
     class="form_roleAdd"
      ref="form"
      :model="form"
      :rules="rules"
      :label-width="dialog.formLabelWidth"
      style="margin:0 24px; width: auto"
    >
      <div class="form_header">
         <el-form-item class="leftInput" label="角色标识:" prop="code">
           <el-input v-model="form.code" placeholder="请输入角色标识" class="inputInner" ></el-input>
        </el-form-item>
        <el-form-item class="leftInput" label="角色名称:" prop="name">
           <el-input v-model="form.name" placeholder="请输入角色名称" class="inputInner" ></el-input>
        </el-form-item>
         <el-form-item class="rightInput" label="角色说明:" prop="description">
           <el-input v-model="form.description" placeholder="请输入角色说明" class="inputInner" ></el-input>
        </el-form-item>
      </div>
      <div class="form_table">
        <el-tree
          :data="treeData"
          show-checkbox
          node-key="menuId"
           ref="tree"
          :props="defaultProps">
        </el-tree>
      </div>
      <el-form-item class="text_right">
        <el-button @click="isVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit('form')">提 交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import Pagination from "@/components/pagination";
export default {
  components: {
    Pagination,
  },
  name: "addFundDialogs",
  data() {
  
    return {
      treeData:[],
      defaultProps: {
          children: 'children',
          label: 'menuName'
        },
      tableData: [],
      limitsNumber: "",
      roleName:"",
      roleContent:"",
      isVisible: this.isShow,
      form: {
        code: "",
        name:"",
        description: "",

      },
       incomePayData: {
        page: 1,
        limit: 10,
        name: ""
      },
      loading:false,
      pageTotal: 0,
      rules: {
        code: [{ required: true, message: "请输入角色标识", trigger: "blur" }],
         name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
        // description: [{ required: true, message: "请输入角色说明", trigger: "blur" }],
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
    let that = this
     let url = '/base/menu/list'
       this.$axios.get(global.url + url).then( (response) => {
            if (response.data.msg == 201) {
              that.treeData =  response.data.respData
              console.log(response.data)
       
            } else {
              that.$message.error(response.data.content)
            }
          });
 
  },
  methods: {

    closeDialog() {
      this.$emit("closeDialog");
    },
    //表单提交
    onSubmit(form) {
      let that = this
      console.log(this.$refs[form]);
      console.log(this.$refs.tree.getCheckedKeys())//获取勾选的子节点id
      console.log(this.$refs.tree.getHalfCheckedKeys())//获取未勾选全子节点的父节点id
      this.$refs.form.validate((valid) => {
        if (valid) {
          //表单数据验证完成之后，提交数据;
          let params = {
              code:this.form.code,
              name:this.form.name,
              description:this.form.description,
               menuIds:this.$refs.tree.getCheckedKeys().join(),
              // menuIds:this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys()).join(),
          };
          let url = "/base/role/addRoleMenu"
          this.$axios.post(global.url + url,params).then((response) => {
            if (response.data.msg == 201) {
              that.$message({
                type: "success",
                message: "新增角色成功",
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
     // 上下分页
    handleCurrentChange(val) {
      this.incomePayData.page = val;
      this.loadData();
    },
    // 每页显示多少条
    handleSizeChange(val) {
      this.incomePayData.limit = val;
      this.loadData();
    },
  },
};
</script>

<style lang="scss" >
    .form_roleAdd{
          max-height: 550px;
          // overflow: auto;
          .inputInner{
            width:164px;
          }
          .search {
          height: 32px;
          line-height: 32px;
          padding:0 10px;
          margin-top:30px;
          .limitTitle {
            float: left;
            font-size: 16px;
            color:#000;
          }
        }
        .limitInput {
          float: right;
        }
        .text_right {
          text-align: right;
          padding-right: 10px;
        }
        .form_header{
          // height: 32px;
          display: flex;
          justify-content: space-between;

          .rightInput{
            padding-right:80px;
          }
        }
        .table_container .el-table th{
          height: 38px!important
        }
    }

</style>

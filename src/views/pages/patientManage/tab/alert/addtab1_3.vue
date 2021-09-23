<template>
  <div class="addtab03">
    <el-form
      ref="form"
      :model="form"
      label-width="100px"
      :rules="rules"
      class="el-form-pad"
    >
      <el-row type="flex" justify="space-between">
        <el-col :span="12">
          <el-form-item label="观察项：" prop="project">
            <el-select
              v-model="form.project"
              size="small"
              @change="changeValue"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="纪录时间：" prop="recordTime">
            <el-date-picker
              v-model="form.recordTime"
              type="datetime"
              size="small"
              placeholder="选择时间"
              align="left"
              :picker-options="pickerOptions"
              :default-value="new Date()"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col v-if="itemOption.type == 1">
          <unit-tab
            v-for="(item, index) in itemOption.date"
            :key="index"
            :obj="item"
            ref="unitTab"
          ></unit-tab>
        </el-col>
        <el-col v-if="itemOption.type == 2">
          <el-form-item :label="itemOption.name + '：'">
            <el-radio-group
              v-model="form.state"
              @change="changeRadio"
              width="100%"
            >
              <el-col
                :span="5"
                v-for="(item, index) in itemOption.date"
                :key="index"
                class="radioCol"
              >
                <el-radio :label="item.value">{{ item.name }}</el-radio>
              </el-col>
            </el-radio-group>
          </el-form-item>
          <unit-tab
            v-for="(item, index) in innerOption"
            :key="index"
            :obj="item"
            ref="unitTab"
          ></unit-tab>
        </el-col>
        <el-col v-if="itemOption.type == 3"> </el-col>
        <el-col v-if="itemOption.type == 4"> </el-col>
      </el-row>
    </el-form>
    <div class="addbtn">
      <el-button size="medium" @click="cancel()">取消</el-button>
      <el-button size="medium" @click="addSubmit('form')" type="primary" :loading="btnLoading">确定</el-button>
    </div>
  </div>
</template>
<script>
import unitTab from "./addtab1_3_com";
export default {
  name: "addtab03",
  components: {
    unitTab: unitTab,
  },
  props:['outhosTime'],
  data() {
    return {
      form: {
        project: "",
        recordTime: "",
        state: "",
        content: [],
        patientRecordId: "",
      },
      options: [],
      rules: {
        recordTime: [
          { required: true, trigger: "blur", message: "时间不能为空" },
        ],
        project: [
          { required: true, trigger: "change", message: "观察项不能为空" },
        ],
      },
      itemOption: {},
      innerOption: [],
      pickerOptions:{
         disabledDate: time => {
          if(this.outhosTime){
            return time.getTime() > new Date(this.outhosTime);
          }else{
            return time.getTime() > new Date().getTime();
          }
        }
      },
      btnLoading:false,
      startTime:null,
    };
  },
  methods: {
    getInit(patientRecordId) {
       this.btnLoading = false;
             this.form={
              project: '',
              recordTime: "",
              state: "",
              content: [],
              patientRecordId: "",
          },
          this.$set(this.form,'project','')
          this.$set(this.itemOption,'type','')
          this.$refs['form'].resetFields();
          this.form.patientRecordId = patientRecordId;
          this.getConfig();
    },
    getInitData(id,patientRecordId) {
      let that = this;
      that.btnLoading = false;
      that.getConfig();
      that.form.patientRecordId = patientRecordId;
      that.form.id = id;
      let url = "/api/icu/observation/" + id;
      that.$axios.get(global.url + url).then(function (res) {
        if (res.data.msg == 201) {
          let list = res.data.respData;
          that.form.project = list.project;
          that.form.recordTime = list.recordTime;
          that.changeValue(that.form.project);
          if (that.itemOption.type == 2) {
            that.form.state = list.state;
            that.changeRadio(that.form.state, list.content);
          }else if(that.itemOption.type==1){
            that.changeRadio(that.form.state, list.content)
          }
          //
        }
      });
    },
    cancel() {
      this.$emit("submit");
    },
    addSubmit(formName) {
      let that = this;
      that.$refs[formName].validate((valid) => {
      if(valid){
      let unitTab = that.$refs.unitTab;
      that.form.content = [];
      if (unitTab) {
        unitTab.forEach(function (item, index) {
          item.form.contentCode = item.contentCode;
          that.form.content.push(item.form);
        });
      }
      let startTime = new Date().getTime();
      if(that.startTime&&(startTime - that.startTime<500)){
          return false;
      }
      that.startTime = startTime;
      let url = "/api/icu/observation/save";
      that.$axios.post(global.url + url, that.form).then(function (res) {
        if (res.data.msg == 201) {
            that.$message({
              type: "success",
              message: res.data.content,
            })
          that.$emit("submit");
          that.$emit("refresh");
        }else{
          that.$message({
              type: "info",
              message: res.data.content,
            })
        }
      });
      }
      })
    },
    getConfig() {
      let that = this;
      let url = "/api/icu/observation/queryConfigure";
      this.$axios.get(global.url + url).then(function (res) {
        if (res.data.msg == 201) {
          that.options = res.data.respData;
          console.log(that.options);
        }
      });
    },
    changeValue(value) {
      let that = this;
      that.options.forEach(function (item, index) {
        if (item.value == value) {
          that.itemOption = item;
        }
      });
      let unitTab = that.$refs.unitTab;
      if(unitTab&&unitTab.length>0){
         unitTab.forEach(function (item, index) {
          item.form.contentValue = "";
        });
      }
      that.innerOption = [];
      that.form.state = "";
    },
    changeRadio(value, content) {
      let that = this;
      that.itemOption.date.forEach(function (item, index) {
        if (item.value == value) {
          that.innerOption = item.date;
        }
      })
      that.$nextTick(function (item, index) {
        let unitTab = that.$refs.unitTab;
        if (unitTab && content) {
          unitTab.forEach(function (item, index) {
            content.forEach(function (item2, index) {
              if (item.contentCode == item2.contentCode) {
                item.form.contentValue = item2.contentValue;
              }
            });
          });
        } else {
          unitTab.forEach(function (item, index) {
            item.form.contentValue = "";
          });
        }
      });
    },
  },
};
</script>
<style lang="scss">
.addtab03 {
  .el-radio-group {
    width: 100%;
  }
  .el-form-pad {
    padding: 0px 20px;
  }
  .itemRadio {
    padding: 10px 10px 15px 25px;
  }
  .radioCol {
    padding: 8px 0px;
  }
  .addbtn {
    margin-top: 20px;
    padding: 10px 20px 10px 20px;
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid rgba(0, 0, 0, 0.06);
  }
  .el-select,
  .el-input,
  .el-date-editor.el-input {
    width: 100%;
  }
}
</style>
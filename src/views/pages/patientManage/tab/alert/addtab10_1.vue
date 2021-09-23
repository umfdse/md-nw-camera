<template>
  <div class="addtab10_1">
    <el-form ref="form" :model="form" label-width="160px" :rules="rules">
      <el-row>
        <el-col :span="20">
          <el-form-item label="采集时间：" prop="recordTime">
            <el-date-picker
              v-model="form.recordTime"
              type="datetime"
              size="small"
              placeholder="选择时间"
              align="left"
              :picker-options="pickerOptions"
              style="width: 100%"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="呼吸方式：" prop="breathingMethod">
            <el-select
              placeholder="请选择"
              size="small"
              v-model="form.breathingMethod"
            >
              <el-option
                v-for="(item, index) in breathingMethods"
                :key="index"
                :label="item.name"
                :value="Number(item.value)"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="R(次/分)：" prop="rtimes">
            <el-input
              size="small"
              v-model="form.rtimes"
              maxlength="32"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="Spo2%：" prop="spo2">
            <el-input
              size="small"
              v-model="form.spo2"
              maxlength="32"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="模式：" prop="mode">
            <el-select placeholder="请选择" size="small" v-model="form.mode">
              <el-option
                v-for="(item, index) in modes"
                :key="index"
                :label="item.name"
                :value="Number(item.value)"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="Fio2%：" prop="fio2">
            <el-input
              size="small"
              v-model="form.fio2"
              maxlength="32"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="F(次/分)：" prop="ttimes">
            <el-input
              size="small"
              v-model="form.ttimes"
              maxlength="32"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="VT(ml)：" prop="vt">
            <el-input
              size="small"
              v-model="form.vt"
              maxlength="32"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="PEEP(cmH2O)：" prop="peep">
            <el-input
              size="small"
              v-model="form.peep"
              maxlength="32"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="PS(cmH2O)：" prop="ps">
            <el-input
              size="small"
              v-model="form.ps"
              maxlength="32"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="addbtn">
      <el-button size="medium" @click="cancel()">取消</el-button>
      <el-button size="medium" @click="addSubmit('form')" type="primary"
        >确定</el-button
      >
    </div>
  </div>
</template>
<script>
export default {
  name: "addtab10_1",
  props: ["config", "recordId"],
  computed: {
    breathingMethods: function () {
      return this.config.ventilator_way;
    },
    modes: function () {
      return this.config.ventilator_mode;
    },
  },
  data() {
    let checkNum = (rule, value, callback) => {
      if (!/^[0-9]\d*$/.test(value) && value) {
        callback(new Error("请输入正整数"));
      } else {
        if (value < 0) {
          callback(new Error("范围在0-999"));
        } else if (value > 999) {
          callback(new Error("范围在0-999"));
        } else {
          callback();
        }
      }
    };
    return {
      rules: {
        recordTime: [
          { required: true, trigger: "blur", message: "时间不能为空" },
        ],
        rtimes: [{ validator: checkNum, trigger: "blur" }],
        ttimes: [{ validator: checkNum, trigger: "blur" }],
        spo2: [{ validator: checkNum, trigger: "blur" }],
        fio2: [{ validator: checkNum, trigger: "blur" }],
        vt: [{ validator: checkNum, trigger: "blur" }],
        peep: [{ validator: checkNum, trigger: "blur" }],
        ps: [{ validator: checkNum, trigger: "blur" }],
      },
      pickerOptions: {
        disabledDate: (time) => {
          if (this.outhosTime) {
            return time.getTime() > new Date(this.outhosTime);
          } else {
            return time.getTime() > new Date().getTime();
          }
        },
      },
      form: {
        recordTime: "",
        breathingMethod: "",
        rtimes: "",
        spo2: "",
        mode: "",
        fio2: "",
        ttimes: "",
        vt: "",
        peep: "",
        ps: "",
      },
      id: null,
      startTime: null,
    };
  },
  methods: {
    clearData() {
      this.id = null;
      this.form = {
        recordTime: "",
        breathingMethod: "",
        rtimes: "",
        spo2: "",
        mode: "",
        fio2: "",
        ttimes: "",
        vt: "",
        peep: "",
        ps: "",
      };
      this.$refs["form"].resetFields();
    },
    initData(id) {
      let that = this;
      this.id = id;
      let url = "/api/icu/instrument/query/" + id;
      that.$axios.get(global.url + url).then(function (res) {
        if (res.data.msg == 201) {
          that.form = res.data.respData;
        } else if (res.data.msg == 301) {
          that.$message({
            message: res.data.content,
            type: "warning",
          });
        }
      });
    },
    cancel() {
      this.$emit("submit", 1);
    },
    addSubmit(formName) {
      let that = this;
      that.$refs[formName].validate((valid) => {
        if (valid) {
          let url = "/api/icu/instrument/save";
          that.form.patientRecordId = that.recordId;
          if (that.id) {
            that.form.id = that.id;
          }
          let startTime = new Date().getTime();
          if (that.startTime && startTime - that.startTime < 500) {
            return false;
          }
          that.startTime = startTime;
          that.$axios.post(global.url + url, that.form).then(function (res) {
            if (res.data.msg == 201) {
              that.$emit("submit", 1);
              that.$emit("refresh");
              that.$message({
                type: "success",
                message: res.data.content,
              });
            } else if (res.data.msg == 302) {
              that.$message({
                message: res.data.content,
                type: "warning",
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>
<style lang="scss">
.addtab10_1 {
  .el-row .el-form-item__label {
    text-align: right !important;
    width: 160px !important;
  }
  .el-select {
    width: 100%;
  }
  .el-form {
    padding: 0px 20px;
  }
  .addbtn {
    margin-top: 20px;
    padding: 10px 20px 10px 20px;
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid rgba(0, 0, 0, 0.06);
  }
}
</style>
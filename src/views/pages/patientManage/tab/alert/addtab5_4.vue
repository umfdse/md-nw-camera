<template>
    <div class="addDrain">
          <el-form ref="form" :model="form" label-width="160px" :rules="rules">
      <el-row>
        <el-col :span="20">
            <el-form-item label="导管名称：">
                {{pipeName}}
                <!-- <el-input v-model="pipeName" disabled></el-input> -->
            </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
            <el-form-item label="记录日期：" prop="drainageTime">
            <el-date-picker
              v-model="form.drainageTime"
              type="datetime"
              size="small"
              placeholder="选择时间"
              align="left"
              :default-value="new Date()"
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
            <el-form-item label="引流液颜色：" prop="drainageColour">
                 <el-select v-model="form.drainageColour" placeholder="请选择">
                    <el-option
                    v-for="(item,index) in colourList"
                    :key="index"
                    :label="item.name"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
            <el-form-item label="引流液剂量(mL)：" prop="drainageAmount">
                <el-input v-model="form.drainageAmount"></el-input>
            </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
            <el-form-item label="周围皮肤情况：" prop="skinStatus">
                <el-input v-model="form.skinStatus"></el-input>
            </el-form-item>
        </el-col>
      </el-row>
       <el-row>
        <el-col :span="20">
            <el-form-item label="引流液性状：" prop="property">
                 <el-select v-model="form.property" placeholder="请选择">
                    <el-option
                    v-for="(item,index) in prList"
                    :key="index"
                    :label="item.name"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-col>
      </el-row>
        <div class="addbtn">
            <el-button size="medium" @click="cancel('form')">取消</el-button>
            <el-button size="medium" @click="addSubmit('form')" type="primary">确定</el-button>
        </div>
    </el-form>
    </div>
</template>

<script>
export default {
    name:'addtab5_4',
    props:['drainageColourList','propertyList','cannulaName','outhosTime'],
    data(){
        return{
            form:{
               drainageColour:'',//引流液颜色
               drainageAmount:'',//引流液剂量
               skinStatus:'',//周围皮肤状况
               property:'',//引流液形状
               drainageTime:''//记录日期
            },
            id:null,
            cannulaId:null,//管道ID
            rules:{
                drainageColour: [{
                    required: true,
                    trigger: "change",
                    message: "颜色不能为空",
                    }],
                drainageAmount: [{
                    required: true,
                    trigger: "blur",
                    message: "剂量不能为空",
                    }],
                skinStatus: [{
                    required: true,
                    trigger: "blur",
                    message: "皮肤状况不能为空",
                    }],
                property: [{
                    required: true,
                    trigger: "change",
                    message: "引流液性状不能为空",
                    }],
                drainageTime: [{
                    required: true,
                    trigger: "blur",
                    message: "日期不能为空",
                    }],
            },
            pickerOptions:{
                disabledDate: time => {
                if(this.outhosTime){
                    return time.getTime() > new Date(this.outhosTime);
                }else{
                    return time.getTime() > new Date().getTime();
                    }
                }
            }
        }
    },
    computed:{
        prList(){
            return this.propertyList;
        },
        colourList(){
            return this.drainageColourList;
        },
        pipeName(){
            return this.cannulaName;
        }
    },
    created(){

    },
    methods:{
        init(cannulaId){
            let that = this;
            that.cannulaId = cannulaId;
            that.id = null;
            that.form={
               drainageColour:'',//引流液颜色
               drainageAmount:'',//引流液剂量
               skinStatus:'',//周围皮肤状况
               property:'',//引流液形状
               drainageTime:''//记录日期
            }
            that.$refs['form'].resetFields();
        },
        editInit(id){
            let that = this;
            let url = '/api/icu/pipe/drainage/'+id;
            that.$axios.get(global.url + url).then(function(res){
                let data = res.data.respData;
                that.cannulaId = data.cannulaId;
                that.id = data.id;
                for(let key in that.form){
                    if(!data[key] && typeof data[key] != "undefined" && data[key] != 0){
                        that.form[key] = data[key];
                    }else{
                        that.form[key] = String(data[key]);
                    }
                }
            })
        },
        cancel(){
            this.$refs['form'].resetFields();
            this.$emit("submit");
        },
        addSubmit(formName){
            let that = this;
                that.$refs[formName].validate((valid) => {
                if (valid) {
                let url = "/api/icu/pipe/drainage";
                that.form.cannulaName = that.pipeName;
                that.form.cannulaId = that.cannulaId;
                that.form.id = that.id;
                that.$axios.post(global.url + url, that.form).then(function (res) {
                    if (res.data.msg == 201) {
                    that.$emit("submit",1);
                    that.$message({
                        type: "success",
                        message: res.data.content,
                        });
                    } else if (res.data.msg == 302) {
                    that.$message({
                        message: res.data.content,
                        type: "info",
                    });
                    }
                });
                } else {
                console.log("error submit!!");
                return false;
                }
            });
        }
    }
}
</script>

<style lang="scss">
.addDrain {
  .el-row .el-form-item__label {
    text-align: right !important;
    width: 160px !important;
  }
  .el-select {
    width: 100%;
  }
  .addbtn {
    padding: 10px 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
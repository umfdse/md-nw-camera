<template>
    <div class="treatManagement">
        <div class='treatSwitch'>
            <div class="treatSwitch_left">
                 <el-radio-group v-model="switchValue">
                    <el-radio-button v-for="(item,index) in radios" :key="index"  :label="item.value" >{{item.label}}</el-radio-button>
                </el-radio-group>
            </div>
            <div class="treatSwitch_right" v-show="switchValue==1">
                <el-button  type="primary" size="small" @click="startFlag=true" v-if="status!=1" v-has="`jsh-manage:add`">启动</el-button>
                <el-button  type="primary" size="small" @click="endStatus" v-if="status==1"  v-has="`jsh-manage:add`">结束</el-button>
            </div>          
        </div>
        <div v-if="switchValue==1">
            <cluser-manage :recorId="patientRecordId" ref="cluserManage"  @getClusteringId="getClusteringId"></cluser-manage>
        </div>
        <div v-if="switchValue==2">
            <blood-sugar ref="bloodSugar" :recorId="patientRecordId" ></blood-sugar>
        </div>
        <el-dialog title="启动" :visible.sync="startFlag" width="30%" class="tab_dialog">
            <el-form ref="form" :model="form" label-width="160px" :rules="rules">
                <el-row>
                    <el-col :span="20">
                    <el-form-item label="启动时间：" prop="startTime">
                        <el-date-picker
                        v-model="form.startTime"
                        type="datetime"
                        size="small"
                        placeholder="选择时间"
                        align="left"
                        :default-value="new Date()"
                        style="width: 100%"
                        format="yyyy-MM-dd HH:mm"
                        value-format="yyyy-MM-dd HH:mm"
                        ></el-date-picker>
                    </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div class="addbtn">
                <el-button size="medium" @click="startFlag=false">取消</el-button>
                <el-button size="medium" @click="addSubmit('form')" type="primary">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import cluserManage from './cluserManage';
import bloodSugar from './bloodSugar';
import eventBus from "@/utils/eventBus.js"
export default {
    name:'treatManagement',
    props: ['patientInfo'],
    components:{cluserManage:cluserManage,bloodSugar:bloodSugar},
    created(){
    },
    mounted(){
        //   this.$watch('$parent.$parent.currentName', this.updateStatus);
    },
    computed: {
      patientRecordId() {
        return this.patientInfo.record.recordId;
      }
    },
    data(){
        return {
            switchValue:'1',
            form:{
                startTime:''
            },
            radios:[
               {label:'集束化管理',value:'1'},
               {label:'血糖管理',value:'2'}
            ],
            startFlag:false,
            id:null,
            status:null,
            rules: {
                startTime: [{  required: true,  trigger: "blur", message: "时间不能为空",}]
             }
        }
    },
    watch:{
        switchValue:function(newValue,oldValue){
            if(newValue==1){
                this.$nextTick(function(){
                    this.$refs.cluserManage.initData();
                })
            }else if(newValue==2){
                this.$nextTick(function(){
                    this.$refs.bloodSugar.init();
                })
            }
        }
    },
    mounted(){
        this.initData();
    },
    methods:{
        initData(){
            if(this.switchValue==1){
                this.$nextTick(function(){
                this.$refs.cluserManage.initData();
                })
            }else if(this.switchValue==2){
            this.$nextTick(function(){
                this.$refs.bloodSugar.init();
            })
            }
        },
        endStatus(){
            let that = this;
            let url = '/api/icu/clustering/end/'+that.id;
            that.$axios.post(global.url + url,{}).then(function(res){
                if(res.data.msg==201){
                    that.$nextTick(function(){
                        that.$refs.cluserManage.initData();
                        eventBus.$emit('refreshData',1);
                    })
                    that.$message({
                       message:res.data.content,
                       type: 'success'  
                    })
                }
            })
        },
        getClusteringId(id,status){
            this.id = id;
            this.status=status;
        },
        addSubmit(formName){
             let that = this;
             that.$refs[formName].validate((valid) => {
                 if(valid){
                    let url = '/api/icu/clustering/start/'+that.patientRecordId+"?startTime="+that.form.startTime;
                    that.$axios.post(global.url + url,{}).then(function (res) {
                        if(res.data.msg==201){
                            that.id = res.data.respData.id;
                            that.startFlag=false;
                            that.form.startTime='';
                            eventBus.$emit('refreshData',1);
                            that.$message({
                                message:res.data.content,
                                type:"success"
                            })
                            that.$nextTick(function(){
                                that.$refs.cluserManage.initData();
                            })
                        }else{
                            that.$message({
                              message: res.data.content,
                              type: 'info'
                            })
                        }
                    })
                 }else{
                    console.log("error submit!!");
                    return false; 
                 }
             })
        }
    }
}
</script>
<style lang="scss">
.treatManagement{
    .el-radio-button__orig-radio:checked + .el-radio-button__inner{
        background-color:transparent;
        color:#1F71FF;
        border-color: #1F71FF;
    }
    .el-radio-button__inner{
        font-size: 14px;
    }
    .treatSwitch{
        display: flex;
        justify-content:space-between;
        height: 35px;
        align-items: center;
    }
    .addbtn {
        margin-top: 20px;
        padding: 10px 20px 10px 20px;
        display: flex;
        justify-content: flex-end;
        border-top:1px solid rgba(0, 0, 0, 0.06);
  }
}
</style>
<template>
    <div class="enter-main">
      <div class="top">
        <div class="title">
          <i class="el-icon-back"></i>
          <span>出院患者护理评估</span>
        </div>
        <el-form :model="ruleForm" :inline="true" label-width="120px" class="form">
          <p class="t t1">基本信息</p>
          <el-row>
            <el-col :span="6">
              <el-form-item label="患者姓名：" class="">
                {{ ruleForm.username }}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="性别：" class="">
                {{ ruleForm.sex }}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="年龄：" class="">
                {{ ruleForm.age }}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="住院号：" class="">
                {{ ruleForm.icuCode }}
              </el-form-item>
            </el-col>
          </el-row>
          <p class="t t2">出院评估</p>
          <div>
            <el-form-item label="出院日期：" class="">
              <el-date-picker
                v-model="ruleForm.value5"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="出院诊断：" class="">
              <el-input v-model="ruleForm.input" style="width: 570px" placeholder="请输入内容"></el-input>
            </el-form-item>
          </div>
          <el-row>
            <el-form-item label="伤口愈合：" class="">
              <el-checkbox-group v-model="ruleForm.checkList">
                <el-checkbox label="I期愈合"></el-checkbox>
                <el-checkbox label="II期愈合"></el-checkbox>
                <el-checkbox label="III期愈合"></el-checkbox>
                <el-checkbox label="拆线"></el-checkbox>
                <el-checkbox label="未拆线"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="病愈情况：" class="">
              <el-checkbox-group v-model="ruleForm.checkList">
                <el-checkbox label="治愈"></el-checkbox>
                <el-checkbox label="好转"></el-checkbox>
                <el-checkbox label="未愈"></el-checkbox>
                <el-checkbox label="其他"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="活动能力：" class="">
              <el-checkbox-group v-model="ruleForm.checkList">
                <el-checkbox label="自理"></el-checkbox>
                <el-checkbox label="部分自理"></el-checkbox>
                <el-checkbox label="不能自理"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="出院方式：" class="">
              <el-checkbox-group v-model="ruleForm.checkList">
                <el-checkbox label="步行"></el-checkbox>
                <el-checkbox label="轮椅"></el-checkbox>
                <el-checkbox label="平车"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-row>
          <p class="t t2">出院病人健康指导</p>
          <el-row>
            <el-form-item label="一般指导：" class="">
              <el-checkbox-group v-model="ruleForm.checkList">
                <el-checkbox label="1、修养环境应清洁舒适，保持室内空气新鲜"></el-checkbox>
                <el-checkbox label="2、保持良好心境，有利康复"></el-checkbox>
                <el-checkbox label="3、根据自身情况适当锻炼增强体质"></el-checkbox>
                <el-checkbox label="4、注意营养饮食，有利机体康复"></el-checkbox>
                <br>
                <el-checkbox label="5、伤口拆线后若发现伤口红肿、有硬结、疼痛或发热等及时到医院就诊"></el-checkbox>
                <el-checkbox label="6、按医生预约时间随诊"></el-checkbox>
                <br>
                <el-checkbox label="7、出院带药指导："></el-checkbox>
                <br>
                <el-input
                  type="textarea"
                  :rows="3"
                  style="width: 700px"
                  placeholder="请输入内容"
                  v-model="textarea">
                </el-input>
              </el-checkbox-group>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="专科指导：" class="">
              <el-input
                type="textarea"
                :rows="3"
                style="width: 700px"
                placeholder="请输入内容"
                v-model="textarea">
              </el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="个体指导：" class="">
              <el-input
                type="textarea"
                :rows="3"
                style="width: 700px"
                placeholder="请输入内容"
                v-model="textarea">
              </el-input>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
      <div>
        <el-button type="primary" class="btn">提交</el-button>
      </div>
    </div>
</template>

<script>
    export default {
      data () {
        return {
          ruleForm: {
            username: '郝得快',
            sex: '女',
            age: '76岁',
            icuCode: 1234567,
            checkList: [],
            radio: '',
          }
        };
      },
      created () {
      
      },
      methods: {

      }
    };
</script>

<style lang="scss">
  .enter-main {
    margin: 10px 24px 24px;
    height: calc(100% - 10px - 24px);
    background: #FFFFFF;
    overflow: hidden;
    .top{
      padding: 24px 0 32px 32px;
      border-bottom: 1px solid #E8E8E8;
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
      .msg{
        font-size: 14px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.87);
        line-height: 20px;
        height: 20px;
        span{
          display: inline-block;
          width: 200px;
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
  }
</style>

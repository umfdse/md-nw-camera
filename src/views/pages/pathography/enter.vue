<template>
    <div class="enter-main">
      <div class="top">
        <div class="title">
          <i class="el-icon-back"></i>
          <span>入院患者护理评估</span>
        </div>
        <el-form :model="ruleForm" label-width="120px" class="form">
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
          <el-row>
            <el-col :span="8">
              <el-form-item label="民族：" class="">
                <el-input v-model="ruleForm.input" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="职业：" class="">
                <el-input v-model="ruleForm.input" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="文化程度：" class="">
                <el-input v-model="ruleForm.input" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="体重：" class="">
                <el-input v-model="ruleForm.input" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="身高：" class="">
                <el-input v-model="ruleForm.input" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="入科时间：" class="">
                <el-input v-model="ruleForm.input" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-form-item label="入院诊断：" class="">
                <el-input style="width: 702px" v-model="ruleForm.input" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否预期入院：" class="">
                <el-select v-model="ruleForm.treatMethod">
                  <el-option  label='静脉溶栓' value='1'></el-option>
                  <el-option  label='血管内介入治疗' value='9'></el-option>
                  <el-option  label='脑出血' value='6'></el-option>
                  <el-option  label='颅内动脉瘤' value='7'></el-option>
                  <el-option  label='CEA/CAS' value='8'></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-form-item label="入院主述：" class="">
                <el-input v-model="ruleForm.input" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="入院方式：" class="">
              <el-checkbox-group v-model="ruleForm.checkList">
                <el-checkbox label="步行"></el-checkbox>
                <el-checkbox label="扶行"></el-checkbox>
                <el-checkbox label="轮椅"></el-checkbox>
                <el-checkbox label="平车"></el-checkbox>
                <el-checkbox label="救护车"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-row>
          <p class="t t2">生命体征</p>
          <el-row>
            <el-col :span="6">
              <el-form-item label="体温：" class="">
                <el-input v-model="ruleForm.input" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="脉搏：" class="">
                <el-input v-model="ruleForm.input" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="呼吸：" class="">
                <el-input v-model="ruleForm.input" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="血压：" class="">
                <el-input v-model="ruleForm.input" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="意识：" class="">
              <el-checkbox-group v-model="ruleForm.checkList">
                <el-checkbox label="清醒"></el-checkbox>
                <el-checkbox label="嗜睡"></el-checkbox>
                <el-checkbox label="意识模糊"></el-checkbox>
                <el-checkbox label="昏迷"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="面部表情：" class="">
              <el-checkbox-group v-model="ruleForm.checkList">
                <el-checkbox label="正常"></el-checkbox>
                <el-checkbox label="淡漠"></el-checkbox>
                <el-checkbox label="痛苦面容"></el-checkbox>
                <el-checkbox label="慢性病面容"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="精神状态：" class="">
              <el-checkbox-group v-model="ruleForm.checkList">
                <el-checkbox label="良好"></el-checkbox>
                <el-checkbox label="抑郁"></el-checkbox>
                <el-checkbox label="焦虑"></el-checkbox>
                <el-checkbox label="幻觉"></el-checkbox>
                <el-checkbox label="妄想"></el-checkbox>
                <el-checkbox label="躁动"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="语言沟通：" class="">
              <el-checkbox-group v-model="ruleForm.checkList">
                <el-checkbox label="正常"></el-checkbox>
                <el-checkbox label="言语不清"></el-checkbox>
                <el-checkbox label="言语困难"></el-checkbox>
                <el-checkbox label="失语"></el-checkbox>
                <el-checkbox label="普通话"></el-checkbox>
                <el-checkbox label="方言"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-row>
          <p class="t t2">既往史</p>
          <el-row>
            <el-col :span="16">
              <el-form-item label="既往史：" class="">
                <el-input style="width: 855px" v-model="ruleForm.input" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-form-item label="药物过敏史：" class="">
                <el-input style="width: 855px" v-model="ruleForm.input" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-form-item label="过敏物质：" class="">
                <el-input style="width: 855px" v-model="ruleForm.input" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-form-item label="饮酒史：" class="">
                <el-input style="width: 855px" v-model="ruleForm.input" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="吸烟史：" class="" style="float:left">
                <el-input style="width: 855px" v-model="ruleForm.input" placeholder="请输入内容"></el-input>
              </el-form-item>
              <el-form-item label-width="200px" label="是否生活在吸烟环境：" class="" style="float:left">
                <el-radio-group v-model="ruleForm.radio">
                  <el-radio :label="3">是</el-radio>
                  <el-radio :label="6">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <p class="t t2">生活史</p>
          <el-row>
            <el-col :span="12">
              <el-form-item label="饮食：" class="">
                <el-input style="width: 448px" v-model="ruleForm.input" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="嗜好：" class="">
                <el-input style="width: 448px" v-model="ruleForm.input" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="营养：" class="">
                <el-input style="width: 448px" v-model="ruleForm.input" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="口腔粘膜：" class="">
                <el-input style="width: 448px" v-model="ruleForm.input" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="食欲：" class="">
                <el-input style="width: 448px" v-model="ruleForm.input" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="睡眠：" class="">
                <el-input style="width: 448px" v-model="ruleForm.input" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="辅助睡眠：" class="">
                <el-input style="width: 448px" v-model="ruleForm.input" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="自理程度：" class="">
                <el-input style="width: 448px" v-model="ruleForm.input" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <p class="t t2">体格情况</p>
          <el-row>
            <el-col :span="12">
              <el-form-item label="活动：" class="">
                <el-select v-model="ruleForm.treatMethod">
                  <el-option  label='静脉溶栓' value='1'></el-option>
                  <el-option  label='血管内介入治疗' value='9'></el-option>
                  <el-option  label='脑出血' value='6'></el-option>
                  <el-option  label='颅内动脉瘤' value='7'></el-option>
                  <el-option  label='CEA/CAS' value='8'></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="体位：" class="">
                <el-select v-model="ruleForm.treatMethod">
                  <el-option  label='静脉溶栓' value='1'></el-option>
                  <el-option  label='血管内介入治疗' value='9'></el-option>
                  <el-option  label='脑出血' value='6'></el-option>
                  <el-option  label='颅内动脉瘤' value='7'></el-option>
                  <el-option  label='CEA/CAS' value='8'></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="皮肤粘膜：" class="">
                <el-select v-model="ruleForm.treatMethod">
                  <el-option  label='静脉溶栓' value='1'></el-option>
                  <el-option  label='血管内介入治疗' value='9'></el-option>
                  <el-option  label='脑出血' value='6'></el-option>
                  <el-option  label='颅内动脉瘤' value='7'></el-option>
                  <el-option  label='CEA/CAS' value='8'></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <p class="t t2">目前情况</p>
          <el-row>
            <el-col :span="12">
              <el-form-item label="排便：" class="">
                <el-input style="width: 448px" v-model="ruleForm.input" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="排尿：" class="">
                <el-input style="width: 448px" v-model="ruleForm.input" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
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

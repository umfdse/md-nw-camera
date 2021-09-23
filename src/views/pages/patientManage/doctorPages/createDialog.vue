<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      :width="dialogWidth"
      :close-on-click-modal="false"
      class="dialogMain"
    >
      <el-form :model="ruleForm" :label-width="labelWidth" ref="ruleForm">
        <div v-for="tabs in formJSONArr" :key="tabs.id">
          <div v-if="code !== 'AGI'">
            <span v-if="formJSONArr.length > 1" class="labelTitle">{{
              tabs.title
            }}</span>
            <dynamic-form
              v-for="item in tabs.questions"
              :key="item.id"
              :config="item"
              :value="ruleForm[item.id]"
              :type="type"
              @input="handleInput($event, item.id)"
            />
          </div>

          <div v-if="code === 'AGI'">
            <el-form-item
              class="dynamic-form"
              :label="tabs.questions[0].question"
              :value="ruleForm[tabs.questions[0].id]"
             
            >
              <el-radio-group v-model="radioAGI" >
                <el-radio
                  @change="changeRadio(item, tabs.questions[0].id)"
                  v-for="(item, index) in tabs.questions[0].options"
                  :key="index"
                  :label="item.id"
                  :class="{
                    radioOnlyItem: tabs.questions[0].options.length == 1,
                  }"
                >
                  {{ item.optionText }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              class="dynamic-form"
              :label="tabs.questions[1].question"
              :value="ruleForm[tabs.questions[1].id]" 
            >
              <el-radio-group v-model="radioAGI" >
                <el-radio
                  @change="changeRadio(item, tabs.questions[1].id)"
                  v-for="(item, index) in tabs.questions[1].options"
                  
                  :key="index"
                  :label="item.id"
                  :class="{
                    radioOnlyItem: tabs.questions[1].options.length == 1,
                  }"
                >
                  {{ item.optionText }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              class="dynamic-form"
              :label="tabs.questions[2].question"
              :value="ruleForm[tabs.questions[2].id]"
            >
              <el-radio-group v-model="radioAGI">
                <el-radio
                  @change="changeRadio(item, tabs.questions[2].id)"
                  v-for="(item, index) in tabs.questions[2].options"
                  :key="index"
                  :label="item.id"
                  :class="{
                    radioOnlyItem: tabs.questions[2].options.length == 1,
                  }"
                >
                  {{ item.optionText }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              class="dynamic-form"
              :label="tabs.questions[3].question"
              :value="ruleForm[tabs.questions[3].id]"
           
            >
              <el-radio-group v-model="radioAGI">
                <el-radio
                  @change="changeRadio(item, tabs.questions[3].id)"
                  v-for="(item, index) in tabs.questions[3].options"
                  :key="index"
                  :label="item.id"
                  :class="{
                    radioOnlyItem: tabs.questions[3].options.length == 1,
                  }"
                >
                  {{ item.optionText }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              class="dynamic-form"
              :label="tabs.questions[4].question"
              :value="ruleForm[tabs.questions[4].id]"
           
            >
              <el-radio-group v-model="radioAGI">
                <el-radio
                  @change="changeRadio(item, tabs.questions[4].id)"
                  v-for="(item, index) in tabs.questions[4].options"
                  :key="index"
                  :label="item.id"
                  :class="{
                    radioOnlyItem: tabs.questions[4].options.length == 1,
                  }"
                >
                  {{ item.optionText }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
        </div>

        <div
          v-if="code === 'Autar'"
          class="tip t1"
          :style="{ 'margin-left': labelWidth }"
        >
          1、≥15者根据活动内容的改变及时评估（每三天至少一次） <br />
          2、＜14分者每周评估一次
        </div>
        <div
          v-if="code === 'SLLB'"
          class="tip"
          :style="{ 'margin-left': labelWidth }"
        >
          <p
            style="
              color: rgba(0, 0, 0, 0.6);
              padding: 0 0 0 20px;
              margin: 0;
              position: relative;
            "
          >
            <i
              style="position: absolute; top: 4px; left: 0; font-size: 14px"
              class="el-icon-info"
            ></i
            >注意：<br />当患者未发生深静脉血栓时，应协商病人进行踝泵锻炼，按摩下肢，促进下肢循环，预防深静脉血栓形成；当患者发生深静脉血栓形成或可疑时，严禁按摩及热敷，避免下肢静脉穿刺。
          </p>
        </div>
        <div
          v-if="code === 'PRSE'"
          class="tip"
          :style="{ 'margin-left': labelWidth }"
        >
          <p
            style="
              color: rgba(0, 0, 0, 0.6);
              padding: 0 0 0 20px;
              margin: 0;
              position: relative;
            "
          >
            <i
              style="position: absolute; top: 4px; left: 0; font-size: 14px"
              class="el-icon-info"
            ></i
            >注：参照Braden压疮风险评估表<br />1、潮湿度1分，1-2H更换衣裤、床单、局部使用保护用品；2分每班更换1次；3分每天更换1次；4分常规更换。<br />2、如果有其他主要的危险因素存在，如高龄、饮食量少影响蛋白质的摄入、舒张压低于60MMHg、血流动力<br />学不稳定严重水肿等，可列入比高一级的危险水平。<br />3、减压装置：酌情；Braden评分频度：每周一次；翻身频度：1次/2-4H
          </p>
        </div>
        <div
          v-if="code === 'MORSE'"
          class="tip"
          :style="{ 'margin-left': labelWidth }"
        >
          <p
            style="
              color: #f23c3c;
              padding: 0 0 0 20px;
              margin: 0;
              position: relative;
            "
          >
            轻度危险：每周评估一次；中度危险：每3天评估一次；高度危险：每天评估一次
          </p>
        </div>
        <div
          v-if="code === 'BARTHEL'"
          class="tip t1"
          :style="{ 'margin-left': labelWidth }"
        >
          重度依赖：≤40分，每天评估一次；中度依赖：41~60分，3天评估一次；轻度依赖：61~99分，1周评估一次；无需依赖：100分
        </div>
        <div
          v-if="code === 'PPFO'"
          class="tip t1"
          :style="{ 'margin-left': labelWidth }"
        >
          评估时机：入院时、转入时、手术后留置各种导管的，进行首次评估，以后高危（Ⅲ度）导管每班评估，<br />中危（Ⅱ度）导管每天评估，低危导管（Ⅰ度）导管每周评估导管每周评估2次，有异常情况随时评估，直至拔管。
        </div>
        <div
          v-if="code === 'MEWS'"
          class="tip t1"
          :style="{ 'margin-left': labelWidth }"
        >
          &lt;4分：病情稳定；4分：病情可能恶化；5-7分：病情重，潜在危险大；≥8分：病情危重
        </div>
        <div
          v-if="code === 'RANSON'"
          class="tip t1"
          :style="{ 'margin-left': labelWidth }"
        >
          &lt;注：具备1-2项为轻型，具备6项以上为重症（病死率超过50%），若达到8项则病死率达100%！
        </div>
        <div
          v-if="code === 'SOFA'"
          class="tip t1"
          :style="{ 'margin-left': labelWidth }"
        >
          注：每日评估时应采取每日最差值
        </div>
        <div
          v-if="code === 'AGI'"
          class="tip t1"
          :style="{ 'margin-left': labelWidth }"
        >
          <p v-if="one">
            Ⅰ级处理方式：<br />
            1、常伴随一般情况的好转而消息，无需特殊处理；<br />
            2、损伤后24-48h内尽早给予肠内营养（1B）；<br />
            3、尽可能减少使用削弱胃肠动力的药物（如儿茶酚胺、阿片肽）（1C）
          </p>
          <p v-if="two">
            Ⅱ级处理方式：<br />
            1、治疗IAH（1D）；<br />
            2、恢复胃肠动力，譬如用促胃肠动力药物（1C）；<br />
            3、开始或维持肠内喂养，即使存在高度胃残留或返流、胃养不耐受，也应考虑尝试给予少量产内喂养（2D）；<br />
            4、对于胃轻瘫患者，如果促动力药无效，应考虑给幽门后喂养（2D）
          </p>
          <p v-if="three">
            Ⅲ级处理方式：<br />
            1、IAH的检测及目标性治疗（1D）；<br />
            2、排除可能纯在的腹部其他问题，如胆囊炎、腹膜炎、肠缺血；<br />
            3、尽可能停用促进胃肠麻痹的药物（1C）；<br />
            4、避免早起（如ICU 7d内）应用肠外喂养来补充不足
            的EN（增加院感发生率）（2B）；<br />
            5、需常规尝试给予小剂量EN（2D）
          </p>
          <p v-if="four">
            Ⅳ级处理方式：<br />
            1、保守治疗无效；<br />
            2、需要开腹减压或其他急诊干预（如结肠镜减压）以挽救生命（1D）
          </p>
        </div>
        <div
          v-if="code === 'ENFI'"
          class="tip"
          :style="{ 'margin-left': labelWidth }"
        >
          <p>0-2分：继续肠内营养，增加或维持原速度，对症治疗；</p>
          <p>3-4分：继续肠内营养，减慢速度，2h后重新评估；</p>
          <p>≥5分：暂停肠内营养，重新评估或更换输液途径。</p>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm" :loading="isLoading"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      title="ApacheII评分"
      :visible.sync="dialogFormVisible"
      :width="formDialogWidth"
      class="dialogMainTwo"
    >

      <el-form :model="form">
        <h1 class="h1Titie">A、生理学评分：</h1>
        <p>1、生理变量</p>
        <el-form-item label="肛温（℃）：" :label-width="formLabelWidth">
          <el-radio-group v-model="form.rectalTemperature" >
            <el-radio :label="0">36.0-38.4</el-radio>
            <el-radio :label="1">34-35.9或38.5-38.9</el-radio>
            <el-radio :label="2">32-33.9</el-radio>
            <el-radio :label="3">30-31.9或39-40.9</el-radio>
            <el-radio :label="4">≤29.9或≥41</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="平均动脉压（mmHG）："
          :label-width="formLabelWidth"
          class="mmHG"
        >
          <el-radio-group v-model="form.averageBloodPressure" >
            <el-radio :label="0">70-109</el-radio>
            <el-radio :label="2">50-69或110-129</el-radio>
            <el-radio :label="3">130-159</el-radio>
            <el-radio :label="4">≤49或≥160</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="心率（次/分）：" :label-width="formLabelWidth">
          <el-radio-group v-model="form.heartRate">
            <el-radio :label="0">70-109</el-radio>
            <el-radio :label="2">50-69或110-139</el-radio>
            <el-radio :label="3">40-54或140-179</el-radio>
            <el-radio :label="4">≤39或≥180</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="呼吸频率（次/分）：" :label-width="formLabelWidth" class="checkRadioSty">
          <el-radio-group v-model="form.breathRate">
            <el-radio :label="0">12-24</el-radio>
            <el-radio :label="2">10-11或25-34</el-radio>
            <el-radio :label="3">6-9</el-radio>
            <el-radio :label="4">35-49</el-radio>
            <el-radio :label="5">≤5或≥50</el-radio>
          </el-radio-group>
        </el-form-item>
        <p>2、氧合作用（mmHG）</p>
        <el-form-item label="FiO2<0.5时测PaO2：" :label-width="formLabelWidth">
          <el-radio-group v-model="form.smallFiO2Pao2">
            <el-radio :label="0">>70</el-radio>
            <el-radio :label="1">61-70</el-radio>
            <el-radio :label="3">55-60</el-radio>
            <el-radio :label="4"> <55 </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="FiO2>0.5时测PaO2：" :label-width="formLabelWidth">
          <el-radio-group v-model="form.bigFiO2Pao2">
            <el-radio :label="0"><200</el-radio>
            <el-radio :label="2">200-349</el-radio>
            <el-radio :label="3">350-499</el-radio>
            <el-radio :label="4">≥500</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="动脉血pH：" :label-width="formLabelWidth">
          <el-radio-group v-model="form.arterialPH">
            <el-radio :label="0">7.33-7.49</el-radio>
            <el-radio :label="1">7.5-7.59</el-radio>
            <el-radio :label="2">7.25-7.32</el-radio>
            <el-radio :label="3">7.15-7.24或7.60-7.69</el-radio>
            <el-radio :label="4">≥7.7或<7.15</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="静脉血HCO3（mmol/L）无动脉血气时用："
          :label-width="formLabelWidth"
        >
          <el-radio-group v-model="form.venousBloodHCO3">
            <el-radio :label="0">22-31.9</el-radio>
            <el-radio :label="1">32-40.9</el-radio>
            <el-radio :label="2">18-21.9</el-radio>
            <el-radio :label="3">15-17.9或41-51.9</el-radio>
            <el-radio :label="4"><15或≥52</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="血清钠（mmol/L）：" :label-width="formLabelWidth">
          <el-radio-group v-model="form.sodium">
            <el-radio :label="0">130-149</el-radio>
            <el-radio :label="1">150-154</el-radio>
            <el-radio :label="2">120-129或155-159</el-radio>
            <el-radio :label="3">111-119或160-179</el-radio>
            <el-radio :label="4">≤110或≥180</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="血清钾（mmol/L）：" :label-width="formLabelWidth">
          <el-radio-group v-model="form.potassium">
            <el-radio :label="0">≥7.0</el-radio>
            <el-radio :label="1">6.0-6.9</el-radio>
            <el-radio :label="2">5.5-5.9</el-radio>
            <el-radio :label="3">3.5-5.4</el-radio>
            <el-radio :label="4">3.0-3.4</el-radio>
            <el-radio :label="5">2.5-2.9</el-radio>
            <el-radio :label="6"><2.5</el-radio>
          </el-radio-group>
        </el-form-item>
         <el-form-item label="血肌酐（/mg/dL）：" :label-width="formLabelWidth">
          <el-radio-group v-model="creatInine" @change="selectCreatInineOne">
            <el-radio :label="0">0.6-1.4</el-radio>
            <el-radio :label="2"><0.6或1.5-1.9</el-radio>
            <el-radio :label="3">2.0-3.4</el-radio>
            <el-radio :label="4">≥3.5</el-radio>
          </el-radio-group>
        </el-form-item>
         <el-form-item label="血肌酐（/umol/L）：" :label-width="formLabelWidth">
          <el-radio-group v-model="creatInine" @change="selectCreatInineTwo">
            <el-radio :label="10">53-127</el-radio>
            <el-radio :label="12">≤53或128-171</el-radio>
            <el-radio :label="13">172-304</el-radio>
             <el-radio :label="14">≥305</el-radio>
            
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否有急性肾衰：" :label-width="formLabelWidth">
          <el-radio-group v-model="form.isAcuteRenalFailure">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="红细胞比容（%）：" :label-width="formLabelWidth">
          <el-radio-group v-model="form.hct">
            <el-radio :label="0">30-45.9</el-radio>
            <el-radio :label="1">46-49.9</el-radio>
            <el-radio :label="2">20-29.9或50-59.9</el-radio>
            <el-radio :label="4"><20或≥60</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="WBC（×10^ 9/L）:" :label-width="formLabelWidth" class="checkRadioSty">
          <el-radio-group v-model="form.wbc">
            <el-radio :label="0">3-14.9</el-radio>
            <el-radio :label="1">15-19.9</el-radio>
            <el-radio :label="2">1-2.9或20-39.9</el-radio>
            <el-radio :label="4"><1或≥40</el-radio>
          </el-radio-group>
        </el-form-item>
        <p>3、GCS评分</p>
        <el-form-item label="睁眼反应：" :label-width="formLabelWidth">
          <el-radio-group v-model="form.eyesOpenResponse" @change="changeEyes">
            <el-radio :label="4">自动睁眼</el-radio>
            <el-radio :label="3">呼唤睁眼</el-radio>
            <el-radio :label="2">刺眼睁眼</el-radio>
            <el-radio :label="1">不能睁眼</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="语言反应：" :label-width="formLabelWidth" >
          <el-radio-group v-model="form.verbalResponse" @change="changeVerbal">
            <el-radio :label="5">回答切题</el-radio>
            <el-radio :label="4">回答不切题</el-radio>
            <el-radio :label="3">答非所问</el-radio>
            <el-radio :label="2">只能发音</el-radio>
            <el-radio :label="1">不能言语</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="运动反应：" :label-width="formLabelWidth">
          <el-radio-group v-model="form.sportResponse" @change="changeSport">   
            <el-radio :label="6">按吩咐动作</el-radio>
            <el-radio :label="5">刺激能定位</el-radio>
            <el-radio :label="4">刺激能躲避</el-radio>
            <el-radio :label="3">刺疼肢体屈曲</el-radio>
            <el-radio :label="2">刺疼肢体伸展</el-radio>
            <el-radio :label="1">不能活动</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="GCS总分：">
            <div  class="GCSScore" >{{score}}</div>
        </el-form-item>
        <el-form-item label="15-GCS评分：" class="checkRadioSty">
            <div  class="GCSScore" >{{reduceBy15Score}}</div>
        </el-form-item>
        
        <h1 class="h1Titie">B、年龄评分：</h1>
        <el-form-item label="" :label-width="formLabelWidth" class="checkRadioSty">
          <el-radio-group v-model="form.ageSquere">
            <el-radio :label="0">≤44岁</el-radio>
            <el-radio :label="2">45-54岁</el-radio>
            <el-radio :label="3">55-64岁</el-radio>
            <el-radio :label="5">65-74岁</el-radio>
            <el-radio :label="6">≥75岁</el-radio>
          </el-radio-group>
        </el-form-item>
        <h1 class="h1Titie">
          C、慢性健康状况评分（有严重器官系统功能不全或免疫损害）：
        </h1>
        <el-form-item label="" :label-width="formLabelWidth" >
          <el-radio-group v-model="form.chc">
            <el-radio :label="2">非手术或择期手术后</el-radio>
            <el-radio :label="5">不能手术或急诊手术后</el-radio>
            <el-radio :label="0">无上述情况</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <p class="tip" :style="{ 'margin-left': formLabelWidth }">
        注：1、急性生理数据采自进入ICU后第一个24小时；2、生理数据应取最差值。
      </p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitApa"
          >确 定</el-button
        >
      </div>
    </el-dialog>
     <el-dialog
      title="NUTRIC评分"
      :visible.sync="dialogNUTRICVisible"
      :width="formDialogWidth"
      class="dialogMainTwo"
    >
      <el-form :model="formNutric">
          <el-form-item label="是否包含IL-6:" :label-width="formLabelWidth">
          <el-radio-group v-model="formNutric.isContainsIl6" @change="changeIL6">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
         <el-form-item label="年龄:" :label-width="formLabelWidth">
          <el-radio-group v-model="formNutric.age" >
            <!-- <el-radio :label="1"><15</el-radio> -->
            <el-radio :label="0"><50</el-radio>
            <el-radio :label="1">50-74</el-radio>
            <el-radio :label="2">≥75</el-radio>
          </el-radio-group>
        </el-form-item>
         <el-form-item label="APACHEⅡ评分:" :label-width="formLabelWidth">
          <el-radio-group v-model="formNutric.apacheiiScore" >
              <el-radio :label="0"><15</el-radio>
            <el-radio :label="1">15-19</el-radio>
            <el-radio :label="2">20-27</el-radio>
            <el-radio :label="3">≥28</el-radio>
          </el-radio-group>
        </el-form-item>
         <el-form-item label="SOFA评分:" :label-width="formLabelWidth">
          <el-radio-group v-model="formNutric.sofaScore" >
            <el-radio :label="0"><6</el-radio>
            <el-radio :label="1">6-9</el-radio>
            <el-radio :label="2">≥10</el-radio>
          </el-radio-group>
        </el-form-item>
         <el-form-item label="伴随疾病:" :label-width="formLabelWidth">
          <el-radio-group v-model="formNutric.containDisease" >
            <el-radio :label="1">0-1</el-radio>
            <el-radio :label="2">2+</el-radio>
          </el-radio-group>
        </el-form-item>
         <el-form-item label="入院至入ICU时间:" :label-width="formLabelWidth">
          <el-radio-group v-model="formNutric.toIcuTime" >
            <el-radio :label="0">0-1</el-radio>
            <el-radio :label="2">1+</el-radio>
          </el-radio-group>
        </el-form-item>
         <el-form-item label="IL-6:" :label-width="formLabelWidth" v-if="isIL6">
          <el-radio-group v-model="formNutric.il6Value" >
            <el-radio :label="0">0-400</el-radio>
            <el-radio :label="1">400+</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
       <div slot="footer" class="dialog-footer">
        <el-button @click="dialogNUTRICVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitNutr"
          >确 定</el-button
        >
      </div>
     </el-dialog>
  </div>
</template>

<script>
import dynamicForm from "./dynamic-form.vue";
// import dynamicForm2 from "./dynamic-form2.vue";
export default {
  components: { dynamicForm },
  data() {
    return {
      radioAGI: "",
      dialogFormVisible: false,
      dialogNUTRICVisible:false,
      one: false,
      two: false,
      three: false,
      four: false,
      isIL6:false,
      creatInine:"",
      score:"",
      reduceBy15Score:"",
      formNutric:{
        patientRecordId:"",
        isContainsIl6:"",
        age:"",
        apacheiiScore:"",
        sofaScore:"",
        containDisease:"",
        toIcuTime:"",
        il6Value:"",
      },
      form: {
        patientRecordId:"",
        rectalTemperature: "",
        averageBloodPressure: "",
        heartRate: "",
        breathRate: "",
        smallFiO2Pao2: "",
        bigFiO2Pao2: "",
        arterialPH: "",
        venousBloodHCO3: "",
        sodium:"",
        potassium: "",
        creatInine:"",
        creatInineStatus:"",
        isAcuteRenalFailure: "",
        hct: "",
        wbc: "",
        eyesOpenResponse: "",
        verbalResponse: "",
        sportResponse: "",
        eyesOpenResponseText:"",
        verbalResponseText:"",
        sportResponseText:"",
        ageSquere: "",  
        chc:"",  
        sourceType:"2",
      },
      formDialogWidth: "840px",
      formLabelWidth: "233px",
      title: "", // 标题
      name: "",
      dialogWidth: "", // 弹框宽度
      labelWidth: "", // 表单样式
      code: "",
      isLoading: false,
      config: {
        questions: [],
      },
      dataStyle: [
        { code: "PAIN", dialogWidth: "480px", labelWidth: "91px" },
        { code: "MYPP", dialogWidth: "840px", labelWidth: "237px" },
        { code: "Killip", dialogWidth: "480px", labelWidth: "18px" },
        { code: "Autar", dialogWidth: "840px", labelWidth: "150px" },
        { code: "Wells", dialogWidth: "480px", labelWidth: "90px" },
        { code: "Phle", dialogWidth: "480px", labelWidth: "50px" },
        { code: "MMT", dialogWidth: "480px", labelWidth: "30px" },
        { code: "SLLB", dialogWidth: "480px", labelWidth: "18px" },
        { code: "AASA", dialogWidth: "480px", labelWidth: "26px" },
        { code: "PRSE", dialogWidth: "840px", labelWidth: "157px" },
        { code: "MORSE", dialogWidth: "840px", labelWidth: "163px" },
        { code: "RAMSAY", dialogWidth: "480px", labelWidth: "56px" },
        { code: "CCOS", dialogWidth: "480px", labelWidth: "20px" },
        { code: "MMRC", dialogWidth: "480px", labelWidth: "20px" },
        { code: "BARTHEL", dialogWidth: "840px", labelWidth: "94px" },
        { code: "PPFO", dialogWidth: "840px", labelWidth: "80px" },
        { code: "MEWS", dialogWidth: "840px", labelWidth: "214px" },
      ],
      type: "", // 类型
      dialogVisible: false,
      ruleForm: {},
      formJSONArr: [],
      formJSON: {},
      dialogType: "add", // add 新增 update 修改
      patientRecordId: "", // 病患id
      answerId: "", // 详情id
    };
  },
  mounted(){
  
  },
  methods: {
    submitNutr(){
       this.isLoading = true;
      
      this.formNutric.patientRecordId = this.patientRecordId
      console.log(this.formNutric)
      //  debugger
      if(this.isIL6){
        for (const key in this.formNutric) {
          if (!this.formNutric[key]&&this.formNutric[key]!="0") {
            this.$message.info("请填写完表单再提交");
            this.isLoading = false;
            return;
          }
       }
      }else{
        if((!this.formNutric.isContainsIl6&&this.formNutric.isContainsIl6!="0")||(!this.formNutric.age&&this.formNutric.age!="0")||(!this.formNutric.apacheiiScore&&this.formNutric.apacheiiScore!="0")||(!this.formNutric.sofaScore&&this.formNutric.sofaScore!="0")||(!this.formNutric.containDisease&&this.formNutric.containDisease!="0")||(!this.formNutric.toIcuTime&&this.formNutric.toIcuTime!="0")){
           this.$message.info("请填写完表单再提交");
            this.isLoading = false;
            return;
        }
      }
       
          let url = "/score/saveNutricScore"
          this.$axios.post(global.url+url,this.formNutric).then((res)=>{
              if(res.data.msg==201){
                if(this.dialogType=="add"){
                   this.$message.success("新增成功")
                }else if(this.dialogType=="update"){
                  this.$message.success("编辑成功")
                }
               
                this.dialogNUTRICVisible=false
                this.$emit("sub");
              }else{
                this.$message.error(res.data.content)
              }
          })
    },
    submitApa(){
      this.isLoading = true;
      this.form.patientRecordId = this.patientRecordId
      this.form.sourceType = "2"
      console.log(this.form)
       for (const key in this.form) {
          if (!this.form[key]&&this.form[key]!="0") {
            this.$message.info("请填写完表单再提交");
            this.isLoading = false;
            return;
          }
       }
        let url = "/score/saveApacheIIDetails"
          this.$axios.post(global.url+url,this.form).then((res)=>{
              if(res.data.msg==201){
                if(this.dialogType=="add"){
                   this.$message.success("新增成功")
                }else if(this.dialogType=="update"){
                  this.$message.success("编辑成功")
                }
               
                this.dialogFormVisible=false
                this.$emit("sub");
              }else{
                this.$message.error(res.data.content)
              }
          })
      
    },
   changeIL6(){
     if(this.formNutric.isContainsIl6==1){
       this.isIL6 = true
     }else{
        this.isIL6 = false
        this.formNutric.il6Value=""
     }
   },
    changeEyes(){
       this.score = -(-this.form.eyesOpenResponse -this.form.sportResponse-this.form.verbalResponse)
       this.reduceBy15Score = 15-this.score
      if(this.form.eyesOpenResponse==4){
        this.form.eyesOpenResponseText= "自动睁眼"
      }else if(this.form.eyesOpenResponse==3){
         this.form.eyesOpenResponseText= "呼唤睁眼"
      }else if(this.form.eyesOpenResponse==2){
         this.form.eyesOpenResponseText= "刺眼睁眼"
      }else if(this.form.eyesOpenResponse==1){
         this.form.eyesOpenResponseText= "不能睁眼"
      }
    },   
    changeVerbal(){
       this.score = -(-this.form.eyesOpenResponse -this.form.sportResponse-this.form.verbalResponse)
       this.reduceBy15Score = 15-this.score
      if(this.form.verbalResponse==5){
        this.form.verbalResponseText= "回答切题"
      }else if(this.form.verbalResponse==4){
         this.form.verbalResponseText= "回答不切题"
      }else if(this.form.verbalResponse==3){
         this.form.verbalResponseText= "答非所问"
      }else if(this.form.verbalResponse==2){
         this.form.verbalResponseText= "只能发音"
      }else if(this.form.verbalResponse==1){
         this.form.verbalResponseText= "不能言语"
      }
    }, 
    changeSport(){
       this.score =-(-this.form.eyesOpenResponse -this.form.sportResponse-this.form.verbalResponse)
       this.reduceBy15Score = 15-this.score
      if(this.form.sportResponse==6){
        this.form.sportResponseText= "按吩咐动作"
      }else if(this.form.sportResponse==5){
         this.form.sportResponseText= "刺激能定位"
      }else if(this.form.sportResponse==4){
         this.form.sportResponseText= "刺激能躲避"
      }else if(this.form.sportResponse==3){
         this.form.sportResponseText= "刺激肢体屈曲"
      }else if(this.form.sportResponse==2){
         this.form.sportResponseText= "刺激肢体伸展"
      }else if(this.form.sportResponse==1){
         this.form.sportResponseText= "不能活动"
      }
    },
    selectCreatInineOne(){
       if(this.creatInine==0){
        this.form.creatInine=0
      }else if(this.creatInine==2){
        this.form.creatInine=2
      }else if(this.creatInine==3){
        this.form.creatInine=3
      }else if(this.creatInine==4){
        this.form.creatInine=4
      }
      this.form.creatInineStatus=1
    },
    selectCreatInineTwo(){
      if(this.creatInine==10){
        this.form.creatInine=0
      }else if(this.creatInine==12){
        this.form.creatInine=2
      }else if(this.creatInine==13){
        this.form.creatInine=3
      }else if(this.creatInine==14){
        this.form.creatInine=4
      }
      this.form.creatInineStatus=2
    },
    changeRadio(item,id) {
      this.ruleForm = {}
       this.ruleForm[id] = item;
       console.log(item,id)
      if (id==131) {
        this.one = true;
        this.two = false;
        this.three = false;
        this.four = false;
      } else if (id==132) {
        this.two = true;
        this.one = false;
        this.three = false;
        this.four = false;
      } else if (id==133) {
        this.three = true;
        this.two = false;
        this.one = false;
        this.four = false;
      } else if (id==134) {
        this.four = true;
        this.two = false;
        this.three = false;
        this.one = false;
      } else {
        this.one = false;
        this.two = false;
        this.three = false;
        this.four = false;
      }
    },
    // 根据不同的类型 创建不同的弹框
    init(code = "PAIN", dialogType = "add", patientRecordId, answerId) {
      this.code = code;
      this.dialogType = dialogType;
      this.patientRecordId = patientRecordId;
      this.answerId = answerId;
      this.isLoading = false;
      let url, params;
      if (dialogType === "add") {
        url = global.url + "/score/queryFormAttributeByFormCode/" + code;
          if (code == "ApacheII") {
            this.form={
                patientRecordId:"",
                rectalTemperature: "",
                averageBloodPressure: "",
                heartRate: "",
                breathRate: "",
                smallFiO2Pao2: "",
                bigFiO2Pao2: "",
                arterialPH: "",
                venousBloodHCO3: "",
                sodium:"",
                potassium: "",
                creatInine:"",
                creatInineStatus:"",
                isAcuteRenalFailure: "",
                hct: "",
                wbc: "",
                eyesOpenResponse: "",
                verbalResponse: "",
                sportResponse: "",
                eyesOpenResponseText:"",
                verbalResponseText:"",
                sportResponseText:"",
                ageSquere: "",  
                chc:"",  
                sourceType:"2",
            }
            this.creatInine = ""
           
            let urll="/score/getGcsScore"
            let param={
              patientRecordId:this.patientRecordId,
              formCode:"GCS"
            }
            let that = this
             this.$axios.post(global.url+urll,param).then((res)=>{
              if(res.data.msg==201){
                that.form.eyesOpenResponse = res.data.respData.eyesOpenResponse
                that.form.sportResponse = res.data.respData.sportResponse
                that.form.verbalResponse = res.data.respData.verbalResponse
                that.score = that.form.eyesOpenResponse +that.form.sportResponse+that.form.verbalResponse
                that.reduceBy15Score = res.data.respData.reduceBy15Score
                 that.dialogFormVisible = true;
                if(that.form.eyesOpenResponse==4){
                    that.form.eyesOpenResponseText= "自动睁眼"
                  }else if(that.form.eyesOpenResponse==3){
                    that.form.eyesOpenResponseText= "呼唤睁眼"
                  }else if(that.form.eyesOpenResponse==2){
                    that.form.eyesOpenResponseText= "刺眼睁眼"
                  }else if(that.form.eyesOpenResponse==1){
                    that.form.eyesOpenResponseText= "不能睁眼"
                  }
                   if(that.form.verbalResponse==5){
                      that.form.verbalResponseText= "回答切题"
                    }else if(that.form.verbalResponse==4){
                      that.form.verbalResponseText= "回答不切题"
                    }else if(that.form.verbalResponse==3){
                      that.form.verbalResponseText= "答非所问"
                    }else if(that.form.verbalResponse==2){
                      that.form.verbalResponseText= "只能发音"
                    }else if(that.form.verbalResponse==1){
                      that.form.verbalResponseText= "不能言语"
                    }
                     if(that.form.sportResponse==6){
                      that.form.sportResponseText= "按吩咐动作"
                    }else if(this.form.sportResponse==5){
                      that.form.sportResponseText= "刺激能定位"
                    }else if(this.form.sportResponse==4){
                      that.form.sportResponseText= "刺激能躲避"
                    }else if(this.form.sportResponse==3){
                      that.form.sportResponseText= "刺激肢体屈曲"
                    }else if(this.form.sportResponse==2){
                      that.form.sportResponseText= "刺激肢体伸展"
                    }else if(this.form.sportResponse==1){
                      that.form.sportResponseText= "不能活动"
                    }
              }else{
                this.$message.error(res.data.content)
              }
            })
            return;
          }else if(code == "NUTRIC"){
            this.formNutric={
                patientRecordId:"",
                isContainsIl6:"",
                age:"",
                apacheiiScore:"",
                sofaScore:"",
                containDisease:"",
                toIcuTime:"",
                il6Value:"",
              },
              this.isIL6 = false;
            this.dialogNUTRICVisible = true
            return
          }
      } else if (dialogType === "update") {
        if(code == "ApacheII"){
           url = global.url + "/score/queryApaacheiiDetail";
          let para = {
            patientRecordId: patientRecordId,
            answerId: answerId,
          }
          console.log(para)
          let that = this
          this.$axios.post(url,para).then((res)=>{
            if(res.data.msg==201){
              that.dialogFormVisible = true
              that.form.patientRecordId = res.data.respData.patientRecordId
              that.form.rectalTemperature = res.data.respData.rectalTemperature
              that.form.sourceType = "2"
              that.form.answerId = answerId
              that.form.chc = res.data.respData.chc
              that.form.ageSquere = res.data.respData.ageSquere
              // that.form.sportResponseText = res.data.respData.sportResponseText
              // that.form.verbalResponseText = res.data.respData.verbalResponseText
              // that.form.eyesOpenResponseText = res.data.respData.eyesOpenResponseText
              that.form.sportResponse = res.data.respData.sportResponse
              that.form.verbalResponse = res.data.respData.verbalResponse
              that.form.eyesOpenResponse = res.data.respData.eyesOpenResponse
              that.form.wbc = res.data.respData.wbc
              that.form.hct = res.data.respData.hct
              that.form.isAcuteRenalFailure = res.data.respData.isAcuteRenalFailure
              that.form.creatInineStatus = res.data.respData.creatInineStatus
              that.form.creatInine = res.data.respData.creatInine
              that.form.potassium = res.data.respData.potassium
              that.form.sodium = res.data.respData.sodium
              that.form.venousBloodHCO3 = res.data.respData.venousBloodHCO3
              that.form.arterialPH = res.data.respData.arterialPH
              that.form.bigFiO2Pao2 = res.data.respData.bigFiO2Pao2
              that.form.smallFiO2Pao2 = res.data.respData.smallFiO2Pao2
              that.form.breathRate = res.data.respData.breathRate
              that.form.heartRate = res.data.respData.heartRate
              that.form.averageBloodPressure = res.data.respData.averageBloodPressure
                if(that.form.eyesOpenResponse==4){
                    that.form.eyesOpenResponseText= "自动睁眼"
                  }else if(that.form.eyesOpenResponse==3){
                    that.form.eyesOpenResponseText= "呼唤睁眼"
                  }else if(that.form.eyesOpenResponse==2){
                    that.form.eyesOpenResponseText= "刺眼睁眼"
                  }else if(that.form.eyesOpenResponse==1){
                    that.form.eyesOpenResponseText= "不能睁眼"
                  }
                   if(that.form.verbalResponse==5){
                      that.form.verbalResponseText= "回答切题"
                    }else if(that.form.verbalResponse==4){
                      that.form.verbalResponseText= "回答不切题"
                    }else if(that.form.verbalResponse==3){
                      that.form.verbalResponseText= "答非所问"
                    }else if(that.form.verbalResponse==2){
                      that.form.verbalResponseText= "只能发音"
                    }else if(that.form.verbalResponse==1){
                      that.form.verbalResponseText= "不能言语"
                    }
                     if(that.form.sportResponse==6){
                      that.form.sportResponseText= "按吩咐动作"
                    }else if(this.form.sportResponse==5){
                      that.form.sportResponseText= "刺激能定位"
                    }else if(this.form.sportResponse==4){
                      that.form.sportResponseText= "刺激能躲避"
                    }else if(this.form.sportResponse==3){
                      that.form.sportResponseText= "刺激肢体屈曲"
                    }else if(this.form.sportResponse==2){
                      that.form.sportResponseText= "刺激肢体伸展"
                    }else if(this.form.sportResponse==1){
                      that.form.sportResponseText= "不能活动"
                    }
              if(that.form.creatInineStatus==2){
                if(that.form.creatInine==0){
                  that.creatInine = 10
                }else if(that.form.creatInine==2){
                  that.creatInine = 12
                }
                else if(that.form.creatInine==3){
                  that.creatInine = 13
                }
                else if(that.form.creatInine==4){
                  that.creatInine = 14
                }
              }else if(that.form.creatInineStatus==1){
                that.creatInine = that.form.creatInine
              }
            }else{
              this.$message.error(res.data.content)
            }
          })
           return
        }else if(code == "NUTRIC"){
          url = global.url + "/score/quertNutricDetail";
          let para = {
            patientRecordId: patientRecordId,
            answerId: answerId,
          }
           let that = this
          this.$axios.post(url,para).then((res)=>{
            if(res.data.msg==201){
                that.dialogNUTRICVisible = true
                that.formNutric.patientRecordId = res.data.respData.patientRecordId
                that.formNutric.answerId = answerId
                that.formNutric.isContainsIl6 = res.data.respData.isContainsIl6
                that.formNutric.age = res.data.respData.age
                that.formNutric.apacheiiScore = res.data.respData.apacheiiScore
                that.formNutric.sofaScore = res.data.respData.sofaScore
                that.formNutric.containDisease = res.data.respData.containDisease
                that.formNutric.toIcuTime = res.data.respData.toIcuTime
                if(that.formNutric.isContainsIl6==1){
                   that.formNutric.il6Value = res.data.respData.il6Value
                } 
            }
          })
          return
        }
        url = global.url + '/score/getForm';
        params = {
          code: code,
          patientRecordId: patientRecordId,
          answerId: answerId,
        };
      }
      if(url.indexOf('/score/getForm')!=-1){
        this.getScoreData_post(url,params)
      }else {
        this.getScoreData_get(url,params)
      }
    },
    getScoreData_get(url,params){
      this.$axios({
        url: url,
        method: "get",
        params: params,
      }).then((res) => {
        if (res.data && res.data.msg === 201) {
          if (res.data.respData && res.data.respData.length > 0) {
            this.handlerJSON(res.data.respData[0]);
          } else {
            this.$message.error("系统错误");
          }
        } else {
          this.$message.error(res.data.content);
        }
      });
    },
    getScoreData_post(url,params){
      this.$axios({
        url: url,
        method: "post",
        data: params,
      }).then((res) => {
        if (res.data && res.data.msg === 201) {
          if (res.data.respData && res.data.respData.length > 0) {
            this.handlerJSON(res.data.respData[0]);
          } else {
            this.$message.error("系统错误");
          }
        } else {
          this.$message.error(res.data.content);
        }
      });
    },
    handleClose() {
      this.dialogVisible = false;
    },
    handlerJSON(data) {
      this.formJSONArr = data.sections;
      if (this.formJSONArr.length === 1) {
        this.formJSON = data.sections[0] || {};
        if (this.formJSON.questions.length === 1) {
          this.type = "only";
        } else {
          this.type = "";
        }
      } else if (this.formJSONArr.length > 1) {
        this.type = "";
      }

      // this.formJSON = data.sections[0] || {}
      this.name = data.name;

      this.title = (this.dialogType === "add" ? "新增" : "修改") + this.name;
      this.dialogWidth = data.dialogWidth;
      this.labelWidth = data.labelWidth;
      this.dialogVisible = true;
      // console.log(JSON.stringify(this.formJSON))
      this.setDefaultValue(); // 表单初始化
    },
    submitForm() {
      this.isLoading = true;
      console.log(JSON.stringify(this.ruleForm))
      let params = {
        formCode: this.code,
        sourceType:"2",
        details: [],
        patientRecordId: this.patientRecordId,
      };
      if (this.dialogType === "update") {
        params.id = this.answerId;
      }
      if(this.code=="AGI"){
         for (const key in this.ruleForm) {
        if (this.radioAGI||this.ruleForm[key]) {
          if(this.ruleForm[key]){
             params.details.push({
                questionId: key,
                option: Array.isArray(this.ruleForm[key])
                  ? this.ruleForm[key]
                  : [this.ruleForm[key]],
              });
          }
             
        }else{
            this.$message.info("请填写完表单再提交");
            this.isLoading = false;
            return;
        }
        // let option =
      
         
      }
      }else{
          for (const key in this.ruleForm) {
          if (!this.ruleForm[key]) {
            this.$message.info("请填写完表单再提交");
            this.isLoading = false;
            return;
          }
          // let option =
          params.details.push({
            questionId: key,
            option: Array.isArray(this.ruleForm[key])
              ? this.ruleForm[key]
              : [this.ruleForm[key]],
          });
        }
      }
      
      this.$axios({
        url: global.url + '/score/saveAnswer',
        // url: "http://172.16.15.199:9080" + "/score/saveAnswer",
        method: "POST",
        data: params,
      }).then((res) => {
        if (res.data && res.data.msg === 201) {
          this.$message.success(
            (this.dialogType === "add" ? "新增" : "修改") + "成功"
          );
          this.dialogVisible = false;
          this.$emit("sub");
        } else {
          this.$message.error(res.data.content);
        }
        this.isLoading = false;
      });
    },
    handleInput(val, key) {
      console.log(val,key)
      this.ruleForm[key] = val;
    },
    setDefaultValue() {
      const formData = {};
      if (this.formJSONArr.length === 1) {
        this.formJSON.questions.forEach((item) => {
          let _item = [];
          if (item.optionIdList && item.optionIdList.length > 0) {
            _item = item.optionIdList.map((i) => {
              return item.options.find((_i) => _i.id == i);
            });
          }
          console.log(_item[0] || "1");
          if (item.type === "checkbox") {
            formData[item.id] = _item || [];
          } else {
            formData[item.id] = _item[0] || "";
          }
        });
      } else if (this.formJSONArr.length > 1) {
        this.formJSONArr.map((item) => {
          item.questions.forEach((itemA) => {
            let _item = [];
            if (itemA.optionIdList && itemA.optionIdList.length > 0) {
              _item = itemA.optionIdList.map((i) => {
                return itemA.options.find((_i) => _i.id == i);
              });
            }
            console.log(_item[0] || "1");
            if (itemA.type === "checkbox") {
              formData[itemA.id] = _item || [];
            } else {
              formData[itemA.id] = _item[0] || "";
            }
          });
        });
      }

      console.log(formData);
      this.ruleForm = formData;
      if(this.code=="AGI"){
        for(let key in  formData){
          if(formData[key]){
            this.radioAGI = formData[key].id
              if (key==131) {
                this.one = true;
                this.two = false;
                this.three = false;
                this.four = false;
              } else if (key==132) {
                this.two = true;
                this.one = false;
                this.three = false;
                this.four = false;
              } else if (key==133) {
                this.three = true;
                this.two = false;
                this.one = false;
                this.four = false;
              } else if (key==134) {
                this.four = true;
                this.two = false;
                this.three = false;
                this.one = false;
              } else {
                this.one = false;
                this.two = false;
                this.three = false;
                this.four = false;
              }
          }
            console.log(key,this.radioAGI)
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.dialogMain {
  .labelTitle {
    font-weight: 700;
    // float:left;
    // margin-bottom:16px;
  }
  .el-dialog__body {
    .el-radio {
      color: rgba(0, 0, 0, 0.87);
      line-height: 32px;
    }
    .el-form-item__label {
      color: rgba(0, 0, 0, 0.87);
      font-weight: 400;
    }

    .el-radio-group {
      width: 100%;
    }
    .tip {
      font-size: 12px;
      line-height: 20px;
      &.t1 {
        color: #f23c3c;
      }
      p {
        font-size: 12px;
      }
    }
    .el-form-item {
      margin-bottom: 14px;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .el-radio__input {
      vertical-align: top;
      margin-top: 9px;
    }
    .el-radio__label {
      display: inline-block;
      line-height: 20px;
      white-space: normal;
    }
  }
}
.dialogMainTwo {
  .h1Titie {
    margin-bottom: 10px;
  }
  // .el-form-item__label{
  //   font-size: 12px;
  // }
  .mmHG {
    font-size: 12px !important;
  }
  .GCSScore{
    display: inline-block;
    width: 100px;
  }
  .checkRadioSty{
  border-bottom: 1 px solid red;
}
  // .el-radio__label{
  //   font-size: 12px!important
  // }
}
</style>

<template>
  <div class="tab8">
    <div class="echart_img_date">
      <el-date-picker
        v-model="queryTime"
        type="date"
        placeholder="选择日期"
        size="small"
        align="left"
        :default-value="new Date()"
        format="yyyy-MM-dd"
        :clearable="false"
        value-format="yyyy-MM-dd"
        @change="changeTime"
      >
      </el-date-picker>
        <el-button type="primary" size="small" @click="pdfPrint()" class="btn">打印</el-button>
    </div>
    <div id="printDom">
      <div class="title">
        <div>{{ patient.hospitalName }}</div>
        <div>ICU护理记录单</div>
      </div>
      <div class="tableInfo">
        <div>
            <span>床号：</span><span>{{ patient.bedNo }}</span>
        </div>
        <div>
          <span>姓名：</span><span>{{ patient.name }}</span>
        </div>
        <div><span>性别：</span><span v-if="patient.sex == 1">男</span></div>
        <div>
          <span>年龄：</span><span>{{ patient.age }}</span>
        </div>
        <div>
          <span>住院病历号：</span><span>{{ patient.inhosNum }}</span>
        </div>
      </div>
      <div>
        <table  cellpadding="0" cellspacing="0" width="100%">
          <thead></thead>
          <tbody>
            <tr class="first">
              <td rowspan="3">
                <div>日期</div>
                <span> </span>
                <div>时间</div>
              </td>
              <td colspan="4">生命体征</td>
              <td rowspan="3" style="fontSize:8px;">
                SpO<span style="vertical-align: sub; font-size: 5px">2</span
                ><br />%
              </td>
              <td rowspan="3" style="fontSize:8px;">
                CVP<br />cmH<span style="vertical-align: sub; font-size: 5px"
                  >2</span
                >O
              </td>
              <td rowspan="3">卧位</td>
              <td rowspan="3">受<br />压<br />皮<br />肤</td>
              <td rowspan="3">意<br />识</td>
              <td colspan="4">瞳孔</td>
              <td colspan="4">机械通气</td>
              <td rowspan="3">氧疗<br /><span style="fontSize:6px;">L/min</span></td>
              <td rowspan="3">镇静<br />评分</td>
              <td rowspan="3">疼痛<br />评分</td>
              <td colspan="5">入量ml</td>
              <td colspan="9">出量ml</td>
              <td colspan="2">静脉<br />置管</td>
              <td rowspan="3"></td>
              <td rowspan="3"></td>
              <td rowspan="3">护理<br>措施</td>
              <td rowspan="3">其它</td>
              <td rowspan="3">签名</td>
            </tr>
            <tr class="two">
              <td rowspan="2">
                T<br />
                ℃
              </td>
              <td rowspan="2">HR<br />次<br />/<br />分</td>
              <td rowspan="2">R<br />次<br />/<br />分</td>
              <td rowspan="2" style="fontSize:8px;">Bp/ABp<br />mmHg</td>
              <td rowspan="2">左<br />mm</td>
              <td rowspan="2">对光<br />反射</td>
              <td rowspan="2">右<br />mm</td>
              <td rowspan="2">对光<br />反射</td>
              <td rowspan="2">呼吸<br />模式</td>
              <td rowspan="2" style="fontSize:8px;">
                FiO<span style="vertical-align: sub; font-size: 5px">2</span
                ><br />%
              </td>
              <td rowspan="2">f<br />次<br />/<br />分</td>
              <td rowspan="2">插管<br />深度<br />cm</td>
              <td colspan="2">静脉用药</td>
              <td colspan="2">饮食</td>
              <td rowspan="2">总<br />量</td>
              <td colspan="5">引流</td>
              <td rowspan="2">尿量</td>
              <td colspan="2">其他</td>
              <td rowspan="2">总量</td>
              <td rowspan="2">类型</td>
              <td rowspan="2">状态</td>
            </tr>
            <tr class="three">
              <td>名称</td>
              <td>量</td>
              <td>名称</td>
              <td>量</td>
              <td>类别</td>
              <td>通畅</td>
              <td>颜色</td>
              <td>性状</td>
              <td>量</td>
              <td>类别</td>
              <td>量</td>
            </tr>
            <!-- <tr class="four">
              <td>1</td>
              <td>2</td>
              <td>3</td>
              <td>4</td>
              <td>5</td>
              <td>6</td>
              <td>7</td>
              <td>8</td>
              <td>9</td>
              <td>10</td>
              <td>11</td>
              <td>12</td>
              <td>13</td>
              <td>15</td>
              <td>15</td>
              <td>16</td>
              <td>17</td>
              <td>18</td>
              <td>19</td>
              <td>20</td>
              <td>21</td>
              <td>22</td>
              <td>23</td>
              <td>24</td>
              <td>25</td>
              <td>26</td>
              <td>27</td>
              <td>28</td>
              <td>29</td>
              <td>30</td>
              <td>31</td>
              <td>32</td>
              <td>33</td>
              <td>34</td>
              <td>35</td>
              <td>36</td>
              <td>37</td>
              <td>38</td>
              <td>39</td>
              <td>40</td>
              <td>40</td>
              <td>42</td>
            </tr> -->
            <tr v-for="(item, index) in data" :key="index">
              <td class="firstTd" style="width:80px;">{{ item.careTime }}</td>
              <td>{{ item.bodyTemperature }}</td>
              <td>{{ item.heartRate }}</td>
              <td>{{ item.breatheRate }}</td>
              <td v-if="item.systolicBloodPressure||item.diastolicBloodPressure">
                {{ item.systolicBloodPressure }}/{{
                  item.diastolicBloodPressure
                }}
              </td><td v-else></td>
              <td>{{ item.oxygenSaturation }}</td>
              <td>{{ item.centralVenousPressure }}</td>
              <td></td>
              <td></td>
              <td v-if="item.observation">{{ item.observation["意识"] }}</td>
              <td v-else></td>
              <td v-if="item.observation">
                {{ item.observation["瞳孔-左大小"] }}
              </td>
              <td v-else></td>
              <td v-if="item.observation">
                {{ item.observation["瞳孔-左对光反射"] }}
              </td>
              <td v-else></td>
              <td v-if="item.observation">
                {{ item.observation["瞳孔-右大小"] }}
              </td>
              <td v-else></td>
              <td v-if="item.observation">
                {{ item.observation["瞳孔-右对光反射"] }}
              </td>
              <td v-else></td>
              <td v-if="item.ventilator">{{ item.ventilator["呼吸模式"] }}</td>
              <td v-else></td>
              <td v-if="item.ventilator">{{ item.ventilator["Fio2%"] }}</td>
              <td v-else></td>
              <td v-if="item.ventilator">{{ item.ventilator["f(次/分)"] }}</td>
              <td v-else></td>
              <td v-if="item.ventilator">{{ item.ventilator["插管深度"] }}</td>
              <td v-else></td>
              <td></td>
              <td v-if="item.score">{{ item.score["镇静评分"] }}</td>
              <td v-else></td>
              <td v-if="item.score">{{ item.score["疼痛评分"] }}</td>
              <td v-else></td>
              <td v-if="item.in">{{ item.in["静脉用药-名称"] }}</td>
              <td v-else></td>
              <td v-if="item.in">{{ item.in["静脉用药-量"] }}</td>
              <td v-else></td>
              <td v-if="item.in">{{ item.in["饮食-名称"] }}</td>
              <td v-else></td>
              <td v-if="item.in">{{ item.in["饮食-量"] }}</td>
              <td v-else></td>
              <td v-if="item.in">{{ item.in["总量"] }}</td>
              <td v-else></td>
              <td v-if="item.out">{{ item.out["引流-类别"] }}</td>
              <td v-else></td>
              <td v-if="item.out">{{ item.out["引流-通畅"] }}</td>
              <td v-else></td>
              <td v-if="item.out">{{ item.out["引流-颜色"] }}</td>
              <td v-else></td>
              <td v-if="item.out">{{ item.out["引流-性状"] }}</td>
              <td v-else></td>
              <td v-if="item.out">{{ item.out["引流-量"] }}</td>
              <td v-else></td>
              <td v-if="item.out">{{ item.out["尿量"] }}</td>
              <td v-else></td>
              <td v-if="item.out">{{ item.out["其他-类别"] }}</td>
              <td v-else></td>
              <td v-if="item.out">{{ item.out["其他-量"] }}</td>
              <td v-else></td>
              <td v-if="item.out">{{ item.out["总量"] }}</td>
              <td v-else></td>
              <td v-if="item.cannula" style="width:40px;">{{ item.cannula["静脉置管-类别"] }}</td>
              <td v-else></td>
              <td v-if="item.cannula">{{ item.cannula["静脉置管-状态"] }}</td>
              <td v-else></td>
              <td style="width:15px;"></td>
              <td style="width:15px;"></td>
              <td v-if="item.basicNursing" style="width:20px;">
                {{ item.basicNursing["护理措施"] }}
              </td>
              <td v-else style="width:10px;"></td>
              <td style="width:80px;"></td>
              <td style="width:50px;"></td>
            </tr>
            <tr v-if="data.length==0">
                <td colspan="42" style="minHeight:50px;">暂无数据</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="food">
          备注：1、观察内容无异常时，用"N"来表示，异常时如实描述。2、常用护理措施代码：①口腔护理 ②会阴护理 ③清洁面部 ④温水擦浴 ⑤气管切开护理 ⑥吸痰⑦预防压疮护理 ⑧雾化吸入 ⑩保护性约束
      </div>
    </div>
    <iframe frameborder="0" name="test" style="display:none" id="test"></iframe>
  </div>
</template>
<script>
export default {
  name: "tab8",
  data() {
    return {
      queryTime: null,
      data: [],
      patient:{
          hospitalName:null,
      },
    };
  },
  computed: {
    patientRecordId() {
      return this.patientInfo.record.recordId;
    },
  },
  props: {
    patientInfo: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  mounted() {
    this.getNowTime();
  },
  methods: {
    getNowTime() {
      let myDate = new Date();
      let year = myDate.getFullYear();
      let month =
        myDate.getMonth() + 1 < 10
          ? "0" + (myDate.getMonth() + 1)
          : myDate.getMonth() + 1;
      let date =
        myDate.getDate() < 10 ? "0" + myDate.getDate() : myDate.getDate();
      this.queryTime = year + "-" + month + "-" + date;
    },
    initData() {
      let that = this;
      let url =
        "/api/icu/careSheet/queryStream?patientRecordId=" +
        that.patientRecordId +
        "&queryTime=" +
        that.queryTime;
      that.$axios.get(global.url + url).then(function (res) {
        if (res.data.msg == 201) {
          if (res.data.respData.data.length > 0) {
            that.data = res.data.respData.data;
          } else {
            that.data = [];
          }
          that.patient = res.data.respData.patient || {};
        }
      });
    },
    changeTime() {
      this.initData();
    },
    pdfPrint(){
         let body = document.getElementById('test').contentWindow.document.body;
         let head = document.getElementById('test').contentWindow.document.head;
         let sty = document.createElement('style');
         sty.innerHTML = '#printDom{font-size:10px;}.firstTd{width:80px;font-size:6px;}td{border:0.5px solid #636363;vertical-align:middle;text-align:center;font-size:8px;}.first td{text-align:center;padding:1px 1px}.two td{text-align:center;padding:1px 1px}.three td{text-align:center;padding:1px 1px}.tableInfo{padding-bottom:15px;display:flex}.tableInfo div{padding-right:10px;font-size:10px;}.tableInfo span{display:inline-block}.title div{text-align:center;font-size:14px;}.food{font-size:10px;}';
         head.appendChild(sty);
         let printDom = document.getElementById('printDom');
         body.innerHTML=printDom.innerHTML;
         document.getElementById('test').contentWindow.print();
    }
  },
};
</script>
<style lang="scss">
.tab8 {
    .btn{
      background-color:#4CAF50;  
      border-color:transparent;
    }
  h1 {
    padding: 5px 0;
    font-size: 14px;
  }
  h2 {
    font-size: 14px;
  }
  td {
    border: 1px solid #636363;
    vertical-align: middle;
    text-align: center;
  }
  .first td {
    text-align: center;
    padding: 10px 5px;
  }
  .two td {
    text-align: center;
    padding: 5px 1px;
  }
  .three td {
    text-align: center;
    padding: 5px 2px;
  }
  .tableInfo {
    padding-bottom: 15px;
    display: flex;
  }
  .tableInfo  div{
        padding-right: 10px;
    }
  .tableInfo span {
    display: inline-block;
  }
  .title {
    text-align: center;
  }
}
</style>
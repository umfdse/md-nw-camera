<template>
  <div class="nusC01">
      <el-form>
          <el-form-item label="查询日期" class="form_item">
            <el-date-picker  v-model="TimeNode"  align="right"  type="date"  placeholder="选择日期"  value-format="yyyy-MM-dd"  format="yyyy-MM-dd" :picker-options="pickerOptions"  @change="SelectedTimeNode">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="" class="form_item">
              <el-button @click="PrintThatPdf">打印</el-button>
          </el-form-item>
      </el-form>
      <div ref="PdfContent">
        <div class="DivContainer">
          <div class="pdf_title">产 科 重 症 监 护 病 房 心 血 管 重 症 监 护 护 理 记 录 表</div>
          <div class="title_box">
            <div class="line_box">
              <span class="label">科室：</span>
              <span class="unline">{{patient.dept}}</span>
            </div>
            <div class="line_box">
              <span class="label">住院号：</span>
              <span class="unline">{{patient.archivesid}}</span>
            </div>
            <div class="line_box mw">
              <span class="label">床号：</span>
              <span class="unline">{{patient.bedNo}}</span>
              <span>床</span>
            </div>
            <div class="line_box">
              <span class="label">姓名：</span>
              <span class="unline">{{patient.name}}</span>
            </div>
            <div class="line_box mw">
              <span class="label">性别</span>
              <span class="unline"><span v-if="patient.sex=='1'">男</span><span v-else-if="patient.sex=='2'">女</span><span v-else>未知</span></span>
            </div>
            <div class="line_box mw">
              <span class="label">年龄：</span>
              <span class="unline">{{patient.age}}</span>
            </div>
            <div class="line_box">
              <span class="label">手术名称：</span>
              <span class="unline">{{patient.operationName}}</span>
            </div>
            <div class="line_box">
              <span class="label">日期：</span>
              <span class="unline">{{patient.date}}</span>
            </div>
          </div>
          <div class="table_top">
            <div class="relative" style="height:338px;">
              <div class="leftHeader">
                <div class="border_Content">
                  <div class="tr border_bottom" ref="topHead">
                    <div class="td w1">标记</div>
                    <div class="td w2">项目</div>
                    <div class="td w2">英文</div>
                  </div>
                  <div class="tr">
                    <div class="td w1">
                      <svg height="10" width="10">
                        <polygon points="5,9 0,0 10,0"
                                 style="fill:transparent;stroke:red;stroke-width:1"></polygon>
                      </svg>
                    </div>
                    <div class="td w2">收缩压(无创)</div>
                    <div class="td w2">SBP（NIBP）</div>
                  </div>
                  <div class="tr">
                    <div class="td w1">
                      <svg height="10" width="10">
                        <polygon points="5,1 0,10 10,10"
                                 style="fill:transparent;stroke:red;stroke-width:1"></polygon>
                      </svg>
                    </div>
                    <div class="td w2">舒张压</div>
                    <div class="td w2">DBP</div>
                  </div>
                  <div class="tr">
                    <div class="td w1">
                      <svg height="10" width="10">
                        <polygon points="5,9 0,0 10,0" style="fill:#00FF00;stroke-width:1"></polygon>
                      </svg>
                    </div>
                    <div class="td w2">收缩压(有创)</div>
                    <div class="td w2">SPB（IBP）</div>
                  </div>
                  <div class="tr">
                    <div class="td w1">
                      <svg height="10" width="10">
                        <polygon points="5,1 0,10 10,10" style="fill:#00FF00;stroke-width:1"></polygon>
                      </svg>
                    </div>
                    <div class="td w2">舒张压</div>
                    <div class="td w2">DBP</div>
                  </div>
                  <div class="tr">
                    <div class="td w1">
                      <svg height="10" width="10">
                        <circle cx="5" cy="5" r="5"
                                style="fill:transparent;stroke:#000;stroke-width:1"></circle>
                      </svg>
                    </div>
                    <div class="td w2">体温（腋温）</div>
                    <div class="td w2">TEMP（腋）</div>
                  </div>
                  <div class="tr">
                    <div class="td w1">
                      <svg height="10" width="10">
                        <circle cx="5" cy="5" r="5" fill="black"></circle>
                      </svg>
                    </div>
                    <div class="td w2">体温（肛温）</div>
                    <div class="td w2">TEMP（肛）</div>
                  </div>
                  <div class="tr">
                    <div class="td w1">
                      <svg height="10" width="10">
                        <circle cx="5" cy="5" r="5" style="fill:red;stroke-width:1"></circle>
                      </svg>
                    </div>
                    <div class="td w2">脉搏</div>
                    <div class="td w2">P</div>
                  </div>
                  <div class="tr">
                    <div class="td w1">
                      <svg height="10" width="10">
                        <circle cx="5" cy="5" r="5"
                                style="fill:transparent;stroke:red;stroke-width:1"></circle>
                      </svg>
                    </div>
                    <div class="td w2">心率</div>
                    <div class="td w2">HR</div>
                  </div>
                  <div class="tr">
                    <div class="td w1">
                      <svg height="10" width="10">
                        <rect x="0" y="0" width="9" height="9"
                              style="fill:transparent;stroke-width:1;stroke:red;"></rect>
                      </svg>
                    </div>
                    <div class="td w2">呼吸</div>
                    <div class="td w2">R</div>
                  </div>
                  <div class="tr">
                    <div class="td w1">
                      <svg height="10" width="10">
                        <rect x="0" y="0" width="9" height="9" style="fill: red;stroke-width:1;"></rect>
                      </svg>
                    </div>
                    <div class="td w2">氧饱和度</div>
                    <div class="td w2">SaO2</div>
                  </div>
                  <div class="tr">
                    <div class="td w1"></div>
                    <div class="td w2"></div>
                    <div class="td w2"></div>
                  </div>
                  <div class="tr">
                    <div class="td w1"></div>
                    <div class="td w2"></div>
                    <div class="td w2"></div>
                  </div>
                </div>
              </div>
              <div class="rightCont">
                <div style="margin-left: -20px;height: calc(100% + 15px);position:relative;top:0;" ref="SvgCont">
                  <svg width="0" height="0" style="display:none;">
                    <defs>
                      <g id="icon00">
                        <polygon points="5,9 0,0 10,0" style="fill:transparent;stroke:red;stroke-width:1"></polygon>
                      </g>
                      <g id="icon01">
                        <polygon points="5,1 0,10 10,10" style="fill:transparent;stroke:red;stroke-width:1"></polygon>
                      </g>


                      <g id="icon02">
                        <polygon points="5,9 0,0 10,0" style="fill:#00FF00;stroke-width:1"></polygon>
                      </g>
                      <g id="icon03">
                        <polygon points="5,1 0,10 10,10" style="fill:#00FF00;stroke-width:1"></polygon>
                      </g>
                      <g id="icon04">
                        <circle cx="5" cy="5" r="5" style="fill:transparent;stroke:#000;stroke-width:1"></circle>
                      </g>
                      <g id="icon05">
                        <circle cx="5" cy="5" r="5" fill="black"></circle>
                      </g>
                      <g id="icon06">
                        <circle cx="5" cy="5" r="5" style="fill:red;stroke-width:1"></circle>
                      </g>
                      <g id="icon07">
                        <circle cx="5" cy="5" r="5" style="fill:transparent;stroke:red;stroke-width:1"></circle>
                      </g>
                      <g id="icon08">
                        <rect x="0" y="0" width="9" height="9" style="fill:transparent;stroke-width:1;stroke:red;"></rect>
                      </g>
                      <g id="icon09">
                        <rect x="0" y="0" width="9" height="9" style="fill: red;stroke-width:1;"></rect>
                      </g>
                    </defs>
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" ref="svgEl"></svg>
                </div>
              </div>
            </div>
            <table cellspacing="0" cellpadding="0" border="1" id="table01">
              <tbody>
              <tr v-for="(Tr,i) in patCond"  desc="patientCondition" :key="i">
                <td v-if="i=='0'"  :rowspan="patCond.length" class="w20">
                  病
                  人
                  情
                  况
                </td>
                <td v-for="(td,k) in Tr" :class="{'w225':k=='0'}"  :k="'td'+k">
                  <div :class="{'tdiv':k!='0'}">{{td}}</div>
                </td>
                <td v-if="i=='0'" colspan="2" class="Lw200">管道情况</td>
                <td v-else-if="i=='1'" colspan="2" :rowspan="rowH1" class="Lw200" style="vertical-align:top;text-align:left;">
                  <div style="padding:2px;">
                    <span>{{pipeline}}</span>
                  </div>
                </td>
              </tr>
              <tr v-for="(Tr,i) in VeLrs"  desc="ventilatorParameters" :key="100+i">
                <td v-if="i=='0'"  :rowspan="VeLrs.length" class="w20">
                  呼
                  吸
                  机
                  参
                  数
                </td>
                <td v-for="(td,k) in Tr" :class="{'w225':k=='0'}" :k="'td'+(100+k)">
                  <div :class="{'tdiv':k!='0'}">{{td}}</div>
                </td>
              </tr>

              <tr v-for="(Tr,i) in drug"  desc="drug" :key="200+i">
                <td v-if="i=='0'" :rowspan="drug.length" class="w20">
                  药
                  物
                </td>
                <td v-for="(td,k) in Tr" :class="{'w225':k=='0'}"  :k="'td'+(200+k)">
                  <div :class="{'tdiv':k!='0'}">{{td}}</div>
                </td>
                <td v-if="i==(drug.length-1)" class="Lw70">24小时总量</td>
                <td v-if="i==(drug.length-1)" class="w130">班次&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 签名</td>
              </tr>

              <tr v-for="(Tr,i) in Vin"  desc="in" :key="300+i">
                <td v-if="i=='0'" :rowspan="Vin.length" class="w20">
                  入
                  量
                  ︵
                  ｍ
                  ｌ
                  ︶
                </td>
                <td v-for="(td,k) in Tr" :class="{'w225':k=='0'}" :k="'td'+(300+k)">
                  <div :class="{'tdiv':k!='0'}">{{td}}</div>
                </td>
                <td v-if="i=='0'" :rowspan="rowH2" class="w130"></td>
              </tr>

              <tr v-for="(Tr,i) in Pout"  desc="out" :key="400+i">
                <td v-if="i=='0'" :rowspan="Pout.length" class="w20">
                  出
                  量
                  ︵
                  ｍ
                  ｌ
                  ︶
                </td>
                <td v-for="(td,k) in Tr" :class="{'w225':k=='0'}" :k="'td'+(400+k)">
                  <div :class="{'tdiv':k!='0'}">{{td}}</div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
  export default {
    name: 'nursingRecordCom01',
    data(){
        return {
            pickerOptions: {
              disabledDate(time) {
                return time.getTime() > Date.now();
              },
              shortcuts: [{
                text: '今天',
                onClick(picker) {
                  picker.$emit('pick', new Date());
                }
              }, {
                text: '昨天',
                onClick(picker) {
                  const date = new Date();
                  date.setTime(date.getTime() - 3600 * 1000 * 24);
                  picker.$emit('pick', date);
                }
              }, {
                text: '一周前',
                onClick(picker) {
                  const date = new Date();
                  date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                  picker.$emit('pick', date);
                }
              }]
            },
            TimeNode:"",
            RecordId:"",
            can_w:null, /*画布长度*/
            can_h:null,  /*画布宽度*/
            STableW:null,
            STableH:null,
            topH:null,
            GridWidth:null,  /*每小时对应网格的宽度*/
            GridHeight:null,   /*每小格对应的高度*/
            patient:{
                dept:"",
                archivesid:"",
                bedNo:"",
                name:"",
                sex:"",
                age:"",
                operationName:"",
                date:""
            },
            patCond:[],
            VeLrs:[],
            drug:[],
            Vin:[],
            Pout:[],
            pipeline:'',
            rowH1:19,
            rowH2:13,
            IsMountedSuccess:false,
        }
    },
    mounted(){
        this.IsMountedSuccess=true;
        this.getServeData();
    },
    methods:{
        PrintThatPdf(){
             var that=this;
            window.nursingRecord.print();
        },
        getServeData(){
            var that=this;
            console.log('that.IsMountedSuccess:'+that.IsMountedSuccess);
            if(that.IsMountedSuccess){
                var subObj={ patientRecordId:that.RecordId, queryTime:that.TimeNode };
                if(!subObj.queryTime){
                  subObj.queryTime=(function(){ var date = new Date();var year = date.getFullYear();var month = date.getMonth() + 1;var day = date.getDate(); return  year+"-"+((month<10)?('0'+month):(month))+"-"+((day<10)?('0'+day):(day));})()
                  that.TimeNode=subObj.queryTime;
                };
                that.$axios.post(global.url + '/api/icu/careSheet/querySolid',subObj).then(function (res) {
                  var response=res.data;
                  if(response.msg==201){
                    that.setCanvasSize();
                    that.setTopParentDc(response.respData);
                    that.setTableTdText(response.respData)
                    that.initJsonPage(response.respData);
                    that.addiframeDom(response.respData);
                  }
                });
            }
        },
        addiframeDom(respData){
            var that=this;
            if(window.nursingRecord&&((typeof(window.nursingRecord.PdfViewInit))=='function')){ window.nursingRecord.PdfViewInit(respData) };
        },
        setTopParentDc(respData){
            var that=this;
            var kes=[`dept`,`archivesid`,`bedNo`,`name`,`sex`,`age`,`operationName`,`date`];
            var parent={};
            var parents=respData.patient;
            kes.forEach(function(ky){ parent[ky]=(parents[ky])?(parents[ky]):``; });
            if(parent.date){parent.date=parent.date.substring(0,9)};
            that.patient=parent;
            that.pipeline=respData.pipeline;
        },
        setTableTdText(respData){
            var that=this;
            // var ks=[`patientCondition`,`ventilatorParameters`,`drug`,`in`,`out`];

            that.patCond=respData.patientCondition;
            that.VeLrs=respData.ventilatorParameters;
            that.drug=respData.drug;
            that.Vin=respData.in;
            that.Pout=respData.out;
            that.rowH1=that.patCond.length + that.VeLrs.length + that.drug.length -2;
            that.rowH2=that.Vin.length + that.Pout.length;
        },
        setRecordIdFn(RecordId){ this.RecordId=RecordId;this.getServeData(); },
        SelectedTimeNode(Time){ this.TimeNode=Time;this.getServeData() },
        initJsonPage:function(respData){
          var that=this;
          that.InitJsonEcg(respData);
        },
        clearRect:function(){
          var SvgElement=this.$refs.svgEl;
          SvgElement.innerHTML='';
        },
        InitJsonEcg(respData){
          this.clearRect();
          // this.drawlinedra();
          this.drawTickTxt();
          this.drawTickMarks();
          this.drawSerData(respData);

        },
        addICONFn(x,y,key,flag){
            if(!flag){ return ;};
            var SvgElement=this.$refs.svgEl;
            var iconObj={
                bodyTemperature: "icon05" , //体温（肛温）
                breatheRate: "icon08" , //  呼吸
                centralVenousPressure: "icon06" ,   //脉搏
                diastolicBloodPressure: "icon01",  //无创舒张压
                heartRate: "icon07"   ,   //心率
                oxygenSaturation: "icon09",    //氧饱和度
                systolicBloodPressure: "icon00"  //无创收缩压
            };
            var useTag=document.createElementNS('http://www.w3.org/2000/svg','use');
            // useTag.setAttributeNS(`xlink:href`,`#${iconObj[key]}`);
            useTag.setAttributeNS("http://www.w3.org/1999/xlink","href",`#${iconObj[key]}`);
            useTag.setAttribute('x',x);
            useTag.setAttribute('y',y);
            SvgElement.appendChild(useTag)
        },
        addVhText(x,y,txt,fontSize){
            var txtstr=(typeof(txt)==='string')?(txt):``;
            if(!txtstr){ return ; };
            var SvgElement=this.$refs.svgEl;
            (txtstr.split('')).forEach(function(tfont,i){
                var text=document.createElementNS('http://www.w3.org/2000/svg','text');
                text.setAttribute('x',x);
                text.setAttribute('y',y+16*i);
                text.innerHTML=tfont;
                if(fontSize){ text.setAttribute('font-size',fontSize) }
                SvgElement.appendChild(text)
            })
        },
        getpolyline(){
            return  document.createElementNS('http://www.w3.org/2000/svg','polyline');
        },
        appendpolyline(polyline,attrTxt,ky){
            var SvgElement=this.$refs.svgEl;
            var len=(attrTxt.split(',')).length-1;
            if(len<2){ console.log('两点确定一条直线,只有一点不能确定直线');return };
            var colorObj={
                "bodyTemperature":"#000000", "breatheRate":"#FF0000", "centralVenousPressure":"#FF0000", "diastolicBloodPressure":"#FF0000", "heartRate":"#FF0000", "oxygenSaturation":"#FF0000", "systolicBloodPressure":"#FF0000"
            }
            polyline.setAttribute('points',attrTxt);
            polyline.setAttribute('fill','none');
            polyline.setAttribute('stroke',colorObj[ky]);
            polyline.setAttribute('stroke-width',1);
            polyline.setAttribute('stroke-linecap','round');
            SvgElement.appendChild(polyline);
        },
        drawLine(arr,ky){
            var that=this;
            var SvgElement=this.$refs.svgEl;
            var polyline=that.getpolyline();
            var attrTxt="";
            arr.forEach(function(co,s){
                if(co){
                  if(attrTxt!=""){ attrTxt+=" "};
                  if(ky==`bodyTemperature`){
                    attrTxt+=(18+that.GridWidth*(s+1))+","+((42-co)*(that.STableH/7));
                  }else{
                    attrTxt+=(18+that.GridWidth*(s+1))+","+((240-co)*(that.STableH/240));
                  }
                }else{
                  that.appendpolyline(polyline,attrTxt,ky);
                  attrTxt="";
                  polyline=that.getpolyline();
                }
            });
            that.appendpolyline(polyline,attrTxt);
        },
        drawSerData(respData){
            var that=this;
            var vitalSigns=respData.vitalSigns;
            var keys=["description","bodyTemperature", "breatheRate", "centralVenousPressure", "diastolicBloodPressure", "heartRate", "oxygenSaturation", "systolicBloodPressure"];
            var valueObj={};
            vitalSigns.forEach(function(dv,i){  keys.forEach(function(k){ if(!valueObj[k]){ valueObj[k]=[]; }; (valueObj[k]).push(dv[k]); }); });
            keys.forEach(function(ky){
                let DataArr=valueObj[ky];
                DataArr.forEach(function(Vo,i){
                    if(ky==`description`){
                        console.log('description=============================');
                        that.addVhText(18+that.GridWidth*(i+1),60,Vo);
                    }else if(ky==`bodyTemperature`){
                        that.addICONFn(16+that.GridWidth*(i+1),(42-Vo)*(that.STableH/7),ky,!!Vo);
                    }else{
                        that.addICONFn(16+that.GridWidth*(i+1),(240-Vo)*(that.STableH/240),ky,!!Vo);
                    }
                });
                if(ky!="description"){
                    that.drawLine(DataArr,ky)
                }
            })
        },
        drawTickTxt(){
          var that=this;
          var tLs=Array.from({length:24}).map(function(t,i){return i+1;});
          var txtLis=(tLs.slice(7).concat(tLs.slice(0,7)).concat([8])).map(function(c){ return (c<10)?('0'+c+':00'):(c+":00")});
          var tdW=this.STableW/24;
          var tdH=this.STableH/12;
          this.GridWidth=tdW;
          this.GridHeight=tdH;
          txtLis.forEach(function(txt,s){
            that.drawText(txt,1+(s*tdW),20,14);
          });
          for(let d=0;d<13;d++){
            that.drawText(d*20,20+that.STableW+15,30+that.STableH-(tdH*d),14);
          }
          that.drawText('mhhg',20+that.STableW+45,34);
          var kh=this.STableH/7;
          for(let g=0,c=42;g<8;g++,c--){
             that.drawText(c,this.STableW+20+115,26+(kh*g))
          }
          that.drawText('°C',this.STableW+20+140,34);
        },
        drawText(txt,x,y,fontSize){
          var SvgElement=this.$refs.svgEl;
          var text=document.createElementNS('http://www.w3.org/2000/svg','text');
          text.setAttribute('x',x);
          text.setAttribute('y',y);
          text.innerHTML=txt;
          if(fontSize){ text.setAttribute('font-size',fontSize) }
          SvgElement.appendChild(text)
        },
        drawTickMarks(){
          var SvgElement=this.$refs.svgEl;
          var tdw=this.STableW/24;
          var kh=this.STableH/7;
          for(let s=0;s<25;s++){
            var line=document.createElementNS('http://www.w3.org/2000/svg','line');
            line.setAttribute('x1',20+(tdw*s));
            line.setAttribute('y1',22);
            line.setAttribute('x2',20+(tdw*s));
            line.setAttribute('y2',26+this.STableH);
            line.setAttribute('stroke','#000');
            SvgElement.appendChild(line);
          }
          for(let t=0;t<13;t++){
            var line=document.createElementNS('http://www.w3.org/2000/svg','line');
            line.setAttribute('x1',20);
            line.setAttribute('y1',26+(t*26));
            line.setAttribute('x2',this.STableW+25);
            line.setAttribute('y2',26+(t*26));
            line.setAttribute('stroke','#000');
            SvgElement.appendChild(line);
          }
          for(let g=0;g<8;g++){
              var line=document.createElementNS('http://www.w3.org/2000/svg','line');
              line.setAttribute('x1',this.STableW+20+100);
              line.setAttribute('y1',26+(g*kh));
              line.setAttribute('x2',this.STableW+20+110);
              line.setAttribute('y2',26+(g*kh));
              line.setAttribute('stroke','#000');
              SvgElement.appendChild(line);
          }
          var line=document.createElementNS('http://www.w3.org/2000/svg','line');
          line.setAttribute('x1',this.STableW+20+100);
          line.setAttribute('y1',26);
          line.setAttribute('x2',this.STableW+20+100);
          line.setAttribute('y2',26+this.STableH);
          line.setAttribute('stroke','#000');
          SvgElement.appendChild(line);
        },
        setCanvasSize:function(){
          var svgBoxEl=this.$refs.SvgCont;
          var SvgElement=this.$refs.svgEl;
          var can_Cw=svgBoxEl.offsetWidth;
          var can_Ch=svgBoxEl.offsetHeight;
          SvgElement.setAttribute('width',can_Cw);
          SvgElement.setAttribute('height',can_Ch);
          this.can_w=can_Cw;
          this.can_h=can_Ch-15;
          this.topH=(this.$refs.topHead).offsetHeight;
          this.STableW=can_Cw-200-20;
          this.STableH=can_Ch-15-this.topH;
        }
    }
  };
</script>

<style lang="scss">
  .nusC01{
      .form_item{
          display:inline-block;
          padding:20px 8px 20px;
          width:305px;
      }
    .DivContainer {
      /*width: 1580px;*/
      width:100%;
      padding: 20px;
      .pdf_title {
        padding: 10px 1px 24px 1px;
        text-align: center;
        font-size: 16px;
        font-weight: bold;
      }
      .title_box {
        width: 100%;
        padding-bottom: 15px;
      }

      .title_box .line_box {
        display: inline-block;
        width: 15%;
        white-space: nowrap;
      }

      .title_box .line_box.mw {
        width: 7.5%;
      }

      .title_box .line_box .label {
        display: inline-block;
        padding-left: 5px;
        padding-right: 10px;
        font-weight: bold;
      }

      .title_box .line_box .unline {
        text-decoration: underline;
      }

      .relative {
        position: relative;
        top: 0;
        left: 0;
      }

      .relative:after {
        content: "";
        width: 100%;
        clear: both;
        zoom: 1;
      }

      .relative .leftHeader {
        position: absolute;
        left: 0;
        top: 0;
        width: 245px;
        height:342px;
      }
      .relative .leftHeader>div{
        position:relative;
        width:100%;
      }
      .relative .leftHeader .border_Content{
        border:solid #000 1px;
      }
      .relative .rightCont {
        position: relative;
        margin-left: 247px;
        margin-right:2px;
        height: 100%;
        border:solid #000 1px;
        border-left: none;
      }

      .relative .leftHeader .tr {
        display: block;
        padding: 2px 0 2px;
        overflow: hidden;
      }
      .relative .leftHeader .tr.border_bottom{
        border-bottom:solid #000 1px;
        padding: 2px 0 1px;
      }
      .relative .leftHeader .tr::after{
        content:" ";
        width:100%;
        clear:both;
        zoom:1;
      }
      .relative .leftHeader .tr .td {
        display: inline-block;
        height: 22px;
        line-height: 22px;
        float:left;
        text-align: center;
      }
      #table01{
        width:100%;
        border:solid #000 1px;
      }
      #table01 tr td{
        min-height:20px;
        text-align:center;
        height: 20px;
        font-size:14px;
        vertical-align: middle
      }
      #table01 td.w20{
        width:20px;
      }
      #table01 td.w225{
        width:225px;
      }
      #table01 td.Lw200{
        width:200px;
      }
      #table01 td.Lw70{
        width:70px;
        font-size: 12px;
      }
      #table01 td.w130{
        width:130px;
        font-size: 12px;
      }
      #table01 tr+tr{
          border-top:solid #000 1px;
      }
      #table01 tr td+td{
        border-left:solid #000 1px;
      }
      .relative .leftHeader .tr .td.td.w1 {
          width: 16%;
      }

      .relative .leftHeader .tr .td.td.w2 {
          width:42%;
      }
    }
  }
</style>
<style>
  @media screen and (min-width:1750px) {
    .nusC01 #table01 td .tdiv{
        min-width: 43.8px;
    }
  }
  @media screen and (min-width:1501px) and (max-width:1750px){
      .nusC01 #table01 td .tdiv{
          min-width:35px;
      }
  }
  @media screen and (max-width:1500px) {
      .nusC01 #table01 td .tdiv{
          min-width:25px;
      }
  }
</style>

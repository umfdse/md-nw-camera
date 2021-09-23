<template>
  <div class="fillcontain_longAdvice">
    <div class="search_container searchArea">
      <el-form
        :inline="true"
        ref="search_data"
        class="demo-form-inline search-form"
        @submit.native.prevent
      >
       <el-form-item class="btnRight">
          <el-button  @click="reset()">重置</el-button>
        </el-form-item>
        <!-- <el-form-item class="btnRight">
           <el-select v-model="doctorAdvice">
            <el-option
              v-for="item in doctorAdvices"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item> -->
         <el-form-item class="btnRight">
           <el-select v-model="option" @change="changgeStatus()" clearable>
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
          <el-form-item class="btnRight">
           <el-select v-model="adType" @change="changgeAdTypes()" clearable>
            <el-option
              v-for="item in adTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
          <el-form-item class="btnRight">
            <el-input v-model="adName" placeholder="请输入医嘱内容搜索">
            <i
              class="el-icon-search searchIcon"
              slot="suffix"
              @click="searchName">
            </i>
          </el-input>
        </el-form-item>
          <el-form-item class="btnRight">
          <el-date-picker v-model="searchTime" @change="changeDate()" type="date" placeholder="选择日期" class="inputInner" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
         <el-form-item class="btnLeft">
           <el-button type="primary" @click="start()" v-has="`advice:run`">开始执行</el-button>
        </el-form-item>
         <el-form-item class="btnLeft">
           <el-button  @click="synchro()">刷新</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table_container">
      <el-table v-loading="loading" :data="tableData" style="width: 100%"   ref="multipleTable" tooltip-effect="dark" @selection-change="handleSelectionChange" >
          <div slot="empty" class="noData"></div>
        <el-table-column type="selection" :selectable='checkboxInit' width="55"></el-table-column>
        <el-table-column prop="orderNo" label="组号" ></el-table-column>
         <el-table-column prop="orderClass" label="医嘱类型"  >
             <template slot-scope="scope">
              <span v-if="scope.row.orderClass == 1">饮食</span>
              <span v-else-if="scope.row.orderClass == 2">护理</span>
               <span v-else-if="scope.row.orderClass == 3">药物</span>
                <span v-else-if="scope.row.orderClass == 4">治疗</span>
                <span v-else-if="scope.row.orderClass == 5">嘱托</span>
              <span v-else-if="scope.row.orderClass == 6">检验</span>
               <span v-else-if="scope.row.orderClass == 7">检查</span>
            </template>
        </el-table-column>
        <el-table-column prop="orderText" label="医嘱内容" ></el-table-column>
         <el-table-column prop="administration" label="执行方法" >
            <template slot-scope="scope">
              <span v-if="scope.row.administration == 1">口服</span>
              <span v-else-if="scope.row.administration == 2">静脉</span>
               <span v-else-if="scope.row.administration == 3">泵入</span>
                <span v-else-if="scope.row.administration == 4">皮下注射</span>
                <span v-else-if="scope.row.administration == 5">停用</span>
              <span v-else-if="scope.row.administration == 6">肌肉注射</span>
               <span v-else-if="scope.row.administration == 7">雾化</span>
                <span v-else-if="scope.row.administration == 8">直肠给药</span>
                 <span v-else-if="scope.row.administration == 9">关节腔给药</span>
                  <span v-else-if="scope.row.administration == 10">引道给药</span>
              <!-- <span v-else>未知</span> -->
            </template>
         </el-table-column>
          <el-table-column prop="frequencyId" label="执行频次" ></el-table-column>
            <el-table-column prop="dunci" label="顿次" ></el-table-column>
        <el-table-column prop="dose" label="医嘱剂量" ></el-table-column>
         <el-table-column prop="totalDose" label="当前入量" ></el-table-column>
       
        <!-- <el-table-column prop="frequencyId" label="使用频次" ></el-table-column> -->
        <el-table-column prop="orderStatus" label="医嘱状态" >
          <template slot-scope="scope">
                <span v-if="scope.row.orderStatus == 1"><span class="orderOne orderI"></span>转抄</span>
              <span v-else-if="scope.row.orderStatus == 2"><span class="orderTwo orderI"></span>停止</span>
               <span v-else-if="scope.row.orderStatus == 3"><span class="orderThree orderI"></span>确认</span>
                <span v-else-if="scope.row.orderStatus == 4"><span class="orderFour orderI"></span>已执行</span>
                <span v-else-if="scope.row.orderStatus == 5"><span class="orderFive orderI"></span>执行中</span>
              <span v-else-if="scope.row.orderStatus == 6"><span class="orderSix orderI"></span>暂停</span>
               <span v-else-if="scope.row.orderStatus == 7"><span class="orderSeven orderI"></span>废弃</span>
                <span v-else-if="scope.row.orderStatus == 8"><span class="orderEight orderI"></span>作废</span>
              <!-- <span v-else></span> -->
            </template>
        </el-table-column>
        
         <el-table-column prop="startTime" label="开始时间"  width="180"></el-table-column>
         <el-table-column prop="endTime" label="停止时间"   width="180"></el-table-column>
          <!-- <el-table-column prop="executeTime" label="执行时间"  width="180"></el-table-column> -->
           <el-table-column prop="orderDoctorName" label="执行人" ></el-table-column>
         <!-- <el-table-column prop="remark" label="备注" ></el-table-column> -->
        <el-table-column prop="operation"  label="操作" width="180">
          <template slot-scope="scope">
             <el-button
              type="text"
              size="mini"
              @click="stop(scope.row,scope.$index)"
              :disabled="scope.row.orderStatus!=5||!(scope.row.administration==1||scope.row.administration==2||scope.row.administration==3)"
              v-if="scope.row.orderNo?true:false"
              v-has="`advice:run`"
            >暂停</el-button>
            <el-button v-has="`advice:run`" type="text"  size="mini" @click="onEdit(scope.row)" v-if="scope.row.orderNo?true:false" :disabled="scope.row.orderStatus!=5||!(scope.row.administration==1||scope.row.administration==2||scope.row.administration==3)">修改</el-button>
            <el-button
            v-has="`advice:run`"
              type="text"
              size="mini"
              @click="onDelete(scope.row,scope.$index)"
              :disabled="scope.row.orderStatus==4||scope.row.orderStatus==7||scope.row.orderStatus==8||scope.row.administration!=2"
              v-if="scope.row.orderNo?true:false"
            >作废</el-button>
              <el-button
              type="text"
              size="mini"
              @click="onPrint(scope.row)"
               v-if="scope.row.orderNo?true:false"
            >打印</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :pageTotal="pageTotal"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
      ></pagination>
      <el-dialog
        :visible.sync="isPrintVisible"
        title="打印预览"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :modal-append-to-body="false"
        width="400px"
        top="18vh"
      >
        <div class="form_userAdd">
          <el-form
            ref="form"
            :model="form"
            :rules="rules"
            :label-width="dialog.formLabelWidth"
            width="360px"
            top="18vh"
            style="margin: 10px; width: auto"
          >
          <section ref="print">
          <div  id="printTest" class="printTest" page-break-before:always>
            <div class="printTop" style=" display: flex;border-bottom: 1px solid #666; line-height: 20px;">
              <div class="printTopLeft" style="flex:1;">
                <p style="font-size:10px">{{patientInfo.record.sourceDept}}</p>
                <p style="font-size:10px">{{patientInfo.name}}</p>
                <p style="font-size:10px">{{patientInfo.birthday}}</p>
                <p>
                  <span style="font-size:10px">{{patientInfo.age}}</span>
                  <span style="font-size:10px">
                    <!-- {{patientInfo.sex}} -->
     
                    <span v-if="patientInfo.sex == 1">男</span>
                    <span v-else-if="patientInfo.sex == 2">女</span>
                  <!-- <span v-else></span> -->
                  </span>
                </p>
              </div>
              <div class="printTopCenter" style="flex:1;">
                <div class="qrcode" ref="qrCodeUrl" id="qrcode" style="padding-top:10px">
                  <img src="" alt="" style=" display: inline-block;  width: 80px; height: 80px; background-color: #fff; box-sizing: border-box;">
                </div>
              </div>
              <div class="printTopRight"  style="flex:1;">
                  <p style="font-size:10px">{{patientInfo.record.inhosDate}}</p>
                  <p style="font-size:10px">bed床号:{{patientInfo.record.bedNo}}</p>
                  <p style="font-size:10px"> 
                    <span v-if="orderType == 1">长期</span>
                    <span v-else-if="orderType == 2">临时</span>
                    </p>
                  <p style="font-size:10px">住院号：{{patientInfo.record.inhosNum}}</p>
              </div>
            </div>
           <div class="containerTitle" style=" border-bottom: 1px solid #666; line-height: 20px;">
             <span style="display:inline-block;width:50%;font-size:10px">医嘱内容</span>
             <!-- <span style="display:inline-block;width:10%;font-size:10px">规格</span> -->
             <!-- <span style="display:inline-block;width:10%">数量</span> -->
             <span style="display:inline-block;width:10%;font-size:10px">剂量</span>
           </div>
           <div class="container" style=" border-bottom: 1px solid #666;font-size:10px; line-height: 20px;">
             <div v-for="(item,index) in dataList" :key="index">
                <span style="display:inline-block;width:50%;font-size:10px">{{item.orderText}}{{item.specification}}</span>
                <!-- <span style="display:inline-block;width:10%;font-size:10px">{{item.specification}}</span> -->
                <!-- <span style="display:inline-block;width:10%">{{}}</span> -->
                <span style="display:inline-block;width:20%;font-size:10px">{{item.dose}}{{item.doseUnit}}</span>
             </div>
           </div>
           <div class="footerContent" style=" display: flex;">
              <div class="footerLeft" style="flex:1">
                <p style="font-size:10px">拆分时间:{{executeTime}}</p>
                <p> 
                  <span v-if="administration == 1" style="font-size:10px">口服<span style="font-size:10px">{{frequencyId}}</span></span>
                  <span v-else-if="administration == 2" style="font-size:10px">静脉<span style="font-size:10px">{{frequencyId}}</span></span>
                  <span v-else-if="administration == 3" style="font-size:10px">泵入<span style="font-size:10px">{{frequencyId}}</span></span>
                    <span v-else-if="administration == 4" style="font-size:10px">皮下注射<span style="font-size:10px">{{frequencyId}}</span></span>
                    <span v-else-if="administration == 5" style="font-size:10px">停用<span style="font-size:10px">{{frequencyId}}</span></span>
                  <span v-else-if="administration == 6" style="font-size:10px">肌肉注射<span style="font-size:10px">{{frequencyId}}</span></span>
                  <span v-else-if="administration == 7" style="font-size:10px">雾化<span style="font-size:10px">{{frequencyId}}</span></span>
                    <span v-else-if="administration == 8" style="font-size:10px">直肠给药<span style="font-size:10px">{{frequencyId}}</span></span>
                    <span v-else-if="administration == 9" style="font-size:10px">关节腔给药<span style="font-size:10px">{{frequencyId}}</span></span>
                      <span v-else-if="administration == 10" style="font-size:10px">引道给药<span style="font-size:10px">{{frequencyId}}</span></span>
                  <!-- <span v-else></span> -->
              </p>
              </div>
              <!-- <div class="footerCenter" style="flex:1" >
                <span style="font-size:10px"> 频次:{{frequencyId}}</span>
              </div> -->
              <div class="footerRight" style="flex:1">
                   <!-- <div class="qrcode" ref="qrCodeUrlTwo" id="qrcodeTwo"></div> -->
                    <img id="barcode" style="display: inline-block;  width: 80px; height: 80px;" />
                 </div>
           </div>
          </div>
          </section>
            <!-- <el-form-item prop="username" label="执行时间:">
               <el-date-picker
               class="inputInner"
                    v-model="form.dateTime"
                    type="datetime"
                    placeholder="选择日期时间"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="rateValue" label="滴速设定:" v-if="isRateUnit">
              <el-input type="text" v-model="form.rateValue" class=" inputInneI inputInneII " placeholder="请输入" ></el-input>
               <el-select v-model="form.rateUnit"  placeholder="请选择" class="inputInneII">
                  <el-option
                    v-for="item in rateUnits"
                    :key="item.id"
                    :label="item.value"
                    :value="item.value"
                  >
                  </el-option>
              </el-select>
            </el-form-item> -->
           
            <el-form-item class="text_right">
              <el-button @click="isPrintVisible = false">取 消</el-button>
              <el-button type="primary" @click="isOnPrint()">确认打印</el-button>
              <!-- <button v-print="'#printTest'">确认打印</button> -->
            </el-form-item>
          </el-form>
        </div>
  </el-dialog>
      <el-dialog
        :visible.sync="isVisible"
        title="开始执行医嘱"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :modal-append-to-body="false"
        width="480px"
        top="18vh"
      >
        <div class="form_userAdd">
          <el-form
            ref="form"
            :model="form"
            :rules="rules"
            :label-width="dialog.formLabelWidth"
            width="480px"
            top="18vh"
            style="margin: 10px; width: auto"
          >
            <el-form-item prop="username" label="执行时间:">
               <el-date-picker
               class="inputInner"
                    v-model="form.dateTime"
                    type="datetime"
                    placeholder="选择日期时间"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="rateValue" label="滴速设定:" v-if="isRateUnit">
              <el-input type="text" v-model="form.rateValue" class=" inputInneI inputInneII " placeholder="请输入" ></el-input>
               <el-select v-model="form.rateUnit"  placeholder="请选择" class="inputInneII">
                  <el-option
                    v-for="item in rateUnits"
                    :key="item.id"
                    :label="item.keyValue"
                    :value="item.value"
                  >
                  </el-option>
              </el-select>
            </el-form-item>
           
            <el-form-item class="text_right">
              <el-button @click="isVisible = false">取 消</el-button>
              <el-button type="primary" @click="onSubmit('form')">提 交</el-button>
            </el-form-item>
          </el-form>
        </div>
  </el-dialog>
  <el-dialog
        :visible.sync="isVisibleEdit"
        title="开始执行医嘱"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :modal-append-to-body="false"
        width="480px"
        top="18vh"
      >
        <div class="form_userAdd">
          <el-form
            ref="form"
            :model="form"
            :rules="rules"
            :label-width="dialog.formLabelWidth"
            width="480px"
            top="18vh"
            style="margin: 10px; width: auto"
          >
            <el-form-item prop="username" label="执行时间:">
               <el-date-picker
               class="inputInner"
                    v-model="form.dateTime"
                    type="datetime"
                    placeholder="选择日期时间"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="rateValue" label="滴速设定:" v-if="isRateUnitEdit">
              <el-input type="text" v-model="form.rateValue" class=" inputInneI inputInneII " placeholder="请输入" ></el-input>
               <el-select v-model="form.rateUnit"  placeholder="请选择" class="inputInneII">
                  <el-option
                    v-for="item in rateUnits"
                    :key="item.id"
                    :label="item.keyValue"
                    :value="item.value"
                  >
                  </el-option>
              </el-select>
            </el-form-item>
           
            <el-form-item class="text_right">
              <el-button @click="isVisibleEdit = false">取 消</el-button>
              <el-button type="primary" @click="onSubmitEdit('form')">提 交</el-button>
            </el-form-item>
          </el-form>
        </div>
  </el-dialog>
    </div>
  </div>
</template>

<script>
// import AddFundDialog from "./alert/addFundDialog";
// import EditFundDialog from "./alert/editFundDialog";
import QRCode from 'qrcodejs2'
// import './date.js'
import JsBarcode from 'jsbarcode'
import Pagination from "@/components/pagination";
export default {
    props:{
          patientInfo:Object,
          // recordId:String,
      },
  // props: ['recordId'],
  components: {
    // AddFundDialog,
    // EditFundDialog,
    Pagination
  },

  // watch:{
  //   patientId(newValue,oldValue){
  //     if(newValue!=oldValue){
  //       this.loadData()
  //     }
  //   }
  // },
  data() {
    //  var checkRateValue = (rule, value, callback) => {
    //     let regName =/^[1-9]\d{0,1}(?:\.\d{1,2})?$/;
    //     if (value == "") {
    //       callback(new Error("滴速不能为空"));
    //     } else {
    //       if (!regName.test(value)) {
    //         callback(new Error("滴速由1-999数字组成包含两位小数"));
    //       }else{
    //         callback()
    //       }
    //     }
    // };
    return {
     multipleSelection: [],
     dataList:[],
     orderIds:[],
     orderNos:[],
     qrcode:null,
     qrcodeTwo:null,
     orderType:"",
     executeTime:"",
     administration:"",
     frequencyId:"",
      isVisible:false,
      isVisibleEdit:false,
      isPrintVisible:false,
      isRateUnit:true,
      isRateUnitEdit:true,
      dialog: {
        width: "400px",
        formLabelWidth: "120px",
      },
      rateUnits:[
        {id:"1",value:"ml/h",keyValue:"毫升/小时"},
        {id:"2",value:"dtt/min",keyValue:"滴/分"}
      ],
       form: {
        dateTime:"",
        rateValue:"",
        rateUnit:"",
      },
       rules: {
        // rateValue: [ { required: true, validator: checkRateValue,  trigger: "blur" }],
      },
     option:"",
    //  doctorAdvice:"",
      options:[
        {label:"全部执行情况",value:""},
        {label:"转抄",value:"1"},
         {label:"停止",value:"2"},
        {label:"确认",value:"3"},
        {label:"已执行",value:"4"},
        {label:"执行中",value:"5"},
         {label:"暂停",value:"6"},
        {label:"废弃",value:"7"},
        {label:"作废",value:"8"}
     ],
      adType:"",
     adTypes:[
        {label:"全部医嘱类型",value:""},
        {label:"饮食",value:"1"},
        {label:"护理",value:"2"},
        {label:"药物",value:"3"},
        {label:"治疗",value:"4"},
        {label:"嘱托",value:"5"},
        {label:"检验",value:"6"},
        {label:"检查",value:"7"},
     ],
     adName:"",   
     searchTime:"",      
    //  doctorAdvices:[
    //     {label:"全部医嘱",value:""},
    //     {label:"已执行",value:"2"},
    //     {label:"确认",value:"3"},
    //     {label:"作废",value:"4"}
    //  ],
    //   search_data: {
    //     dateTime: "",
    //     name: ""
    //   },
    //   rules: {
    //     name: [{ required: true, message: "请输入机械类型", trigger: "blur" }]
    //   },
      tableData: [],
      ids:[],
      tableHeight: 0,
      loading: true,
      isShow: false,
      isEditShow: false,
      qrCodeText:"",
      addFundDialog: {
        show: false,
        dialogRow: {}
      },
      editFundDialog: {
        show: false,
        dialogRow: {}
      },
      incomePayData: {
        page: 1,
        limit: 10,
        name: ""
      },
      pageTotal: 0,
      config :{
      interval:1, //间隔天数，间隔为整数

      runNow: false, //是否立即运行

      time: "23:59:59" //执行的时间点 时在0~23之间

      }
      // 用于列表查询
    };
  },
  created(){

  },
  mounted() {
    console.log(new Date().format("yyyy-MM"))
    console.log(this.patientInfo)
    console.log(this.patientInfo.record.recordId)
      this.option = this.options[0].value
      // this.doctorAdvice = this.doctorAdvices[0].label
    this.loadData();
    // this.timeoutFunc(this.config,this.synchro)
  },
  methods: {
    timeoutFunc(config, func) {
      console.log(config,func)
    //   config.runNow && func()

      let nowTime = new Date().getTime()

      let timePoints = config.time.split(':').map(i => parseInt(i))

      let recent = new Date().setHours(...timePoints)

      recent >= nowTime || (recent += 24 * 3600000 )

      setTimeout(() => {
         func()

         setInterval(func, config.interval * 3600000 )

      }, recent - nowTime)

    },
    creatQrCode(row) {
        this.qrcode = new QRCode(this.$refs.qrCodeUrl, {
            text: String(this.patientInfo.record.recordId), // 需要转换为二维码的内容
            width: 80,
            height: 80,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        })
        console.log(this.qrcode)
    },
    creatQrCodeTwo(row) {
      let text = this.patientInfo.record.recordId+"_"+row.orderNo
        this.qrcodeTwo = new QRCode(this.$refs.qrCodeUrlTwo, {
            text: text, // 需要转换为二维码的内容
            width: 100,
            height: 50,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        })
    },
    onPrint(row){
      console.log(row)
      let text = this.patientInfo.record.recordId+"_"+row.orderNo
       this.qrCodeText = text
      this.dataList=[]
      this.orderType = row.orderType
      this.executeTime = row.executeTime
      this.frequencyId = row.frequencyId
      this.administration = row.administration
        let that= this
      let params = {
        recordId:this.patientInfo.record.recordId,
        orderStatus:this.option,
        pageNum: this.incomePayData.page,
        pageSize: this.incomePayData.limit,
        orderType:"1"
      };
      let url = "/api/icu/advice/getSplitAdvicelist";
      this.$axios.post(global.url + url,params).then(function (res) {
        let arr = res.data.respData.list;
        if(arr.length){
          for(let i=0;i<arr.length;i++){
            if(row.orderNo==arr[i].orderNo){
              that.dataList.push(arr[i])
            }
            
          }
          that.isPrintVisible = true
          // that.creatQrCode(row);
          
        }
        console.log(that.dataList)
        that.$nextTick(function(){
          let dom = document.getElementById("qrcode")
          while(dom.firstChild){
            dom.removeChild(dom.firstChild)
          }
          // let domTwo = document.getElementById("qrcodeTwo")
          //  while(domTwo.firstChild){
          //   domTwo.removeChild(domTwo.firstChild)
          // }
           that.creatQrCode(row)
          //  that.creatQrCodeTwo(row)
          JsBarcode("#barcode", text);
        })
       
        // that.tableData = res.data.respData.list;
        // that.pageTotal = res.data.respData.total;
        // that.getSpanArr(that.tableData)
      });
     
      


    },
    isOnPrint(){
      var LODOP=getCLodop();
      // LODOP.SET_LICENSES(unescape("\u6606\u660e\u6613\u6781\u4fe1\u606f\u6280\u672f\u6709\u9650\u516c\u53f8"),"055716580837383919278901905623","","");
      LODOP.PRINT_INITA(0,0,"50mm",'80mm')
      LODOP.SET_PRINT_PAGESIZE(1, "58mm",'80mm', "病患药嘱打印");
      // LODOP.SET_PRINT_STYLEA(0,"GroundColor","#000000");
      LODOP.SET_PRINT_STYLE("FontSize",8);
       LODOP.NewPage();
      // LODOP.SET_PRINT_MODE("PRINT_PAGE_PERCENT","Full-Page");//整页缩放
      // LODOP.SET_PRINT_MODE("FULL_WIDTH_FOR_OVERFLOW",true);
      // LODOP.SET_PRINT_MODE("FULL_HEIGHT_FOR_OVERFLOW",true);
      // LODOP.SET_PRINT_STYLE("Bold",1);
      // LODOP.SET_PRINT_STYLE("Alignment",2);
      // var newstrOne = document.getElementsByClassName('printTopLeft')[0].innerHTML
      // LODOP.ADD_PRINT_TEXT('1mm','1mm','20mm','20mm',newstrOne);
      //  var newstrTwo = document.getElementsByClassName('printTopCenter')[0].innerHTML
      //    LODOP.ADD_PRINT_TEXT('1mm','20mm','20mm','20mm',newstrTwo);
      // var newstr = document.getElementsByClassName('printTest')[0].innerHTML
      // LODOP.ADD_PRINT_HTML(1,10,300,380,newstr)
       LODOP.ADD_PRINT_TEXT(10,5,80,20,this.patientInfo.record.sourceDept);
       LODOP.ADD_PRINT_TEXT(25,5,80,20,this.patientInfo.name);
        LODOP.ADD_PRINT_TEXT(40,5,80,20,this.patientInfo.birthday);
         LODOP.ADD_PRINT_TEXT(70,5,80,20,this.patientInfo.age+"岁");
        LODOP.ADD_PRINT_TEXT(70,30,80,20,this.patientInfo.sex==1?"男":"女");
        LODOP.ADD_PRINT_BARCODE(15,70,70,70,"QRCode",this.patientInfo.record.recordId)
          LODOP.ADD_PRINT_TEXT(10,145,130,20,new Date(this.patientInfo.record.inhosDate).format("yyyy-MM-dd"));
            LODOP.ADD_PRINT_TEXT(28,145,100,20,'bed床号:'+this.patientInfo.record.bedNo);
              LODOP.ADD_PRINT_TEXT(46,145,100,20,this.orderType=="1"?"长期":"临时");
                LODOP.ADD_PRINT_TEXT(70,145,100,20,'住院号:'+this.patientInfo.record.inhosNum);
                 LODOP.ADD_PRINT_LINE(90,0,90,'54mm','1mm',1);
                  LODOP.ADD_PRINT_TEXT(100,5,100,20,"药品名称");
                    LODOP.ADD_PRINT_TEXT(100,90,100,20,"规格");
                      LODOP.ADD_PRINT_TEXT(100,150,100,20,"用量");
                       LODOP.ADD_PRINT_LINE(120,0,120,'54mm','1mm',1);
                       for(var i=0;i<this.dataList.length;i++){
                         LODOP.ADD_PRINT_TEXT(130+i*15,5,100,20,this.dataList[i].orderText);
                          LODOP.ADD_PRINT_TEXT(130+i*15,90,100,20,this.dataList[i].specification);
                           LODOP.ADD_PRINT_TEXT(130+i*15,150,100,20,this.dataList[i].dose+this.dataList[i].doseUnit);
                          

                       }
                         LODOP.ADD_PRINT_LINE(130+i*15+3,5,130+i*15+3,'54mm','1mm',1);
                          LODOP.ADD_PRINT_TEXT(155+i*15,5,100,20,'拆分时间:'+this.executeTime);
                          var administration;
                          if(this.administration==1){              
                            administration="口服"
                          }else if(this.administration==2){
                             administration="静脉"
                          }
                          else if(this.administration==3){
                              administration="泵入"
                            }
                             else if(this.administration==4){
                              administration="皮下注射"
                            }
                             else if(this.administration==5){
                              administration="停用"
                            }
                             else if(this.administration==6){
                              administration="肌肉注射"
                            }
                             else if(this.administration==7){
                              administration="雾化"
                            }
                             else if(this.administration==8){
                              administration="直肠给药"
                            }
                             else if(this.administration==9){
                              administration="关节腔给药"
                            }
                             else if(this.administration==10){
                              administration="引道给药"
                            }
                          //  LODOP.ADD_PRINT_TEXT(175+i*15,10,100,20,'拆分时间:'+this.executeTime);
                            LODOP.ADD_PRINT_TEXT(190+i*15,5,100,20,administration+this.frequencyId);
                             LODOP.ADD_PRINT_BARCODE(160+i*15,110,90,60,"128A",this.qrCodeText)
                            
      LODOP.PREVIEWA()
      //  window.get().setResizable(true);
      //   // 打开时最大化窗口
      //   window.get().maximize();
        // var newstr = document.getElementsByClassName('printTest')[0].innerHTML
        // var oldstr = document.body.innerHTML
        // window.document.body.innerHTML = newstr
        //  window.document.body.style.width = '239mm' // 打印内容A4纸高度
        // window.document.body.style.height = '300mm' // 打印内容A4纸高度
        // window.print()
        // document.body.innerHTML = oldstr
      // this.$print(this.$refs.print)
    // global.printLoop()
      //  this.$message.warning("请功能暂未开放！")
    },
    onEdit(row) {
      if(row.administration!=2){
        this.isRateUnitEdit = false
      }else{
        this.isRateUnitEdit = true
      }
      this.isVisibleEdit = true
      this.form.dateTime = new Date().format("yyyy-MM-dd hh:mm:ss")
      this.form.rateValue = row.speed
      this.form.rateUnit = row.speedUnit
      this.orderNos=[row.orderNo]
    },
    start(){
      if(this.multipleSelection.length>0){
        for(let i=0;i<this.multipleSelection.length;i++){
          if(this.multipleSelection[i].administration!=2){
            this.isRateUnit = false
          }else{
             this.isRateUnit = true
          }
        }
         this.isVisible = true
        this.form.dateTime=new Date().format("yyyy-MM-dd hh:mm:ss")
        this.form.rateValue= 15
        this.form.rateUnit="dtt/min"
      }else{
        this.$message.error("请选择医嘱!")
      }
      
    },
     //暂停
    stop(row){
      this.$confirm("确认暂停该液体吗?", "提示", {
        type: "warning"
      }).then(()=>{
        this.orderNos=[]
      let url = "/api/icu/advice/pauseAdvice"
      // if(this.tableData.length>0){
      //   for(let i=0;i<this.tableData.length;i++){
      //     if(row.orderNo==this.tableData[i].orderNo){
      //       this.orderIds.push(this.tableData[i].id)
      //     }
      //   }
      // }
      this.orderNos=[row.orderNo]
      let params = {
        recordId:this.patientInfo.record.recordId,
        // executeTime:row.executeTime,
        orderNos:this.orderNos,
        // orderNo:row.orderNo,
        orderType:row.orderType,
        // pauseTime:row.pauseTime
      }
       this.$axios.post(global.url + url,params).then(response => {
            if (response.data.msg == 201) {
              this.$message({
                message: "暂停成功",
                type: "success"
              });
              this.loadData();
            } else {
             this.$message.error(response.data.content)
            }
          });
      })
      .catch(() => {});
    },
    // 废弃
    onDelete(row) {
      this.$confirm("确认作废该液体吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.orderNos=[]
          let url = "/api/icu/advice/discard"
          // if(this.tableData.length>0){
          //   for(let i=0;i<this.tableData.length;i++){
          //     if(row.orderNo==this.tableData[i].orderNo){
          //       this.orderIds.push(this.tableData[i].id)
          //     }
          //   }
          // }
           this.orderNos=[row.orderNo]
          let params = {
            // executeTime:row.executeTime,
            // orderIds:this.orderIds,
            orderNos:this.orderNos,
            // orderNo:row.orderNo,
            orderType:row.orderType,
            recordId:this.patientInfo.record.recordId
          }
          this.$axios.post(global.url+url,params).then((res)=>{
            if(res.data.msg==201){
               this.$message({
                message: "作废成功",
                type: "success"
              });
               this.loadData();
            }else{
              this.$message.error(res.data.content)
            }
          })
        })
        .catch(() => {});
    },
     checkboxInit(row,index){
        if ((row.orderStatus==3||row.orderStatus==6)&&row.orderNo) {//你需要判断的条件
          return 1;//可勾选
        }else{
          return 0;//不可勾选
        }
      },
      synchro(){
        // this.loadData()
        this.$confirm("确认刷新医嘱吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          let url="/api/icu/advice/updateOrderData"
          let params={}
          let that = this
          this.$axios.post(global.url+url,params).then((res)=>{
            if(res.data.msg==201){
                that.loadData()
            }
          })
        })
        .catch(() => {});
     
      },
    changgeStatus(){
        this.loadData()
      },
      changgeAdTypes(){
         this.loadData()
      },
      searchName(){
         this.loadData()
      },
      changeDate(){
         this.loadData()
      },
      onSubmit(){
         if(this.form.rateValue-1>=0 && this.form.rateValue-999<=0){
        this.orderNos=[]
          if(this.multipleSelection.length>0){
          for(let i=0;i<this.multipleSelection.length;i++){
            // for(var j=0;j<this.tableData.length;j++){
            //   if(this.multipleSelection[i].orderNo==this.tableData[j].orderNo){
            //     this.orderIds.push(this.tableData[j].id)
            //   }
            // }
            if(this.multipleSelection[i].orderNo){
              this.orderNos.push(this.multipleSelection[i].orderNo)
            }
           
           
           
            // this.orderIds.push(this.multipleSelection[i].id)
          }
          // for(let j=0;j<this.tableData.length;j++){
          //   for(let k=0;k<this.orderNos.length;k++){
          //     if(this.orderNos[k]==this.tableData[j].orderNo){
          //       this.orderIds.push(this.tableData[j].id)
          //     }
          //   }
          // } 
          // console.log(this.tableData)
          // console.log(this.orderNos)
          //  console.log(this.orderIds)
          //   return
        }else{
          this.$message.error("请选择医嘱！")
          return
        }
        this.$confirm("确认要执行医嘱吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          let params = { 
            recordId:this.patientInfo.record.recordId,//病患id
            executeTime:this.form.dateTime,
            orderType:"1",
            rateValue:this.form.rateValue,
            rateUnit:this.form.rateUnit,
            // orderIds:this.orderIds,//医嘱id
            orderNos:this.orderNos
            };
            console.log(params)
          let url = "/api/icu/advice/executeAdvice";
          this.$axios.post(global.url + url,params).then(response => {
            if (response.data.msg == 201) {
              this.$message({
                message: "执行成功",
                type: "success"
              });
              this.isVisible = false
              this.loadData();
            } else {
             this.$message.error(response.data.content)
            }
          });
        })
        .catch(() => {});
         }else{
           this.$message({
             type:"warning",
             message:"滴速为1-999之间的数字"
           })
         }
      },
      onSubmitEdit(){ 
    if(this.form.rateValue-1>=0 && this.form.rateValue-999<=0){
         this.$confirm("确认要执行医嘱吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          let params = { 
            recordId:this.patientInfo.record.recordId,//病患id
            executeTime:this.form.dateTime,
            orderType:"1",
            rateValue:this.form.rateValue,
            rateUnit:this.form.rateUnit,
            // orderIds:this.orderIds,//医嘱id
            orderNos:this.orderNos
            };
            console.log(params)
          let url = "/api/icu/advice/updateAdvice";
          this.$axios.post(global.url + url,params).then(response => {
            if (response.data.msg == 201) {
              this.$message({
                message: "执行成功",
                type: "success"
              });
              this.isVisibleEdit = false
              this.loadData();
            } else {
             this.$message.error(response.data.content)
            }
          });
        })
        .catch(() => {});
         }else{
           this.$message({
             type:"warning",
             message:"滴速为1-999之间的数字"
           })
         }
      },
    reset(){
      this.option=""
      this.adType = ""
      this.adName = ""
      this.searchTime = ""
      this.loadData()
    },
    onScreeoutMoney(searchForm) {
      this.$refs[searchForm].validate(valid => {
        if (valid) {
          this.loadData();
        }
      });
    },
     handleSelectionChange(val) {
        this.multipleSelection = val;
        console.log(this.multipleSelection)
      },
    setTableHeight() {
      this.$nextTick(() => {
        this.tableHeight = document.body.clientHeight - 300;
      });
    },
    // 获取列表数据
    loadData() {
       this.loading = false;
      let that= this
      let params = {
        recordId:this.patientInfo.record.recordId,
        orderStatus:this.option,
        orderClass:this.adType,
        orderText:this.adName,
        planExecuteDate:this.searchTime||"",
        pageNum: this.incomePayData.page,
        pageSize: this.incomePayData.limit,
        orderType:"1"
      };
      let url = "/api/icu/advice/getSplitAdvicelist";
      this.$axios.post(global.url + url,params).then(function (res) {
        let arr = res.data.respData.list;
        if(arr.length){
          for(let i=0;i<arr.length;i++){
            // if(arr[i].orderStatus==1){
            //   arr[i].orderStatus="转抄"
            // }else if(arr[i].orderStatus==2){
            //   arr[i].orderStatus="停止"
            // }
            // else if(arr[i].orderStatus==3){
            //   arr[i].orderStatus="确认"
            // }
            // else if(arr[i].orderStatus==4){
            //   arr[i].orderStatus="执行"
            // }
            for(var j=i+1;j<arr.length;j++){
              if(arr[i].orderNo==arr[j].orderNo){
                arr[j].orderNo=""
              }
            }
          }
          
        }
        that.tableData = res.data.respData.list;
        that.pageTotal = res.data.respData.total;
        // that.getSpanArr(that.tableData)
      });

    },
    // getSpanArr(data) {
    //       // data就是我们从后台拿到的数据
    //     for (var i = 0; i < data.length; i++) {
    //       if (i === 0) {
    //         this.spanArr.push(1);
    //         this.pos = 0;
    //       } else {
    //         // 判断当前元素与上一个元素是否相同
    //         if (data[i].orderNo === data[i - 1].orderNo) {
    //           this.spanArr[this.pos] += 1;
    //           this.spanArr.push(0);
    //         } else {
    //           this.spanArr.push(1);
    //           this.pos = i;
    //         }
    //       }
    //       console.log(this.spanArr);
    //     }
    //   },
    //   objectSpanMethod({ row, column, rowIndex, columnIndex }) {
    //     if (columnIndex === 0 ) {
    //       const _row = this.spanArr[rowIndex];
    //       const _col = _row > 0 ? 1 : 0;
    //       console.log(`rowspan:${_row} colspan:${_col}`);
    //       return {
    //         // [0,0] 表示这一行不显示， [2,1]表示行的合并数
    //         rowspan: _row,
    //         colspan: _col
    //       };
    //     }
    //   },
    hideAddFundDialog(){
        this.addFundDialog.show = false;
    },
    hideEditFundDialog() {
      this.editFundDialog.show = false;
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
  }
};
</script>

<style lang="scss">
.fillcontain_longAdvice{
  width: 100%;
  height: 100%;
  // padding:10px;
.table_container {
  padding: 20px;
  /* background: #fff; */
  border-radius: 2px;
}
.el-dialog--small {
  width: 600px !important;
}
.pagination {
  text-align: right;
  margin-top: 10px;
}
.search_container {
  position: relative;
  width:100%;
  height: 32px;
  // height:60px;
  /* margin-bottom: 20px; */
}
.btnLeft {
  float: left;
  margin-left: 10px !important;
   margin-top:10px;
  /* margin-bottom:20px; */
}
.btnRight{
  float: right;
   margin-top:10px;
  margin-right:30px !important
}
.el-input__inner{
  background-color: #fff;
}
.searchArea {
  background: rgba(255, 255, 255, 1);
  border-radius: 2px;
}
.noData {
            margin: 0 auto;
            background-image: url("/static/img/noData_table.png");
            width: 234px;
            height: 224px;
            background-size: 100%;
            background-repeat: no-repeat;
            padding: 0;
            margin-top: 50px;
    }
    .inputInner{
    width:224px!important
  }
  .inputInneI{
    padding-right:10px;
  }
  .inputInneII{
    display: inline-block;
    width:105px!important
  }
  .orderI{
     display: inline-block;
      width: 8px;
      height: 8px;
       border-radius: 50%;
      margin-right:3px;
  }
    .orderOne{
      background-color: #1374E4;
    }
    .orderTwo{
      background-color: #FA3039;
    }
    .orderThree{
      background-color: #F9B344;
    }
    .orderFour{
      background-color: #00B628;
    }
     .orderFive{
      background-color: #64DE7E;
    }
     .orderSix{
      background-color: #BFBFBF;
    }
     .orderSeven{
      background-color: #9254DE;
    }
     .orderEight{
      background-color: #FA3039;
    }
    .printTop{
      display: flex;
      line-height: 20px;
      border-bottom: 1px solid #666;
    }
    .printTopLeft{
      flex:1;
    }
    .printTopCenter{
      flex:1;
    }
    .qrcode{
      display: inline-block;
      img {
          width: 80px;
          height: 80px;
          background-color: #fff; //设置白色背景色
          padding: 6px; // 利用padding的特性，挤出白边
          box-sizing: border-box;
      }
    }
    .printTopRight{
      flex:1;
    }
    .containerTitle{
      line-height: 20px;
       border-bottom: 1px solid #666;
    }
    .container{
      line-height: 20px;
       border-bottom: 1px solid #666;
    }
    .footerContent{
       display: flex;
      line-height: 20px;
    }
    .footerLeft{
      flex:2;
    }
    .footerCenter{
      flex:1;
    }
    .footerRight{
      flex:1;
      #barcode{
        width: 80px!important;
        height: 80px!important;
      }
    }
}
</style>



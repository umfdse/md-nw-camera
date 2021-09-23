<template>
  <div class="ecgMonitoringWrapper">
    <div class="top">
      <div class="topItem">
        <div class="itemBg">
          <div class="title">血氧浓度</div>
          <div class="num">
            <span class="count">{{deviceData[3000]}}</span>
            <span class="unit">%</span>
          </div>
        </div>
      </div>
      <div class="topItem">
        <div class="itemBg">
          <div class="title">心率</div>
          <div class="num">
            <span class="count">{{deviceData[3001]}}</span>
            <span class="unit">/min</span>
          </div>
        </div>
      </div>
      <div class="topItem">
        <div class="itemBg">
          <div class="title">nbp平均值</div>
          <div class="num">
            <span class="count">{{deviceData[3002]}}</span>
            <span class="unit">mmhg</span>
          </div>
        </div>
      </div>
      <div class="topItem">
        <div class="itemBg">
          <div class="title">呼吸频率</div>
          <div class="num">
            <span class="count">{{deviceData[3008]}}</span>
            <span class="unit">/min</span>
          </div>
        </div>
      </div>
      <div class="topItem">
        <div class="itemBg">
          <div class="title">体温</div>
          <div class="num">
            <span class="count">{{deviceData[3009]}}</span>
            <span class="unit">℃</span>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="left">
        <div class="bottomItem">
          <div class="title">nbp高值</div>
          <div class="num">
            <span class="count">{{deviceData[3003]}}</span>
            <span class="unit">mmhg</span>
          </div>
        </div>
        <div class="bottomItem">
          <div class="title">nbp低值</div>
          <div class="num">
            <span class="count">{{deviceData[3004]}}</span>
            <span class="unit">mmhg</span>
          </div>
        </div>
        <div class="bottomItem">
          <div class="title">cvp</div>
          <div class="num">
            <span class="count">{{deviceData[3010]}}</span>
            <span class="unit">/</span>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="bottomItem">
          <div class="title">有创血压平均值</div>
          <div class="num">
            <span class="count">{{deviceData[3005]}}</span>
            <span class="unit">mmhg</span>
          </div>
        </div>
        <div class="bottomItem">
          <div class="title">有创血压高值</div>
          <div class="num">
            <span class="count">{{deviceData[3006]}}</span>
            <span class="unit">mmhg</span>
          </div>
        </div>
        <div class="bottomItem">
          <div class="title">有创血压低值</div>
          <div class="num">
            <span class="count">{{deviceData[3007]}}</span>
            <span class="unit">mmhg</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {saveSessionData, getSessionData, removeSessionData} from "@/utils/SimpleSessionStorageService.js";
  export default {
    name: "ecgMonitoring",
    props: ['patientInfo'],
    data(){
      return{
        pagination: false,
        isEdit: false,
        hospitalCode:'',
        deviceData: {
          3000: '',//血氧浓度
          3001: '', //心率
          3002: '', //nbp平均值
          3008: '', //呼吸频率
          3009: '',//体温
          3003: '', //nbp高值
          3004: '', //nbp低值
          3010: '', //cvp,
          3005: '', //有创血压平均值,
          3006: '', //有创血压高值
          3007: '', //有创血压低值
        }
      }
    },
    mounted(){
      this.hospitalCode = getSessionData('hospitalCode')
      this.initData()
      // 轮询后台接口, 实时同步数据
      let _this = this
      if(this.timer){
        clearInterval(this.timer)
      }else {
        this.timer = setInterval(()=>{
          _this.initData()
        },5000)
      }
    },
    beforeRouterLeave(){

    },
    beforeRouteLeave(to, from, next){
      clearInterval(this.timer)
      next()
    },
    beforeDestroy(){
      clearInterval(this.timer)
    },
    methods:{
      initData(){
        this.getDeviceData()
      },
      getDeviceData(){
        let _this = this
        //清空数据
        for (let key in this.deviceData) {
          _this.deviceData[key]= ''
        }
        let param = {
          "bedNo": this.patientInfo.record.bedNo,
          "hospitalCode": this.hospitalCode,
          "recordId": this.patientInfo.record.recordId,
          "type": 2 //1.呼吸机，2.监护仪，3.CRRT
        }
        this.$axios({
          url: global.url + '/patient/check/list',
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          data: param
        }).then((response) => {
          var data = response.data
          if (data.msg == 201) {
            if (data.respData) {
              for (let key in this.deviceData) {
                data.respData.forEach(item => {
                  if(key == item.itemAddr) {
                    _this.deviceData[key]= item.itemValue
                  }
                })
              }
            }
          }
        });
      }
    }
  }
</script>

<style scoped lang="scss">
  .ecgMonitoringWrapper{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .top{
      flex: 1;
      display: flex;
      .topItem{
        flex: 1;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        padding:32px 20px;
        .itemBg{
          width: 100px;
          height: 100px;
          background-image: url("/static/img/device_hexagon_ecg.png");
          background-size:100% 100%;
          background-repeat: no-repeat;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          .title{
            color: #46E1EA;
            font-size: 14px;
          }
          .num{
            color: #46E1EA;
            padding-top: 20px;
            .count{
              font-size: 28px;
            }
            .unit{
              font-size: 14px;
            }
          }
        }
      }
    }
    .bottom{
      flex: 1;
      display: flex;
      padding: 0 32px;
      box-sizing: border-box;
      .left{
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content:  center;
        align-items:flex-start;
        .title{
          flex: 7;
          display: flex;
          justify-content: flex-start;
        }
        .num{
          flex: 3;
          display: flex;
          justify-content: flex-start;
        }
      }
      .right{
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items:flex-end;
        justify-content: center;
        .title{
          flex: 6;
          display: flex;
          justify-content: flex-start;
        }
        .num{
          flex: 4;
          display: flex;
          justify-content: flex-start;
        }
      }
      .bottomItem{
        width: 228px;
        height:32px;
        background-image: url("/static/img/device_rectangular.png");
        background-size:100% 100%;
        background-repeat: no-repeat;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        padding:0 16px;
        .title{
          font-size: 14px;
          color:#ffffff;
        }
        .num{
          color:#ffffff;
          .count{
            font-size: 20px;
          }
          .unit{
            font-size:12px;
            padding-top: 4px;
            padding-left: 2px;
          }
        }
      }
    }
  }
</style>

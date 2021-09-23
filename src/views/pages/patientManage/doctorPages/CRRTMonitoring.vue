<template>
    <div class="CRRTMonitoringWrapper">
      <div class="top">
        <div class="topItem">
          <div class="itemBg">
            <div class="title">吸气潮气量</div>
            <div class="num">
              <span class="count">30</span>
              <span class="unit">ml</span>
            </div>
          </div>
        </div>
        <div class="topItem">
          <div class="itemBg">
            <div class="title">呼气潮气量</div>
            <div class="num">
              <span class="count">45</span>
              <span class="unit">ml</span>
            </div>
          </div>
        </div>
        <div class="topItem">
          <div class="itemBg">
            <div class="title">呼吸频率</div>
            <div class="num">
              <span class="count">12</span>
              <span class="unit">bpm</span>
            </div>
          </div>
        </div>
        <div class="topItem">
          <div class="itemBg">
            <div class="title">吸气潮气量</div>
            <div class="num">
              <span class="count">60</span>
              <span class="unit">cmh2o</span>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="left">
          <div class="bottomItem">
            <div class="title">分钟呼吸气量潮气量</div>
            <div class="num">
              <span class="count">45</span>
              <span class="unit">ml</span>
            </div>
          </div>
          <div class="bottomItem">
            <div class="title">自主呼吸频率</div>
            <div class="num">
              <span class="count">45</span>
              <span class="unit">bpm</span>
            </div>
          </div>
          <div class="bottomItem">
            <div class="title">氧气输入口压力</div>
            <div class="num">
              <span class="count">45</span>
              <span class="unit">psi</span>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="bottomItem">
            <div class="title">降压</div>
            <div class="num">
              <span class="count">45</span>
              <span class="unit">cmh2o</span>
            </div>
          </div>
          <div class="bottomItem">
            <div class="title">平均压</div>
            <div class="num">
              <span class="count">66</span>
              <span class="unit">cmh2o</span>
            </div>
          </div>
          <div class="bottomItem">
            <div class="title">吸入氧气浓度</div>
            <div class="num">
              <span class="count">20</span>
              <span class="unit">%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import {saveSessionData, getSessionData, removeSessionData} from "@/utils/SimpleSessionStorageService.js";
    export default {
        name: "CRRTMonitoringWrapper",
        props: ['patientInfo'],
      data(){
          return{
            pagination: false,
            isEdit: false,
            hospitalCode:''
          }
      },
      mounted(){
        this.hospitalCode = getSessionData('hospitalCode')
      },
      methods:{
        initData(){
          this.getDeviceData()
        },
        getDeviceData(){
          let param = {
            "bedNo": this.patientInfo.record.bedNo,
            "deviceNo": "",
            "hospitalCode": this.hospitalCode,
            "recordId": this.patientInfo.record.recordId,
            "type": 1 //1.呼吸机，2.监护仪，3.CRRT
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

            } else {
              this.$message({
                message: data.content,
                type: 'warning'
              })
            }
          });
        },
      }
    }
</script>

<style scoped lang="scss">
  .CRRTMonitoringWrapper{
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
          width: 144px;
          height: 144px;
          background-image: url("/static/img/device_hexagon.png");
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

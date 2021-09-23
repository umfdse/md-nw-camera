<template>
  <div class="body-container">
    <div class="update-container" v-if="info==null && !jsonIsLoading">
      <h2>程序更新出错，获取更新版本失败!</h2>
      <p>未更新</p>
    </div>
    <div class="update-container" v-if="info!=null">
      <div class="up-title" v-if="info.version">新版本升级提醒 v{{info.version}}</div>
      <div class="align-center">
        <img class="font-img" src="/static/logo.png" alt="">
        <p class="font-tip">为了更好的使用体验，建议升级到最新版本</p>
        <p class="font-msg">更新说明：{{info.versionNote}}</p>
        <button type="button" class="update-btn" v-if="progress < 100" :disabled="progress >= 0 || !saveAsName"
                @click="showFileDialog">升级版本
        </button>
        <input type="file" class="hidden" ref="fileInput" :nwsaveas="saveAsName" @change="startDownload">
        <p class="font-red">*安装新版后需重启 {{info.appName}}</p>
      </div>
      <div class="progress-box">
        <p v-if="progress === -2">下载出错</p>
        <el-progress v-if="progress >= 0" class="up-progress" :text-inside="true" :stroke-width="26"
                     :percentage="progress"
                     :format="format"></el-progress>
        <div v-if="progress==100" class="up-tip">
          * 新版本已下载完成，如不能自动安装，请选择安装包手动安装!
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  // import {
  //   getUpdateJson,
  //   parseName,
  //   downloadHandle
  // } from '@/utils/update';
  import {
    getUpdateJson,
    parseName,
    downloadHandle
  } from '@/utils/updatev1';

  import {
    Shell,
    Window
  } from 'nw.gui';

  export default {
    name: 'update',
    data() {
      return {
        info: null,
        jsonIsLoading: true,
        progress: -1 // init: -1, error: -2
      };
    },
    computed: {
      saveAsName() {
        return parseName(this.info);
      }
    },

    methods: {
      format(percentage) {
        return percentage == 100 ? '下载完成' : `${percentage}%`;
      },
      showFileDialog(ev) {
        this.$refs.fileInput.click();
      },
      startDownload(ev) {
        const targetPath = ev.target.value;

        // reset
        ev.target.value = '';
        if (!targetPath.trim()) return;

        this.progress = 0;
        const file = downloadHandle(targetPath, this.info);

        file.on('data', num => {
          this.progress = Math.ceil(num * 100);
        });
        file.on('error', () => {
          this.progress = -2;
        });

        file.on('end', filePath => {
          this.progress = this.progress < 0 ? this.progress : 100;
          // open install file
          this.timerCount[0] = setTimeout(() => Shell.openExternal(filePath), 100);
        });
      }
    },
    created() {
      //尺寸还原至登录窗口大小
      Window.get().restore();
      console.log("-------Update.vue-created----------");
      getUpdateJson().catch(err => {
        console.log(err);
      }).then(json => {
        this.jsonIsLoading = false;
        if (json) {
          this.info = json;
        }
      });
    },
    beforeDestroy() {
      let _this = this;
      for (let i = 0; i <= _this.timerCount.length; i++) {
        clearTimeout(_this.timerCount[i]);//清空容器的所有计时器
      }
      _this.timerCount.splice(0, _this.timerCount.length)//清空容器
    }
  };

</script>
<style lang="scss" scoped>
  .body-container {
    padding: 20px;
    font-family: '微软雅黑', 'microsoft yahei', 'Source Sans Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif, '黑体', 'Avenir', Helvetica;

    .update-container {
      width: 100%;

      .up-title {
        font-size: 20px !important;
        color: #000;
        font-weight: 600;
      }

      .align-center {
        margin-top: 10px;
        text-align: center;

        p {
          line-height: 2;
          text-align: center;
        }

        .font-img {
          width: 138px;
        }

        .font-tip {
          font-size: 20px !important;
          color: #333;
        }

        .font-msg {
          font-size: 18px !important;
          color: #999;
        }

        .font-red {
          color: #F23C3C;
          font-size: 16px !important;
          font-weight: 600;
          margin-top: 5px;
          margin-bottom: 5px;
        }

        .update-btn {
          color: #fff;
          font-family: '微软雅黑', 'microsoft yahei', 'Source Sans Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif, '黑体', 'Avenir', Helvetica;
          font-size: 20px;
          letter-spacing: 2px;
          background: #1890FF;
          padding: 8px 35px;
          outline: none;
          border: 1px solid #1890FF;
          cursor: pointer;
          border-radius: 4px;
        }
      }

      .progress-box {
        width: 70%;
        margin: 0 auto;
      }

      .up-tip {
        text-align: center;
        margin-top: 15px;
        color: #F23C3C;
      }
    }

  }

  .hidden {
    display: none;
  }


  .update-btn:hover {
    opacity: 1;
  }

  .download-progress {
    margin: 20px 0;
  }

  .body-container {
    display: flex;
    height: 100%;
  }

</style>
<style lang="scss">
  .progress-box {
    .el-progress {
      margin: 10px 0;
    }
  }

</style>

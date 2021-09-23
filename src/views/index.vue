<template>
  <div style="height:100%;background:#f5f5f5;" class="cuzhong">
    <transition name="list">
      <cz-topbar ref="topBar" class="topBar"></cz-topbar>
    </transition>
    <cz-content ref="content" class="transition_dom"></cz-content>
    <!--<cz-footbar></cz-footbar>-->
  </div>
</template>
<script>
  import Topbar from "./topbar";
  import Footbar from "./footbar";
  import Content from "./content";
  import {getSessionData} from '@/utils/SimpleSessionStorageService.js';
  export default {
    data() {
      return {
      };
    },
    created() {
      console.group('%c%s', 'color:green',"---created:src/views/all/index.vue");
    },
    beforeDestroy() {
      console.group('%c%s', 'color:green',"---beforeDestroy:src/views/all/index.vue");
    },

    mounted() {
    },
    components: {
      CzTopbar: Topbar,
      CzFootbar: Footbar,
      CzContent: Content
    },
    methods: {
    },
  };
</script>

<style lang="scss">
  .wsMsg {
    position: absolute;
    bottom: 46px;
    right: 30px;

    .el-card .el-card__body {
      max-height: 150px;
      overflow-y: scroll;
      padding: 0;
    }

    .el-card__header {
      padding: 5px 0;
      border-bottom: 1px solid #EBEEF5;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      background: #E9EEF2;
    }

    .box-card[data-v-c6bd0440] {
      width: 300px;
    }

    .item {
      padding: 10px 5px;
      cursor: pointer;
      margin-bottom: 0;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #E4E7ED;
      position: relative;
      color: #333;
      .wsMsg_content{
        flex: 5;
        display: flex;
        align-items: center;
        max-width: 180px;
      }
      .wsMsg_ignore{
        min-width: 60px;
        padding-right: 10px;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }
    }

    .text {
      font-size: 14px;
    }

    .wsMsg_img {
      width: 25px;
      margin: 0 10px;
    }

    .wsMsg_close {
      position: absolute;
      right: 5px;
      font-size: 16px;
      cursor: pointer;
    }
    .clearfix {
      display: flex;
      align-items: center;
    }
    .clearfix:before,
    .clearfix:after {
      display: table;
      content: "";
    }
    .clearfix:after {
      clear: both
    }
    .msgIcon {
      margin: 0 10px;
      font-size: 20px;
    }
    .wsMsg_text{
      color:#57AAFF;
      .wsMsg_text_warn{
        color:#f56c6c
      }

    }
    .el-collapse-item{
      .el-collapse-item__header{
        color:#57AAFF;
        padding-left: 15px;
      }
      .el-collapse-item__content{
        line-height: inherit;
      }
    }

  }
</style>

<style scoped>
  .list-enter-active, .list-leave-active {
    transition: all 0.1s;
  }

  .list-enter, .list-leave-to {
    opacity: 0;
    transform: translateY(30px);
  }

  .transition_dom {
    transition: all 0.1s linear 0.1s;
  }

  .menuItem_fold {
    cursor: pointer;
    position: absolute;
    left: 49%;
    z-index: 99;
  }
</style>

<template>
  <div class="content" :class="{'overflow-y':!name1}">
     <router-view  v-if="isContentRouterAlive" style="min-width:1280px;overflow:auto"  @sendToContent="getDataFromAidpage">
     </router-view>
  </div>
</template>
<style lang="scss" scoped>
  .content{
    height: calc(100% - 48px);
  }
  .overflow-y{
    overflow-y: auto !important;
  }
</style>
<script>
export default {
  name:"czcontent",
  provide () {
    return {
      contentReload: this.contentReload
    };
  },
  data() {
    return {
      name1: false,  // 默认是false，只有在新增弹框出来的时候，设置为true
      name2: false,  // 默认是false，只有在刷新页面时候，设置为true
      isContentRouterAlive:true
    }
  },

  created() {
    console.group('%c%s', 'color:green', "--created:src/views/all/content/index.vue");
  },

  beforeDestroy(){
    console.group('%c%s', 'color:green', "--beforeDestroy:src/views/all/content/index.vue");
  },

  methods: {
    contentReload() {
      console.log("--src/views/all/content/index.vue执行reload操作,更新当前定义的router-view");
      this.isContentRouterAlive = false;
      this.$nextTick(function () {
        this.isContentRouterAlive = true;
      });
    },
    getDataFromAidpage(data) {
      if (data) {
        data.isHasdialog ? this.name1 = true : this.name1 = false;
        data.loading ? this.name2 = true : this.name2 = false;
      }
    },
  }
}
</script>

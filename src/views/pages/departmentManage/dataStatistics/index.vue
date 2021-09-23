<template>
  <div class="data_wrapper">
     <div v-if="true" class="noData"></div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss">
.data_wrapper{
  .noData {
      margin:0 auto;
      background-image: url("/static/img/noData_table.png");
      width: 234px;
      height: 224px;
      background-size: 100%;
      background-repeat: no-repeat;
      padding: 0;
    }
}
  
</style>
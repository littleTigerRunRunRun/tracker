<template>
  <div class="panel-status">
    <md-field class="width-input">
      <label for="width">宽度</label>
      <md-input id="width" v-model="state.size.width" name="width" />
    </md-field>
    <md-field class="height-input">
      <label for="height">高度</label>
      <md-input id="height" v-model="state.size.height" name="height" />
    </md-field>
  </div>
</template>

<script>
export default {
  name: 'PanelStatus',
  inject: ['state'],
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
  .panel-status{
    position: absolute;
    left: 300px;
    top: 10px;
    width: 500px;
    height: 80px;
    .width-input, .height-input{
      width: 120px;
      display: inline-block;
      vertical-align: middle;
      margin-right: 20px;
    }
  }
</style>

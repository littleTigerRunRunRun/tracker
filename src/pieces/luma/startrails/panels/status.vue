<template>
  <div
    class="panel-status"
    :style="{
      width: `${state.status.bound.width}px`,
      height: `${state.status.bound.height}px`,
      left: `${state.status.bound.left}px`,
      top: `${state.status.bound.top}px`,
    }"
  >
    <md-field class="width-input params-input">
      <label for="width">宽度</label>
      <md-input id="width" v-model="state.status.width" name="width" />
    </md-field>
    <md-field class="height-input params-input">
      <label for="height">高度</label>
      <md-input id="height" v-model="state.status.height" name="height" />
    </md-field>
    <md-field class="thickness-input params-input">
      <label for="thickness">厚度</label>
      <md-input id="thickness" v-model="state.status.thickness" name="thickness" />
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
    .params-input{
      width: 120px;
      display: inline-block;
      vertical-align: middle;
      margin-right: 20px;
    }
  }
</style>

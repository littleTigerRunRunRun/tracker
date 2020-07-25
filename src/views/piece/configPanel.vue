<template>
  <div class="config-panel">
    <md-field>
      <label for="first-name">First Name</label>
    </md-field>
  </div>
</template>

<script>
export default {
  name: 'ConfigPanel',
  props: {
    form: {
      type: Object,
      default: () => { return {} }
    }
  }
}
</script>

<style lang="scss">
  .config-panel{
    color: #fff;
    padding: 0 16px;
  }
</style>

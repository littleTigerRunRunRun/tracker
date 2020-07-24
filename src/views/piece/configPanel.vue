<template>
  <div class="config-panel">
    <md-field :class="getValidationClass('firstName')">
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

  }
</style>

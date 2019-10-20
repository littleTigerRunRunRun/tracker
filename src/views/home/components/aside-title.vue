<template>
  <md-list-item>
    <span class="md-list-item-text">
      <md-button class="md-primary">{{ title }}</md-button>
    </span>  
  </md-list-item>
</template>

<script>
export default {
  name: 'AsideTitle',
  props: {
    activate: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss">

</style>
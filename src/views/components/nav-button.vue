<template>
  <md-button class="md-primary" :class="{ activate: current === code }" @click="handleClick">
    {{ title }}
    <!-- <md-tooltip md-direction="bottom">举杯邀明月,对影成三人</md-tooltip> -->
  </md-button>
</template>

<script>
export default {
  name: 'NavButton',
  props: {
    current: {
      type: String,
      default: ''
    },
    code: {
      type: String,
      default: '',
      required: true
    },
    title: {
      type: String,
      default: '',
      required: true
    }
  },
  data() {
    return {}
  },
  methods: {
    handleClick() {
      this.$emit('jumpTo', this.code)
    }
  }
}
</script>

<style lang="postcss">
  .md-button.activate:before{
    opacity: 0.12;
    background-color: currentColor;
  }
</style>

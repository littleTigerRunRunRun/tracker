<template>
  <div class="tracker-piece-entry">
    <div class="block" style="background-color: rgba(25, 0, 0);" />
    <div class="block" style="background-color: rgba(25, 0, 0);" />
    <div class="block" style="background-color: rgba(25, 0, 0);" />
    <br>
    <div class="block" style="background-color: rgba(25, 0, 0);" />
    <div class="block" style="background-color: rgba(25, 0, 0);" />
    <div class="block" style="background-color: rgba(25, 0, 0);" />
    <br>
    <div class="block" style="background-color: rgba(25, 0, 0);" />
    <div class="block" style="background-color: rgba(25, 0, 0);" />
    <div class="block" style="background-color: rgba(25, 0, 0);" />
  </div>
</template>

<script>
import props from './config'

export default {
  name: 'AutoConfig',
  props,
  data() {
    return {
    }
  },
  mounted() {
    this.$emit('config', props)
  },
  beforeDestroy() {
  },
  methods: {
    onEnterEnd() {
      // 完全进入且动画结束的钩子
    }
  }
}
</script>

<style lang="scss" scoped>
  .tracker-piece-entry{
    position: relative;
    width: 100%;
    height: 100%;
    font-size: 0px;
    line-height: 0px;
    /* 这里开始后续都可以清理 */
    .block{
      width: 100px;
      height: 100px;
      display: inline-block;
    }
  }
</style>

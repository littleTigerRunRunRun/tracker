<template>
  <div class="tracker-piece-entry">
    <img src="/public/img/cat.jpg">
    <div class="back1" />
    <div class="back2" />
  </div>
</template>

<script>
import props from './config'

export default {
  name: 'Test2',
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
    img, .back1, .back2 {
      position: absolute;
      left: 0;
      top: 0;
      width: 200px;
      height: 200px;
    }
    .back1{
      backdrop-filter: blur(10px);
    }
    .back2{
      backdrop-filter: blur(10px);
    }
  }
</style>

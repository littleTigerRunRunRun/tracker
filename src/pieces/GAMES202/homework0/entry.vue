<template>
  <div class="tracker-piece-entry">
    <canvas ref="canvas" />
  </div>
</template>

<script>
import { main } from './main.js'

export default {
  name: 'Homework0',
  data() {
    return {
    }
  },
  mounted() {
    this.$emit('config', null)
  },
  beforeDestroy() {
  },
  methods: {
    onEnterEnd() {
      // 完全进入且动画结束的钩子
      main(this.$refs.canvas)
    }
  }
}
</script>

<style lang="scss" scoped>
  .dg.ac{
    z-index: 12;
  }
</style>

<style lang="scss" scoped>
  .tracker-piece-entry{
    position: relative;
    width: 100%;
    height: 100%;
    canvas {
      width: 100%;
      height: 100%;
    }
  }
</style>

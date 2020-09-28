<template>
  <div class="tracker-piece-entry">
    <canvas ref="canvas" />
  </div>
</template>

<script>
import props from './config'
import getLoop from './main.js'

export default {
  name: 'PieChartPre',
  props,
  data() {
    return {
    }
  },
  mounted() {
    this.$emit('config', props)
    this.loop = getLoop()
    this.loop.start({
      canvas: this.$refs.canvas,
      preserveDrawingBuffer: true
    })
  },
  beforeDestroy() {
    this.loop = null
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
    canvas {
      width: 100%;
      height: 100%;
    }
  }
</style>

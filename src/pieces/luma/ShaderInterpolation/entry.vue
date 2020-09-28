<template>
  <div class="tracker-piece-entry">
    <canvas ref="canvas" />
    <!-- <div class="text">
      {{ text[type] }}
    </div> -->
  </div>
</template>

<script>
import props from './config'
import getLoop from './main.js'

export default {
  name: 'ShaderInterpolation',
  props,
  data() {
    return {
      text: {
        linear: '线性插值 f(x, y) = x * t + y * (1 - t)'
      }
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
    .text{
      position: absolute;
      left: 40px;
      top: 40px;
      font-size: 24px;
      color: #ccc;
    }
  }
</style>

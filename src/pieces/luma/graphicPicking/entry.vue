<template>
  <div class="tracker-piece-entry">
    <canvas ref="canvas" @mousemove="handleMouseMove" />
  </div>
</template>

<script>
import props from './config'
import setCanvas from './main.js'

export default {
  name: 'GraphicPicking',
  props,
  data() {
    return {
      show: false
    }
  },
  mounted() {
    this.$emit('config', props)
    this.loop = setCanvas(this.$refs.canvas)
    setTimeout(() => {
      this.show = true
    }, 200)
  },
  beforeDestroy() {
    if (this.loop) this.loop.destroy()
  },
  methods: {
    onEnterEnd() {
      // 完全进入且动画结束的钩子
    },
    handleMouseMove(e) {
      // 此处简化了问题为一个全屏图像
      if (this.loop) this.loop.setCursor({ x: e.offsetX / window.innerWidth, y: e.offsetY / window.innerHeight })
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

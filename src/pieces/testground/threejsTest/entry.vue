<template>
  <div class="tracker-piece-entry">
    <div ref="container" class="container" />
  </div>
</template>

<script>
import props from './config'
import Scene from './scene.js'

export default {
  name: 'ThreejsTest',
  props,
  data() {
    return {
    }
  },
  mounted() {
    this.$emit('config', props)
    this.scene = new Scene({ container: this.$refs.container, params: { image: this.image, kernelRadius: this.kernelRadius, sigma: this.sigma }})
  },
  beforeDestroy() {
    if (this.scene) {
      this.scene.destroy()
      this.scene = null
    }
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
    background-color: #000;
    .container{
      width: 100%;
      height: 100%;
    }
  }
</style>

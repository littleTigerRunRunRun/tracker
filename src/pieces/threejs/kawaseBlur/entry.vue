<template>
  <div class="tracker-piece-entry">
    <div ref="container" class="container" />
  </div>
</template>

<script>
import props from './config'
import Scene from './scene.js'

export default {
  name: 'KawaseBlur',
  props,
  data() {
    return {
      scene: null
    }
  },
  watch: {
    radius(val) {
      if (this.scene) this.scene.changeParams('radius', val)
    },
    image(val) {
      if (this.scene) this.scene.changeParams('image', val)
    }
  },
  mounted() {
    this.$emit('config', props)
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
      this.scene = new Scene({ container: this.$refs.container, params: { image: this.image, radius: this.radius }})
    }
  }
}
</script>

<style lang="scss" scoped>
  .tracker-piece-entry{
    position: relative;
    width: 100%;
    height: 100%;
    .container{
      width: 100%;
      height: 100%;
    }
  }
</style>

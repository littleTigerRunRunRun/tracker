<template>
  <div class="tracker-piece-entry">
    <div ref="container" class="container" />
  </div>
</template>

<script>
import Scene from './scene.js'

export default {
  name: 'GaussianBlur',
  props: {},
  data() {
    return {
      scene: null
    }
  },
  mounted() {
  },
  update() {
    console.log('udpate')
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
      this.scene = new Scene({ container: this.$refs.container })
    }
  }
}
</script>

<style lang="scss">
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

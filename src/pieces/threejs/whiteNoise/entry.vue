<template>
  <div class="tracker-piece-entry">
    <div ref="container" class="container" />
  </div>
</template>

<script>
import props from './config'
import Scene from './scene'

export default {
  name: 'WhiteNoise',
  props,
  data() {
    return {
    }
  },
  mounted() {
    this.$emit('config', props)
    this.$nextTick(() => {
      this.scene = new Scene({ container: this.$refs.container, params: {}})
    })
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
    .container{
      position: relative;
      width: 100%;
      height: 100%;
    }
  }
</style>

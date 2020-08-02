<template>
  <div class="tracker-piece-entry">
    <canvas ref="canvas" class="canvas" />
  </div>
</template>

<script>
import props from './config'

export default {
  name: 'Puncher',
  props,
  data() {
    return {
    }
  },
  watch: {
    points() {
      this.refresh()
    }
  },
  mounted() {
    this.$emit('config', props)

    this.$nextTick(() => {
      this.refresh()
    })
  },
  beforeDestroy() {
  },
  methods: {
    onEnterEnd() {
      // 完全进入且动画结束的钩子
    },
    refresh() {
      const points = []
      try {
        const ps = JSON.parse(this.points)
        points.splice(0, 0, ...ps)
      } catch (e) {
        console.log(e)
        return
      }
      const canvas = this.$refs.canvas
      const bound = canvas.getBoundingClientRect()
      canvas.width = bound.width
      canvas.height = bound.height
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      for (const array of points) {
        for (const point of array.points) {
          ctx.fillStyle = array.style
          ctx.fillRect(point[0] * array.radius * bound.width + this.centerX * bound.width + array.offset[0], point[1] * array.radius * bound.height + this.centerY * bound.height + array.offset[1], 8, 8)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .tracker-piece-entry{
    position: relative;
    width: 100%;
    height: 100%;
    .canvas{
      width: 100%;
      height: 100%;
    }
  }
</style>

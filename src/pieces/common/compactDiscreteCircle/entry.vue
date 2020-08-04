<template>
  <div class="tracker-piece-entry">
    <canvas ref="canvas" class="canvas" />
  </div>
</template>

<script>
import props from './config'

export default {
  name: 'CompactDiscreteCircle',
  props,
  data() {
    return {
    }
  },
  watch: {
    num() {
      this.render()
    },
    pointRadius() {
      this.render()
    },
    angle() {
      this.render()
    }
  },
  mounted() {
    this.$emit('config', props)
    window.addEventListener('resize', this.render)
    this.$nextTick(() => {
      this.render()
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.render)
  },
  methods: {
    onEnterEnd() {
      // 完全进入且动画结束的钩子
    },
    render() {
      const canvas = this.$refs.canvas
      const { width, height } = canvas.getBoundingClientRect()
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')

      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, width, height)

      const radian = this.angle / 180 * Math.PI
      const radius = Math.min(width, height) * 0.4
      const center = [width * 0.5, height * 0.5]
      const c = radius / Math.sqrt(this.num)

      ctx.fillStyle = '#fff'
      // 伏格公式 https://baike.baidu.com/item/%E4%BC%8F%E6%A0%BC%E5%85%AC%E5%BC%8F/24130507?fr=aladdin
      // φ = n ∗ 137.5°, r = c√n
      for (let i = 0; i < this.num; i++) {
        const angle = i * radian
        const r = c * Math.sqrt(i)

        ctx.beginPath()
        ctx.arc(center[0] + r * Math.sin(angle), center[1] + r * Math.cos(angle), this.pointRadius, 0, Math.PI * 2, true)
        ctx.fill()
        ctx.closePath()
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

<template>
  <div class="dragable-container" @mousedown="handleMouseDown">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'DragableContainer',
  props: {
    x: {
      type: Number,
      default: 0
    },
    y: {
      type: Number,
      default: 0
    },
    xEnable: {
      type: Boolean,
      default: true
    },
    yEnable: {
      type: Boolean,
      default: false
    },
    xRange: {
      type: Array,
      default: () => [-10000, 10000]
    },
    yRange: {
      type: Array,
      default: () => [-10000, 10000]
    },
    // 1个px换算成多少数值
    xScale: {
      type: Number,
      default: 1
    },
    yScale: {
      type: Number,
      default: 1
    },
    lock: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      moving: false,
      lastX: 0,
      lastY: 0
    }
  },
  mounted() {
    document.body.addEventListener('mousemove', this.handleMouseMove)
    document.body.addEventListener('mouseup', this.handleMouseUp)
  },
  beforeDestroy() {
    document.body.removeEventListener('mousemove', this.handleMouseMove)
    document.body.removeEventListener('mouseup', this.handleMouseUp)
  },
  methods: {
    clamp(value, min, max) {
      return Math.max(min, Math.min(max, value))
    },
    handleMouseDown(e) {
      if (this.lock) return
      this.moving = true
      this.lastX = e.pageX
      this.lastY = e.pageY
    },
    handleMouseMove(e) {
      if (!this.moving || this.lock) return
      const x = this.clamp(this.x + (e.pageX - this.lastX) * this.xScale, this.xRange[0], this.xRange[1])
      const y = this.clamp(this.y + (e.layerY - this.lastY) * this.yScale, this.yRange[0], this.yRange[1])

      const data = {}
      if (this.xEnable) {
        this.$emit('update:x', x)
        data.x = x
      }
      if (this.yEnable) {
        this.$emit('update:y', y)
        data.y = y
      }

      this.lastX = e.pageX
      this.lastY = e.pageY
    },
    handleMouseUp(e) {
      if (this.lock) return
      this.handleMouseMove(e)
      this.moving = false
    }
  }
}
</script>

<style lang="scss">
  .dragable-container{
    width: 100%;
    height: 100%;
    pointer-events: auto;
    cursor: pointer;
  }
</style>

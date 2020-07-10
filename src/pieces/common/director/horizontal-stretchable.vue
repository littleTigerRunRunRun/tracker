<template>
  <div class="horizontal-stretchable-container">
    <!-- <div class="stretch stretch-left" @mousedown="(e) => handleMouseDown('left', e)" /> -->
    <slot />
    <div class="stretch stretch-right" @mousedown="handleMouseDown" />
  </div>
</template>

<script>
export default {
  name: 'HorizontalStretchable',
  props: {
    width: {
      type: Number,
      default: 0
    },
    xRange: {
      type: Array,
      default: () => [0, 100000]
    },
    xScale: {
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
      lastX: 0
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
    },
    handleMouseMove(e) {
      if (!this.moving || this.lock) return
      const width = this.clamp(this.width + (e.pageX - this.lastX) * this.xScale, this.xRange[0], this.xRange[1])

      this.$emit('update:width', width)
      this.$emit('change', width)

      this.lastX = e.pageX
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
  .horizontal-stretchable-container{
    height: 100%;
    position: relative;
    .stretch{
      position: absolute;
      top: 0;
      width: 6px;
      height: 100%;
      cursor: e-resize;
    }
    .stretch-left{
      left: -3px;
    }
    .stretch-right{
      right: -3px;
    }
  }
</style>

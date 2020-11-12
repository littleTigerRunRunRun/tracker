<template>
  <canvas
    ref="canvas"
    class="cut-webgl-regular-polygon"
    :width="width"
    :height="height"
    :style="{
      width: `${width}px`,
      height: `${height}px`
    }"
  />
</template>

<script>
import { throttle } from 'lodash'
import { ShapeCreator, ColorDescriber } from '../ShapeCreator'
import { fetchColor } from '../colorManager'

export default {
  name: 'CusRegularPolygon',
  props: {
    width: {
      type: Number,
      default: 100
    },
    height: {
      type: Number,
      default: 100
    },
    occupy: {
      type: Number,
      validator(value) {
        if (typeof value !== 'number' || value < 0 || value > 1) {
          console.error('occupy应该是0到1之间的数字')
          return false
        }
        return true
      },
      default: 0.98
    },
    side: {
      type: Number,
      default: 3
    },
    fill: {
      type: [String, Array],
      default: () => [0, 0, 0, 1]
    },
    stroke: {
      type: [String, Array],
      default: () => [0, 0, 0, 1]
    },
    strokeWidth: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      shape: null
    }
  },
  computed: {
    radius() {
      return Math.min(this.width, this.height) * this.occupy * 0.5
    }
  },
  watch: {
    width() {
      this.refreshGeometryShape()
    },
    height() {
      this.refreshGeometryShape()
    },
    side() {
      this.refreshGeometryShape()
    },
    strokeWidth() {
      this.refreshGeometryShape()
    },
    fill() {
      this.refreshGeometryShape()
    },
    stroke() {
      this.refreshGeometryShape()
    }
  },
  mounted() {
    this.createShape()
    this.refreshGeometryShape = throttle(this._refreshGeometryShape, 100, { trailing: true, leading: true })
  },
  beforeDestroy() {
    if (this.shape) this.shape.destroy()
  },
  methods: {
    getFillCD() {
      if (typeof this.fill === 'string') return fetchColor(this.fill)
      else return new ColorDescriber([], { base: this.fill })
    },
    getStrokeCD() {
      if (typeof this.stroke === 'string') return fetchColor(this.stroke)
      else return new ColorDescriber([], { base: this.stroke })
    },
    createShape() {
      // if (this.shape) this.shape.destroy()
      this.shape = new ShapeCreator({
        canvas: this.$refs.canvas,
        type: 'regularPolygon',
        transform: {
          translate: [0, 0]
        },
        shape: {
          side: this.side,
          radius: this.radius
        },
        style: {
          fill: this.getFillCD(),
          stroke: this.getStrokeCD(),
          strokeWidth: this.strokeWidth
        }
      })
      this.$emit('refresh')
    },
    _refreshGeometryShape() {
      const params = {
        type: 'regularPolygon',
        shape: {
          side: this.side,
          radius: this.radius
        },
        style: {
          fill: this.getFillCD(),
          stroke: this.getStrokeCD(),
          strokeWidth: this.strokeWidth
        }
      }
      this.shape.refreshGeometryShape(params)
      this.$emit('refresh')
    },
    bake(params) {
      if (this.shape) return this.shape.bake(params)
      else return null
    }
  }
}
</script>

<style>

</style>

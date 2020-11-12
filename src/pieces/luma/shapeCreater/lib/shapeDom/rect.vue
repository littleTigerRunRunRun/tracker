<template>
  <canvas
    ref="canvas"
    class="cut-webgl-rect"
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
  name: 'CusRect',
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
  },
  watch: {
    width() {
      this.refreshGeometryShape()
    },
    height() {
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
        type: 'rect',
        transform: {
          translate: [0, 0]
        },
        shape: {
          width: this.width * this.occupy,
          height: this.height * this.occupy
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
        type: 'rect',
        shape: {
          width: this.width * this.occupy,
          height: this.height * this.occupy
        },
        style: {
          fill: this.getFillCD(),
          stroke: this.getStrokeCD(),
          strokeWidth: this.strokeWidth
        }
      }
      // console.log('rect refresh', params)
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

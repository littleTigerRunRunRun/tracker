<!-- eslint-disable-next-line -->
<template />

<script>
import { throttle } from 'lodash'
import { ColorDescriber } from '../ShapeCreator'
import { defineColor, broadcastColor, fetchId } from '../colorManager'

export default {
  name: 'CusGradient',
  props: {
    id: {
      type: String,
      default: ''
    },
    linearInterpolate: {
      type: Number,
      default: 0
    },
    radiusInterpolate: {
      type: Number,
      default: 0
    },
    gradients: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      color: null,
      splitedGradients: []
    }
  },
  computed: {
  },
  watch: {
    gradients: {
      handler() {
        this.splitGradients()
      },
      immediate: true
    },
    linearInterpolate() {
      this.refreshColor()
    },
    radiusInterpolate() {
      this.refreshColor()
    }
  },
  created() {
    this.refreshColor = throttle(this._refreshColor, 100, { trailing: true, leading: true })
  },
  mounted() {
    this.defineColor()
    if (!this.id) this.$emit('updata:id', fetchId())
  },
  methods: {
    splitGradients() {
      const gradients = []
      for (const gradient of this.gradients) {
        if (!gradient.stops && gradient.stop) gradient.stops = gradient.stop
        switch (gradient.type) {
          case 'linear': {
            for (let i = 1; i < gradient.stops.length; i++) {
              const prev = gradient.stops[i - 1]
              const now = gradient.stops[i]
              const linear = {
                type: 'linear',
                limited0: true,
                limited1: true,
                start: { color: new Array(...prev.color), point: [gradient.from.point[0] * (1 - prev.offset) + gradient.to.point[0] * prev.offset, gradient.from.point[1] * (1 - prev.offset) + gradient.to.point[1] * prev.offset], fixed: gradient.fixed || false, normalized: prev.normalized || false },
                end: { color: new Array(...now.color), point: [gradient.from.point[0] * (1 - now.offset) + gradient.to.point[0] * now.offset, gradient.from.point[1] * (1 - now.offset) + gradient.to.point[1] * now.offset], fixed: gradient.fixed || false, normalized: now.normalized || false }
              }
              if (i === 1) linear.limited0 = false
              if (i === gradient.stops.length - 1) linear.limited1 = false
              gradients.push(linear)
            }
            break
          }
          case 'radius': {
            for (let i = 1; i < gradient.stops.length; i++) {
              const prev = gradient.stops[i - 1]
              const now = gradient.stops[i]
              const radius = {
                type: 'radius',
                center: { point: new Array(...gradient.center.point), fixed: gradient.fixed },
                limited: true,
                inner: { color: new Array(...prev.color), radius: prev.radius, fixed: gradient.fixed || false, normalized: prev.normalized || false },
                outer: { color: new Array(...now.color), radius: now.radius, fixed: gradient.fixed || false, normalized: now.normalized || false }
              }
              if (i === 1) radius.inner.radius = 0
              if (i === gradient.length - 1) radius.limited1 = false
              gradients.push(radius)
            }
            break
          }
          case 'conic': {
            for (let i = 1; i < gradient.stops.length; i++) {
              const prev = gradient.stops[i - 1]
              const now = gradient.stops[i]
              const conic = {
                type: 'conic',
                center: { point: new Array(...gradient.center.point), fixed: gradient.fixed },
                limited: true,
                start: { color: new Array(...prev.color), angle: prev.angle, fixed: gradient.fixed || false, normalized: prev.normalized || false },
                end: { color: new Array(...now.color), angle: now.angle, fixed: gradient.fixed || false, normalized: now.normalized || false }
              }
              gradients.push(conic)
            }
            break
          }
        }
      }
      this.splitedGradients = gradients
      if (this.refreshColor) this.refreshColor()
    },
    defineColor() {
      this.color = new ColorDescriber(this.splitedGradients, { base: [0, 0, 0, 0], linearInterpolate: this.linearInterpolate, radiusInterpolate: this.radiusInterpolate })
      defineColor(this.id, this.color)
    },
    _refreshColor() {
      this.color.refresh(this.splitedGradients, { base: [0, 0, 0, 0] })
      broadcastColor(this.id, this.color)
    }
  }
}
</script>

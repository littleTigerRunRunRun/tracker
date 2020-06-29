<template>
  <div class="svg-parts-radar-dashboard">
    <svg
      version="1.1"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      preserveAspectRatio="xMidYMid meet"
      width="100%"
      height="100%"
      :viewBox="viewBox"
    >
      <defs>
        <!-- <filter id="changeColorDarker">
          <feColorMatrix
            type="matrix"
            values="0.3 0 0 0 0
                    0 0.3 0 0 0
                    0 0 0.3 0 0
                    0 0 0 1 0"
          />
        </filter> -->
        <radialGradient id="outer_mask_gradient">
          <stop offset="64%" stop-color="#fff" :stop-opacity="0" />
          <stop offset="88%" stop-color="#fff" :stop-opacity="outerOpacity" />
        </radialGradient>
        <linearGradient id="cover_gradient" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" :stop-color="fill" stop-opacity="0.7" />
          <stop :offset="`${Math.round(Math.cos(outerGapAngle) *50 + 50)}%`" stop-color="#000" stop-opacity="0.7" />
          <stop offset="98%" stop-color="#000" stop-opacity="0" />
        </linearGradient>
        <linearGradient id="pointer_inner_gradient" x1="0" y1="0.5" x2="1" y2="0.5">
          <stop offset="10%" :stop-color="fill" stop-opacity="1" />
          <stop offset="100%" :stop-color="fill" stop-opacity="0.1" />
        </linearGradient>
        <mask id="radiusMask">
          <circle :cx="mainRadius" :cy="mainRadius" :r="outerRadius + outerWidth / 2 + 2" fill="url(#outer_mask_gradient)" />
        </mask>
      </defs>
      <g class="chart-main">
        <path class="outerPath" :d="bgPath" fill="url(#cover_gradient)" />
        <g>
          <path class="outer" :d="outerPath" :stroke-width="outerWidth" :stroke="fill" fill-opacity="0.8" stroke-linecap="square" stroke-linejoin="round" mask="url(#radiusMask)" />
        </g>
        <g class="chart-scale">
          <g v-for="(scale, index) in renderScales" :key="`scale${index}`" class="scale">
            <rect :x="mainRadius" :y="mainRadius + scaleRadius" :width="scaleWidth" :height="scaleHeight" :rx="scaleBorderRadius" :ry="scaleBorderRadius" :fill="fill" :fill-opacity="scaleOpacity" :transform="scale.rotate" />
            <text v-if="scale.scaleText" :x="scale.x + scale.scaleText.offset.x" :y="scale.y + scale.scaleText.offset.y" :fill="fill" :fill-opacity="scaleOpacity" font-size="36" dominant-baseline="middle" text-anchor="middle">{{ scale.scaleText.label }}</text>
          </g>
        </g>
        <g class="inner">
          <circle :cx="mainRadius" :cy="mainRadius" :r="centerRadius" fill="none" :stroke="fill" :stroke-width="centerWidth" :stroke-opacity="centerOpacity" />
          <circle :cx="mainRadius" :cy="mainRadius" :r="innerCircleRadius" fill="none" :stroke="fill" :stroke-width="innerCircleWidth" :stroke-opacity="innerCircleOpacity" />
          <circle :cx="mainRadius" :cy="mainRadius" :r="coreRadius" :fill="fill" :fill-opacity="coreOpacity" />
        </g>
        <g class="pointer">
          <path class="outer" :d="pointerOuterPath" fill="none" :stroke-width="outerWidth" :stroke="fill" :stroke-opacity="1" stroke-linecap="round" :style="{ strokeDasharray: `${radiusLength} ${radiusLength}`, strokeDashoffset: Math.min((100 - value) / 100 * radiusLength, radiusLength - 2) }" />
          <rect class="inner" :x="mainRadius - outerRadius" :y="mainRadius - outerWidth * 0.5" :width="outerRadius" :height="outerWidth" fill="url(#pointer_inner_gradient)" :transform="pointerRotate" />
        </g>
        <g class="score">
          <text :font-size="mainScoreSize" :fill="fill" :x="mainRadius + mainScoreOffset.x" :y="mainRadius + mainScoreOffset.y + mainScoreSize" dominant-baseline="middle" text-anchor="middle">{{ Math.round(value) }}</text>
        </g>
      </g>
    </svg>
  </div>
</template>

<script>
import props from './config.js'

export default {
  name: 'RadarDashboard',
  props,
  data() {
    return {

    }
  },
  computed: {
    mainRadius() {
      return this.outerRadius / this.occupy
    },
    viewBox() {
      return `0 0 ${this.mainRadius * 2} ${this.mainRadius * 2}`
    },
    radiusLength() {
      return (Math.PI * 2 - this.outerGapAngle * 2) * this.outerRadius
    },
    pointerRotate() {
      const angle = ((Math.PI * 2 - this.outerGapAngle * 2) * this.value / 100 - Math.PI / 2 + this.outerGapAngle) / Math.PI * 180
      return `rotate(${angle} ${this.mainRadius} ${this.mainRadius})`
    },
    pointerOuterPath() {
      const radius = this.outerRadius
      const oh = Math.sin(this.outerGapAngle) * radius
      const ov = Math.cos(this.outerGapAngle) * radius
      return `
        M${this.mainRadius - oh},${this.mainRadius + ov} 
        A${radius},${radius} 0 1,1 ${this.mainRadius + oh},${this.mainRadius + ov}
      `
    },
    bgPath() {
      const radius = this.outerRadius - this.outerWidth / 2 + 2
      const oh = Math.sin(this.outerGapAngle) * radius
      const ov = Math.cos(this.outerGapAngle) * radius
      return `
        M${this.mainRadius - oh},${this.mainRadius + ov} 
        A${radius},${radius} 0 1,1 ${this.mainRadius + oh},${this.mainRadius + ov} 
        A${this.outerRadius * 1.6},${this.outerRadius * 1.6} 0 0,1 ${this.mainRadius - oh},${this.mainRadius + ov} 
      `
    },
    outerPath() {
      // o = offset h = horizontal v = vertical
      const oh = Math.sin(this.outerGapAngle) * this.outerRadius
      const ov = Math.cos(this.outerGapAngle) * this.outerRadius
      const extendRate = 1 - this.outerExtend / this.outerRadius
      return `
        M${this.mainRadius - oh * extendRate},${this.mainRadius + ov * extendRate} 
        L${this.mainRadius - oh},${this.mainRadius + ov} 
        A${this.outerRadius},${this.outerRadius} 0 1,1 ${this.mainRadius + oh},${this.mainRadius + ov} 
        L${this.mainRadius + oh * extendRate},${this.mainRadius + ov * extendRate}
      `
    },
    renderScales() {
      const array = []
      const sa = this.outerGapAngle // 起始角startAngle
      for (let i = 0; i <= this.scaleNum; i++) {
        const angle = sa + i / this.scaleNum * (Math.PI - sa) * 2
        const scaleText = this.scales.find((scale) => scale.index === i)
        console.log(scaleText)
        array.push({
          value: i / this.scaleNum * 100,
          x: this.mainRadius - Math.sin(angle) * this.scaleRadius,
          y: this.mainRadius + Math.cos(angle) * this.scaleRadius,
          rotate: `rotate(${angle / Math.PI * 180} ${this.mainRadius} ${this.mainRadius})`,
          scaleText
        })
      }
      return array
    }
  }
}
</script>

<style lang="scss">
  .svg-parts-radar-dashboard{
    width: 100%;
    height: 100%;
    .pointer{
      .outer{
        transition: stroke-dashoffset 0.3s;
      }
      .inner{
        transition: transform 0.3s;
      }
    }
  }
</style>

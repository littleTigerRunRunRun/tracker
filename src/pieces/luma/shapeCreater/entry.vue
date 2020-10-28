<template>
  <div class="tracker-piece-entry">
    <svg version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid meet" class="block" viewBox="0 0 200 200">
      <path
        d="M100,20 L169.2820323027551,140 L30.717967697244916,140.00000000000003 Z"
        fill="rgba(255, 0, 0, 0.2)"
        stroke="rgba(0, 60, 120, 0.8)"
        stroke-width="8"
      />
    </svg>
    <canvas ref="c0" class="block" width="200" height="200" />
    <svg version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid meet" class="block" viewBox="0 0 200 200">
      <path
        d="M156.5685424949238,43.431457505076196 L156.5685424949238,156.5685424949238 L43.4314575050762,156.5685424949238 L43.43145750507618,43.43145750507621 Z"
        fill="rgba(255, 0, 0, 0.2)"
        stroke="rgba(0, 60, 120, 0.8)"
        stroke-width="8"
      />
    </svg>
    <canvas ref="c1" class="block" width="200" height="200" />
    <svg version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid meet" class="block" viewBox="0 0 200 200">
      <path
        d="M100,20 L176.0845213036123,75.2786404500042 L147.02282018339787,164.72135954999578 L52.97717981660216,164.72135954999578 L23.91547869638771,75.27864045000422 Z"
        fill="rgba(40, 80, 255, 0.5)"
        stroke="rgba(255, 0, 0, 1)"
        stroke-width="2"
      />
    </svg>
    <canvas ref="c2" class="block" />
    <svg version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid meet" class="block" viewBox="0 0 200 200">
      <circle
        cx="100"
        cy="100"
        r="55"
        fill="none"
        stroke="#333"
        stroke-width="0.25"
      />
    </svg>
    <canvas ref="c3" class="block" />
  </div>
</template>

<script>
import props from './config'
import ShapeCreator from './ShapeCreator'

export default {
  name: 'ShapeCreater',
  props,
  data() {
    return {
    }
  },
  mounted() {
    this.$emit('config', props)

    this.sc0 = new ShapeCreator({
      canvas: this.$refs.c0,
      type: 'regularPolygon',
      shape: {
        side: 3,
        radius: 80,
        center: [100, 100]
      },
      style: {
        fill: 'rgba(255, 0, 0, 0.2)',
        stroke: 'rgba(0, 60, 120, 0.8)',
        strokeWidth: 8
      }
    })

    // this.sc1 = new ShapeCreator({
    //   canvas: this.$refs.c1,
    //   type: 'regularPolygon',
    //   shape: {
    //     side: 4,
    //     radius: 80,
    //     center: [100, 100],
    //     start: Math.PI / 4
    //   },
    //   style: {
    //     fill: 'rgba(255, 0, 0, 0.2)',
    //     stroke: 'rgba(0, 60, 120, 0.8)',
    //     strokeWidth: 8
    //   }
    // })

    // this.sc2 = new ShapeCreator({
    //   canvas: this.$refs.c2,
    //   type: 'regularPolygon',
    //   shape: {
    //     side: 5,
    //     radius: 80,
    //     center: [100, 100]
    //   },
    //   style: {
    //     fill: 'rgba(40, 80, 255, 0.5)',
    //     stroke: 'rgba(255, 0, 0, 1)',
    //     strokeWidth: 2
    //   }
    // })

    // this.sc3 = new ShapeCreator({
    //   canvas: this.$refs.c3,
    //   type: 'circle',
    //   // showSvg: true,
    //   shape: {
    //     accuracy: 1, // 曲线细分程度
    //     radius: 55,
    //     center: [100, 100]
    //   },
    //   style: {
    //     stroke: '#333',
    //     strokeWidth: 0.25
    //   }
    // })
  },
  beforeDestroy() {
    if (this.sc1) {
      this.sc0.destroy()
      this.sc0 = null
      // this.sc1.destroy()
      // this.sc1 = null
      // this.sc2.destroy()
      // this.sc2 = null
      // this.sc3.destroy()
      // this.sc3 = null
    }
  },
  methods: {
    onEnterEnd() {
      // 完全进入且动画结束的钩子
    }
  }
}
</script>

<style lang="scss">
  .tracker-piece-entry{
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #fff;
    .block{
      width: 200px;
      height: 200px;
      box-sizing: content-box;
      float: left;
      box-shadow: 0 0 1px #999 inset;
    }
  }
</style>

<template>
  <div class="tracker-piece-entry">
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
      <path d="M100,20 L176.0845213036123,75.2786404500042 L147.02282018339787,164.72135954999578 L52.97717981660216,164.72135954999578 L23.91547869638771,75.27864045000422 Z" fill="#f00" />
    </svg>
    <canvas ref="c2" class="block" />
    <svg version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid meet" class="block" viewBox="0 0 200 200">
      <path d="M100,20 L111.38518706186281,20.81428464952539 L122.53860454731438,23.240562110840216 L133.2332010401509,27.229440371638532 L143.25126539644782,32.69971737350551 L152.3888587156228,39.54003405165934 L160.45996594834065,47.61114128437719 L167.3002826264945,56.74873460355219 L172.77055962836147,66.76679895984908 L176.75943788915978,77.46139545268562 L179.1857153504746,88.61481293813719 L180,99.99999999999997 L179.18571535047462,111.38518706186281 L176.75943788915978,122.53860454731438 L172.77055962836147,133.2332010401509 L167.30028262649452,143.25126539644776 L160.45996594834065,152.3888587156228 L152.3888587156228,160.45996594834065 L143.25126539644782,167.3002826264945 L133.23320104015093,172.77055962836147 L122.53860454731438,176.75943788915978 L111.38518706186281,179.1857153504746 L100.00000000000004,180 L88.6148129381372,179.18571535047462 L77.46139545268565,176.7594378891598 L66.76679895984908,172.77055962836147 L56.748734603552194,167.3002826264945 L47.6111412843772,160.45996594834065 L39.54003405165935,152.3888587156228 L32.69971737350549,143.2512653964478 L27.22944037163856,133.23320104015096 L23.240562110840216,122.53860454731438 L20.81428464952539,111.38518706186282 L20,100.00000000000001 L20.814284649525376,88.6148129381372 L23.2405621108402,77.46139545268565 L27.229440371638518,66.76679895984913 L32.69971737350552,56.748734603552165 L39.540034051659305,47.61114128437724 L47.61114128437715,39.540034051659376 L56.74873460355221,32.69971737350551 L66.76679895984903,27.22944037163856 L77.46139545268562,23.240562110840216 L88.61481293813718,20.81428464952539 Z" fill="#f00" />
    </svg>
    <canvas ref="c3" class="block" />
  </div>
</template>

<script>
import props from './config'
import ShaperCreator from './ShaperCreator'

export default {
  name: 'ShapeCreater',
  props,
  data() {
    return {
    }
  },
  mounted() {
    this.$emit('config', props)

    this.sc1 = new ShaperCreator({
      canvas: this.$refs.c1,
      type: 'regularPolygon',
      shape: {
        side: 4,
        radius: 80,
        center: [100, 100],
        start: Math.PI / 4
      },
      style: {
        fill: 'rgba(255, 0, 0, 0.2)',
        stroke: 'rgba(0, 60, 120, 0.8)',
        strokeWidth: 8
      }
    })

    this.sc2 = new ShaperCreator({
      canvas: this.$refs.c2,
      type: 'regularPolygon',
      shape: {
        side: 5,
        radius: 80,
        center: [100, 100]
      }
    })

    this.sc3 = new ShaperCreator({
      canvas: this.$refs.c3,
      type: 'circle',
      // showSvg: true,
      shape: {
        accuracy: 1, // 曲线细分程度
        radius: 80,
        center: [100, 100]
      }
    })
  },
  beforeDestroy() {
    if (this.sc1) {
      this.sc1.destroy()
      this.sc1 = null
      this.sc2.destroy()
      this.sc2 = null
      this.sc3.destroy()
      this.sc3 = null
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

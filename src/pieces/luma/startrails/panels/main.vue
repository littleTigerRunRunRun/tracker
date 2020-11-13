<template>
  <div class="panel-main">
    <canvas ref="canvas" />
  </div>
</template>

<script>
import { ShapeCreator, ColorDescriber } from '../../shapeCreater/lib/ShapeCreator/index.js'

export default {
  name: 'PanelMain',
  data() {
    return {
      shape: null
    }
  },
  mounted() {
    this.initPath()
  },
  methods: {
    initPath() {
      this.shape = new ShapeCreator({
        canvas: this.$refs.canvas,
        type: 'regularPolygon',
        transform: {
          translate: [0, 0]
        },
        shape: {
          side: 4,
          radius: 80,
          start: Math.PI / 4
        },
        style: {
          fill: new ColorDescriber([], { base: [255, 0, 0, 0.2] }),
          stroke: new ColorDescriber([], { base: [26, 128, 210, 0.6] }),
          strokeWidth: 4
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .panel-main{
    position: absolute;
    left: 100px;
    top: 100px;
    width: 1000px;
    height: 600px;
    box-shadow:
      0px 0px 3px rgba(0, 0, 0, 0.2),
      0px 1px 3px rgba(0, 0, 0, 0.2),
      0px 0px 7px 1px rgba(0, 0, 0, 0.25);
  }
</style>

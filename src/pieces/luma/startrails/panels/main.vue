<template>
  <div
    class="panel-main"
    :style="{
      width: `${state.main.bound.width}px`,
      height: `${state.main.bound.height}px`,
      left: `${state.main.bound.left}px`,
      top: `${state.main.bound.top}px`,
    }"
  >
    <canvas ref="canvas" />
  </div>
</template>

<script>
import { ShapeCreator, ColorDescriber, initLoop } from '../../shapeCreater/lib'

export default {
  name: 'PanelMain',
  inject: ['state'],
  data() {
    return {
      shape: null
    }
  },
  created() {
    initLoop({ fetchLength: true })
  },
  mounted() {
    this.initPath()
  },
  methods: {
    initPath() {
      this.shape = new ShapeCreator({
        canvas: this.$refs.canvas,
        type: 'rect',
        transform: {
          translate: [0, 0]
        },
        shape: {
          width: this.state.status.width,
          height: this.state.status.height
        },
        style: {
          stroke: new ColorDescriber([], { base: [26, 128, 210, 0.2] }),
          strokeWidth: this.state.status.thickness
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .panel-main{
    position: absolute;
    box-shadow:
      0px 0px 3px rgba(0, 0, 0, 0.2),
      0px 1px 3px rgba(0, 0, 0, 0.2),
      0px 0px 7px 1px rgba(0, 0, 0, 0.25);
    canvas{
      width: 100%;
      height: 100%;
    }
  }
</style>

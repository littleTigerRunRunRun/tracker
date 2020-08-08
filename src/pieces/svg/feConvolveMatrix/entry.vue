<template>
  <div class="tracker-piece-entry">
    <svg
      version="1.1"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      preserveAspectRatio="xMinYMin meet"
      viewBox="0 0 500 500"
    >
      <defs>
        <filter id="blur">
          <feConvolveMatrix order="3" kernelMatrix="0 0 0 0 1 0 0 0 0" />
        </filter>
      </defs>
    </svg>
    <img width="1000" src="http://localhost:8080/public/img/flower.jpg" style="filter: url(#blur);">
  </div>
</template>

<script>
// import props from './config'

export default {
  name: 'FeConvolveMatrix',
  props: {},
  data() {
    return {
    }
  },
  mounted() {
    // this.$emit('config', props)
  },
  beforeDestroy() {
  },
  methods: {
    onEnterEnd() {
      // 完全进入且动画结束的钩子
    }
  }
}
</script>

<style lang="scss" scoped>
  .tracker-piece-entry{
    position: relative;
    width: 100%;
    height: 100%;
    .example-image{
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
  }
</style>

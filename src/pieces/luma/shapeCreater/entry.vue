<template>
  <div class="tracker-piece-entry">
    <svg version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid meet" class="block" viewBox="0 0 200 200">
      <path d="M170.71067811865476,29.289321881345245 L170.71067811865476,170.71067811865476 L29.28932188134526,170.71067811865476 L29.28932188134523,29.28932188134526" fill="#f00" />
    </svg>
    <canvas ref="c1" class="block" width="200" height="200" />
    <svg version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid meet" class="block" viewBox="0 0 200 200">
      <path d="M158.77852522924732,19.09830056250526 L195.10565162951536,130.90169943749473 L100.00000000000001,200 L4.89434837048465,130.90169943749476 L41.221474770752664,19.098300562505273" fill="#f00" />
    </svg>
    <canvas ref="c2" class="block" />
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
      sc2: null
    }
  },
  mounted() {
    this.$emit('config', props)

    this.sc1 = new ShaperCreator({
      canvas: this.$refs.c1,
      points: [[170.71067811865476, 29.289321881345245], [170.71067811865476, 170.71067811865476], [29.28932188134526, 170.71067811865476], [29.28932188134523, 29.28932188134526]]
    })

    this.sc2 = new ShaperCreator({
      canvas: this.$refs.c2,
      points: [[158.77852522924732, 19.09830056250526], [195.10565162951536, 130.90169943749473], [100.00000000000001, 200], [4.89434837048465, 130.90169943749476], [41.221474770752664, 19.098300562505273]]
    })
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

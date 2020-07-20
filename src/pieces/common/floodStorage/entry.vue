<template>
  <div class="tracker-piece-entry">
    <div
      class="block"
      :style="{
        left: `${block.left}px`,
        top: `${block.top}px`
      }"
    />
  </div>
</template>

<script>
import FloodStorage from '@/lib/storyboard/floodStorage'

export default {
  name: 'FloodStorage',
  props: {},
  data() {
    return {
      block: {
        top: 100,
        left: 100
      }
    }
  },
  mounted() {
    this.floodStorage = new FloodStorage(this.block, [
      { key: 'top', speed: 800 },
      { key: 'left', speed: 1000 }
    ])
    this.interval = setInterval(() => {
      this.floodStorage.left = Math.random() * (window.innerWidth - 200) + 100
      this.floodStorage.top = Math.random() * (window.innerHeight - 200) + 100
    }, 2000)
  },
  beforeDestroy() {
    clearInterval(this.interval)
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
      position: absolute;
      width: 100px;
      height: 100px;
      background-color: #ff5455;
    }
  }
</style>

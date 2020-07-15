<template>
  <div class="tracker-piece-entry">
    <div ref="container" class="container" />
  </div>
</template>

<script>
export default {
  name: 'GaussianBlur',
  props: {},
  data() {
    return {
    }
  },
  mounted() {

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
    background-color: #000;
  }
</style>

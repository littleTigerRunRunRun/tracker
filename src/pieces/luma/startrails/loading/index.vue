<template>
  <canvas ref="canvas" class="startrails-loading-animation" />
</template>

<script>
import animePlayer from './main.js'

export default {
  name: 'StartrailsLoadingAnimation',
  mounted() {
    animePlayer.setTarget(this.$refs.canvas)
    animePlayer.run()
  }
}
</script>

<style lang="postcss" scoped>
  .startrails-loading-animation{

  }
</style>

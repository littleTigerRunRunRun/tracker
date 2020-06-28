<template>
  <div class="piece-entry">
    <radar-dash-board />
  </div>
</template>

<script>
import RadarDashBoard from './index.vue'

export default {
  name: 'PieceEntry',
  components: {
    RadarDashBoard
  },
  data() {
    return {

    }
  }
}
</script>

<style lang="scss">
  .piece-entry{
    width: 100%;
    height: 100%;
    background-color: #000;
    opacity: 0;
    animation: fadeOut 0.4s 0.5s;
    animation-fill-mode: forwards;
  }
  @keyframes fadeOut {
    from { opacity: 0 }
    to { opacity: 1 }
  }
</style>

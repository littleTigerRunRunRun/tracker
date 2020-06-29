<template>
  <div class="piece-entry">
    <radar-dash-board :fill="fill" class="orange" :value="value" />
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
      value: 0,
      fill: '#FEDD04'
    }
  },
  mounted() {
    this.interval = setInterval(() => {
      this.changeValue(Math.random() * 100)
    }, 3000)
  },
  beforeDestroy() {
    clearInterval(this.interval)
  },
  methods: {
    changeValue(value) {
      this.value = value
    }
  }
}
</script>

<style lang="scss">
  .piece-entry{
    width: 100%;
    height: 100%;
    opacity: 0;
    background-color: #0B203F;
    animation: fadeOut 0.4s 0.5s;
    animation-fill-mode: forwards;
  }
  @keyframes fadeOut {
    from { opacity: 0 }
    to { opacity: 1 }
  }
</style>

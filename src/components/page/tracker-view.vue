<template>
  <div id="tracker-piece">
    <md-toolbar class="md-accent" md-elevation="3">
      <h3 class="md-title" style="flex: 1">追光®视觉实验室</h3>
      <md-button class="md-primary" @click="jumpTo('home')">撷芳</md-button>
      <md-button class="md-primary" @click="jumpTo('about')">铭志</md-button>
    </md-toolbar>

    <slot name="main" />
  </div>
</template>

<script>
  export default {
    name: "Home",
    methods: {
      jumpTo(name) {
        if (this.$route.name === name) return 
        this.$router.push({ name })
      }
    }
  }
</script>

<style lang="scss">
  #tracker-piece {
    font-family: 'PingFang SC', 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    .navigator{
      width: 240px;
      text-align: left;
    }
  }
</style>

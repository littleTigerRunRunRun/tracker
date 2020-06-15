<template>
  <div id="tracker-piece">
    <md-toolbar class="md-accent" md-elevation="3">
      <h3 class="md-title" style="flex: 1">
        追光®视觉实验室
      </h3>
      <nav-button v-for="(button, index) in buttons" :key="`nav_button_${index}`" :current="current" :code="button.code" :title="button.title" @jumpTo="jumpTo(button)" />
    </md-toolbar>

    <slot name="main" />
  </div>
</template>

<script>
import NavButton from './nav-button'
import HomeComp from '../home'
import GameComp from '../game'
import AboutComp from '../about'

export default {
  name: 'PageView',
  components: {
    NavButton
  },
  data() {
    return {
      current: 'home',
      buttons: [
        { code: 'home', title: '繁华唱遍', component: HomeComp },
        { code: 'game', title: '我本逍遥', component: GameComp },
        { code: 'about', title: '薄酒咏志', component: AboutComp }
      ]
    }
  },
  methods: {
    jumpTo({ code, component }) {
      this.current = name

      this.$emit('pageTo', code)
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

<template>
  <div
    ref="main"
    class="view-piece"
  >
    <!--右上角的按钮群-->
    <div
      class="button-group"
    >
      <md-button
        v-for="(button, bindex) in buttons"
        :key="`button${bindex}`"
        ref="tools"
        class="md-icon-button"
        @click.native="handleButtonClick(button.code)"
      >
        <md-icon>{{ button.icon }}</md-icon>
      </md-button>
    </div>
  </div>
</template>

<script>
import director from './storyboard'

export default {
  name: 'ViewPiece',
  props: {
    piece: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      buttons: [
        { code: 'takeScreenshot', icon: 'photo_camera' },
        { code: 'setConfig', icon: 'build' },
        { code: 'readMD', icon: 'menu_book' },
        { code: 'close', icon: 'close' }
      ],
      lastPiece: null,
      director
    }
  },
  watch: {
    piece(piece) {
      if (!this.lastPiece && piece) {
        this.view()
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.addCharactors()
    })
  },
  methods: {
    view() {
      const rect = this.piece.target.getBoundingClientRect()
    },
    handleButtonClick(code) {
      console.log('button click!', code)
    },
    addCharactors() {
      this.director.addCharactors({
        main: this.$refs.main,
        tools: this.$refs.tools.map((vcomp) => vcomp.$el)
      })
    }
  }
}
</script>

<style lang="scss">
  .view-piece{
    position: fixed;
    z-index: 1000;
    left: -10000px;
    top: 0px;
    background-image: url('../../assets/view.jpg');
    background-size: cover;
    .button-group{
      position: absolute;
      right: 8px;
      top: 8px;
      .md-button{
        position: absolute;
        right: -44px;
        cursor: pointer;
        color: #000;
        background-color: #fff;
        opacity: 0.6;
        border-radius: 0px;
        margin: 0px;
        transform: rotate(90deg);
      }
    }
  }
</style>

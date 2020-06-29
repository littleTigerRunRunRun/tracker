<template>
  <div
    v-if="piece"
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
    <div class="piece-main">
      <component
        :is="comp"
        v-if="comp"
      />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
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
      director,
      comp: ''
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
  },
  methods: {
    view() {
      this.comp = () => import(`../../pieces/${this.piece.data.categoryName}/${this.piece.data.name}/entry.vue`)
      this.lastPiece = true

      this.$nextTick(() => {
        this.addCharactors()
        const rect = this.piece.target.getBoundingClientRect()
        this.director.addProp('startBound', { left: rect.left, top: rect.top, width: rect.width / window.innerWidth * 100, height: rect.height / window.innerHeight * 100 })
        this.director.playScene('moveIn')
      })
    },
    handleButtonClick(code) {
      switch (code) {
        case 'close': {
          const rect = this.piece.target.getBoundingClientRect()
          this.director.addProp('startBound', { left: rect.left, top: rect.top, width: rect.width / window.innerWidth * 100, height: rect.height / window.innerHeight * 100 })
          this.director.playScene('moveOut').then(() => {
            this.$emit('update:piece', null)
            this.lastPiece = false
          })
          break
        }
      }
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
    left: 0px;
    top: 0px;
    background-image: url('../../assets/view.jpg');
    background-size: cover;
    overflow: hidden;
    .button-group{
      position: absolute;
      right: 8px;
      top: 8px;
      .md-button{
        position: absolute;
        right: -44px;
        cursor: pointer;
        color: #fff;
        background-color: #999;
        opacity: 0.6;
        border-radius: 0px;
        margin: 0px;
        transform: rotate(90deg);
        i{
          color: #fff;
        }
      }
    }
    .piece-main{
      width: 100%;
      height: 100%;
      position: relative;
    }
  }
</style>

<template>
  <div
    v-if="piece"
    ref="main"
    class="view-piece"
  >
    <div class="piece-main">
      <component
        :is="comp"
        v-if="comp"
      />
    </div>
    <div v-show="capture" class="capture">
      <div class="capture-shock">
        <div ref="cst" class="shock-top" />
        <div ref="csb" class="shock-bottom" />
      </div>
      <div class="capture-range">
        <div ref="rlt" class="range-left-top" />
        <div ref="rrt" class="range-right-top" />
        <div ref="rlb" class="range-left-bottom" />
        <div ref="rrb" class="range-right-bottom" />
      </div>
    </div>
    <!--右上角的按钮群-->
    <div
      class="button-group"
    >
      <md-button
        v-for="(button, bindex) in buttons"
        :key="`button${bindex}`"
        ref="tools"
        class="md-icon-button"
        :disabled="capture && button.code === 'screenshot'"
        @click.native="handleButtonClick(button.code)"
      >
        <md-icon>{{ button.icon }}</md-icon>
      </md-button>
    </div>
  </div>
</template>

<script>
import director from './storyboard'
import html2canvas from 'html2canvas'
// console.log(html2canvas)

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
        { code: 'screenshot', icon: 'photo_camera' },
        { code: 'setConfig', icon: 'build' },
        { code: 'readMD', icon: 'menu_book' },
        { code: 'close', icon: 'close' }
      ],
      lastPiece: null,
      director,
      comp: '',
      capture: false
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
        this.director.playScenes([{ name: 'moveIn' }, { name: 'toolsIn', delay: 100 }])
      })
    },
    handleButtonClick(code) {
      switch (code) {
        case 'close': {
          const rect = this.piece.target.getBoundingClientRect()
          this.director.addProp('startBound', { left: rect.left, top: rect.top, width: rect.width / window.innerWidth * 100, height: rect.height / window.innerHeight * 100 })
          this.director.playScenes([{ name: 'moveOut' }, { name: 'toolsOut' }]).then(() => {
            this.$emit('update:piece', null)
            this.lastPiece = false
            this.clearCapture()
          })
          break
        }
        case 'screenshot': {
          this.capture = true
          this.director.playScenes([{ name: 'toolsOut' }, { name: 'captureIn', delay: 200 }, { name: 'captureShock', delay: 800 }])
          break
        }
      }
    },
    clearCapture() {
      this.capture = false
    },
    addCharactors() {
      this.director.addCharactors({
        main: this.$refs.main,
        tools: this.$refs.tools.map((vcomp) => vcomp.$el),
        captureRanges: [this.$refs.rlt, this.$refs.rrt, this.$refs.rlb, this.$refs.rrb],
        captureShocks: [this.$refs.cst, this.$refs.csb]
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
    overflow: hidden;
    .piece-main{
      width: 100%;
      height: 100%;
      position: relative;
      background-image: url('../../assets/view.jpg');
      background-size: cover;
    }
    .capture{
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      .capture-range{
        position: absolute;
        width: 100%;
        height: 100%;
        div{
          position: absolute;
          width: 30px;
          height: 30px;
        }
        .range-left-top{
          left: 40px;
          top: 40px;
          border-top: 4px solid #fff;
          border-left: 4px solid #fff;
          clip-path: polygon(0% 100%, 0% 0%, 100% 0%);
        }
        .range-right-top{
          right: 40px;
          top: 40px;
          border-top: 4px solid #fff;
          border-right: 4px solid #fff;
          clip-path: polygon(0% 0%, 100% 0%, 100% 100%);
        }
        .range-left-bottom{
          left: 40px;
          bottom: 40px;
          border-bottom: 4px solid #fff;
          border-left: 4px solid #fff;
          clip-path: polygon(0% 0%, 0% 100%, 100% 100%);
        }
        .range-right-bottom{
          right: 40px;
          bottom: 40px;
          border-bottom: 4px solid #fff;
          border-right: 4px solid #fff;
          clip-path: polygon(0% 100%, 100% 10%, 100% 100%);
        }
      }
      .capture-shock{
        position: absolute;
        width: calc(100% - 22px);
        height: calc(100% - 22px);
        left: 11px;
        top: 11px;
        div {
          position: absolute;
          width: 100%;
          height: 0;
          background-color: #000;
        }
        .shock-top {
          top: 0;
        }
        .shock-bottom {
          bottom: 0;
        }
      }
    }
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
  }
</style>

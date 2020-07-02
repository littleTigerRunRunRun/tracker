<template>
  <div
    v-if="piece"
    ref="main"
    class="view-piece"
  >
    <div ref="comp" class="piece-main">
      <component
        :is="comp"
        v-if="comp"
      />
    </div>
    <div v-show="capture.activate" class="capture" :class="{ activate: capture.activate }">
      <div v-show="capture.src" ref="captureImage" class="capture-image">
        <img :src="capture.src">
        <md-button class="md-icon-button button-done" @click.native="handleSave">
          <md-icon>done</md-icon>
        </md-button>
        <md-button class="md-icon-button button-clear" @click.native="handleCancel">
          <md-icon>clear</md-icon>
        </md-button>
        <div ref="captureImageHide" class="hide-white" />
      </div>
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
      <div class="capture-hide" />
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
        :disabled="capture.activate && button.code === 'screenshot'"
        @click.native="handleButtonClick(button.code)"
      >
        <md-icon>{{ button.icon }}</md-icon>
      </md-button>
    </div>
  </div>
</template>

<script>
import director from './storyboard'
// import html2canvas from 'html2canvas'
import domtoimage from 'dom-to-image'

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
      capture: {
        activate: false,
        src: ''
      }
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
          this.capture.activate = true
          this.director.playScenes([{ name: 'toolsOut' }, { name: 'captureRangeIn', delay: 200 }, { name: 'captureShock', delay: 600 }]).then(() => {
            // console.log(this.$refs.comp)
            // html2canvas(this.$refs.comp, {
            //   foreignObjectRendering: true,
            //   useCORS: true
            // }).then((canvas) => {
            //   document.body.appendChild(canvas)
            //   canvas.style.position = 'fixed'
            //   canvas.style.zIndex = 99
            //   canvas.style.left = 0
            //   canvas.style.top = 0
            // })
            domtoimage.toPng(this.$refs.comp).then((src) => {
              this.capture.src = src
              this.$nextTick(() => {
                const { width, height } = this.$refs.captureImage.getBoundingClientRect()
                this.director.addProps({
                  imageStartSize: { width, height },
                  imageEndSize: { width: width * 0.2, height: height * 0.2 }
                })
                this.director.playScenes([{ name: 'toolsIn' }, { name: 'captureRangeOut' }, { name: 'captureImageMove', delay: 100 }])
              })
            })
          })
          break
        }
      }
    },
    handleCancel() {
      this.director.playScenes('captureCancel').then(() => {
        this.clearCapture()
      })
    },
    handleSave() {
      const bound = this.$refs.captureImage.getBoundingClientRect()
      this.director.addProp('imageShrinkBound')
      this.director.playScenes('captureSave').then(() => {
        console.log('save!')
      })
    },
    clearCapture() {
      this.capture.activate = false
      this.capture.src = ''

      this.director.resetCharator('captureImage')
    },
    addCharactors() {
      this.director.addCharactors({
        main: this.$refs.main,
        tools: this.$refs.tools.map((vcomp) => vcomp.$el),
        captureRanges: [this.$refs.rlt, this.$refs.rrt, this.$refs.rlb, this.$refs.rrb],
        captureShocks: [this.$refs.cst, this.$refs.csb],
        captureImage: this.$refs.captureImage
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
      &.activate{
        pointer-events: auto;
      }
      .capture-image{
        position: absolute;
        width: 100%;
        height: 100%;
        border: 2px solid #fff;
        box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.4);
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
        .button-done, .button-clear {
          position: absolute;
          bottom: 4px;
          background-color: #999;
          border-radius: 0px;
          width: 32px;
          height: 32px;
          min-width: 0px;
          margin: 0;
          &:before, .md-ripple, .md-ripple-wave{
            border-radius: 0px !important;
          }
          i{
            color: #fff;
          }
        }
        .button-done {
          right: 40px;
        }
        .button-clear {
          right: 4px;
        }
        .captureImageHide{
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          background-color: #fff;
        }
      }
      .capture-range{
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
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
        &:before, .md-ripple, .md-ripple-wave{
          border-radius: 0px !important;
        }
        position: absolute;
        right: -44px;
        cursor: pointer;
        color: #fff;
        background-color: #999;
        opacity: 0.6;
        border-radius: 0px;
        margin: 0px;
        transform: rotate(90deg);
      }
    }
  }
</style>

<template>
  <div
    v-show="piece"
    ref="main"
    class="view-piece"
  >
    <div class="background" :style="{ backgroundImage: `url(${piece && piece.data && piece.data.capture || 'http://127.0.0.1:7001/public/img/capture/default.jpg'})` }" />
    <div ref="comp" class="piece-main">
      <component
        :is="comp"
        v-if="comp"
        ref="target"
      />
    </div>
    <div class="decorators">
      <div class="water-spray" />
    </div>
    <div v-show="capture.activate" class="capture" :class="{ activate: capture.activate }">
      <div v-show="capture.src" ref="captureImage" class="capture-image">
        <div ref="captureImageContent" class="image-content">
          <img :src="capture.src">
          <md-button class="md-icon-button button-done" :disabled="capture.imageDisabled" @click.native="handleSave">
            <md-icon>done</md-icon>
          </md-button>
          <md-button class="md-icon-button button-clear" :disabled="capture.imageDisabled" @click.native="handleCancel">
            <md-icon>clear</md-icon>
          </md-button>
        </div>
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
        :disabled="
          (capture.activate && button.code === 'screenshot') ||
            (markdown.activate && button.code === 'markdown')
        "
        @click.native="handleButtonClick(button.code)"
      >
        <md-icon>{{ button.icon }}</md-icon>
      </md-button>
    </div>
  </div>
</template>

<script>
import { saveCapture } from './api'
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
        { code: 'config', icon: 'build' },
        { code: 'markdown', icon: 'menu_book' },
        { code: 'close', icon: 'close' }
      ],
      toolMap: {
        markdown: 2
      },
      lastPiece: null,
      director,
      comp: '',
      capture: {
        activate: false,
        src: '',
        imageDisabled: false
      },
      markdown: {
        activate: false
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
  beforeDestroy() {
    this.director.destroy()
    this.director = null
  },
  methods: {
    view() {
      this.comp = () => import(`../../pieces/${this.piece.data.categoryName}/${this.piece.data.name}/entry.vue`)
      this.lastPiece = true

      this.$nextTick(() => {
        this.addCharactors()
        const rect = this.piece.target.getBoundingClientRect()
        this.director.addProp('startBound', { left: rect.left, top: rect.top, width: rect.width / window.innerWidth * 100, height: rect.height / window.innerHeight * 100 })
        this.director.playScenes([{ name: 'moveIn' }, { name: 'toolsIn', delay: 100 }]).then(() => {
          if (this.$refs.target && this.$refs.target.onEnterEnd) this.$refs.target.onEnterEnd()
        })
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
            this.clearMarkdown()
          })
          break
        }
        case 'screenshot': {
          this.capture.activate = true
          this.director.playScenes([{ name: 'toolsOut' }, { name: 'captureRangeIn', delay: 200 }, { name: 'captureShock', delay: 600 }]).then(() => {
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
        case 'config': {
          this.director.playScenes([{ name: 'toolsOut' }])
          break
        }
        case 'markdown': {
          // (() => import(`../../pieces/${this.piece.data.categoryName}/${this.piece.data.name}/doc.md`))().then((data) => {
          //   console.log(data)
          // })
          this.markdown.activate = true
          const bound = this.$refs.tools[this.toolMap.markdown].$el.getBoundingClientRect()
          this.director.playScenes([{ name: 'markdownIn' }, { name: 'toolsout' }], { markdownLeft: { left: bound.left }})
          break
        }
      }
    },
    handleCancel() {
      this.capture.imageDisabled = true
      this.director.playScenes('captureCancel').then(() => {
        this.capture.imageDisabled = false
        this.clearCapture()
      })
    },
    handleSave() {
      const bound = this.$refs.captureImage.getBoundingClientRect()
      this.director.addProp('imageShrinkBound', {
        width: 20,
        height: 20,
        left: bound.left + (bound.width - 20) / 2,
        bottom: bound.height / 2 + 10
      })
      saveCapture({ src: this.capture.src, id: this.piece.data.id, categoryId: this.piece.data.categoryId }).then((data) => {
        // console.log(data)
        this.$emit('pieceRefresh')
      })
      this.capture.imageDisabled = true
      this.director.playScenes('captureSave', { endBottom: { bottom: window.innerHeight + 10 }}).then(() => {
        this.capture.imageDisabled = false
        this.clearCapture()
      })
    },
    clearCapture() {
      this.capture.activate = false
      this.capture.src = ''
      this.capture.imageDisabled = false

      this.director.resetCharator('captureImage')
      this.director.resetCharator('captureImageContent')
    },
    clearMarkdown() {
      this.markdown.activate = false
    },
    addCharactors() {
      this.director.addCharactors({
        main: this.$refs.main,
        tools: this.$refs.tools.map((vcomp) => vcomp.$el),
        captureRanges: [this.$refs.rlt, this.$refs.rrt, this.$refs.rlb, this.$refs.rrb],
        captureShocks: [this.$refs.cst, this.$refs.csb],
        captureImage: this.$refs.captureImage,
        captureImageContent: this.$refs.captureImageContent
      })
    }
  }
}
</script>

<style lang="scss">
  .view-piece{
    position: fixed;
    z-index: 11;
    left: 0px;
    top: 0px;
    overflow: hidden;
    .background{
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      background-size: cover;
    }
    .piece-main{
      width: 100%;
      height: 100%;
      position: relative;
      // background-image: url('../../assets/view.jpg');
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
        transform-origin: 50% 50%;
        backface-visibility: hidden;
        background-color: #fff;
        .image-content{
          width: 100%;
          height: 100%;
          position: relative;
          opacity: 1;
        }
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
      }
      .capture-range{
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        pointer-events: none;
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
        pointer-events: none;
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
      width: 100%;
      right: 0px;
      top: 8px;
      .md-button{
        transition: none !important;
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
        i{
          color: #fff;
        }
      }
    }
  }
</style>

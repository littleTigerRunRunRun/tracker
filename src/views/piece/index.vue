<template>
  <div
    v-show="piece || straightPath.length"
    ref="main"
    class="view-piece"
    :class="{
      'straight-path': straightPath.length > 0
    }"
  >
    <div class="background" :style="{ backgroundImage: `url(${piece && piece.data && piece.data.capture})` }" />
    <div ref="comp" class="piece-main">
      <component
        :is="comp"
        v-if="comp"
        ref="target"
        v-bind="config.values"
        @config="registerConfig"
        @quality="setQuality"
      />
    </div>
    <!--截图相关内容-->
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
    <!---配置表-->
    <config-panel
      class="config-panel"
      :form="config.form"
      :values="config.values"
      :style="{
        right: `${config.right}px`,
        width: `${config.width}px`,
        opacity: config.opacity
      }"
      @close="closeConfig"
    />
    <!--右上角的按钮群-->
    <div
      class="button-group"
    >
      <md-button
        v-for="(button, bindex) in buttons"
        :key="`button${bindex}`"
        ref="tools"
        class="md-icon-button rect-button"
        :disabled="
          (configDisabled && button.code === 'config') ||
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
import configPanel from './configPanel/index.vue'

export default {
  name: 'ViewPiece',
  components: {
    configPanel
  },
  inject: ['router'],
  props: {
    piece: {
      type: Object,
      default: null
    },
    straightPath: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      buttons: [
        { code: 'screenshot', icon: 'photo_camera' },
        { code: 'config', icon: 'build' },
        // { code: 'markdown', icon: 'menu_book' },
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
      },
      config: {
        values: {},
        form: {},
        width: 480,
        right: -480,
        opacity: 0
      },
      imageQuality: 0.8,
      configDisabled: false
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
    if (this.straightPath.length > 0) {
      this.showPieceStraight()
    }
  },
  beforeDestroy() {
    this.director.destroy()
    this.director = null
  },
  methods: {
    // 根据路由直接读取组件而不是通过接口查询
    showPieceStraight() {
      this.comp = () => import(`../../pieces/${this.straightPath[1]}/${this.straightPath[2]}/entry.vue`)

      this.$nextTick(() => {
        this.addCharactors()
        // console.log(rect)
        this.director.addProp('startBound', { left: 0, top: 0, width: 100, height: 100 })
        this.director.playScenes([{ name: 'toolsIn', delay: 100 }]).then(() => {
          if (this.$refs.target && this.$refs.target.onEnterEnd) this.$refs.target.onEnterEnd()
        })
      })
    },
    // 从列表打开的过程处理
    view() {
      this.router.replace(['piece', this.piece.data.categoryName, this.piece.data.name])
      this.comp = () => import(`../../pieces/${this.piece.data.categoryName}/${this.piece.data.name}/entry.vue`)
      this.lastPiece = true

      this.$nextTick(() => {
        this.addCharactors()
        const rect = this.piece.target.getBoundingClientRect()
        // console.log(rect)
        this.director.addProp('startBound', { left: rect.left, top: rect.top, width: rect.width / window.innerWidth * 100, height: rect.height / window.innerHeight * 100 })
        this.director.playScenes([{ name: 'moveIn' }, { name: 'toolsIn', delay: 100 }]).then(() => {
          if (this.$refs.target && this.$refs.target.onEnterEnd) this.$refs.target.onEnterEnd()
        })
      })
    },
    // 工具栏响应
    handleButtonClick(code) {
      switch (code) {
        case 'close': {
          if (this.piece && this.piece.target) {
            const rect = this.piece.target.getBoundingClientRect()
            this.director.addProp('startBound', { left: rect.left, top: rect.top, width: rect.width / window.innerWidth * 100, height: rect.height / window.innerHeight * 100 })
          }
          this.director.playScenes([{ name: 'moveOut' }, { name: 'toolsOut' }]).then(() => {
            this.router.replace(['home'])
            this.$emit('update:piece', null)
            this.$emit('update:straightPath', [])
            this.lastPiece = false
            this.clearCapture()
            this.clearMarkdown()
          })
          break
        }
        case 'screenshot': {
          this.capture.activate = true
          this.director.playScenes([{ name: 'toolsOut' }, { name: 'captureRangeIn', delay: 200 }, { name: 'captureShock', delay: 600 }]).then(() => {
            domtoimage.toJpeg(this.$refs.comp, { quality: this.imageQuality }).then((src) => {
              // console.log(src)
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
          this.director.playScenes([{ name: 'toolsOut' }, { name: 'configIn', delay: 100 }]).then(() => {
            // this.config.activate = true
          })
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
    // 取消截图保存
    handleCancel() {
      this.capture.imageDisabled = true
      this.director.playScenes('captureCancel').then(() => {
        this.capture.imageDisabled = false
        this.clearCapture()
      })
    },
    // 奥村截图
    handleSave() {
      const bound = this.$refs.captureImage.getBoundingClientRect()
      this.director.addProp('imageShrinkBound', {
        width: 20,
        height: 20,
        left: bound.left + (bound.width - 20) / 2,
        bottom: bound.height / 2 + 10
      })
      const params = {}
      if (this.piece) {
        params.id = this.piece.data.id
        params.categoryId = this.piece.data.categoryId
      } else {
        params.name = this.straightPath[2]
        params.categoryName = this.straightPath[1]
      }
      saveCapture(Object.assign({ src: this.capture.src }, params)).then((data) => {
        // console.log(data)
        this.$emit('pieceRefresh')
      })
      this.capture.imageDisabled = true
      this.director.playScenes('captureSave', { endBottom: { bottom: window.innerHeight + 10 }}).then(() => {
        this.capture.imageDisabled = false
        this.clearCapture()
      })
    },
    // 清空截图相关
    clearCapture() {
      this.capture.activate = false
      this.capture.src = ''
      this.capture.imageDisabled = false

      this.director.resetCharator('captureImage')
      this.director.resetCharator('captureImageContent')
    },
    // 清空文档相关
    clearMarkdown() {
      this.markdown.activate = false
    },
    // 添加动画对象
    addCharactors() {
      this.director.addCharactors({
        main: this.$refs.main,
        tools: this.$refs.tools.map((vcomp) => vcomp.$el),
        captureRanges: [this.$refs.rlt, this.$refs.rrt, this.$refs.rlb, this.$refs.rrb],
        captureShocks: [this.$refs.cst, this.$refs.csb],
        captureImage: this.$refs.captureImage,
        captureImageContent: this.$refs.captureImageContent,
        config: this.config
      })
    },
    // 注册配置表
    registerConfig(config) {
      if (!config) this.configDisabled = true

      const values = {}
      const form = {}
      for (const key in config) {
        form[key] = config[key].form
        values[key] = typeof config[key].default === 'function' ? config[key].default() : config[key].default
      }
      this.config.values = values
      this.config.form = form
    },
    closeConfig() {
      this.director.playScenes([{ name: 'toolsIn', delay: 100 }, { name: 'configOut' }])
    },
    setQuality(quality) {
      this.imageQuality = quality
    }
  }
}
</script>

<style lang="scss">
  @import './style.scss';
</style>

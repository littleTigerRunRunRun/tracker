<template>
  <div
    class="view-piece"
    :class="{ show, hide }"
    :style="{
      width: `${rect.width}`,
      height: `${rect.height}`,
      transform: `translate(${rect.left}px, ${rect.top}px)`,
      opacity: rect.opacity
    }"
    @transitionend="handleEnterEnd"
  >
    <!--右上角的按钮群-->
    <div
      class="button-group"
      :class="{ 'anime-start': buttonAnime }"
    >
      <md-button class="md-icon-button" @click.native="takeScreenshot">
        <md-icon>photo_camera</md-icon>
      </md-button>
      <md-button class="md-icon-button" @click.native="setConfig">
        <md-icon>build</md-icon>
      </md-button>
      <md-button class="md-icon-button" @click.native="readMD">
        <md-icon>menu_book</md-icon>
      </md-button>
      <md-button class="md-icon-button" @click.native="close">
        <md-icon>close</md-icon>
      </md-button>
    </div>
  </div>
</template>

<script>
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
      lastPiece: null,
      show: false,
      hide: false,
      rect: {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        opacity: 0
      },
      // button动画配置
      buttonCount: 0,
      buttonAnime: false
    }
  },
  watch: {
    piece(piece) {
      if (!this.lastPiece && piece) {
        this.view()
      }
    }
  },
  methods: {
    view() {
      const rect = this.piece.target.getBoundingClientRect()
      this.rect.left = rect.left
      this.rect.top = rect.top
      this.rect.width = `${rect.width}px`
      this.rect.height = `${rect.height}px`

      requestAnimationFrame(() => {
        this.show = true
        this.rect.left = 0
        this.rect.top = 0
        this.rect.width = '100%'
        this.rect.height = '100%'
        this.rect.opacity = 1
      })
    },
    handleEnterEnd() {
      this.buttonCount++
      if (this.buttonCount === 3 && !this.buttonAnime) this.buttonAnime = true
    },
    // 获取一个截图，作为外部的screenshot
    takeScreenshot() {

    },
    // 查看开发思路文档
    readMD() {

    },
    // 配置数据
    setConfig() {

    },
    // 关闭
    close() {
      this.hide = true

      this.$nextTick(() => {
        const rect = this.piece.target.getBoundingClientRect()
        this.rect.left = rect.left
        this.rect.top = rect.top
        this.rect.width = `${rect.width}px`
        this.rect.height = `${rect.height}px`
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
    &.show{
      left: 0px;
      transition: transform 0.3s, width 0.3s, height 0.3s, opacity 0.1s;
      transition-timing-function: ease-in;
    }
    .button-group{
      position: absolute;
      right: 8px;
      top: 8px;
      &.anime-start{
        .md-button{
          transform: rotate(0deg);
          &:nth-child(4n + 1) {
            right: 152px;
          }
          &:nth-child(4n + 2) {
            right: 104px;
          }
          &:nth-child(4n + 3) {
            right: 56px;
          }
          &:nth-child(4n + 4) {
            right: 8px;
          }
        }
      }
      .md-button{
        position: absolute;
        right: -44px;
        cursor: pointer;
        color: #000;
        background-color: #fff;
        opacity: 0.6;
        border-radius: 0px;
        margin: 0px;
        transition: right 0.4s, transform 0.4s;
        transform: rotate(90deg);
        &:before, span, .md-ripple{
          border-radius: 0px;
        }
        &:nth-child(4n + 1) {
          transition-duration: 0.3s;
        }
        &:nth-child(4n + 2) {
          transition-duration: 0.5s;
        }
        &:nth-child(4n + 3) {
          transition-duration: 0.7s;
        }
        &:nth-child(4n + 4) {
          transition-duration: 0.9s;
        }
      }
    }
  }
</style>

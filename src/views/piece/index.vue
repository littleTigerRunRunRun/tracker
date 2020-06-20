<template>
  <div
    class="view-piece"
    :class="{ show }"
    :style="{
      width: `${rect.width}`,
      height: `${rect.height}`,
      transform: `translate(${rect.left}px, ${rect.top}px)`,
      opacity: rect.opacity
    }"
    @transitionend="handleEnterEnd"
  >
    <!--右上角的按钮群-->
    <div class="button-group">
      <md-button class="md-icon-button" @click.native="addCategory">
        <md-icon>photo_camera</md-icon>
      </md-button>
      <md-button class="md-icon-button" @click.native="addCategory">
        <md-icon>build</md-icon>
      </md-button>
      <md-button class="md-icon-button" @click.native="addCategory">
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
      rect: {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        opacity: 0
      }
    }
  },
  watch: {
    piece(piece) {
      if (!this.lastPiece && piece) {
        this.view()
      } else {
        this.hide()
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
    hide() {
      console.log('hide')
    },
    handleEnterEnd() {
      console.log('end')
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
      transition: transform 0.5s, width 0.5s, height 0.5s, opacity 0.2s;
      transition-timing-function: ease-in;
    }
    .button-group{
      position: absolute;
      right: 8px;
      top: 8px;
      .md-button{
        cursor: pointer;
        color: #000;
        background-color: #fff;
        opacity: 0.6;
        border-radius: 0px;
        margin: 0px;
        &:not(:first-of-type) {
          margin-left: 8px;
        }
        &:before, span, .md-ripple{
          border-radius: 0px;
        }
      }
    }
  }
</style>

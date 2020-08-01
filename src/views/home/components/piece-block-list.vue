<template>
  <div class="piece-block-list md-layout">
    <div class="piece-block md-layout-item md-size-25" @click="addPiece">
      <add-piece-dialog
        ref="addPiece"
        :category-id="categoryId"
        :category-title="categoryTitle"
        @pieceAdded="$emit('pieceAdded')"
      />
      <img width="100%" src="../../../assets/gold_rect.jpg">
      <div class="piece-content">
        <md-button class="md-icon-button add-button">
          <md-icon>add</md-icon>
        </md-button>
      </div>
    </div>
    <div
      v-for="(piece, index) in list"
      :key="`piece${index}`"
      ref="piece"
      class="piece-block md-layout-item md-size-25"
      :class="{ 'piece-gather': piece.type === 'gather' }"
      @click="viewPiece(piece, index)"
    >
      <img width="100%" src="../../../assets/gold_rect.jpg">
      <div class="piece-content">
        <div class="common-content">
          <img :src="piece.capture || 'http://127.0.0.1:7001/public/img/capture/default.jpg'">
          <div class="content-block">
            <span class="title text-content">
              {{ piece.title }}
            </span>
            <span class="desc text-content">
              {{ piece.desc }}
            </span>
            <!-- <span class="label text-content">
              {{ piece.label.join('/') }}
            </span> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AddPieceDialog from './add-piece-dialog'

export default {
  name: 'PieceBlock',
  components: {
    AddPieceDialog
  },
  inject: ['handleViewPiece'],
  props: {
    list: {
      type: Array,
      default: () => []
    },
    categoryId: {
      type: [String, Number],
      default: ''
    },
    categoryTitle: {
      type: String,
      default: ''
    },
    categoryName: {
      type: [String, Number],
      default: ''
    }
  },
  methods: {
    addPiece() {
      this.$refs.addPiece.activate()
    },
    viewPiece(piece, index) {
      this.handleViewPiece(Object.assign(piece, { categoryName: this.categoryName, categoryId: this.categoryId }), this.$refs.piece[index])
    }
  }
}
</script>

<style lang="scss">
.piece-block-list{
  width: 100%;
  .piece-block{
    position: relative;
    width: 100%;
    transform-style:preserve-3d;
    perspective:800px;
    margin-top: 20px;
    &.md-size-25{
      min-width: 0;
      max-width: none;
      flex-basis: calc(25% - 15px);
      flex-grow: 0;
      flex-shrink: 25;
    }
    & > img {
      position: relative;
      opacity: 0;
    }
    &:not(:nth-child(4n + 1)) {
      margin-left: 20px;
    }
    &.piece-gather{
      .piece-content{
        .common-content{
          transform: translate(4px, -4px);
        }
        &:before, &:after{
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          display: block;
          background-color: #fff;
          top: 0px;
          left: 0px;
          z-index: -1;
          box-shadow:
            0px 1px 1px rgba(0, 0, 0, 0.15),
            0px 1px 3px rgba(0, 0, 0, 0.15),
            -1px 1px 3px rgba(0, 0, 0, 0.1);
        }
        &:before{
          transform: translate(-4px, 4px);
        }
        &:after{
          transform: translate(0px, 0px);
        }
      }
    }
    &:hover{
      .piece-content{
        transform: translateZ(30px);
        box-shadow:
          0px 1px 1px rgba(0, 0, 0, 0.05),
          0px 1px 3px rgba(0, 0, 0, 0.05),
          -1px 1px 3px rgba(0, 0, 0, 0.05),
          1px 1px 3px rgba(0, 0, 0, 0.05),
          1px 2px 5px rgba(0, 0, 0, 0.05),
          1px 2px 7px 2px rgba(0, 0, 0, 0.05);
        .common-content{
          .content-block{
            background-color: rgba(0, 0, 0, 0.6);
            transform: translate(0, 0);
            .desc{
              opacity: 0.6;
            }
          }
        }
      }
    }
    .piece-content{
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      cursor: pointer;
      transition: box-shadow 0.2s, transform 0.3s;
      // border-radius: 4px;
      box-shadow:
        0px 1px 1px rgba(0, 0, 0, 0.05),
        0px 1px 3px rgba(0, 0, 0, 0.05),
        -1px 1px 3px rgba(0, 0, 0, 0.05);
      .add-button{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -60%);
      }
      .common-content{
        width: 100%;
        height: 100%;
        background-size: cover;
        position: relative;
        overflow: hidden;
        &>img{
          position: absolute;
          min-width: 100%;
          min-height: 100%;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
        .content-block{
          position: absolute;
          padding: 6px 10px;
          bottom: 0px;
          width: 100%;
          background-color: rgba(0, 0, 0, 0);
          transition: transform 0.3s, background-color 0.3s;
          transform: translate(0, calc(100% - 40px));
          .text-content{
            position: relative;
            color: #fff;
            width: 100%;
            display: inline-block;
          }
          .title{
            line-height: 28px;
            font-size: 16px;
            color: #fff;
            font-weight: bold;
            text-shadow: 0 0 2px #000;
            opacity: 0.8;
          }
          .desc{
            font-size: 12px;
            line-height: 14px;
            text-shadow: 0 0 4px #000;
            opacity: 0;
            transition: opacity 0.3s;
          }
          .label{
            text-shadow: 0 0 4px #000;
            opacity: 0.4;
          }
        }
      }
    }
  }
}
</style>

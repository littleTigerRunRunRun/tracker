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
      class="piece-block md-layout-item md-size-25"
    >
      <img width="100%" src="../../../assets/gold_rect.jpg">
      <div class="piece-content">
        <div class="common-content">
          <span class="title">
            {{ piece.title }}
          </span>
          <span class="desc">
            {{ piece.desc }}
          </span>
          <span class="label">
            {{ piece.label.join('/') }}
          </span>
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
    }
  },
  methods: {
    addPiece() {
      this.$refs.addPiece.activate()
    }
  }
}
</script>

<style lang="scss">
.piece-block-list{
  width: 100%;
  .piece-block{
    position: relative;
    & > img {
      opacity: 0;
    }
    &:not(:first-of-type) {
      margin-left: 20px;
    }
    .piece-content{
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      cursor: pointer;
      transition: box-shadow 0.2s;
      border-radius: 4px;
      overflow: hidden;
      box-shadow:
        0px 1px 1px rgba(0, 0, 0, 0.05),
        0px 1px 3px rgba(0, 0, 0, 0.05),
        -1px 1px 3px rgba(0, 0, 0, 0.05);
      &:hover{
        box-shadow:
          0px 1px 1px rgba(0, 0, 0, 0.05),
          0px 1px 3px rgba(0, 0, 0, 0.05),
          -1px 1px 3px rgba(0, 0, 0, 0.05),
          1px 1px 3px rgba(0, 0, 0, 0.05),
          1px 2px 5px rgba(0, 0, 0, 0.05),
          1px 2px 7px 2px rgba(0, 0, 0, 0.05);
      }
      .add-button{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -60%);
      }
      .common-content{
        width: 100%;
        height: 100%;
        padding: 6px 10px;
        background-image: url('../../../assets/view.webp');
        background-size: cover;
        position: relative;
        span{
          color: #fff;
          display: inline-block;
          width: 100%;
        }
        .title{
          font-size: 18px;
          color: #fff;
          font-weight: bold;
          text-shadow: 0 0 2px #000;
          margin-top: 4px;
        }
        .desc{
          text-shadow: 0 0 4px #000;
          margin-top: 8px;
        }
        .label{
          position: absolute;
          bottom: 12px;
          left: 10px;
          text-shadow: 0 0 4px #000;
        }
      }
    }
  }
}
</style>

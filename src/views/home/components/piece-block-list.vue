<template>
  <div class="piece-block-list md-layout">
    <div class="piece-block md-layout-item md-size-25">
      <add-piece-dialog
        ref="addPiece"
        :category-id="categoryId"
        :category-title="categoryTitle"
      />
      <img width="100%" src="../../../assets/gold_rect.jpg">
      <div class="piece-content">
        <md-button class="md-icon-button add-button" @click.native="addPiece">
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
          内容
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
    .piece-content{
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      .add-button{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      .common-content{
        box-shadow:
          0px 1px 1px rgba(0, 0, 0, 0.05),
          0px 1px 3px rgba(0, 0, 0, 0.05),
          -1px 1px 3px rgba(0, 0, 0, 0.05),
          1px 1px 3px rgba(0, 0, 0, 0.05),
          1px 2px 5px rgba(0, 0, 0, 0.05),
          1px 2px 7px 2px rgba(0, 0, 0, 0.05);
      }
    }
  }
}
</style>

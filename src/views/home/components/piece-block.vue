<template>
  <div class="piece-block">
    <img width="100%" src="../../../assets/gold_rect.jpg">
    <div class="piece-content">
      piece-content
    </div>
  </div>
</template>

<script>
export default {
  name: 'PieceBlock'
}
</script>

<style lang="scss">
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
      background-color: rgba(99, 99, 99, 0.4);
    }
  }
</style>

<template>
  <div class="tracker-piece-entry">
    <!-- 这里开始后续都可以清理 -->
    <div ref="title" class="tracker-piece-title">
      autoConfig自动表单文件生成测试
    </div>
    <div ref="content" class="tracker-piece-container">
      <div class="start">
        测试是否能够正常生成表单文件
      </div>
    </div>
  </div>
</template>

<script>
import props from './config'

export default {
  name: 'AutoConfig',
  props,
  data() {
    return {
    }
  },
  mounted() {
    this.$emit('config', props)
  },
  beforeDestroy() {
  },
  methods: {
    onEnterEnd() {
      // 完全进入且动画结束的钩子
    }
  }
}
</script>

<style lang="scss" scoped>
  .tracker-piece-entry{
    position: relative;
    width: 100%;
    height: 100%;
    /* 这里开始后续都可以清理 */
    padding: 56px 8px 8px 8px;
    .tracker-piece-title{
      position: absolute;
      top: 8px;
      left: 16px;
      height: 40px;
      line-height: 40px;
      color: #fff;
      font-size: 24px;
      text-shadow: 0px 0px 2px rgba(0, 0, 0, 0.5);
    }
    .tracker-piece-container{
      position: relative;
      width: 100%;
      height: 100%;
      left: 0px;
      background-color: rgba(255, 255, 255, 0.8);
      padding: 16px;
      .start{
        font-size: 20px;
      }
    }
  }
</style>

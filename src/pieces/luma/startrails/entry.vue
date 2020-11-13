<template>
  <div class="tracker-piece-entry" :class="{ anime: animeStart }">
    <!--实时内容编辑和展示-->
    <panel-main ref="main" />
    <!--自适应管理面板，管理自适应方案，以宽度和宽高比为xy轴，以面积展示方案涵盖范围-->
    <panel-adaptation ref="adaptation" />
    <!--状态管理面板：装饰物尺寸、模板、路径等管理-->
    <panel-status ref="status" />
    <!--细节面板：工具的细节，例如画笔的选择，颜色的配置等等-->
    <panel-detail ref="detail" />
    <!--工具面板：笔刷（选择画笔）、油漆桶（上色）、镐子（纵向位移）、烘焙、手电筒（打光）、魔术棒（添加粒子效果）-->
    <panel-tool ref="tool" />
  </div>
</template>

<script>
import stateBus from './state'
import props from './config'
import panelMain from './panels/main'
import panelAdaptation from './panels/adaptation'
import panelTool from './panels/tool'
import panelStatus from './panels/status'
import panelDetail from './panels/detail'
console.log(stateBus)

export default {
  name: 'Startrails',
  provide() {
    return {
      state: stateBus
    }
  },
  components: {
    panelMain,
    panelAdaptation,
    panelTool,
    panelStatus,
    panelDetail
  },
  props,
  data() {
    return {
      animeStart: false
    }
  },
  mounted() {
    this.$emit('config', props)
    this.animeStart = true
    this.directorPosition()
  },
  beforeDestroy() {
  },
  methods: {
    onEnterEnd() {},
    directorPosition() {
    }
  }
}
</script>

<style lang="scss" scoped>
  .tracker-piece-entry{
    position: relative;
    width: 100%;
    height: 100%;
    background: radial-gradient(farthest-side at 50% 30%, rgba(255, 255, 255, 1), rgba(100, 100, 100, 0.3));
    opacity: 0;
    &.anime{
      animation: fadeOut ease-out 0.6s;
      animation-fill-mode: forwards;
    }
  }

  @keyframes fadeOut {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
</style>

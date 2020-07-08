<template>
  <div class="tracker-piece-entry" ref="container">
    <div class="show-how-blocks">
      <div class="block1 block" />
      <div class="block2 block" />
      <div class="block3 block" />
    </div>
  </div>
</template>

<script>
import Director from '@/lib/storyboard/director.js'

export default {
  name: 'Director',
  props: {},
  data() {
    return {
      director: new Director({
        storyborad: {
          charactors: [
            { name: 'container', type: 'dom' }
          ],
          props: [],
          scenes: {
            in: [
              {
                charactors: ['container'],
                desc: '进入后背景颜色淡入',
                actionClips: [
                  {
                    delay: 0,
                    duration: 400,
                    ease: 'easeOut',
                    from: [{ opacity: 0 }],
                    to: [{ opacity: 1 }]
                  }
                ]
              }
            ]
          }
        }
      })
    }
  },
  mounted() {
    requestAnimationFrame(() => {
      console.log('mounted!')
      this.addCharactors()
      this.director.playScenes([{ name: 'in', delay: 200 }])
    })
  },
  beforeDestroy() {
    this.director.destroy()
    this.director = null
  },
  methods: {
    onEnterEnd() {
      // 完全进入且动画结束的钩子
    },
    addCharactors() {
      console.log(this.$refs.container, this.director)
      this.director.addCharactors({
        container: this.$refs.container
      })
    }
  }
}
</script>

<style lang="scss">
  .tracker-piece-entry{
    position: relative;
    width: 100%;
    height: 100%;
    /* 这里开始后续都可以清理 */
    background-color: #fff;
    opacity: 0;
    .show-how-blocks{
      .block{
        width: 60px;
        height: 60px;
        position: absolute;
      }
      .block1{
        top: 100px;
        left: 100px;
        background-color: #DC4E41;
      }
      .block2{
        top: 200px;
        left: 100px;
        background-color: #1BA160;
      }
      .block3{
        top: 300px;
        left: 100px;
        background-color: #FFCD42;
      }
    }
  }
</style>

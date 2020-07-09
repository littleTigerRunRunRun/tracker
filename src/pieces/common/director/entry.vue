<template>
  <div
    class="tracker-piece-entry"
    :style="{ opacity: charactors.container.opacity }"
  >
    <div class="show-how-blocks">
      <div
        class="block1 block"
        :style="{
          opacity: charactors.block1.opacity,
          left: `${charactors.block1.left}px`,
          top: `${charactors.block1.top}px`,
          rotate: `transform: rotate(${charactors.block1.rotate}deg)`,
        }"
      />
      <div
        class="block2 block"
        :style="{
          opacity: charactors.block2.opacity,
          left: `${charactors.block2.left}px`,
          top: `${charactors.block2.top}px`,
          rotate: `transform: rotate(${charactors.block2.rotate}deg)`,
        }"
      />
      <div
        class="block3 block"
        :style="{
          opacity: charactors.block3.opacity,
          left: `${charactors.block3.left}px`,
          top: `${charactors.block3.top}px`,
          rotate: `transform: rotate(${charactors.block3.rotate}deg)`,
        }"
      />
    </div>
    <div
      class="timeline-ui"
      :style="{
        opacity: charactors.timelineContainer.opacity,
        bottom: `${charactors.timelineContainer.bottom}px`,
        boxShadow: `0 2px ${charactors.timelineContainer.shadowSize}px rgba(0, 0, 0, 0.5)`
      }"
    >
      <div class="timeline-main">
        <timeline-ui-control @control="handleControl" />
        <div class="timeline-targets">
          <div
            v-for="(target, key) in timelineTargets"
            :key="`target${key}`"
            class="timeline-target"
          >
            {{ target.name }}
            <md-button class="md-icon-button button-add" @click.native="addClip">
              <md-icon>add</md-icon>
            </md-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Director from '@/lib/storyboard/director.js'
import TimelineUiControl from './timeline-ui-control'

export default {
  name: 'Director',
  components: {
    TimelineUiControl
  },
  props: {},
  data() {
    return {
      charactors: {
        container: {
          opacity: 0
        },
        block1: {
          opacity: 0,
          left: 0,
          top: 100,
          rotate: 0
        },
        block2: {
          opacity: 0,
          left: 0,
          top: 200,
          rotate: 0
        },
        block3: {
          opacity: 0,
          left: 0,
          top: 300,
          rotate: 0
        },
        timelineContainer: {
          opacity: 0,
          bottom: -100,
          shadowSize: 0
        }
      },
      director: new Director({
        storyborad: {
          charactors: [
            { name: 'container' },
            { name: 'block1' },
            { name: 'block2' },
            { name: 'block3' },
            { name: 'timelineContainer' }
          ],
          props: [
            { name: 'blockMoveInDelay', default: [0, 100, 200] }
          ],
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
              },
              {
                charactors: ['block1', 'block2', 'block3'],
                desc: '三个示例用色块右移淡入',
                actionClips: [
                  {
                    delay: 'blockMoveInDelay',
                    duration: 300,
                    ease: 'easeOut',
                    from: [{ opacity: 0, left: 0 }],
                    to: [{ opacity: 1, left: 100 }]
                  }
                ]
              },
              {
                charactors: ['timelineContainer'],
                desc: '时间轴容器向上出现',
                actionClips: [
                  {
                    delay: 300,
                    duration: 400,
                    ease: 'easeOut',
                    from: [{ opacity: 0, bottom: -100, shadowSize: 0 }],
                    to: [{ opacity: 1, bottom: 0, shadowSize: 10 }]
                  }
                ]
              }
            ]
          }
        }
      }),
      targetChild: {
        block1: [],
        block2: [],
        block3: []
      }
    }
  },
  computed: {
    timelineTargets() {
      return {
        block1: {
          name: 'block1',
          target: this.charactors.block1,
          child: this.targetChild.block1
        },
        block2: {
          name: 'block2',
          target: this.charactors.block2,
          child: this.targetChild.block2
        },
        block3: {
          name: 'block3',
          target: this.charactors.block3,
          child: this.targetChild.block3
        }
      }
    }
  },
  mounted() {
    requestAnimationFrame(() => {
      this.addCharactors()
      this.director.playScenes([{ name: 'in', delay: 400 }])
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
      this.director.addCharactors(this.charactors)
    },
    handleControl(code) {
      // 控制器指令
      console.log(code)
    },
    addClip() {
      console.log('clip')
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
    .show-how-blocks{
      .block{
        width: 60px;
        height: 60px;
        position: absolute;
        cursor: pointer;
      }
      .block1{
        background-color: #DC4E41;
      }
      .block2{
        background-color: #1BA160;
      }
      .block3{
        background-color: #FFCD42;
      }
    }
    .timeline-ui{
      position: absolute;
      width: 100%;
      height: 40%;
      left: 0px;
      bottom: 0px;
      background-color: #eee;
      user-select: none;
      .timeline-main{
        width: 240px;
        height: 100%;
        border-right: 1px solid #ccc;
        .timeline-targets{
          width: 100%;
          height: 100%;
          .timeline-target{
            position: relative;
            text-indent: 8px;
            height: 34px;
            line-height: 34px;
            background-color: #f2f2f2;
            margin-bottom: 2px;
            box-shadow:
              0 1px 5px rgba(0, 0, 0, 0.15),
              0 0 3px rgba(0, 0, 0, 0.15);
            .button-add{
              min-width: 0px;
              width: 24px;
              height: 24px;
              position: absolute;
              right: 0px;
              top: 50%;
              transform: translate(0, -50%);
              &:before, .md-ripple-wave{
                display: none;
              }
              i{
                font-size: 20px !important;
                &:hover {
                  color: rgba(0, 0, 0, 0.8);
                }
              }
            }
          }
        }
      }
    }
  }
</style>

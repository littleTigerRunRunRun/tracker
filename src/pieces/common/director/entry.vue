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
          transform: `rotate(${charactors.block1.rotate}deg)`,
          backgroundColor: `hsl(5, 69%, ${charactors.block1.lightness}%)`
        }"
      />
      <div
        class="block2 block"
        :style="{
          opacity: charactors.block2.opacity,
          left: `${charactors.block2.left}px`,
          top: `${charactors.block2.top}px`,
          transform: `rotate(${charactors.block2.rotate}deg)`,
          backgroundColor: `hsl(151, 71%, ${charactors.block2.lightness}%)`
        }"
      />
      <div
        class="block3 block"
        :style="{
          opacity: charactors.block3.opacity,
          left: `${charactors.block3.left}px`,
          top: `${charactors.block3.top}px`,
          transform: `rotate(${charactors.block3.rotate}deg)`,
          backgroundColor: `hsl(44, 100%, ${charactors.block3.lightness}%)`
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
          <template v-for="(target, key) in timelineTargets">
            <div
              :key="`target${key}`"
              class="timeline-target"
            >
              {{ target.name }}
              <md-button class="md-icon-button button-search" @click.native="searchTargetDom(key)">
                <md-icon>search</md-icon>
              </md-button>
              <md-button class="md-icon-button button-add" @click.native="addClip(key)">
                <md-icon>add</md-icon>
              </md-button>
            </div>
            <div
              :key="`lines${key}`"
              class="timeline-lines"
              :style="{ height: `${target.child.length * 34}px` }"
            >
              <div
                v-for="(child, cindex) in target.child"
                :key="`child${cindex}`"
                class="timeline"
              >
                <md-field>
                  <md-select id="attr" v-model="child.attr" md-dense name="attr" placeholder="过渡属性" md-class="timeline-attr-select" @md-selected="refreshClip(key, cindex, child)">
                    <md-option v-for="(attr, aindex) in optionsAttr" :key="`attr${aindex}`" :value="attr" :disabled="target.usedChild.includes(attr)">
                      {{ attr }}
                    </md-option>
                  </md-select>
                </md-field>
                <md-field>
                  <md-select id="ease" v-model="child.ease" md-dense name="ease" placeholder="时间曲线" md-class="timeline-attr-select" @md-selected="refreshClip(key, cindex, child)">
                    <md-option v-for="(ease, aindex) in optionsEase" :key="`ease${aindex}`" :value="ease">
                      {{ ease }}
                    </md-option>
                  </md-select>
                </md-field>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div class="timeline-viewer">
        <div ref="viewer" class="timeline-viewer-container" />
        <div class="timeline-viewer-targets">
          <template v-for="(target, key) in timelineTargets">
            <div :key="`target${key}`" class="timeline-viewer-target" />
            <div :key="`lines${key}`" class="timeline-viewer-lines" :style="{ height: `${target.child.length * 34}px` }">
              <div
                v-for="(clip, cindex) in target.child"
                :key="`clip${cindex}`"
                class="timeline-viewer-line"
              >
                <!--这里的5是viewerConfig.scales.unitFrame * 1000 / viewerConfig.scales.unitInterval-->
                <horizontal-stretchable class="timeline-clip-block" :width.sync="clip.duration" :x-scale="5" :style="{ width: `${clip.duration / 5}px`, left: `${viewerConfig.scales.indent + clip.delay / 5}px` }" @change="refreshClip(key, cindex, clip)">
                  <dragable :x.sync="clip.delay" :x-range="[0, 10000]" :x-scale="5" :y-enable="false" @change="refreshClip(key, cindex, clip)">
                    <div class="show-text">
                      <span class="label">from</span>
                      <md-field>
                        <md-input v-model="clip.from" placeholder="from" type="number" @blur.native="refreshClip(key, cindex, clip)" />
                      </md-field>
                      <span class="label">to</span>
                      <md-field>
                        <md-input v-model="clip.to" placeholder="To" type="number" @blur="refreshClip(key, cindex, clip)" />
                      </md-field>
                    </div>
                  </dragable>
                </horizontal-stretchable>
              </div>
            </div>
          </template>
        </div>
        <!-- time anchor -->
        <!-- <div class="timeline-anchor" :style="{ marginLeft: `${viewerConfig.anchor.indent}px`, left: `${viewerConfig.anchor.left}px`, width: `${viewerConfig.anchor.width}px`, top: `${viewerConfig.anchor.height}px`, height: `calc(100% - ${viewerConfig.anchor.height}px` }">
          <div class="timeline-anchor-line" :style="{ backgroundColor: viewerConfig.anchor.fill, left: `${(viewerConfig.anchor.width - 1) / 2}px` }" />
          <dragable :style="{ width: `${viewerConfig.anchor.width}px`, height: `${viewerConfig.anchor.height}px` }" :x.sync="viewerConfig.anchor.left" :x-range="[0, 10000]" :y-enable="false">
            <svg
              version="1.1"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              preserveAspectRatio="xMidYMid meet"
              class="timeline-anchor-target"
              :style="{ width: `${viewerConfig.anchor.width}px`, height: `${viewerConfig.anchor.height}px` }"
              :width="viewerConfig.anchor.width"
              :height="viewerConfig.anchor.height"
              :viewBox="`0 0 ${viewerConfig.anchor.width} ${viewerConfig.anchor.height}`"
            >
              <path stroke="none" :fill="viewerConfig.anchor.fill" :d="`M0,0 L${viewerConfig.anchor.width},0 L${viewerConfig.anchor.width},${viewerConfig.anchor.height - viewerConfig.anchor.lean} L${viewerConfig.anchor.width / 2},${viewerConfig.anchor.height} L0,${viewerConfig.anchor.height - viewerConfig.anchor.lean} Z`" />
            </svg>
          </dragable>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import Director from '@/lib/storyboard/director.js'
import Easing from '@/lib/storyboard/easing'
import TimelineViewer from './timeline-viewer.js'
import TimelineUiControl from './timeline-ui-control'
import Dragable from './dragable.vue'
import HorizontalStretchable from './horizontal-stretchable.vue'
const optionsEase = []
for (const key in Easing) optionsEase.push(key)

export default {
  name: 'Director',
  components: {
    TimelineUiControl,
    Dragable,
    HorizontalStretchable
  },
  props: {},
  data() {
    return {
      movie: '',
      charactors: {
        container: {
          opacity: 0
        },
        block1: {
          opacity: 0,
          left: 0,
          top: 100,
          rotate: 0,
          lightness: 56
        },
        block2: {
          opacity: 0,
          left: 0,
          top: 200,
          rotate: 0,
          lightness: 31
        },
        block3: {
          opacity: 0,
          left: 0,
          top: 300,
          rotate: 0,
          lightness: 63
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
            { name: 'blockMoveInDelay', default: [0, 100, 200] },
            { name: 'startLightness', default: [{ lightness: 56 }, { lightness: 31 }, { lightness: 63 }] }
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
            ],
            targetHighlight: [
              {
                charactors: ['block1', 'block2', 'block3'],
                desc: '色块的高亮动画',
                actionClips: [
                  {
                    delay: 0,
                    duration: 1000,
                    ease: 'smoothGoBack',
                    from: ['startLightness'],
                    to: [{ lightness: 100 }]
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
      },
      actions: {
        block1: null,
        block2: null,
        block3: null
      },
      optionsAttr: ['left', 'top', 'opacity', 'rotate'],
      optionsEase,
      viewerConfig: {
        anchor: {
          fill: '#888',
          indent: 6,
          left: 0, // === scales.indent - (this.width - 1) / 2
          width: 9, // 这个数字需要是一个奇数
          height: 18,
          lean: 4, // 倾斜量
          top: 22
        },
        scales: {
          scale: 1,
          height: 40,
          indent: 10,
          backgroundColor: 'rgba(0, 0, 0, 0)',
          unitInterval: 20,
          unitFrame: 0.1,
          unitText: 's',
          scaleLineColor: '#e5e5e5',
          layers: [
            { interval: 200, width: 1, height: 12, color: '#999', number: true },
            { interval: 100, width: 1, height: 8, color: '#aaa' },
            { interval: 20, width: 1, height: 6, color: '#ccc' }
          ]
        }
      },
      dynamicDirector: new Director({
        storyborad: {
          charactors: [
            { name: 'block1' },
            { name: 'block2' },
            { name: 'block3' }
          ],
          props: [],
          scenes: {
            edit: [
              { charactors: ['block1'], desc: '对block1的可编辑动画', actionClips: [] },
              { charactors: ['block2'], desc: '对block2的可编辑动画', actionClips: [] },
              { charactors: ['block3'], desc: '对block3的可编辑动画', actionClips: [] }
            ]
          }
        }
      })
    }
  },
  computed: {
    timelineTargets() {
      return {
        block1: {
          name: 'block1',
          groupIndex: 0,
          target: this.charactors.block1,
          child: this.targetChild.block1,
          usedChild: this.targetChild.block1.map((item) => item.attr)
        },
        block2: {
          name: 'block2',
          groupIndex: 1,
          target: this.charactors.block2,
          child: this.targetChild.block2,
          usedChild: this.targetChild.block2.map((item) => item.attr)
        },
        block3: {
          name: 'block3',
          groupIndex: 2,
          target: this.charactors.block3,
          child: this.targetChild.block3,
          usedChild: this.targetChild.block3.map((item) => item.attr)
        }
      }
    }
  },
  mounted() {
    requestAnimationFrame(() => {
      this.addCharactors()
      const sceneEdit = this.dynamicDirector.getScene('edit')
      this.actions.block1 = sceneEdit.getAction(0)
      this.actions.block2 = sceneEdit.getAction(1)
      this.actions.block3 = sceneEdit.getAction(2)
      this.director.playScenes([{ name: 'in', delay: 400 }]).then(() => {
        this.director.playScenes([{ name: 'targetHighlight' }])
        this.timelineViewer = new TimelineViewer({ container: this.$refs.viewer, config: this.viewerConfig })
      })
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
      this.dynamicDirector.addCharactors(this.charactors)
      this.director.addCharactors(this.charactors)
    },
    handleControl(code) {
      // 控制器指令
      switch (code) {
        case 'play': {
          this.dynamicDirector.playScenes('edit')
          break
        }
        default: {
          this.dynamicDirector.getScene('edit').timelineControl(code)
          break
        }
      }
    },
    addClip(key) {
      this.targetChild[key].push({ attr: '', ease: 'linear', from: 0, to: 1, duration: 1000, delay: 0 })
      this.actions[key].addClip({ duration: 1000, delay: 0, ease: 'linear', from: {}, to: {}})
    },
    refreshClip(key, index, clip) {
      const action = this.actions[key]
      const from = {}
      const to = {}
      from[clip.attr] = parseInt(clip.from)
      to[clip.attr] = parseInt(clip.to)
      action.editClip(index, 'duration', clip.duration)
      action.editClip(index, 'delay', clip.delay)
      action.editClip(index, 'ease', clip.ease)
      action.editClip(index, 'from', [from])
      action.editClip(index, 'to', [to])
    },
    searchTargetDom(key) {
      // todo: 测试动画进程中再次播放会发生什么
      this.director.playScenes([{ name: 'targetHighlight', gather: [this.timelineTargets[key].groupIndex] }])
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
        float: left;
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
            .button-search, .button-add{
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
            .button-search{
              right: 20px;
              i {
                font-size: 16px !important;
              }
            }
          }
          .timeline-lines{
            padding-left: 16px;
            height: 0px;
            transition: height 0.3s;
            .timeline{
              width: 100%;
              height: 32px;
              line-height: 32px;
              background-color: #e5e5e5;
              box-shadow:
                0 1px 5px rgba(0, 0, 0, 0.15),
                0 0 3px rgba(0, 0, 0, 0.15);
              margin-bottom: 1px;
              font-size: 0px;
              .md-field {
                padding-top: 0px;
                width: 103px;
                height: 24px;
                line-height: 24px;
                min-height: 0;
                margin: 0;
                display: inline-block;
                text-indent: 8px;
                margin-left: 6px;
                vertical-align: middle;
                background-color: #ccc;
                box-shadow:
                  0 1px 5px rgba(0, 0, 0, 0.15),
                  0 0 3px rgba(0, 0, 0, 0.15);
                &:before, &:after{
                  display: none;
                }
                .md-menu {
                  height: 24px;
                  line-height: 24px;
                }
                input{
                  font-size: 12px;
                  text-indent: 4px;
                  height: 24px;
                  line-height: 23px;
                  &::placeholder {
                    font-size: 12px;
                    color: #999;
                  }
                }
              }
            }
          }
        }
      }
      .timeline-viewer{
        position: relative;
        width: calc(100% - 240px);
        height: 100%;
        float: left;
        .timeline-viewer-container{
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
        }
        .timeline-viewer-targets {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          padding-top: 40px;
          .timeline-viewer-target {
            height: 34px;
            line-height: 34px;
          }
          .timeline-viewer-lines {
            transition: height 0.2s;

            .timeline-viewer-line {
              position: relative;
              margin: 3px 0;
              height: 28px;
              line-height: 28px;
              background-color: rgba(255, 255, 255, 0.5);
              font-size: 0px;
              .timeline-clip-block{
                position: absolute;
                height: 24px;
                top: 2px;
                background-color: #ccc;
                box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
                .show-text{
                  font-size: 12px;;
                  color: #000;
                  text-indent: 8px;
                  line-height: 24px;
                  // text-shadow: 0 0 4px #000;
                  white-space: nowrap;
                  .label{
                    display: inline-block;
                  }
                  .md-field{
                    padding-top: 0px;
                    width: 40px;
                    height: 24px;
                    line-height: 24px;
                    min-height: 0;
                    margin: 0;
                    display: inline-block;
                    text-indent: 8px;
                    margin-left: 6px;
                    &:before, &:after{
                      display: none;
                    }
                    .md-menu {
                      height: 24px;
                      line-height: 24px;
                    }
                    input{
                      width: 100%;
                      font-size: 12px;
                      text-indent: 4px;
                      height: 18px;
                      line-height: 17px;
                      margin-top: -2px;
                      color: #000;
                      -webkit-text-fill-color: #000;
                      border-bottom: 1px solid #999;
                      &::placeholder {
                        font-size: 12px;
                        color: #000;
                      }
                    }
                  }
                }
              }
            }
          }
        }
        .timeline-anchor{
          position: absolute;
          pointer-events: none;
          .timeline-anchor-line{
            position: absolute;
            top: 0;
            width: 1px;
            height: 100%;
          }
        }
      }
    }
  }

  /* md全局样式优化 */
  .timeline-attr-select{
    .md-list {
      background-color: rgba(240, 240, 240, 0.87);
      .md-list-item{
        height: 32px;
        line-height: 32px;
        .md-list-item-button, .md-list-item-content{
          height: 32px;
          line-height: 32px;
          min-height: 0;
        }
      }
    }
  }
</style>

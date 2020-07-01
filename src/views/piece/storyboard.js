import Director from './storyboard/director'

const rangeStartMap = [
  { left: 60, top: 60 },
  { right: 60, top: 60 },
  { left: 60, bottom: 60 },
  { right: 60, bottom: 60 }
]
const rangeEndMap = [
  { left: 10, top: 10 },
  { right: 10, top: 10 },
  { left: 10, bottom: 10 },
  { right: 10, bottom: 10 }
]
const rangeOutEndMap = [
  { left: -10, top: -10 },
  { right: -10, top: -10 },
  { left: -10, bottom: -10 },
  { right: -10, bottom: -10 }
]

const director = new Director({
  storyborad: {
    // 演员
    charactors: [
      { name: 'main' },
      { name: 'tools', masses: true }, // 群众演员
      { name: 'captureRanges', masses: true, length: 4 },
      { name: 'captureShocks', masses: true, length: 2 },
      { name: 'captureImage', engrave: ['style.width', 'style.height', 'style.left', 'style.top'] } // engrave on one's mind
    ],
    // 道具，这里指会被调用到的关键数据
    props: [
      { name: 'startBound', default: null },
      { name: 'endBound', value: { width: 100, height: 100, left: 0, top: 0 }},
      { name: 'toolsEnterDuration', value: (index) => 600 - index * 80 },
      { name: 'toolsLeaveDuration', value: (index) => 300 - index * 30 },
      { name: 'toolsEnterDelay', value: (index) => index * 50 },
      { name: 'toolsLeaveDelay', value: (index) => 40 - index * 10 },
      { name: 'toolsRight', value: (index) => { return { right: 152 - 48 * index } } },
      { name: 'toolsStart', value: { opacity: 0, right: -44, rotate: 90 }},
      { name: 'rangesStartPosition', value: (index) => rangeStartMap[index] },
      { name: 'rangesEndPosition', value: (index) => rangeEndMap[index] },
      { name: 'rangesOutEndPosition', value: (index) => rangeOutEndMap[index] },
      { name: 'imageStartSize' },
      { name: 'imageEndSize' }
    ],
    // 镜头
    scenes: {
      moveIn: [
        {
          charactors: ['main'],
          desc: '主背景淡入扩散到全屏',
          actionClips: [
            {
              delay: 0,
              duration: 500,
              ease: 'easeIn',
              from: ['startBound'],
              to: ['endBound'],
              update({ width, height, left, top }) {
                this.target.style.width = `${width}%`
                this.target.style.height = `${height}%`
                this.target.style.left = `${left}px`
                this.target.style.top = `${top}px`
              }
            },
            {
              delay: 0,
              duration: 200,
              ease: 'easeIn',
              from: [{ opacity: 0 }],
              to: [{ opacity: 1 }],
              update({ opacity }) {
                this.target.style.opacity = opacity
              }
            }
          ]
        }
      ],
      moveOut: [
        {
          charactors: ['main'],
          desc: '点击关闭，主背景回到初始位置和大小',
          actionClips: [
            {
              delay: 0,
              duration: 400,
              ease: 'easeIn',
              from: ['endBound'],
              to: ['startBound'],
              update({ width, height, left, top }) {
                this.target.style.width = `${width}%`
                this.target.style.height = `${height}%`
                this.target.style.left = `${left}px`
                this.target.style.top = `${top}px`
              }
            },
            {
              delay: 300,
              duration: 200,
              ease: 'easeIn',
              from: [{ opacity: 1 }],
              to: [{ opacity: 0 }],
              update({ opacity }) {
                this.target.style.opacity = opacity
              }
            }
          ]
        }
      ],
      toolsIn: [
        {
          charactors: 'tools', // 群演的戏一般单独写在一起不与演员融合
          desc: '主背景进入以后，工具依次进入',
          actionClips: [
            {
              delay: 'toolsEnterDelay',
              duration: 'toolsEnterDuration',
              ease: 'easeIn',
              from: ['toolsStart'],
              to: ['toolsRight', { opacity: 1, rotate: 0 }],
              update({ opacity, rotate, right }) {
                this.target.style.opacity = opacity
                this.target.style.right = `${right}px`
                this.target.style.transform = `rotate(${rotate}deg)`
              }
            }
          ]
        }
      ],
      toolsOut: [
        {
          charactors: 'tools', // 群演的戏一般单独写在一起不与演员融合
          desc: '主背景进入以后，工具依次进入',
          actionClips: [
            {
              delay: 'toolsLeaveDelay',
              duration: 'toolsLeaveDuration',
              ease: 'linear',
              from: ['toolsRight', { opacity: 1, rotate: 0 }],
              to: ['toolsStart'],
              update({ opacity, rotate, right }) {
                this.target.style.opacity = opacity
                this.target.style.right = `${right}px`
                this.target.style.transform = `rotate(${rotate}deg)`
              }
            }
          ]
        }
      ],
      captureIn: [
        {
          charactors: 'captureRanges',
          desc: '点击截图按钮后，按钮群退出，展示截图范围',
          actionClips: [
            {
              delay: 0,
              duration: 200,
              ease: 'easeOut',
              from: ['rangesStartPosition', { opacity: 0 }],
              to: ['rangesEndPosition', { opacity: 1 }],
              update({ opacity, left, right, top, bottom }) {
                this.target.style.opacity = opacity
                if (left !== undefined) this.target.style.left = `${left}px`
                if (right !== undefined) this.target.style.right = `${right}px`
                if (top !== undefined) this.target.style.top = `${top}px`
                if (bottom !== undefined) this.target.style.bottom = `${bottom}px`
              }
            }
          ]
        }
      ],
      captureOut: [
        {
          charactors: 'captureRanges',
          desc: '拍完照后，截图范围消失',
          actionClips: [
            {
              delay: 0,
              duration: 300,
              ease: 'easeIn',
              from: ['rangesEndPosition', { opacity: 1 }],
              to: ['rangesOutEndPosition', { opacity: 0 }],
              update({ opacity, left, right, top, bottom }) {
                this.target.style.opacity = opacity
                if (left !== undefined) this.target.style.left = `${left}px`
                if (right !== undefined) this.target.style.right = `${right}px`
                if (top !== undefined) this.target.style.top = `${top}px`
                if (bottom !== undefined) this.target.style.bottom = `${bottom}px`
              }
            }
          ]
        }
      ],
      captureShock: [
        {
          charactors: 'captureShocks',
          desc: '截屏器上下快速咬合，形成拍摄的感觉',
          actionClips: [
            {
              delay: 0,
              duration: 200,
              ease: 'goback',
              frameByFrame: true,
              from: [{ height: 0 }],
              to: [{ height: 50 }],
              update({ height }) {
                this.target.style.height = `${height}%`
              }
            }
          ]
        }
      ],
      captureImageMove: [
        {
          charactors: ['captureImage'],
          desc: '截图完成后，截图缩小至左上角',
          actionClips: [
            {
              delay: 0,
              duration: 400,
              ease: 'easeOut',
              from: ['imageStartSize', { left: 0, top: 0 }],
              to: ['imageEndSize', { left: 10, top: 10 }],
              update({ width, height, left, top }) {
                this.target.style.width = `${width}px`
                this.target.style.height = `${height}px`
                this.target.style.left = `${left}px`
                this.target.style.top = `${top}px`
              }
            }
          ]
        }
      ],
      captureCancel: [
        {
          charactors: ['captureImage'],
          desc: '截图完成后，截图缩小至左上角',
          actionClips: [
            {
              delay: 0,
              duration: 400,
              ease: 'turnBackIn2',
              from: [{ top: 10 }],
              to: [{ top: -500 }],
              update({ top }) {
                this.target.style.top = `${top}px`
              }
            }
          ]
        }
      ]
    }
  }
})

export default director

import Director from '@/lib/storyboard/director'

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

const director = new Director({
  storyborad: {
    // 演员
    charactors: [
      // dom类型会被劫持一层，进而简化样式赋值
      { name: 'main', type: 'dom' },
      { name: 'tools', type: 'dom', masses: true, length: 4 }, // 群众演员
      { name: 'captureRanges', type: 'dom', masses: true, length: 4 },
      { name: 'captureShocks', type: 'dom', masses: true, length: 2 },
      { name: 'captureImage', type: 'dom', engrave: ['width', 'height', 'left', 'bottom', 'rotate'] }, // engrave on one's mind
      { name: 'captureImageContent', type: 'dom', engrave: ['opacity'] },
      { name: 'config' }
    ],
    // 道具，这里指会被调用到的关键数据
    props: [
      { name: 'startBound', default: null },
      { name: 'endBound', value: { width: 100, height: 100, left: 0, top: 0 }},
      { name: 'toolsEnterDuration', value: (index) => 600 - index * 80 },
      { name: 'toolsLeaveDuration', value: (index) => 300 - index * 30 },
      { name: 'toolsEnterDelay', value: (index) => index * 50 },
      { name: 'toolsLeaveDelay', value: (index) => 40 - index * 10 },
      { name: 'toolsRight', value: (index) => { return { right: 104 - 48 * index } } }, // 152
      { name: 'toolsStart', value: { opacity: 0, right: -44, rotate: 90 }},
      { name: 'rangesStartPosition', value: (index) => rangeStartMap[index] },
      { name: 'rangesEndPosition', value: (index) => rangeEndMap[index] },
      { name: 'imageStartSize', default: null },
      { name: 'imageEndSize', default: null },
      { name: 'imageShrinkBound' }
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
              filters: { width: 'percent', height: 'percent' }
              // update依然可行，但过重了，不太像在描述
              // update({ width, height, left, top }) {
              //   this.target.style.width = `${width}%`
              //   this.target.style.height = `${height}%`
              //   this.target.style.left = `${left}px`
              //   this.target.style.top = `${top}px`
              // }
            },
            {
              delay: 0,
              duration: 200,
              ease: 'easeIn',
              from: [{ opacity: 0 }],
              to: [{ opacity: 1 }]
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
              filters: { width: 'percent', height: 'percent' }
            },
            {
              delay: 300,
              duration: 200,
              ease: 'easeIn',
              from: [{ opacity: 1 }],
              to: [{ opacity: 0 }]
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
              to: ['toolsRight', { opacity: 1, rotate: 0 }]
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
              to: ['toolsStart']
            }
          ]
        }
      ],
      captureRangeIn: [
        {
          charactors: 'captureRanges',
          desc: '点击截图按钮后，按钮群退出，展示截图范围',
          actionClips: [
            {
              delay: 0,
              duration: 200,
              ease: 'easeOut',
              from: ['rangesStartPosition', { opacity: 0 }],
              to: ['rangesEndPosition', { opacity: 1 }]
            }
          ]
        }
      ],
      captureRangeOut: [
        {
          charactors: 'captureRanges',
          desc: '拍完照后，截图范围消失',
          actionClips: [
            {
              delay: 0,
              duration: 300,
              ease: 'easeIn',
              from: [{ opacity: 1 }],
              to: [{ opacity: 0 }]
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
              filters: { height: 'percent' }
            }
          ]
        }
      ],
      captureImageMove: [
        {
          charactors: ['captureImage'],
          desc: '截图完成后，截图缩小至左下角',
          actionClips: [
            {
              delay: 0,
              duration: 400,
              ease: 'easeOut',
              from: ['imageStartSize', { left: 0, bottom: 0 }],
              to: ['imageEndSize', { left: 10, bottom: 10 }]
            }
          ]
        }
      ],
      captureCancel: [
        {
          charactors: ['captureImage'],
          desc: '截图被取消，下移消失',
          actionClips: [
            {
              delay: 0,
              duration: 400,
              ease: 'turnBackIn2',
              from: [{ bottom: 10 }],
              to: [{ bottom: -500 }]
            }
          ]
        }
      ],
      captureSave: [
        {
          charactors: ['captureImage'],
          desc: '截图保存，图片转化成一个颗粒，我们可以理解成是压缩成了数据',
          actionClips: [
            {
              delay: 0,
              duration: 300,
              ease: 'easeIn',
              from: ['imageEndSize', { bottom: 10, left: 10 }],
              to: ['imageShrinkBound']
            }
          ]
        },
        {
          charactors: ['captureImage'],
          desc: '内容旋转',
          actionClips: [
            {
              delay: 0,
              duration: 1300,
              ease: 'easeIn',
              from: [{ rotate: 0 }],
              to: [{ rotate: 360 }]
            }
          ]
        },
        // 这种动画应该加一个继承类的配置
        {
          charactors: ['captureImage'],
          desc: '上升的动画，暗示数据在上传到服务器',
          actionClips: [
            {
              delay: 300,
              duration: 1000,
              ease: 'easeIn',
              from: ['imageShrinkBound.bottom'],
              // 这里这个endBottom属于临时资产，是在play的时候传入的，无需预先定义
              to: ['endBottom']
            }
          ]
        },
        {
          charactors: ['captureImageContent'],
          desc: '在外容器缩小成一个正方形的同时，内容逐渐褪去',
          actionClips: [
            {
              delay: 100,
              duration: 200,
              ease: 'linear',
              from: [{ opacity: 1 }],
              to: [{ opacity: 0 }]
            }
          ]
        }
      ],
      markdownIn: [
        {
          charactors: 'tools',
          desc: '点击动画后，工具-第三个，即文档markdown按钮向左侧旋转移动到左上角后放大到全量',
          actionClips: [
            {
              delay: 0,
              duration: 200,
              ease: 'linear',
              from: ['toolsRight'],
              to: [{ right: 8 }]
            }
          ]
        }
      ],
      configIn: [
        {
          charactors: 'config',
          desc: '点击设置按钮，设置面板从右侧淡入推出',
          actionClips: [
            {
              delay: 0,
              duration: 200,
              ease: 'easeOut',
              from: [{ opacity: 0, right: -480 }],
              to: [{ opacity: 1, right: 0 }]
            }
          ]
        }
      ],
      configOut: [
        {
          charactors: 'config',
          desc: '点击设置面板的关闭按钮，设置面板向右侧淡出',
          actionClips: [
            {
              delay: 0,
              duration: 200,
              ease: 'easeOut',
              from: [{ opacity: 1, right: 0 }],
              to: [{ opacity: 0, right: -400 }]
            }
          ]
        }
      ]
    }
  }
})

export default director

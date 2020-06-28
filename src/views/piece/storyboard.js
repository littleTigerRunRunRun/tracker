import Director from './storyboard/director'

const director = new Director({
  storyborad: {
    // 演员
    charactors: [
      { name: 'main' },
      { name: 'title' },
      { name: 'tools', masses: true, length: 4 } // 群众演员
    ],
    // 道具，这里指会被调用到的关键数据
    props: [
      { name: 'startBound', default: null },
      { name: 'endBound', value: { width: 100, height: 100, left: 0, top: 0 }},
      { name: 'toolsEnterDuration', value: (index) => 600 - index * 80 },
      { name: 'toolsLeaveDuration', value: (index) => 300 - index * 30 },
      { name: 'toolsEnterDelay', value: (index) => index * 50 },
      { name: 'toolsLeaveDelay', value: (index) => 30 - index * 10 },
      { name: 'toolsRight', value: (index) => { return { right: 152 - 48 * index } } },
      { name: 'toolsStart', value: { opacity: 0, right: -44, rotate: 90 }}
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
        },
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
      moveOut: [
        {
          charactors: ['main'],
          desc: '点击关闭，主背景回到初始位置和大小',
          actionClips: [
            {
              delay: 200,
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
              delay: 500,
              duration: 200,
              ease: 'easeIn',
              from: [{ opacity: 1 }],
              to: [{ opacity: 0 }],
              update({ opacity }) {
                this.target.style.opacity = opacity
              }
            }
          ]
        },
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
      ]
    }
  }
})

export default director

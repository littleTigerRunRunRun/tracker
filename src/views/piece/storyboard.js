import Director from './director'

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
      { name: 'startBound', default: { width: 0, height: 0, transform: '' }},
      { name: 'endBound', value: { width: '100%', height: '100%', transform: 'translate(0px, 0px)' }},
      { name: 'toolsDuration', value: (index) => 0.9 - index * 0.2 },
      { name: 'toolsDelay', value: (index) => 0.3 + index * 0.2 },
      { name: 'toolsRight', value: (index) => { return { right: `${152 - 48 * index}px` } } }
    ],
    // 镜头
    scenes: {
      moveIn: [
        {
          index: 0,
          charactors: ['main'],
          desc: '主背景淡入扩散到全屏',
          actionClips: [
            { delay: 0, duration: 0.3, ease: 'slow', from: ['startBound'], to: ['endBound'] },
            { delay: 0, duration: 0.1, ease: 'none', from: [{ opacity: 0 }], to: [{ opacity: 1 }] }
          ]
        },
        {
          index: 1,
          charactors: 'tools', // 群演的戏一般单独写在一起不与演员融合
          desc: '主背景进入以后，工具依次进入',
          actionClips: [
            { delay: 'toolsDelay', duration: 'toolsDuration', ease: 'slow', from: [{ right: '-44px', transform: 'rotate(90deg)' }], to: ['toolsRight', { transform: 'rotate(0deg)' }] }
          ]
        }
      ]
    }
  }
})
console.log(director)

export default director

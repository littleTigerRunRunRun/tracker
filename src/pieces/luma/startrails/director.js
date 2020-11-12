// 本来应该是一个动画 + 交互系统
// import Director from '@/lib/storyboard/director'

// export default new Director({
//   storyborad: {
//     charactors: [],
//     props: [],
//     scenes: []
//   }
// })

const positions = {
  main: {
    left: 'calc(4% + 240px)',
    top: '10%'
  },
  adaptation: {
    left: '2%',
    top: '10%'
  },
  status: {
    left: '2%',
    top: '2%'
  },
  detail: {
    left: 'calc(98% - 320px)',
    top: '8%'
  },
  tool: {
    left: 'calc(4% + 240px)',
    top: 'calc(80% + 20px)'
  }
}

export default function setPosition(name, target) {
  const position = positions[name]
  if (!position) return

  target.style.position = 'absolute'
  target.style.left = position.left
  target.style.top = position.top
}

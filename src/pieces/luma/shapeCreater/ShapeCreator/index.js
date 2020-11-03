import { AnimationLoop, Model } from '@luma.gl/engine'
import { setParameters } from '@luma.gl/gltools'
import GL from '@luma.gl/constants'
// import { brightnessContrast } from '@luma.gl/shadertools'
// console.log(brightnessContrast)

import { constantValue } from '@/pieces/luma/common/modules/constant'
import createHandyBuffer from '@/pieces/moveMountain/prefab/buffer/HandyBuffer'

import { Pipe, Pass, ShaderPass } from '../pipe/index.js'

import { shapeSolver, polygonToSvgString } from './shapeSolver'
import { PathGeometry } from './PathGeometry.js'
import { GeometryPass } from './GeometryPass'

// 一个离屏绘制的渲染循环，用于绘制形状
let publicLoop
let publicPipe
function initLoop() {
  // 启动loop
  publicLoop = new AnimationLoop({
    onInitialize: ({ gl, canvas }) => {
      setParameters(gl, {
        // blend: true,
        blendFunc: [gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE]
      })

      // this.gl = gl
      // this.canvas = canvas
      // this.geometry = new PathGeometry({ gl, points: this.points, style: this.style })
      publicPipe = new Pipe({
        gl,
        autoUpdate: false,
        // textures: {
        //   t_geo: '/public/t_circle.png'
        // },
        stages: [
          [
            { pass: GeometryPass }
          ]
        ]
      })
      return {}
    },
    onRender: ({ gl }) => {
      console.log('render')
    }
    // useDevicePixels: true
  })
  publicLoop.start({
    webgl2: true,
    // canvas,
    antialias: true,
    width: 400,
    height: 400,
    // premultipliedAlpha: false,
    preserveDrawingBuffer: true
  })
}
initLoop()

export default class ShaperCreator {
  constructor(params) {
    const { canvas, showSvg, type, shape, style, showNormal = false } = params
    this.points = shapeSolver({ type, shape })
    this.style = style

    this.showNormal = showNormal // 是否显示几何图形的法线
    if (showSvg) console.log(polygonToSvgString(points))
  }

  destroy() {
  }
}

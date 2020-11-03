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

const canvas = document.createElement('canvas')
canvas.style.width = '200px'
canvas.style.height = '300px'
canvas.style.top = 0
canvas.style.left = 0
canvas.style.position = 'fixed'
canvas.style.zIndex = 1000000
document.body.appendChild(canvas)
// 一个离屏绘制的渲染循环，用于绘制形状
const publicRenderer = {
  loop: null,
  pipe: null,
  initTasks: [], // 需要init结束后协助初始化的任务
  renderTasks: [], // task序列，loop的每一帧就是在清空这个task
  gl: null,
  canvas
}
function initLoop() {
  // 启动loop
  publicRenderer.loop = new AnimationLoop({
    onInitialize: ({ gl }) => {
      publicRenderer.gl = gl

      setParameters(gl, {
        // blend: true,
        blendFunc: [gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE]
      })

      publicRenderer.pipe = new Pipe({
        gl,
        autoUpdate: false,
        // textures: {
        //   t_geo: '/public/t_circle.png'
        // },
        stages: [
          [{ pass: GeometryPass }]
        ]
      })

      for (const task of publicRenderer.initTasks) task(gl)

      return {}
    },
    onRender: ({ gl, time }) => {
      for (const task of publicRenderer.renderTasks) {
        task({ gl, pipe: publicRenderer.pipe })
        publicRenderer.pipe.next({ time })
        publicRenderer.pipe.clear()
      }
      publicRenderer.renderTasks.splice(0, publicRenderer.renderTasks.length)
    }
    // useDevicePixels: true
  })
  publicRenderer.loop.start({
    webgl2: true,
    canvas: publicRenderer.canvas,
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
    this.canvas = canvas

    this.showNormal = showNormal // 是否显示几何图形的法线
    if (showSvg) console.log(polygonToSvgString(points))

    // 初始化geometry
    if (publicRenderer.gl) {
      this.initGeometry(publicRenderer.gl)
    } else publicRenderer.initTasks.push(this.initGeometry)

    this.refresh()
  }

  initGeometry = (gl) => {
    this.geometry = new PathGeometry({ gl, points: this.points, style: this.style })
  }

  render = ({ gl, pipe }) => {
    pipe.pools.geometry = this.geometry
    pipe.pools.geometrySize = [this.canvas.width, this.canvas.height]
  }

  refresh() {
    publicRenderer.renderTasks.push(this.render)
  }

  destroy() {
  }
}

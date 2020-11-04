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
// canvas.style.width = '300px'
// canvas.style.height = '300px'
// canvas.style.top = 0
// canvas.style.left = '200px'
// canvas.style.position = 'fixed'
// canvas.style.zIndex = 1000000
// document.body.appendChild(canvas)
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
      publicRenderer.pipe.pools.canvas = publicRenderer.canvas

      for (const task of publicRenderer.initTasks) task(gl)

      return {}
    },
    onRender: ({ gl, time }) => {
      const tasks = [].concat(publicRenderer.renderTasks)
      publicRenderer.renderTasks.splice(0, publicRenderer.renderTasks.length)
      for (const task of tasks) {
        task.before({ gl, pipe: publicRenderer.pipe })
        publicRenderer.pipe.next({ time })
        task.after({ gl, pipe: publicRenderer.pipe })
        publicRenderer.pipe.clear()
      }
    },
    autoResizeViewport: false
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
    const { canvas, showSvg, type, shape, style, showNormal = false, dynamic = false, transform = {}} = params
    this.style = style
    this.canvas = canvas
    this.ctx = this.canvas.getContext('2d')
    this.dynamic = dynamic // shaper的颜色需要贴图来渲染，在不作动态使用时，我们认为这是一个单次绘制后就会去除贴图的类型，下次绘制时贴图会重新初始化

    this.transform = transform

    const { points, size } = shapeSolver({ type, shape })
    this.points = points
    this.originSize = size // 跟外部的形变作一个区分
    this.showNormal = showNormal // 是否显示几何图形的法线
    if (showSvg) console.log(polygonToSvgString(points))

    // 初始化geometry
    if (publicRenderer.gl) {
      this.initGeometry(publicRenderer.gl)
    } else publicRenderer.initTasks.push(this.initGeometry)

    this.refresh()
  }

  initGeometry = (gl) => {
    this.geometry = new PathGeometry({ gl, points: this.points, size: this.originSize, style: this.style })
  }

  get translate() { return [].concat(this.transform.translate) }
  set translate(translate) {
    if (translate.length) this.transform.translate.splice(0, this.transform.translate.length, ...translate)
    else if (translate.x !== undefined) this.transform.translate.splice(0, this.transform.translate.length, translate.x, translate.y)
    console.log(this.transform.translate)
    this.refresh()
  }

  render = {
    before: ({ gl, pipe }) => {
      pipe.pools.geometry = this.geometry
      pipe.pools.geometryUniforms = {
        u_geometry_size: this.originSize,
        u_translate: this.transform.translate || [0, 0]
      }
      pipe.pools.geometrySize = { width: this.canvas.width, height: this.canvas.height }
    },
    after: ({ gl, pipe }) => {
      this.ctx.drawImage(pipe.pools.canvas, 0, 0, this.canvas.width, this.canvas.height)
    }
  }

  refresh() {
    if (publicRenderer.renderTasks.indexOf(this.render) > -1) return
    publicRenderer.renderTasks.push(this.render)
  }

  destroy() {
  }
}

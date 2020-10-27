import { AnimationLoop, Model } from '@luma.gl/engine'
import { setParameters } from '@luma.gl/gltools'
// import { fxaa } from '@luma.gl/shadertools'

import { constantValue } from '../common/modules/constant'
import PathGeometry from './PathGeometry.js'
import { shapeSolver, polygonToSvgString } from './shapeSolver'
import HelperLine from './HelperLine.js'
import { Pipe, Pass } from './pipe/index.js'
// console.log(fxaa)

export default class ShaperCreator {
  constructor(params) {
    const { canvas, showSvg, type, shape, style } = params
    const points = shapeSolver({ type, shape })

    this.canvas = canvas
    this.geometry = new PathGeometry({ points, style })
    this.showNormal = true // 是否显示几何图形的法线
    if (showSvg) console.log(polygonToSvgString(points))

    this.initLoop(canvas)
  }

  initLoop(canvas) {
    this.loop = new AnimationLoop({
      onInitialize: this.onInitialize,
      onRender: this.onRender
    })
    this.loop.start({
      canvas,
      preserveDrawingBuffer: true
    })
  }

  onInitialize = ({ gl, canvas }) => {
    setParameters(gl, {
      blend: true,
      blendFunc: [gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE]
    })

    this.gl = gl
    this.canvas = canvas
    this.initPipe(gl)
    return {}
  }

  onRender = ({ gl }) => {
    if (this.needUpdate) {
      this.pipe.render()
    }
  }

  // 初始化本例需要使用的逻辑管道
  initPipe() {
    this.geometryPass = new Pass({
      pointers: {
        geometry: this.geometry
      },
      onInitialize: ({ gl, geometry }) => {
        const helper = new HelperLine(gl, { lines: geometry.helperLines }) //

        const shapeModel = new Model(gl, {
          uniforms: {
            u_resolution: [100, 100]
          },
          vs: `
            attribute vec2 positions;
            attribute vec4 color;
    
            uniform vec2 u_resolution;
            varying vec4 v_color;
    
            void main() {
              v_color = color;
              gl_Position = vec4(positions / u_resolution * f2 * -1.0 + vec2(f1), f0, f1);
            }
          `,
          fs: `
            precision highp float;
    
            varying vec4 v_color;
    
            void main(void) {
              gl_FragColor = vec4(v_color);
            }
          `,
          modules: [constantValue],
          geometry
        })

        this.needUpdate = true

        return { helper, shapeModel }
      },
      onRender: ({ gl, helper, shapeModel }) => {
        shapeModel.uniforms.u_resolution = [gl.drawingBufferWidth, gl.drawingBufferHeight]
        shapeModel.draw()

        // this.helper.uniforms.u_resolution = [gl.drawingBufferWidth, gl.drawingBufferHeight]
        if (this.showNormal) helper.draw()

        this.needUpdate = false
      },
      onDestroy: ({ shapeModel }) => {
        shapeModel.delete()
      },
      // onOutput,
      target: null
    })

    // this.txaaPass = new Pass({

    // })

    this.pipe = new Pipe({
      gl: this.gl,
      stages: [
        [
          { pass: this.geometryPass }
        ]
      ]
    })
  }

  destroy() {
    this.pipe.destroy()
    this.loop.delete()
    this.loop = null
  }
}

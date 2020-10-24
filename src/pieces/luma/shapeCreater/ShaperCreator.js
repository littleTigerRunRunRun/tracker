import { AnimationLoop, Model } from '@luma.gl/engine'
import { clear } from '@luma.gl/webgl'
import { constantValue } from '../common/modules/constant'
import PathGeometry from './PathGeometry.js'
import { shapeSolver, polygonToSvgString } from './shapeSolver'

console.log('dd')

export default class ShaperCreator {
  constructor(params) {
    const { canvas, showSvg } = params

    this.loop = new AnimationLoop({
      onInitialize: this.onInitialize,
      onRender: this.onRender
    })
    this.loop.start({
      canvas,
      preserveDrawingBuffer: true
    })
    this.canvas = canvas
    this.points = shapeSolver(params)
    if (showSvg) console.log(polygonToSvgString(this.points))
  }

  onInitialize = ({ gl, canvas }) => {
    this.gl = gl
    this.canvas = canvas
    this.createModel()
    return {}
  }

  onRender = ({ gl }) => {
    if (this.needUpdate && this.model) {
      clear(gl, { color: [0, 0, 0, 0] })

      this.model.uniforms.u_resolution = [gl.drawingBufferWidth, gl.drawingBufferHeight]
      this.model.draw()
      this.needUpdate = false
    }
  }

  createModel() {
    this.model = new Model(this.gl, {
      uniforms: {
        u_resolution: [100, 100]
      },
      vs: `
        attribute vec3 positions;

        uniform vec2 u_resolution;

        void main() {
          gl_Position = vec4(positions.xy / u_resolution * f2 * -1.0 + vec2(f1), positions.z, f1);
        }
      `,
      fs: `
        precision highp float;

        void main(void) {
          gl_FragColor = vec4(f1, f0, f0, f1);
        }
      `,
      modules: [constantValue],
      geometry: new PathGeometry(this.points)
    })
    this.needUpdate = true
  }

  destory() {
    this.model.delete()
    this.model = null
    this.loop.delete()
    this.loop = null
  }
}

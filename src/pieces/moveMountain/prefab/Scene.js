import { AnimationLoop, Model } from '@luma.gl/engine'
import { Buffer, clear } from '@luma.gl/webgl'

export default class Scene {
  constructor(props = {}) {
    this.props = props

    this.loop = new AnimationLoop({
      onInitialize: this.onInitialize,
      onRender: this.onRender
    })
  }

  getSomeKeyFromObject(props, keys) {
    const obj = {}
    for (const key of keys) {
      obj[key] = props[key]
    }
    return obj
  }

  start() {
    this.loop.start(this.getSomeKeyFromObject(this.props, ['canvas', 'preserveDrawingBuffer']))
  }

  onInitialize({ gl }) {
    const positionBuffer = new Buffer(gl, new Float32Array([
      -0.5, -0.5,
      0.5, -0.5,
      0.0, 0.5
    ]))

    const colorBuffer = new Buffer(gl, new Float32Array([
      1.0, 0.0, 0.0,
      0.0, 1.0, 0.0,
      0.0, 0.0, 1.0
    ]))

    const vs = `
      attribute vec2 position;
      attribute vec3 color;

      varying vec3 vColor;

      void main() {
        vColor = color;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `

    const fs = `
      varying vec3 vColor;

      void main() {
        gl_FragColor = vec4(vColor, 1.0);
      }
    `

    const model = new Model(gl, {
      vs,
      fs,
      attributes: {
        position: positionBuffer,
        color: colorBuffer
      },
      vertexCount: 3
    })

    return { model }
  }

  onRender({ gl, model }) {
    clear(gl, { color: [0, 0, 0, 1] })
    model.draw()
  }

  destroy() {
    this.loop = null
  }
}

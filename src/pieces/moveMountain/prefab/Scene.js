import { AnimationLoop, Model, CubeGeometry } from '@luma.gl/engine'
import { Buffer, clear } from '@luma.gl/webgl'
import { Matrix4 } from 'math.gl'
import Control from './global/control/Base'

export default class Scene {
  constructor({ props, models, control }) {
    this.props = props
    this.models = models
    this.control = new Control(control.params)

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

  onInitialize = ({ gl }) => {
    const vs = `
      attribute vec3 positions;

      uniform mat4 u_mvpMatrix;

      void main() {
        gl_Position = u_mvpMatrix * vec4(positions, 1.0);
      }
    `

    const fs = `
      uniform vec3 u_material_base_color;

      void main() {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
      }
    `

    const model = new Model(gl, {
      vs,
      fs,
      geometry: new CubeGeometry(),
      uniforms: {
        u_material_base_color: [1.0, 1.0, 1.0]
      }
    })

    const eysPosition = [3, 2, 10]
    const viewMatrix = new Matrix4().lookAt({ eye: eysPosition })
    console.log(viewMatrix)
    this.control.setEye(viewMatrix)
    // mvp = model view projection
    const mvpMatrix = new Matrix4()

    return { model, viewMatrix, mvpMatrix }
  }

  lastTime = 0
  onRender = (params) => {
    // console.log(params)
    const { gl, model, viewMatrix, mvpMatrix, aspect, tick, time } = params
    const delt = time - this.lastTime
    this.lastTime = time

    this.control.tick(delt)

    mvpMatrix
      .perspective({ fov: Math.PI * 0.33, aspect })
      .multiplyRight(viewMatrix)

    clear(gl, { color: [0, 0, 0, 1] })

    model.setUniforms({ u_mvpMatrix: mvpMatrix }).draw()
  }

  start() {
    // loop start
    this.loop.start(this.getSomeKeyFromObject(this.props, ['canvas', 'preserveDrawingBuffer']))
    // control bind
    this.control.bind(this.props.canvas)
  }

  destroy() {
    this.loop = null
    this.control.destroy()
  }
}

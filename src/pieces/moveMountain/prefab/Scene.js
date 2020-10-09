import { AnimationLoop, Model } from '@luma.gl/engine'
import { Buffer, clear } from '@luma.gl/webgl'
import { Matrix4 } from 'math.gl'
import Control from './global/control/Base'

export default class Scene {
  constructor({ props, models, lights, eysPosition = [0, 0, 10], centerPosition = [0, 0, 0], control }) {
    this.props = props
    this.eysPosition = eysPosition
    this.centerPosition = centerPosition
    this.models = models
    this.lights = lights
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

  _lastAspect = 1
  onInitialize = ({ gl, aspect }) => {
    this._lastAspect = aspect

    const vs = `
      attribute vec3 positions;
      attribute vec3 normals;

      uniform mat4 u_modelMatrix;
      uniform mat4 u_viewMatrix;
      uniform mat4 u_projectionMatrix;

      varying vec3 v_color;

      void main() {
        // u_MVPMatrix = u_projectionMatrix * u_viewMatrix * u_modelMatrix
        gl_Position = u_projectionMatrix * u_viewMatrix * u_modelMatrix * vec4(positions, 1.0);
        // 我们假定给定的是一个方向为vec3(1.0, 1.0, 1.0)的DirectionalLight
        vec3 directionalLight = vec3(-5.0, -4.0, -1.0);
        v_color = dot(normals, directionalLight) / length(normals) / length(directionalLight) * vec3(1.0, 1.0, 1.0);
      }
    `

    const fs = `
      uniform vec3 u_material_base_color;
      
      varying vec3 v_color;

      void main() {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
      }
    `

    const models = []
    for (const model of this.models) {
      models.push({
        position: model.position || [0, 0, 0],
        rotation: model.rotation || [0, 0, 0],
        modelMatrix: new Matrix4(),
        model: new Model(gl, {
          vs,
          fs,
          geometry: model.geometry,
          uniforms: {
            u_material_base_color: [1.0, 1.0, 1.0]
          }
        })
      })
    }

    // mvp = model view projection
    const viewMatrix = new Matrix4().lookAt({ eye: this.eysPosition, center: this.centerPosition })
    this.control.setEye({ eye: this.eysPosition, center: this.centerPosition })

    const projectionMatrix = new Matrix4().perspective({ fov: Math.PI * 0.33, aspect, near: 1, far: 1000.0 })

    return { models, viewMatrix, projectionMatrix }
  }

  lastTime = 0
  onRender = (params) => {
    // console.log(params)
    const { gl, models, viewMatrix, projectionMatrix, aspect, tick, time } = params
    const delt = time - this.lastTime
    this.lastTime = time

    this.control.tick(delt)

    clear(gl, { color: [0, 0, 0, 1] })

    models.map(({ model, position, rotation, modelMatrix }) => {
      modelMatrix
        .identity()
        .translate(position)
        .rotateXYZ(rotation)

      model.setUniforms({
        u_modelMatrix: modelMatrix,
        u_viewMatrix: this.control.viewMatrix || viewMatrix,
        u_projectionMatrix: projectionMatrix
      }).draw()
    })
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

import { AnimationLoop, Model } from '@luma.gl/engine'
import { Buffer, clear } from '@luma.gl/webgl'
import { setParameters } from '@luma.gl/gltools'
import GL from '@luma.gl/constants'
import { Matrix4 } from 'math.gl'
import combineLight from './light/combineLight'
import Control from './global/control/Base'
import { constantValue } from './utils/constant'

export default class Scene {
  constructor({ props, models, lights, eyesPosition = [0, 0, 10], centerPosition = [0, 0, 0], control }) {
    this.props = props
    this.eyesPosition = eyesPosition
    this.centerPosition = centerPosition
    this.models = models
    this.lightsModule = combineLight(lights)
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

    setParameters(gl, {
      depthTest: true,
      cull: true,
      cullFace: GL.BACK
      // depthFunc: gl.LEQUAL
    })

    const vs = `
      attribute vec3 positions;
      attribute vec3 normals;

      uniform mat4 u_modelMatrix;
      uniform mat4 u_viewMatrix;
      uniform mat4 u_projectionMatrix;

      varying vec3 v_color;
      varying vec3 v_frag_pos;
      varying vec3 v_normal;

      void main() {
        // u_MVPMatrix = u_projectionMatrix * u_viewMatrix * u_modelMatrix MVP变换
        gl_Position = u_projectionMatrix * u_viewMatrix * u_modelMatrix * vec4(positions, f1);

        vec3 modelNormal = normalize((mat3(u_modelMatrix) * normals).xyz);
        v_normal = modelNormal;
        v_frag_pos = (u_modelMatrix * vec4(positions, f1)).xyz; // mat3(u_modelMatrix) * positions;
        
        v_color = vec3(f0, f0, f0);
        ${this.lightsModule.frags.ambient}
        ${this.lightsModule.frags.directionalDiffuss}
      }
    `

    const fs = `
      uniform vec3 u_material_base_color;
      uniform vec3 u_view_pos;
      
      varying vec3 v_color;
      varying vec3 v_frag_pos;
      varying vec3 v_normal;

      const float specularStrength = 0.5;

      void main() {
        vec3 specularColor = vec3(f0, f0, f0);
        vec3 viewDir = normalize(u_view_pos - v_frag_pos);
        vec3 normal = normalize(v_normal);
        for (int i = 0; i < DIRECTIONAL_LENGTH; i++) {
          vec3 reflectDir = reflect(normalize(-u_directional_light[i].direction), normal);
          float spec = pow(max(dot(viewDir, reflectDir), f0), 8.0);
          specularColor += spec * specularStrength * u_directional_light[i].color;
        }

        gl_FragColor = vec4(v_color * u_material_base_color + specularColor, f1);
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
          modules: [this.lightsModule, constantValue],
          uniforms: {
            u_material_base_color: model.material.baseColor
          }
        })
      })
    }

    // mvp = model view projection
    const viewMatrix = new Matrix4().lookAt({ eye: this.eyesPosition, center: this.centerPosition })
    this.control.setEye({ eye: this.eyesPosition, center: this.centerPosition })

    const projectionMatrix = new Matrix4().perspective({ fov: Math.PI * 0.3, aspect, near: 1, far: 1000.0 })

    // const vertex = models[0].model.program.vs.handle
    // console.log(gl.getShaderSource(vertex))

    return { models, viewMatrix, projectionMatrix }
  }

  onResize({ aspect, projectionMatrix }) {
    projectionMatrix
      .identity()
      .perspective({ fov: Math.PI * 0.33, aspect, near: 1, far: 1000.0 })
  }

  lastTime = 0
  onRender = (params) => {
    // console.log(params)
    const { gl, models, viewMatrix, projectionMatrix, aspect, tick, time } = params
    const delt = time - this.lastTime
    this.lastTime = time

    if (this._lastAspect !== aspect) {
      this.onResize(params)
      this._lastAspect = aspect
    }

    this.control.tick(delt)

    clear(gl, { color: [0, 0, 0, 1], depth: true })

    models.map(({ model, position, rotation, modelMatrix }) => {
      modelMatrix
        .identity()
        .translate(position)
        .rotateXYZ(rotation)

      model.setUniforms({
        u_modelMatrix: modelMatrix,
        u_viewMatrix: this.control.viewMatrix || viewMatrix,
        u_projectionMatrix: projectionMatrix,
        u_view_pos: this.control.viewMatrixData.eye || this.eyesPosition
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

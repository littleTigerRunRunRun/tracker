import { AnimationLoop, Model } from '@luma.gl/engine'
import { clear, Buffer, Program, VertexArray } from '@luma.gl/webgl'
import { setParameters } from '@luma.gl/gltools'
import GL from '@luma.gl/constants'
import { Matrix4 } from 'math.gl'
import combineLight from './light/combineLight'
import Control from './global/control/Base'
import { constantValue } from './utils/constant'
import createBuffer from './buffer/index'

const QUAD_VERTS = [1, 1, -1, 1, 1, -1, -1, -1]

const modelVS = `#version 300 es
attribute vec3 positions;
attribute vec3 normals;

uniform mat4 u_modelMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_projectionMatrix;

out vec3 v_normals;

void main() {
  v_normals = normals;
  gl_Position = u_projectionMatrix * u_viewMatrix * u_modelMatrix * vec4(positions, f1);
}
`
const modelFS = `#version 300 es
uniform vec3 u_materialBaseColor;
uniform int u_drawMode;
  
in vec3 v_normals;

out vec4 fragColor;

void main() {
  switch (u_drawMode) {
    // 绘制模式：深度
    case 1: fragColor = vec4(u_materialBaseColor, f1); break;
    // 绘制模式：法向量
    case 2: fragColor = vec4(v_normals * fhalf + fhalf, f1); break;
    case 3: fragColor = vec4(v_normals * fhalf + fhalf, f1); break;
  }
}
`

const quadVS = `#version 300 es
layout(location=0) in vec2 a_position;

out vec2 v_uv;

void main() {
  v_uv = a_position.xy * fhalf + fhalf;
  gl_Position = vec4(a_position, f0, f1);
}
`

const quadFS = `#version 300 es

uniform sampler2D u_depth;
uniform sampler2D u_normals;

in vec2 v_uv;

out vec4 fragColor;

void main() {
  // fragColor = vec4(texture2D(u_normals, v_uv).xyz, f1);
  if (v_uv.x < 0.5 && v_uv.y < 0.5) {
    float depth = pow(texture2D(u_depth, v_uv * f2).r, 8.0); 
    fragColor = vec4(vec3(depth), f1);
  } else if (v_uv.x > 0.5 && v_uv.y < 0.5) {
    fragColor = vec4(texture2D(u_normals, vec2(v_uv.x * f2 - f1, v_uv.y * f2)).xyz, f1);
  }
}
`

export default class Scene {
  constructor({ props, models, lights, eyesPosition = [0, 0, 10], centerPosition = [0, 0, 0], control, framebuffers }) {
    this.props = props
    this.eyesPosition = eyesPosition
    this.centerPosition = centerPosition
    this.models = models
    this.lightsModule = combineLight(lights)
    this.control = new Control(control.params)
    this.framebuffers = framebuffers

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

    const framebuffers = createBuffer(this.framebuffers, gl)

    const quad = new Model(gl, {
      id: 'quad_program',
      vs: quadVS,
      fs: quadFS,
      modules: [constantValue],
      attributes: {
        a_position: new Buffer(gl, new Float32Array(QUAD_VERTS))
      },
      drawMode: gl.TRIANGLE_STRIP,
      vertexCount: 4
    })

    const models = []
    for (const model of this.models) {
      models.push({
        position: model.position || [0, 0, 0],
        rotation: model.rotation || [0, 0, 0],
        modelMatrix: new Matrix4(),
        model: new Model(gl, {
          id: 'object_model',
          vs: modelVS,
          fs: modelFS,
          geometry: model.geometry,
          modules: [this.lightsModule, constantValue],
          uniforms: {
            u_drawMode: 1,
            u_materialBaseColor: model.material.baseColor
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

    return { models, viewMatrix, projectionMatrix, framebuffers, quad }
  }

  onResize({ aspect, projectionMatrix }) {
    projectionMatrix
      .identity()
      .perspective({ fov: Math.PI * 0.33, aspect, near: 1, far: 1000.0 })
  }

  lastTime = 0
  onRender = (params) => {
    // console.log(params)
    const { gl, models, viewMatrix, projectionMatrix, aspect, tick, time, framebuffers, quad } = params
    const delt = time - this.lastTime
    this.lastTime = time

    if (this._lastAspect !== aspect) {
      this.onResize(params)
      this._lastAspect = aspect
    }

    this.control.tick(delt)

    // clear framebuffer
    for (const key in framebuffers) {
      const framebuffer = framebuffers[key]
      clear(gl, { color: [0, 0, 0, 1], depth: true, framebuffer: framebuffer.buffer })
    }

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
      })

      for (const key in framebuffers) {
        const framebuffer = framebuffers[key]
        model.setUniforms({
          u_drawMode: framebuffer.index
        })
        model.draw({ framebuffer: framebuffer.buffer })
      }
    })

    clear(gl, { color: [0, 0, 0, 1], depth: true })

    const uniforms = {}
    for (const key in framebuffers) {
      const framebuffer = framebuffers[key]
      framebuffer.addUniform(uniforms, framebuffer.buffer)
    }
    quad.setUniforms(uniforms)

    quad.draw()
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

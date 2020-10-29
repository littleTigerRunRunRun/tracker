import { AnimationLoop, Model } from '@luma.gl/engine'
import { setParameters } from '@luma.gl/gltools'
import { fxaa } from '@luma.gl/shadertools'
import GL from '@luma.gl/constants'
// import { brightnessContrast } from '@luma.gl/shadertools'
// console.log(brightnessContrast)

import { constantValue } from '../common/modules/constant'
import { PathGeometry } from './PathGeometry.js'
import { shapeSolver, polygonToSvgString } from './shapeSolver'
import { HelperLine } from './HelperLine.js'
import { Pipe, Pass, ShaderPass } from './pipe/index.js'
import createHandyBuffer from '../../moveMountain/prefab/buffer/HandyBuffer'

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
      webgl2: true,
      canvas,
      preserveDrawingBuffer: true
    })
  }

  onInitialize = ({ gl, canvas }) => {
    setParameters(gl, {
      blendFunc: [gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE]
    })

    this.gl = gl
    this.canvas = canvas
    this.initPipe(gl)
    return {}
  }

  onRender = ({ gl, time, extraUniform }) => {
    if (this.needUpdate) {
      this.pipe.render({ time })
    }
  }

  // 初始化本例需要使用的逻辑管道
  initPipe() {
    const { buffer, blit } = createHandyBuffer(this.gl)
    this.geometryPass = new Pass({
      pointers: {
        geometry: this.geometry,
        blit
      },
      onInitialize: ({ gl, geometry }) => {
        const helper = new HelperLine(gl, { lines: geometry.helperLines }) //

        const shapeModel = new Model(gl, {
          uniforms: {
            u_resolution: [100, 100]
          },
          vs: `#version 300 es
            layout (location = 0) in vec2 positions;
            layout (location = 1) in vec4 color;
    
            uniform vec2 u_resolution;

            out vec4 v_color;
    
            void main() {
              v_color = color;
              gl_Position = vec4(positions / u_resolution * f2 * -1.0 + vec2(f1), f0, f1);
            }
          `,
          fs: `#version 300 es
    
            in vec4 v_color;

            layout (location = 0) out vec4 colorValue;
    
            void main() {
              colorValue = v_color;
            }
          `,
          modules: [constantValue],
          geometry
        })

        this.needUpdate = true

        return { helper, shapeModel }
      },
      onRender: ({ gl, helper, shapeModel, target }) => {
        setParameters(gl, {
          blend: true
        })
        shapeModel.uniforms.u_resolution = [gl.drawingBufferWidth, gl.drawingBufferHeight]
        shapeModel.draw({ framebuffer: target })

        if (this.showNormal) {
          helper.uniforms.u_resolution = [gl.drawingBufferWidth, gl.drawingBufferHeight]
          helper.draw({ framebuffer: target })
        }

        this.needUpdate = false
      },
      onDestroy: ({ shapeModel }) => {
        shapeModel.delete()
      },
      onOutput: ({ blit }) => {
        const color = blit({ attachment: GL.COLOR_ATTACHMENT0 })

        return {
          t_geo: color
        }
      },
      clear: { color: [1, 1, 1, 1] },
      target: buffer
    })

    fxaa.fs = fxaa.fs.replace('#define FXAA_QUALITY_PRESET 29', '#define FXAA_QUALITY_PRESET 39')
    this.txaaPass = new ShaderPass({
      fs: `#version 300 es
      
        uniform sampler2D t_geo;
        uniform vec2 u_resolution;

        in vec2 v_uv;

        out vec4 fragColor;

        void main() {
          // fragColor = fxaa_sampleColor(t_geo, u_resolution, v_uv);
          fragColor = texture2D(t_geo, v_uv);
        }
      `,
      modules: [fxaa],
      render({ gl, time, extraUniforms, model }) {
        setParameters(gl, {
          blend: false
        })
        // const fragment = model.program.fs.handle
        // console.log(gl.getShaderSource(fragment))

        console.log(extraUniforms)

        // model.uniforms.u_resolution = [1, 1]
        console.log(model.uniforms)
        model.draw()
      },
      target: null
    })

    this.pipe = new Pipe({
      gl: this.gl,
      // textures: {
      //   t_geo: '/public/t_geo.png'
      // },
      stages: [
        [
          { pass: this.geometryPass, output: ['t_geo'] }
        ],
        [
          { pass: this.txaaPass, input: ['t_geo'] }
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

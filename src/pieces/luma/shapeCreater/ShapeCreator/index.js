import { AnimationLoop, Model } from '@luma.gl/engine'
import { setParameters } from '@luma.gl/gltools'
import GL from '@luma.gl/constants'
// import { brightnessContrast } from '@luma.gl/shadertools'
// console.log(brightnessContrast)

import { constantValue } from '@/pieces/luma/common/modules/constant'
import createHandyBuffer from '@/pieces/moveMountain/prefab/buffer/HandyBuffer'

import { Pipe, Pass, ShaderPass } from '../pipe/index.js'

import { PathGeometry } from './PathGeometry.js'
import { shapeSolver, polygonToSvgString } from './shapeSolver'
import { HelperLine } from './HelperLine.js'

export default class ShaperCreator {
  constructor(params) {
    const { canvas, showSvg, type, shape, style, showNormal = false } = params
    this.points = shapeSolver({ type, shape })
    this.style = style

    this.showNormal = showNormal // 是否显示几何图形的法线
    if (showSvg) console.log(polygonToSvgString(points))

    this.initLoop(canvas)
  }

  initLoop(canvas) {
    this.loop = new AnimationLoop({
      onInitialize: this.onInitialize,
      onRender: this.onRender
      // useDevicePixels: true
    })
    this.loop.start({
      webgl2: true,
      canvas,
      antialias: true,
      width: 400,
      height: 400,
      // premultipliedAlpha: false,
      preserveDrawingBuffer: true
    })
  }

  onInitialize = ({ gl, canvas }) => {
    setParameters(gl, {
      blendFunc: [gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE]
    })

    this.gl = gl
    this.canvas = canvas
    this.geometry = new PathGeometry({ gl, points: this.points, style: this.style })
    this.initPipe(gl)
    return {}
  }

  onRender = ({ gl, time, extraUniform }) => {
    this.pipe.render({ time })
  }

  // 初始化本例需要使用的逻辑管道
  initPipe() {
    const { buffer, blit } = createHandyBuffer(this.gl, 8)
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

    this.blurPass = new ShaderPass({
      fs: `#version 300 es
      
        uniform sampler2D t_geo;
        uniform vec2 u_resolution;

        in vec2 v_uv;

        out vec4 fragColor;

        const float inverse_sqrt_2p = 0.39894228;
        const float sigma = 2.0;
        const int kernelRadius = 2;

        // 生成一个x位置的一维正态分布值
        float oneDimensionalGaussian (in float x) {
          return inverse_sqrt_2p / sigma * exp((-x * x) / (f2 * sigma * sigma));
        }

        vec4 gaussianBlur(sampler2D tImage, vec2 uv) {
          vec2 direction = vec2(0.0, 1.0);
          vec2 unitSize = f1 / u_resolution;
          float weightSum = oneDimensionalGaussian(f0);
          vec3 diffuseSum = texture2D(tImage, uv).rgb * weightSum;
    
          // 这里其实是从-(kernelRadius - 1) kernelRadius - 1
          for (int i = 1; i < kernelRadius; i++ ) {
            float x = float(i);
            float w = oneDimensionalGaussian(x);
            vec2 offset = direction * x * unitSize;
            vec3 sampler1 = texture2D(tImage, uv + offset).rgb;
            vec3 sampler2 = texture2D(tImage, uv - offset).rgb;
            diffuseSum += (sampler1 + sampler2) * w;
            weightSum += w * f2;
          }
    
          return vec4(diffuseSum / weightSum, 1.0);
        }

        void main() {
          // fragColor = fxaa_sampleColor(t_geo, u_resolution, v_uv);
          fragColor = texture2D(t_geo, v_uv); // gaussianBlur(t_geo, v_uv);
        }
      `,
      render({ gl, time, extraUniforms, model }) {
        setParameters(gl, {
          blend: false
        })
        // const fragment = model.program.fs.handle
        // console.log(gl.getShaderSource(fragment))

        model.uniforms.u_resolution = [gl.drawingBufferWidth, gl.drawingBufferHeight]
        model.draw()
      },
      target: null
    })

    this.pipe = new Pipe({
      gl: this.gl,
      autoUpdate: false,
      // textures: {
      //   t_geo: '/public/t_circle.png'
      // },
      stages: [
        [
          { pass: this.geometryPass, output: ['t_geo'] }
        ],
        [
          { pass: this.blurPass, input: ['t_geo'] }
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

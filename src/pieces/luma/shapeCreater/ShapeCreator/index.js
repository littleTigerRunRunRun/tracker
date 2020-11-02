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
      // blend: true,
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
    // const { buffer, blit } = createHandyBuffer(this.gl, 8)
    this.geometryPass = new Pass({
      pointers: {
        geometry: this.geometry
        // blit
      },
      onInitialize: ({ gl, geometry }) => {
        const helper = new HelperLine(gl, { lines: geometry.helperLines }) //
        // console.log(geometry.textures[0])

        const shapeModel = new Model(gl, {
          uniforms: {
            u_resolution: [100, 100],
            'u_colorTextures[0]': geometry.textures[0]
          },
          defines: {
          },
          vs: `#version 300 es
            layout (location = 0) in vec2 positions;
            layout (location = 1) in vec3 texture;
    
            uniform vec2 u_resolution;

            out vec3 v_texture;
    
            void main() {
              v_texture = texture;
              gl_Position = vec4(positions / u_resolution * f2 * -1.0 + vec2(f1), f0, f1);
            }
          `,
          fs: `#version 300 es
    
            uniform sampler2D u_colorTextures[2];

            in vec3 v_texture;

            layout (location = 0) out vec4 colorValue;
    
            void main() {
              if (v_texture.x == f0) {
                colorValue = texture2D(u_colorTextures[0], vec2(v_texture.y, f1 - v_texture.z));
              }
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
        shapeModel.draw()
        // shapeModel.draw({ framebuffer: target })

        if (this.showNormal) {
          helper.uniforms.u_resolution = [gl.drawingBufferWidth, gl.drawingBufferHeight]
          helper.draw()
          // helper.draw({ framebuffer: target })
        }
      },
      onDestroy: ({ shapeModel }) => {
        shapeModel.delete()
      },
      // onOutput: ({ blit }) => {
      //   const color = blit({ attachment: GL.COLOR_ATTACHMENT0 })

      //   return {
      //     t_geo: color
      //   }
      // },
      clear: { color: [1, 1, 1, 1] },
      target: null // buffer
    })

    this.pipe = new Pipe({
      gl: this.gl,
      autoUpdate: false,
      // textures: {
      //   t_geo: '/public/t_circle.png'
      // },
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

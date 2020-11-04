import { Pass } from '../pipe/index.js'
import { constantValue } from '@/pieces/luma/common/modules/constant'
import { Model } from '@luma.gl/engine'
import { setParameters, resizeGLContext } from '@luma.gl/gltools'
// import { HelperLine } from './HelperLine.js'
console.log(resizeGLContext)

export const GeometryPass = new Pass({
  onInitialize: ({ gl }) => {
    // const helper = new HelperLine(gl, { lines: geometry.helperLines })

    const vs = `#version 300 es

      layout (location = 0) in vec2 positions;
      layout (location = 1) in vec3 texture;

      uniform vec2 u_resolution;

      out vec3 v_texture;

      void main() {
        v_texture = texture;
        gl_Position = vec4(positions / u_resolution * f2 * -1.0 + vec2(f1), f0, f1);
      }
    `
    const fs = `#version 300 es

      uniform sampler2D u_colorTextures[2];

      in vec3 v_texture;

      layout (location = 0) out vec4 colorValue;

      void main() {
        if (v_texture.x == f0) {
          colorValue = texture2D(u_colorTextures[0], vec2(f1) - v_texture.yz);
        } else {
          colorValue = texture2D(u_colorTextures[1], vec2(f1) - v_texture.yz);
        }
      }
    `

    return { fs, vs, gl }
  },
  onRender: ({ gl, vs, fs, geometry, geometrySize, canvas }) => {
    setParameters(gl, {
      blend: true
    })

    const { width, height } = geometrySize
    canvas.width = width
    canvas.height = height
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'
    resizeGLContext(gl)
    gl.viewport(0, 0, width, height)
    const shapeModel = new Model(gl, {
      uniforms: {
        u_resolution: [width, height],
        'u_colorTextures[0]': geometry.textures[0],
        'u_colorTextures[1]': geometry.textures[1]
      },
      defines: {},
      vs,
      fs,
      modules: [constantValue],
      geometry
    })
    shapeModel.draw()
    // console.log(shapeModel)
    // shapeModel.draw({ framebuffer: target })

    // if (this.showNormal) {
    //   helper.uniforms.u_resolution = [gl.drawingBufferWidth, gl.drawingBufferHeight]
    //   helper.draw()
    //   // helper.draw({ framebuffer: target })
    // }

    return { shapeModel }
  },
  onClear: ({ shapeModel }) => {
    // shapeModel.delete()
  },
  // onOutput: ({ blit }) => {
  //   const color = blit({ attachment: GL.COLOR_ATTACHMENT0 })

  //   return {
  //     t_geo: color
  //   }
  // },
  clearSettings: { color: [1, 1, 1, 1] },
  target: null // buffer
})

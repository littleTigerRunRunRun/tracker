import { Model } from '@luma.gl/engine'
import { setParameters, resizeGLContext, withParameters, isWebGL2, log } from '@luma.gl/gltools'
import GL from '@luma.gl/constants'
import { assert } from '@luma.gl/webgl'
// import { HelperLine } from '../geometry'
import { Pass } from '../pass'
import { constantValue, RectProcessModel } from '../utils'

function drawBuffers({
  logPriority, // Probe log priority, enables Model to do more integrated logging

  drawMode = GL.TRIANGLES,
  vertexCount,
  offset = 0,
  start,
  end,
  isIndexed = false,
  indexType = GL.UNSIGNED_SHORT,
  instanceCount = 0,
  isInstanced = instanceCount > 0,

  vertexArray = null,
  // transformFeedback,
  framebuffer,
  parameters = {},

  // Deprecated
  uniforms,
  samplers
}) {
  if (uniforms || samplers) {
    // DEPRECATED: v7.0 (deprecated earlier but warning not properly implemented)
    log.deprecated('Program.draw({uniforms})', 'Program.setUniforms(uniforms)')()
    this.setUniforms(uniforms || {})
  }

  assert(vertexArray)

  this.gl.useProgram(this.handle)

  vertexArray.bindForDraw(vertexCount, instanceCount, () => {
    if (framebuffer !== undefined) {
      parameters = Object.assign({}, parameters, { framebuffer })
    }

    // if (transformFeedback) {
    //   const primitiveMode = getPrimitiveDrawMode(drawMode)
    //   transformFeedback.begin(primitiveMode)
    // }

    this._bindTextures()

    // this.gl.bindFramebuffer(GL.READ_FRAMEBUFFER, framebuffer.handle)
    // this.gl.bindFramebuffer(GL.DRAW_FRAMEBUFFER, framebuffer.handle)
    // console.log(framebuffer.drawBuffers)

    withParameters(this.gl, parameters, () => {
      // TODO - Use polyfilled WebGL2RenderingContext instead of ANGLE extension
      if (isIndexed && isInstanced) {
        this.gl.drawElementsInstanced(drawMode, vertexCount, indexType, offset, instanceCount)
      } else if (isIndexed && isWebGL2(this.gl) && !isNaN(start) && !isNaN(end)) {
        this.gl.drawRangeElements(drawMode, start, end, vertexCount, indexType, offset)
      } else if (isIndexed) {
        this.gl.drawElements(drawMode, vertexCount, indexType, offset)
      } else if (isInstanced) {
        this.gl.drawArraysInstanced(drawMode, offset, vertexCount, instanceCount)
      } else {
        this.gl.drawArrays(drawMode, offset, vertexCount)
      }
    })

    // if (transformFeedback) {
    //   transformFeedback.end()
    // }
  })

  return true
}

export const GeometryPass = new Pass({
  onInitialize: ({ gl }) => {
    const vs = `#version 300 es

      layout (location = 0) in vec3 positions;
      layout (location = 1) in vec3 texture;

      uniform vec2 u_resolution;
      uniform float u_geometry_size;
      uniform vec2 u_translate;

      out vec3 v_texture;
      out float v_length;

      void main() {
        v_texture = texture;
        v_length = positions.z;
        vec2 resize = vec2(f1);
        #if (AUTO_RESIZE_MODE == 0) // not resize
          // do nothing
        #elif (AUTO_RESIZE_MODE == 1) // resize but remain ratio
          resize = u_resolution;
        #elif (AUTO_RESIZE_MODE == 2) // to edge
          resize = vec2(min(u_resolution.x, u_resolution.y));
        #endif

        vec2 pos = (positions.xy * u_geometry_size + u_translate) / resize * f2;
        gl_Position = vec4(pos.x, -pos.y, f0, f1);
      }
    `
    const fs = `#version 300 es

      uniform sampler2D u_colorTextures[2];
      uniform float u_geometry_length;

      in vec3 v_texture;
      in float v_length;

      layout (location = 0) out vec4 colorValue;
      // #ifdef FETCH_LENGTH
      layout (location = 1) out vec4 lengthValue;
      // #endif

      void main() {
        // #ifdef FETCH_LENGTH
        lengthValue = vec4(f1, f0, f0, f1);
        // #endif
        if (v_texture.x == f0) {
          colorValue = texture2D(u_colorTextures[0], vec2(v_texture.y, f1 - v_texture.z));
        } else if (v_texture.x == f1) {
          // colorValue = vec4(vec3((v_length.x * 256.0 + v_length.y) / u_geometry_length), f1);
          colorValue = texture2D(u_colorTextures[1], vec2(v_texture.y, f1 - v_texture.z));
        } else colorValue = vec4(f0, f0, f0, f0);
      }
    `

    return { fs, vs, gl }
  },
  onRender: ({ gl, vs, fs, geometry, geometryUniforms, geometryDefines = {}, geometrySize, canvas, fetchLength, target }) => {
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
    if (target) target.resize({ width, height })

    if (fetchLength) geometryDefines.FETCH_LENGTH = 1
    const shapeModel = new Model(gl, {
      uniforms: {
        u_resolution: [width, height],
        'u_colorTextures[0]': geometry.textures[0],
        'u_colorTextures[1]': geometry.textures[1]
      },
      defines: geometryDefines,
      vs,
      fs,
      modules: [constantValue],
      geometry
    })
    // shapeModel.program._drawBuffers = drawBuffers

    // // 用于测试贴图是否正确绘制的测试model
    // const shapeModel = new RectProcessModel(gl, {
    //   uniforms: {
    //     'u_colorTextures[0]': geometry.textures[0],
    //     'u_colorTextures[1]': geometry.textures[1]
    //   },
    //   // defines: geometryDefines,
    //   modules: [constantValue],
    //   is2: true,
    //   fs: `#version 300 es

    //     uniform sampler2D u_colorTextures[2];

    //     in vec2 v_uv;

    //     layout (location = 0) out vec4 colorValue;

    //     void main() {
    //       colorValue = texture2D(u_colorTextures[0], v_uv); // vec4(f0, f0, f0, f1);
    //     }
    //   `
    // })

    for (const key in geometryUniforms) shapeModel.uniforms[key] = geometryUniforms[key]
    // console.log(target.handle)

    gl.bindFramebuffer(gl.FRAMEBUFFER, target.handle)
    gl.drawBuffers(target.drawBuffers)

    const drawParams = shapeModel.vertexArray.getDrawParams()
    const {
      isIndexed = drawParams.isIndexed,
      indexType = drawParams.indexType,
      indexOffset = drawParams.indexOffset
    } = shapeModel.props
    const { isInstanced, instanceCount } = shapeModel

    shapeModel.program.setUniforms(shapeModel.uniforms)

    const DRAW_PARAMS = {}
    drawBuffers.call(shapeModel.program, Object.assign(DRAW_PARAMS, { framebuffer: target }, {
      uniforms: null, // Already set (may contain "function values" not understood by Program)
      parameters: {},
      drawMode: shapeModel.getDrawMode(),
      vertexCount: shapeModel.getVertexCount(),
      vertexArray: shapeModel.vertexArray,
      isIndexed,
      indexType,
      isInstanced,
      instanceCount,
      offset: isIndexed ? indexOffset : 0
    }))

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)

    // const fragment = shapeModel.program.fs.handle
    // console.log(gl.getShaderSource(fragment))

    // if (target) shapeModel.draw({ framebuffer: target })
    // else shapeModel.draw()

    // const helper = new HelperLine(gl, { lines: geometry.helperLines, size: geometryUniforms.u_geometry_size })
    // for (const key in geometryUniforms) helper.uniforms[key] = geometryUniforms[key]
    // helper.uniforms.u_resolution = [width, height]
    // helper.draw()

    shapeModel.delete()

    return {}
  },
  onClear: () => {
    // shapeModel.delete()
  },
  // onOutput: ({ blit }) => {
  //   const color = blit({ attachment: GL.COLOR_ATTACHMENT0 })

  //   return {
  //     t_geo: color
  //   }
  // },
  target: null // buffer
})

import { Model } from '@luma.gl/engine'
import { setParameters, resizeGLContext } from '@luma.gl/gltools'
// import { HelperLine } from '../geometry'
import { Pass } from '../pass'
import { constantValue } from '../utils' // , RectProcessModel

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
        v_length = positions[2];
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

      in vec3 v_texture;
      in float v_length;

      layout (location = 0) out vec4 colorValue;

      void main() {
        if (v_texture.x == f0) {
          colorValue = texture2D(u_colorTextures[0], vec2(v_texture.y, f1 - v_texture.z));
        } else if (v_texture.x == f1) {
          colorValue = texture2D(u_colorTextures[1], vec2(v_texture.y, f1 - v_texture.z));
          // colorValue = vec4(vec3(v_length), f1);
        } else colorValue = vec4(f0, f0, f0, f1);
      }
    `

    return { fs, vs, gl }
  },
  onRender: ({ gl, vs, fs, geometry, geometryUniforms, geometryDefines = {}, geometrySize, canvas }) => {
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
      defines: geometryDefines,
      vs,
      fs,
      modules: [constantValue],
      geometry
    })

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
    // console.log(shapeModel.uniforms)
    shapeModel.draw()
    // console.log(shapeModel)
    // shapeModel.draw({ framebuffer: target })

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
  clearSettings: { color: [0, 0, 0, 0] },
  target: null // buffer
})

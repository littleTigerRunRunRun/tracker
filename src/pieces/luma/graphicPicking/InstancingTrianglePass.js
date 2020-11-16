// 一个用于测试graphic picking的pass
import { Model } from '@luma.gl/engine'
import { Buffer } from '@luma.gl/webgl'
import { Pass } from '@/pieces/luma/common/pass'
import GL from '@luma.gl/constants'

export default new Pass({
  onInitialize: ({ gl }) => {
    const positionBuffer = new Buffer(gl, new Float32Array([
      -0.2, -0.2,
      0.2, -0.2,
      0.2, 0.2
    ]))

    const colorBuffer = new Buffer(gl, new Float32Array([
      1.0, 0.0, 0.0,
      0.0, 1.0, 0.0,
      0.0, 0.0, 1.0,
      1.0, 1.0, 0.0
    ]))

    const offsetBuffer = new Buffer(gl, new Float32Array([
      0.5, 0.5,
      -0.5, 0.5,
      0.5, -0.5,
      -0.5, -0.5
    ]))

    const indexBuffer = new Buffer(gl, new Float32Array([
      1, 2, 3, 4
    ]))

    const model = new Model(gl, {
      vs: `#version 300 es

        layout (location = 0) in vec2 position;
        layout (location = 1) in vec3 color;
        layout (location = 2) in vec2 offset;
        layout (location = 3) in float index;

        out vec3 color_vColor;
        out float v_index;

        void main() {
          v_index = index;
          color_vColor = color;
          gl_Position = vec4(position + offset, 0.0, 1.0);
        }
      `,
      fs: `#version 300 es
        uniform float u_select;

        in vec3 color_vColor;
        in float v_index;

        out vec4 fragColor;
        
        void main() {
          if (u_select == v_index) {
            fragColor = vec4(vec3(1.0), 1.0);
          } else {
            fragColor = vec4(color_vColor, 1.0);
          }
        }
      `,
      attributes: {
        position: positionBuffer,
        color: [colorBuffer, { divisor: 1 }],
        offset: [offsetBuffer, { divisor: 1 }],
        index: [indexBuffer, { divisor: 1 }]
      },
      vertexCount: 3,
      instanceCount: 4,
      instanced: true
    })

    return { model }
  },
  onRender: (params) => {
    const { model, gl, selectingIndex } = params
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)

    model.uniforms.u_select = selectingIndex || 0
    model.draw()
  },
  clearSettings: { color: [0, 0, 0, 1] }
})

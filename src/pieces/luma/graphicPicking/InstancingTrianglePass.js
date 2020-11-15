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

    const model = new Model(gl, {
      vs: `#version 300 es

        layout (location = 0) in vec2 position;
        layout (location = 1) in vec3 color;
        layout (location = 2) in vec2 offset;

        out vec3 color_vColor;

        void main() {
          color_vColor = color;
          gl_Position = vec4(position + offset, 0.0, 1.0);
        }
      `,
      fs: `#version 300 es

        in vec3 color_vColor;

        out vec4 fragColor;
        
        void main() {
          fragColor = vec4(color_vColor, 1.0);
        }
      `,
      attributes: {
        position: positionBuffer,
        color: [colorBuffer, { divisor: 1 }],
        offset: [offsetBuffer, { divisor: 1 }]
      },
      vertexCount: 3,
      instanceCount: 4,
      instanced: true
    })

    return { model }
  },
  onRender: (params) => {
    const { model, gl } = params
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)

    model.draw()
  },
  clearSettings: { color: [0, 0, 0, 1] }
})

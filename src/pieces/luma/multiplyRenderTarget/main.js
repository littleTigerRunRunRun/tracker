import { ShaderPass, Loop } from '@/pieces/luma/common/pass'
import { constantValue } from '@/pieces/luma/common/utils'

export default function setCanvas(canvas) {
  const loop = new Loop({
    canvas,
    // autoUpdate: true,
    stages: [
      [
        {
          pass: new ShaderPass({
            uniforms: {
              u_time: 0,
              u_resolution: [100, 100]
            },
            fs: `#version 300 es

              uniform float u_time;
              uniform vec2 u_resolution;

              in vec2 v_uv;

              out vec4 fragColor;

              void main(void) {
                vec2 uv = (v_uv - 0.5) * 2.0 * u_resolution / min(u_resolution.x, u_resolution.y);
                
                fragColor = vec4(vec3(0.2 / length(uv)), f1);
              }
            `,
            modules: [constantValue],
            render({ gl, model, startTime }) {
              gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)

              model.uniforms.u_time = Date.now() - startTime
              model.uniforms.u_resolution = [gl.drawingBufferWidth, gl.drawingBufferHeight]

              model.draw()
            }
          })
        }
      ]
    ]
  })

  loop.addRenderTask()

  return loop
}

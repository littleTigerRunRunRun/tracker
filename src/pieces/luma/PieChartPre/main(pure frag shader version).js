import { AnimationLoop, Model } from '@luma.gl/engine'
import { clear } from '@luma.gl/webgl'
import { RectProcessModel } from '../common/models/RectProcessModel'
import { constantValue } from '../common/modules/constant'

// https://www.shadertoy.com/view/4sKBWc
export default function() {
  return new AnimationLoop({
    onInitialize({ gl }) {
      const model = new RectProcessModel(gl, {
        uniforms: {
          u_time: 0,
          u_resolution: [gl.drawingBufferWidth, gl.drawingBufferHeight]
        },
        fs: `
          precision highp float;

          #define RADIUS 0.5
          #define PI 3.1415926
          #define INVERSE_TWO_PI 0.159155

          uniform float u_time;
          uniform vec2 u_resolution;

          varying vec2 v_uv;

          void main(void) {
            vec2 uv = (v_uv - 0.5) * 2.0 * u_resolution / min(u_resolution.x, u_resolution.y);
            float dist = length(uv);

            // 16% 27% 57%
            vec3 color = vec3(0.6, 0.09, 0.08);
            vec3 background = vec3(0.1, 0.2, 0.3);
            float angle = (PI - atan(uv.x, -uv.y)) * INVERSE_TWO_PI;

            vec3 dcolor1 = vec3(0.1, 0.69, 0.65);
            color += smoothstep(0.16 - 0.001, 0.16 + 0.001, angle) * dcolor1;

            vec3 dcolor2 = vec3(0.29, 0.19, 0.168);
            color += smoothstep(0.43 - 0.001, 0.43 + 0.001, angle) * dcolor2;

            gl_FragColor = vec4(color, f1);

            gl_FragColor = vec4(smoothstep(RADIUS - 0.002, RADIUS + 0.002, dist) * (background - color) + color, f1);
          }
        `,
        modules: [constantValue]
      })

      const startTime = Date.now()

      return { model, startTime }
    },
    onRender({ gl, model, startTime }) {
      clear(gl, { color: [0, 0, 0, 1] })

      model.uniforms.u_time = Date.now() - startTime
      model.uniforms.u_resolution = [gl.drawingBufferWidth, gl.drawingBufferHeight]

      model.draw()
    }
  })
}

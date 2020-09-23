import { AnimationLoop, Model } from '@luma.gl/engine'
import { Buffer, clear } from '@luma.gl/webgl'
import { RectProcessModel } from '../common/models/RectProcessModel'
import { constantValue } from '../common/modules/constant'
import { simplex } from '../common/modules/noise'

// https://www.shadertoy.com/view/WtG3RD
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
          
          #define BLACK_COL vec3(16.0, 21.0, 25.0) / 255.0

          uniform float u_time;
          uniform vec2 u_resolution;

          varying vec2 v_uv;
        
          void main(void) {
            vec2 uv = (v_uv - fhalf) * 2.0 * u_resolution / min(u_resolution.x, u_resolution.y);

            float l = length(uv);

            float m1 = clamp(0.1 / smoothstep(f0, 1.75, l), f0, f1);
            float m2 = clamp(0.1 / smoothstep(0.42, f0, l), f0, f1);
            
            float n1 = simplex_noise(vec3(uv * 2.0, f1 + u_time * 0.000525));
            float s1 = n1 * max(f1 - l * 1.75, f0) + 0.9;

            float n2 = simplex_noise(vec3(uv * f1, 15.0 + u_time * 0.000525));
            float s2 = n2 * max(f0 + l * f1, 0.025) + 1.25;

            float a = sin(atan(uv.y, uv.x));
            float am = abs(a - fhalf) / 4.0;
            float n3 = simplex_noise(vec3(vec2(am, am * 100.0 + u_time * 0.003) * 0.15, 30.0 + u_time * 0.000525));
            float s3 = n3 * max(f0 + l * f1, 0.25) + 1.5;
            s3 *= smoothstep(f0, 0.3345, l);

            float sh = smoothstep(0.15, 0.35, l);

            // m1 * m1 * m2就有简单的日食效果了
            float m = m1 * m1 * m2 * (s1 * s2 * s3 * (f1 - l)) * sh;

            float value = m;
            vec3 col = mix(BLACK_COL, 0.5 + 0.5 * cos(u_time * 0.001 + uv.xyx * 3.0 + vec3(f0, 2.0, 4.0)), m);

            gl_FragColor = vec4(col, f1);
          }
        `,
        modules: [simplex, constantValue]
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

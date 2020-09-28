import { AnimationLoop, Model } from '@luma.gl/engine'
import { clear } from '@luma.gl/webgl'
import { RectProcessModel } from '../common/models/RectProcessModel'
import { constantValue } from '../common/modules/constant'

// https://www.shadertoy.com/view/Wty3zz
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

          uniform float u_time;
          uniform vec2 u_resolution;

          varying vec2 v_uv;

          const float PI = 3.1416;

          float DistLine(vec3 ro, vec3 rd, vec3 p) {
            return length(cross(p - ro, rd)) / length(rd);
          }

          void main(void) {
            vec2 uv = (v_uv - fhalf) * f2 * u_resolution / min(u_resolution.x, u_resolution.y);
            vec3 ro = vec3(f0, fhalf, -f2);
            vec3 rd = vec3(uv, f0) - ro;

            float t = u_time * 0.002;
            // 在xz平面上做一个围绕中心点的旋转，p、q具有半圈的相位差
            vec3 p = 0.5 * vec3(sin(t), f0, fhalf + cos(t));
            vec3 q = 0.5 * vec3(sin(t + PI), f0, fhalf + cos(t + PI));
            float d = DistLine(ro, rd, p);
            float e = DistLine(ro, rd, q);

            // pow (a / (value + b), c) * d a可以增大直接半径，b和c效果类似，d能调整整体亮度
            d = pow(0.06 / (d + 0.04), 1.0) * 1.0;
            e = pow(0.06 / (e + 0.04), 1.0) * 1.0;

            vec3 c1 = vec3(f0, 0.5, 0.9);
            vec3 c2 = vec3(0.8, 0.5, f0);

            gl_FragColor = vec4(c1 * d + c2 * e, f1);
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

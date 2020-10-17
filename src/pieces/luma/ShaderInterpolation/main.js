import { AnimationLoop, Model } from '@luma.gl/engine'
import { clear } from '@luma.gl/webgl'
import { RectProcessModel } from '../common/models/RectProcessModel'
import { constantValue } from '../common/modules/constant'
import { cosInter } from '../common/modules/interpolation'
import { simplex } from '../common/modules/noise'

// https://www.shadertoy.com/view/ll2GD3
export default function() {
  let uniforms = null

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

          // 一个平滑的线性差值方法
          float fade(float t) {
            return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
          }

          void main(void) {
            vec2 uv = (v_uv - 0.5) * 2.0 * u_resolution / min(u_resolution.x, u_resolution.y);
            float t = v_uv .x + u_time * 0.00001;

            // color(t) = a + b ⋅ cos[ 2π( c ⋅ t + d ) ]
            // 我需要一个渐变色蓝色到红色
            vec3 a1 = vec3(0.5, 0.0, 0.5);
            vec3 b1 = vec3(0.5, 0, -0.5);
            vec3 c1 = vec3(1.0, 1.0, 1.0);
            vec3 d1 = vec3(0.0, 0.0, 0.0);
            vec3 color1 = cosInter(t, a1, b1, c1, d1);

            vec3 a2 = vec3(0.5, 0.5, 0.5);
            vec3 b2 = vec3(0.5, 0.5, 0.5);
            vec3 c2 = vec3(1.0, 1.0, 1.0);
            vec3 d2 = vec3(0.0, 0.1, 0.2);
            vec3 color2 = cosInter(t, a2, b2, c2, d2);

            vec3 a3 = vec3(0.5, 0.5, 0.5);
            vec3 b3 = vec3(0.5, 0.5, 0.5);
            vec3 c3 = vec3(1.0, 1.0, 1.0);
            vec3 d3 = vec3(0.3, 0.2, 0.2);
            vec3 color3 = cosInter(t, a3, b3, c3, d3);

            vec3 a4 = vec3(0.5, 0.5, 0.5);
            vec3 b4 = vec3(0.5, 0.5, 0.5);
            vec3 c4 = vec3(1.0, 1.0, 0.5);
            vec3 d4 = vec3(0.8, 0.9, 0.3);
            vec3 color4 = cosInter(t, a4, b4, c4, d4);

            vec3 a5 = vec3(0.5, 0.5, 0.5);
            vec3 b5 = vec3(0.5, 0.5, 0.5);
            vec3 c5 = vec3(1.0, 0.7, 0.4);
            vec3 d5 = vec3(0.0, 0.15, 0.2);
            vec3 color5 = cosInter(t, a5, b5, c5, d5);

            vec3 a6 = vec3(0.5, 0.5, 0.5);
            vec3 b6 = vec3(0.5, 0.5, 0.5);
            vec3 c6 = vec3(2.0, 1.0, 0.0);
            vec3 d6 = vec3(0.5, 0.2, 0.25);
            vec3 color6 = cosInter(t, a6, b6, c6, d6);

            vec3 a7 = vec3(0.8, 0.5, 0.4);
            vec3 b7 = vec3(0.2, 0.4, 0.2);
            vec3 c7 = vec3(2.0, 1.0, 1.0);
            vec3 d7 = vec3(0.0, 0.25, 0.25);
            vec3 color7 = cosInter(t, a7, b7, c7, d7);
            // vec3 a7 = vec3(1.0, 1.0, 1.0);
            // vec3 b7 = vec3(0.0, 0.0, 0.0);
            // vec3 color7 = mix(a7, b7, vec3(fade(v_uv.x)));

            vec3 a8 = vec3(0.5, 0.5, 0.5);
            vec3 b8 = vec3(0.5, 0.5, 0.5);
            vec3 c8 = vec3(1.0, 1.0, 1.0);
            vec3 d8 = vec3(0.0, 0.33, 0.67);
            vec3 color8 = cosInter(t, a8, b8, c8, d8);
            // vec3 color8 = mix(a7, b7, vec3(v_uv.x));

            vec4 color = vec4(color1, f1);
            if (v_uv.y > 0.125) color = vec4(color2, f1);
            if (v_uv.y > 0.25) color = vec4(color3, f1);
            if (v_uv.y > 0.375) color = vec4(color4, f1);
            if (v_uv.y > 0.5) color = vec4(color5, f1);
            if (v_uv.y > 0.625) color = vec4(color6, f1);
            if (v_uv.y > 0.75) color = vec4(color7, f1);
            if (v_uv.y > 0.875) color = vec4(color8, f1);

            float f = fract(v_uv.y * 8.0);
            // border
            color.xyz *= smoothstep(0.49, 0.47, abs(f - 0.5));
            // 两侧阴影
            color.xyz *= vec3(0.5 + 0.5 * sqrt(4.0 * f * f * (1.0 - f)));
            // 抖动dithering
            float noise = 
              simplex_noise(vec3(v_uv * 2.0, f0)) * 0.42 + 
              simplex_noise(vec3(v_uv * 4.0, f0)) * 0.26 + 
              simplex_noise(vec3(v_uv * 14.0, f0)) * 0.23 + 
              simplex_noise(vec3(v_uv * 9.0, f0)) * 0.19
              ;
            color.xyz += noise * 0.1;
            
            gl_FragColor = color;
            // gl_FragColor = vec4(noise, noise, noise, f1);
          }
        `,
        modules: [constantValue, cosInter, simplex]
      })

      const startTime = Date.now()

      console.log(model)

      return { model, startTime }
    },
    onRender({ gl, model, startTime }) {
      clear(gl, { color: [0, 0, 0, 1] })

      model.uniforms.u_time = Date.now() - startTime
      model.uniforms.u_resolution = [gl.drawingBufferWidth, gl.drawingBufferHeight]

      if (uniforms) {
        for (const key in uniforms) {
          model.uniforms[key] = uniforms[key]
        }
        uniforms = null
      }

      model.draw()
    },
    changeParams(params) {
      uniforms = params
    }
  })
}

import { AnimationLoop, Model } from '@luma.gl/engine'
import { clear } from '@luma.gl/webgl'
import { RectProcessModel } from '../common/models/RectProcessModel'
import { constantValue } from '../common/modules/constant'

// https://www.shadertoy.com/view/3sfyRB
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

          #define COLOR vec3(0.001, 0.011, 0.05)

          uniform float u_time;
          uniform vec2 u_resolution;

          varying vec2 v_uv;
        
          void main(void) {
            vec2 uv = v_uv * u_resolution / min(u_resolution.x, u_resolution.y);

            vec3 blue = pow(COLOR, uv.yyy);
            vec3 orange = f1 - blue;
            vec3 sky = blue * pow(orange, vec3(8.0)) * 16.0; // pow(orange, vec3(8.0))
            gl_FragColor = vec4(pow(sky, vec3(0.4545)), f1);
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

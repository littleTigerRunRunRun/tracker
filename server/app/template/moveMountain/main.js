import { AnimationLoop, Model } from '@luma.gl/engine'
import { clear } from '@luma.gl/webgl'
import { RectProcessModel } from '../../luma/common/models/RectProcessModel'
import { constantValue } from '../../luma/common/modules/constant'

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
        
          void main(void) {
            vec2 uv = (v_uv - 0.5) * 2.0 * u_resolution / min(u_resolution.x, u_resolution.y);

            gl_FragColor = vec4(vec3(0.2 / length(uv)), f1);
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

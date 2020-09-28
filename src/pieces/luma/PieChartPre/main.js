import { AnimationLoop, Model, PlaneGeometry } from '@luma.gl/engine'
import { clear } from '@luma.gl/webgl'
// import { RectProcessModel } from '../common/models/RectProcessModel'
import { constantValue } from '../common/modules/constant'

// https://www.shadertoy.com/view/4sKBWc
export default function() {
  return new AnimationLoop({
    onInitialize({ gl }) {
      const model = new Model(gl, {
        uniforms: {
          u_time: 0,
          u_resolution: [gl.drawingBufferWidth, gl.drawingBufferHeight]
        },
        geometry: new PlaneGeometry({ xlen: 1, ylen: 1 }),
        vs: `
          attribute vec3 positions;

          varying vec2 v_uv;

          void main() {
            v_uv = positions.xy * fhalf + fhalf;
            gl_Position = vec4(positions, f1);
          }
        `,
        fs: `
          precision highp float;
        
          varying vec2 v_uv;
          uniform vec2 u_resolution;
          
        
          void main(void) {
            vec2 uv = (v_uv - 0.5) * 2.0 * u_resolution / min(u_resolution.x, u_resolution.y);

            gl_FragColor = vec4(vec3(f1), f1);
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

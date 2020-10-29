import { Model, Buffer, PlaneGeometry } from '@luma.gl/engine'

export class RectProcessModel extends Model {
  constructor(gl, { fs, modules = [], defines = {}, is2 = false }) {
    super(gl, {
      vs: is2 ? `#version 300 es
        layout (location = 0) in vec3 positions;

        uniforms vec2 u_resolution;

        out vec2 v_uv;
        
        void main() {
          v_uv = positions.xy / u_resolution * fhalf + fhalf;
          gl_Position = vec4(positions, f1);
        }
      ` : `
        attribute vec3 positions;

        uniforms vec2 u_resolution;

        varying vec2 v_uv;

        void main() {
          v_uv = positions.xy / u_resolution * fhalf + fhalf;
          gl_Position = vec4(positions, f1);
        }
      `,
      fs,
      defines,
      uniforms: {
        u_resolution: [1, 1]
      },
      modules,
      geometry: new PlaneGeometry({ xlen: 2, ylen: 2 })
    })
  }
}

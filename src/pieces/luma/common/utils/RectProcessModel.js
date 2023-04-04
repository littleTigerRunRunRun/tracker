import { Model, PlaneGeometry } from '@luma.gl/engine'
import { constantValue } from './constant'

export class RectProcessModel extends Model {
  constructor(gl, { fs, vs, modules = [], defines = {}, uniforms = {}, is2 = false }) {
    super(gl, {
      vs: vs || (is2 ? `#version 300 es
        layout (location = 0) in vec3 positions;

        uniform vec2 u_resolution;

        out vec2 v_uv;

        void main() {
          v_uv = positions.xy * fhalf + fhalf;
          gl_Position = vec4(positions, f1);
        }
      ` : `
        attribute vec3 positions;

        uniform vec2 u_resolution;

        varying vec2 v_uv;

        void main() {
          v_uv = positions.xy * fhalf + fhalf;
          gl_Position = vec4(positions, f1);
        }
      `),
      fs,
      defines,
      uniforms: Object.assign({
        u_resolution: [1, 1]
      }, uniforms),
      modules: [constantValue].concat(modules),
      geometry: new PlaneGeometry({ xlen: 2, ylen: 2 })
    })
  }
}

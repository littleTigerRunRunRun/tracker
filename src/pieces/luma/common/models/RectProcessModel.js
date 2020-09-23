import { Model, Buffer, PlaneGeometry } from '@luma.gl/engine'

export class RectProcessModel extends Model {
  constructor(gl, { fs, modules = [] }) {
    super(gl, {
      vs: `
        attribute vec3 positions;

        varying vec2 v_uv;

        void main() {
          v_uv = positions.xy * fhalf + fhalf;
          gl_Position = vec4(positions, f1);
        }
      `,
      fs,
      modules,
      geometry: new PlaneGeometry({ xlen: 2, ylen: 2 })
    })
  }
}

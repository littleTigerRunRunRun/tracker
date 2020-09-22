import { Model, Buffer } from '@luma.gl/engine'

export class RectProcessModel extends Model {
  constructor({ gl, fs, modules = [] }) {
    super({
      gl,
      vs: `
        attribute vec2 position;

        void main() {
          gl_Position = vec4(position, 0.0, 1.0);
        }
      `,
      fs,
      modules,
      attributes: {
        // position: new Buffer(gl, new Float32Array([
        //   -1.0, -1.0,
        //   1.0, -1.0,
        //   1.0, 1.0,

        // ]))
      }
    })
  }
}

import { Model } from '@luma.gl/engine'
import { Buffer } from '@luma.gl/webgl'
import { constantValue } from '@/pieces/luma/common/modules/constant'
// import GL from '@luma.gl/constants'
// console.log(GL)

function getVector2Vertical(x, y) {
  let vec
  if (y !== 0) vec = [1, -x / y]
  else vec = [0, -x]
  const vecLength = Math.hypot(vec[0], vec[1])
  vec = vec.map((val) => val / vecLength)
  return {
    c: vec, // clockwise
    ac: vec.map((val) => val * -1) // anti-clockwise
  }
}

export class HelperLine extends Model {
  constructor(gl, { lines, modules = [], width = 2, length = 10, startcolor = [0.5, 0, 0, 0], endcolor = [0, 1, 0, 1] }) {
    const positions = []
    // const indices = []
    const colors = []

    lines.map((line) => {
      // vecticalVectors
      const point = line[0]
      const normal = line[1]
      const vvs = getVector2Vertical(normal[0], normal[1])
      const points = [
        point[0] + vvs.ac[0] * width * 0.5, point[1] + vvs.ac[1] * width * 0.5,
        point[0] + normal[0] * length + vvs.ac[0] * width * 0.5, point[1] + normal[1] * length + vvs.ac[1] * width * 0.5,
        point[0] + normal[0] * length + vvs.c[0] * width * 0.5, point[1] + normal[1] * length + vvs.c[1] * width * 0.5,
        point[0] + vvs.c[0] * width * 0.5, point[1] + vvs.c[1] * width * 0.5
      ]

      positions.push(...[points[0], points[1]])
      positions.push(...[points[2], points[3]])
      positions.push(...[points[6], points[7]])
      positions.push(...[points[2], points[3]])
      positions.push(...[points[4], points[5]])
      positions.push(...[points[6], points[7]])

      colors.push(...startcolor)
      colors.push(...endcolor)
      colors.push(...startcolor)
      colors.push(...endcolor)
      colors.push(...endcolor)
      colors.push(...startcolor)
    })

    // console.log(positions)

    super(gl, {
      vs: `
        attribute vec2 position;
        attribute vec4 color;

        uniform vec2 u_resolution;

        varying vec4 v_color;

        void main() {
          v_color = color;
          gl_Position = vec4(position / u_resolution * f2 * -1.0 + vec2(f1), f0, f1);
        }
      `,
      fs: `
        precision highp float;

        varying vec4 v_color;

        void main(void) {
          gl_FragColor = vec4(v_color);
        }
      `,
      modules: [constantValue].concat(modules),
      uniforms: {
        u_resolution: [200, 200]
      },
      attributes: {
        position: new Buffer(gl, new Float32Array(positions)),
        color: new Buffer(gl, new Float32Array(colors))
      },
      vertexCount: positions.length / 2
    })
  }
}

/* eslint-disable no-this-before-super */
import { Geometry } from '@luma.gl/engine'

function splitTriangle(points) {
  const triangles = []
  if (points.length < 3) return triangles

  const positions = []
  const indices = []
  const normals = []
  const bound = {
    minx: 10000,
    miny: 10000,
    maxx: -10000,
    maxy: -10000
  }
  const ps = points.map((item, index) => {
    positions.push(...item, 0)
    normals.push(0, 1, 0)

    bound.maxx = Math.max(bound.maxx, item[0])
    bound.minx = Math.min(bound.minx, item[0])
    bound.maxy = Math.max(bound.maxy, item[1])
    bound.miny = Math.min(bound.miny, item[1])

    const arr = [].concat(item)
    arr.push(index)
    return arr
  })

  for (let i = 0; ps.length > 2; i++) {
    const p1 = ps[i]
    const p2 = ps[i + 1]
    const p3 = ps[i + 2] || ps[0]
    indices.push(p1[2], p2[2], p3[2])

    // 被划分的三角形被从集合中剔除
    ps.splice(i + 1, 1)
    i++

    // check: ps[i + 2]是否存在
    if (!ps[i + 2] && ps.length > 2) i = 0
  }

  return {
    data: {
      indices: { size: 1, value: new Uint16Array(indices) },
      attributes: {
        POSITION: { size: 3, value: new Float32Array(positions) },
        NORMAL: { size: 3, value: new Float32Array(normals) }
      }
    },
    bound
  }
}

export default class PathGeometry extends Geometry {
  constructor(points) {
    const { data, bound } = splitTriangle(points)

    super(data)

    this.bound = bound
  }
}

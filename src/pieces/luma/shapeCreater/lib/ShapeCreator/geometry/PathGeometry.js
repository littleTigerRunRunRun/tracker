/* eslint-disable no-this-before-super */
import { Geometry } from '@luma.gl/engine'
import { ColorDescriber } from '../utils'

function normalize(vec) {
  const hypot = Math.hypot(...vec)
  for (let i = 0; i < vec.length; i++) {
    vec[i] = vec[i] / hypot
  }
}

// 产生本体的三角形属性
function splitTriangle({ gl, positions, indices, normals = [], colors, bound, style, points, helperLines, textures, size, strokeOffset }) {
  const ps = points.map((item, index) => {
    // 求点的法向量
    let normal
    if (normals.length - 1 < index) {
      const threePoints = [points[index - 1 < 0 ? points.length - 1 : index - 1], points[index], points[index + 1 > points.length - 1 ? 0 : index + 1]]
      const vec1 = [threePoints[1][0] - threePoints[0][0], threePoints[1][1] - threePoints[0][1]]
      const vec2 = [threePoints[1][0] - threePoints[2][0], threePoints[1][1] - threePoints[2][1]]
      normalize(vec1)
      normalize(vec2)
      normal = [vec1[0] * 0.5 + vec2[0] * 0.5, vec1[1] * 0.5 + vec2[1] * 0.5]
      normal.push(0)
      normalize(normal)
      normals.push(normal)
    } else normal = normals[index]
    // console.log(normals, 1, index, normal)

    item[0] -= strokeOffset * normal[0] * (style.strokeWidth || 1) / size
    item[1] -= strokeOffset * normal[1] * (style.strokeWidth || 1) / size
    positions.push(...item)

    // 几何内容总包围盒更新
    bound.maxx = Math.max(bound.maxx, item[0])
    bound.minx = Math.min(bound.minx, item[0])
    bound.maxy = Math.max(bound.maxy, item[1])
    bound.miny = Math.min(bound.miny, item[1])

    const arr = [].concat(item)
    arr.push(index)
    return arr
  })

  bound.x = bound.minx
  bound.y = bound.miny
  bound.width = bound.maxx - bound.minx
  bound.height = bound.maxy - bound.miny

  // drop color
  if ((style.fill instanceof ColorDescriber)) {
    // console.log(bound, positions)
    for (let i = 0; i < positions.length; i += 2) {
      // 我们约定了fill的textureIndex为0
      colors.push(...[0, (positions[i] - bound.x) / bound.width, (positions[i + 1] - bound.y) / bound.height])
    }
    // 手动处理一下线性渐变
    textures[0] = style.fill.render(gl, {
      height: bound.height * size,
      width: bound.width * size
    })
  } else {
    for (let i = 0; i < positions.length; i += 2) {
      // 我们约定了fill的textureIndex为0
      colors.push(...[2, 0, 0])
    }
  }

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

  // 绘制法线的辅助线
  normals.map((normal, index) => {
    // console.log(points[index], normal)
    helperLines.push([
      [...points[index]],
      normal
    ])
  })
}

// 产生本体描边的三角形属性
function splitStroke({ gl, positions, indices, normals, colors, bound, style, points, helperLines, textures, size }) {
  // stroke 部分
  const stroke = style.stroke
  const strokeWidth = (style.strokeWidth === undefined ? 1 : style.strokeWidth) / size
  if (stroke && strokeWidth) {
    // 测试一下法向量的正确性
    const strokePositions = []
    const strokeIndices = []
    const strokeColors = []
    const positionsStart = positions.length / 2
    points.map((point, index) => {
      const nextPoint = points[index + 1 > points.length - 1 ? 0 : index + 1]
      const vec = [nextPoint[0] - point[0], nextPoint[1] - point[1]]
      const normal = normals[index]
      const length = strokeWidth / Math.sqrt(1 - Math.pow(Math.abs(vec[0] * normal[0] + vec[1] * normal[1]) / Math.hypot(vec[0], vec[1]) / Math.hypot(normal[0], normal[1]), 2))
      // console.log(length)
      const p1 = [point[0], point[1]]
      const p2 = [point[0] + normal[0] * length, point[1] + normal[1] * length]
      strokePositions.push(...p1)
      strokePositions.push(...p2)
      // console.log(...p1, ...p2)

      bound.maxx = Math.max(bound.maxx, p1[0])
      bound.minx = Math.min(bound.minx, p1[0])
      bound.maxy = Math.max(bound.maxy, p1[1])
      bound.miny = Math.min(bound.miny, p1[1])
      bound.maxx = Math.max(bound.maxx, p2[0])
      bound.minx = Math.min(bound.minx, p2[0])
      bound.maxy = Math.max(bound.maxy, p2[1])
      bound.miny = Math.min(bound.miny, p2[1])
    })

    const length = points.length * 2
    for (let i = 0; i < length; i++) {
      if (Math.floor(i / 2) !== i / 2) continue
      const i1 = i + positionsStart
      const i2 = i + 1 + positionsStart
      const i3 = i + 2 > length - 1 ? positionsStart : (i + 2 + positionsStart)
      const i4 = i + 3 > length - 1 ? (positionsStart + 1) : (i + 3 + positionsStart)
      strokeIndices.push(...[i1, i2, i3])
      strokeIndices.push(...[i2, i4, i3])
    }

    if (stroke instanceof ColorDescriber) {
      // console.log(bound, positions)
      for (let i = 0; i < strokePositions.length; i += 2) {
        // 我们约定了fill的textureIndex为0
        colors.push(...[1, (strokePositions[i] - bound.x) / bound.width, (strokePositions[i + 1] - bound.y) / bound.height])
      }
      // 手动处理一下线性渐变
      textures[1] = style.stroke.render(gl, {
        height: bound.height * size,
        width: bound.width * size
      })
    } else {
      for (let i = 0; i < strokePositions.length; i += 2) {
        // 我们约定了fill的textureIndex为0
        colors.push(...[2, 0, 0])
      }
    }

    colors.push(...strokeColors)
    positions.push(...strokePositions)
    indices.push(...strokeIndices)
  }
}

// 产生形状绘制所用的网格
function createMesh(gl, points, normals = [], size, style = {}, strokeOffset = 1) {
  const triangles = []
  if (points.length < 3) return triangles

  const positions = []
  const indices = []
  const colors = []
  const bound = {
    minx: 10000,
    miny: 10000,
    maxx: -10000,
    maxy: -10000
  }
  const textures = []
  const helperLines = []

  splitTriangle({ gl, positions, indices, normals, colors, bound, style, points, helperLines, textures, size, strokeOffset })
  splitStroke({ gl, positions, indices, normals, colors, bound, style, points, helperLines, textures, size, strokeOffset })

  return {
    indices,
    positions,
    colors,
    helperLines,
    bound,
    textures
  }
}

export class PathGeometry extends Geometry {
  constructor({ gl, points, normals = [], style, size }) {
    const { indices, positions, colors, helperLines, bound, textures } = createMesh(gl, points, normals, size, style)
    // console.log(indices)

    super({
      indices: { size: 1, value: new Uint16Array(indices) },
      attributes: {
        POSITION: { size: 2, value: new Float32Array(positions) },
        NORMAL: { size: 3, value: new Float32Array([].concat(normals)) },
        texture: { size: 3, value: new Float32Array(colors) }
      }
    })

    this.helperLines = helperLines
    this.bound = bound
    this.textures = textures
    this.gl = gl
    // this.style = style
    // console.log(textures)
  }

  rebuild({ size, points, style, normals = [] }) {
    // console.log(points)
    const { indices, positions, colors, textures } = createMesh(this.gl, points, normals, size, style)
    this.textures.splice(0, this.textures.length, ...textures)
    this._setAttributes(
      {
        POSITION: { size: 2, value: new Float32Array(positions) },
        NORMAL: { size: 3, value: new Float32Array([].concat(normals)) },
        texture: { size: 3, value: new Float32Array(colors) }
      },
      { size: 1, value: new Uint16Array(indices) }
    )
    this.vertexCount = indices.length // positions.length / 2
  }

  delete() {
    // for (const texture of this.textures) texture.delete()
    this.textures.splice(0, this.textures.length)
    this.textures = []

    if (super.delete) super.delete()
  }
}

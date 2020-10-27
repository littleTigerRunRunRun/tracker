/* eslint-disable no-this-before-super */
import { Geometry } from '@luma.gl/engine'
import Color from '@/lib/color.js'

// 分割形状并且生成边框
function splitTriangle(points, style = {}) {
  const triangles = []
  if (points.length < 3) return triangles

  const positions = []
  const indices = []
  const normals = []
  const colors = []
  const bound = {
    minx: 10000,
    miny: 10000,
    maxx: -10000,
    maxy: -10000
  }

  const fill = new Color(style.fill || 'rgba(0, 0, 0, 0)').normalize4

  const ps = points.map((item, index) => {
    positions.push(...item)

    // 求点的法向量
    const threePoints = [points[index - 1 < 0 ? points.length - 1 : index - 1], points[index], points[index + 1 > points.length - 1 ? 0 : index + 1]]
    let normalPow2 = 0
    const normal = threePoints[1].map((point, index) => {
      const val = point - threePoints[0][index] * 0.5 - threePoints[2][index] * 0.5
      normalPow2 += val * val
      return val
    })
    normal.push(0)
    normals.push(normal.map((val) => val / Math.sqrt(normalPow2)))

    // 存入颜色
    colors.push(...fill)

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

  // stroke 部分
  const helperLines = []
  normals.map((normal, index) => {
    // console.log(points[index], normal)
    helperLines.push([
      [...points[index]],
      normal
    ])
  })

  const { stroke = 'rgba(0, 0, 0, 0)', strokeWidth = 1 } = style
  const strokeNormal = new Color(stroke).normalize4
  if (stroke && strokeNormal[3] > 0 && strokeWidth) {
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
      strokePositions.push(point[0], point[1])
      strokePositions.push(point[0] + normal[0] * length, point[1] + normal[1] * length)
      strokeColors.push(...strokeNormal)
      strokeColors.push(...strokeNormal)
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

    positions.push(...strokePositions)
    colors.push(...strokeColors)
    indices.push(...strokeIndices)
  }

  return {
    indices,
    positions,
    normals,
    colors,
    helperLines,
    bound
  }
}

export default class PathGeometry extends Geometry {
  constructor({ points, style }) {
    const { indices, positions, normals, colors, helperLines, bound } = splitTriangle(points, style)
    // console.log(indices, positions, normals, colors, helperLines, bound)

    super({
      indices: { size: 1, value: new Uint16Array(indices) },
      attributes: {
        POSITION: { size: 2, value: new Float32Array(positions) },
        NORMAL: { size: 3, value: new Float32Array(normals) },
        color: { size: 4, value: new Float32Array(colors) }
      }
    })

    this.helperLines = helperLines
    this.bound = bound
  }
}

const solvers = {
  custom(shape) {
    return {
      length: shape.length || undefined,
      normals: shape.normals || undefined,
      points: shape.points || [],
      size: 1,
      autoResizeMode: 0
    }
  },
  regularPolygon(shape) {
    const { radius, side = 4, start = 0 } = shape
    const center = [0, 0]
    const radiusStatic = 1
    const ps = []
    let length = 0
    let i = 0
    for (; i < side; i++) {
      const point = [center[0] + radiusStatic * Math.sin((Math.PI * 2 * i) / side + start), center[0] - radiusStatic * Math.cos((Math.PI * 2 * i) / side + start)]
      if (i === 0) point.push(0)
      else {
        length += Math.hypot(ps[i - 1][0] - point[0], ps[i - 1][1] - point[1]) * radius
        point.push(length)
      }
      ps.push(point)
    }
    length += Math.hypot(ps[i - 1][0] - ps[0][0], ps[i - 1][1] - ps[0][1]) * radius

    return {
      length,
      points: ps,
      size: radius,
      autoResizeMode: 1
    }
  },
  circle(shape) {
    const { radius, accuracy = 1 } = shape
    const center = [0, 0]
    const radiusStatic = 1
    const side = Math.max(Math.floor(5 * accuracy * Math.sqrt(radius)), 4)
    const ps = []
    const normals = []
    let length = 0
    let i = 0
    for (; i < side; i++) {
      const normal = [Math.sin((Math.PI * 2 * i) / side), -Math.cos((Math.PI * 2 * i) / side)]
      normals.push(normal)
      const point = [center[0] + radiusStatic * normal[0], center[0] + radiusStatic * normal[1]]
      if (i === 0) point.push(0)
      else {
        length += Math.hypot(ps[i - 1][0] - point[0], ps[i - 1][1] - point[1]) * radius
        point.push(length)
      }
      ps.push(point)
    }
    length += Math.hypot(ps[i - 1][0] - ps[0][0], ps[i - 1][1] - ps[0][1]) * radius

    return {
      length,
      normals,
      points: ps,
      size: radius,
      autoResizeMode: 1
    }
  },
  rect(shape) {
    const { width, height } = shape
    const ps = []
    ps.push([width * -0.5, height * -0.5, 0])
    ps.push([width * 0.5, height * -0.5, width])
    ps.push([width * 0.5, height * 0.5, width + height])
    ps.push([width * -0.5, height * 0.5, width * 2 + height])
    const length = width * 2 + height * 2
    return {
      length,
      points: ps,
      size: 1,
      autoResizeMode: 1
    }
  }
}

export function shapeSolver({ type = 'custom', shape = {}}) {
  return solvers[type](shape)
}

export function polygonToSvgString({ points, size = 1, width = 100, height = 100, params = {}}) {
  const { pathForClipPath } = params
  let str = ''
  // console.log(points)
  if (pathForClipPath) {
    points.map((point, index) => {
      str += `${point[0] * size / width * 100 + 50}% ${point[1] * size / height * 100 + 50}%`
      if (index < points.length - 1) str += ', '
    })
  } else {
    points.map((point, index) => {
      if (index === 0) str += `M${point[0] * size + width},${point[1] * size + height} `
      else str += `L${point[0] * size + width},${point[1] * size + height} `
    })
    str += 'Z'
  }
  return str
}

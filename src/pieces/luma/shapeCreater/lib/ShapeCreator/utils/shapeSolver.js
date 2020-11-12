const solvers = {
  custom(shape) {
    return {
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
    for (let i = 0; i < side; i++) {
      ps.push([center[0] + radiusStatic * Math.sin((Math.PI * 2 * i) / side + start), center[0] - radiusStatic * Math.cos((Math.PI * 2 * i) / side + start)])
    }

    return {
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
    for (let i = 0; i < side; i++) {
      const normal = [Math.sin((Math.PI * 2 * i) / side), -Math.cos((Math.PI * 2 * i) / side)]
      normals.push(normal)
      ps.push([center[0] + radiusStatic * normal[0], center[0] + radiusStatic * normal[1]])
    }

    return {
      normals,
      points: ps,
      size: radius,
      autoResizeMode: 1
    }
  },
  rect(shape) {
    const { width, height } = shape
    const ps = []
    ps.push([width * -0.5, height * -0.5])
    ps.push([width * 0.5, height * -0.5])
    ps.push([width * 0.5, height * 0.5])
    ps.push([width * -0.5, height * 0.5])

    return {
      points: ps,
      size: 1,
      autoResizeMode: 1
    }
  }
}

export function shapeSolver({ type = 'custom', shape = {}}) {
  return solvers[type](shape)
}

export function polygonToSvgString({ points, size, width, height, params = {}}) {
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
      if (index === 0) str += `M${point[0] * size},${point[1] * size} `
      else str += `L${point[0] * size},${point[1] * size} `
    })
    str += 'Z'
  }
  return str
}

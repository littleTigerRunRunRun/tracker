const solvers = {
  custom(shape) {
    return shape.points || []
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
      size: radius
    }
  },
  circle(shape) {
    const { radius, accuracy = 1 } = shape
    const center = [0, 0]
    const radiusStatic = 1
    const side = Math.max(Math.floor(5 * accuracy * Math.sqrt(radius)), 4)
    const ps = []
    for (let i = 0; i < side; i++) {
      ps.push([center[0] + radiusStatic * Math.sin((Math.PI * 2 * i) / side), center[0] - radiusStatic * Math.cos((Math.PI * 2 * i) / side)])
    }
    return {
      points: ps,
      size: radius
    }
  }
}

export function shapeSolver({ type = 'custom', shape = {}}) {
  return solvers[type](shape)
}

export function polygonToSvgString(points) {
  let str = ''
  console.log(points)
  points.map((point, index) => {
    if (index === 0) str += `M${point[0]},${point[1]} `
    else str += `L${point[0]},${point[1]} `
  })
  str += 'Z'
  return str
}

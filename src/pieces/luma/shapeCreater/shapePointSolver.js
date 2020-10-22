const solvers = {
  custom(shape) {
    return shape.points || []
  },
  regularPolygon(shape) {
    const { side = 4, radius = 0.5, center = [0, 0], start = 0 } = shape
    const ps = []
    for (let i = 0; i < side; i++) {
      ps.push([center[0] + radius * Math.sin((Math.PI * 2 * i) / side + start), center[0] - radius * Math.cos((Math.PI * 2 * i) / side + start)])
    }
    return ps
  },
  circle(shape) {
    const { radius, center = [0, 0], accuracy = 1 } = shape
    const side = Math.max(Math.floor(5 * accuracy * Math.sqrt(radius)), 4)
    const ps = []
    for (let i = 0; i < side; i++) {
      ps.push([center[0] + radius * Math.sin((Math.PI * 2 * i) / side), center[0] - radius * Math.cos((Math.PI * 2 * i) / side)])
    }
    return ps
  }
}

export function shapeSolver({ type = 'custom', shape = {}}) {
  return solvers[type](shape)
}

export function polygonToSvgString(points) {
  let str = ''
  points.map((point, index) => {
    if (index === 0) str += `M${point[0]},${point[1]} `
    else str += `L${point[0]},${point[1]} `
  })
  str += 'Z'
  return str
}

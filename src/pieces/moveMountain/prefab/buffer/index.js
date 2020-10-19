import createDepthBuffer from './DepthBuffer'
import createColorBuffer from './ColorBuffer'

const maps = {
  depth: {
    index: 1,
    func: createDepthBuffer,
    addUniform: (obj, buffer) => {
      obj.u_depth = buffer.depth
    }
  },
  normals: {
    index: 2,
    func: createColorBuffer,
    addUniform: (obj, buffer) => {
      obj.u_normals = buffer.color
    }
  },
  depth_normals: {
    index: 3,
    func: createColorBuffer,
    addUniform: (obj, buffer) => {
      obj.u_normals = buffer.color
      obj.u_depth = buffer.depth
    }
  }
}

export default function(fbs, gl) {
  const buffers = {}
  for (const fb of fbs) {
    let buffer
    // if (typeof fb === 'string') {
    //   buffer = maps[fb].func(gl)
    // }
    buffers[fb] = {
      type: fb,
      index: maps[fb].index,
      buffer: maps[fb].func(gl),
      addUniform: maps[fb].addUniform
    }
  }
  return buffers
}

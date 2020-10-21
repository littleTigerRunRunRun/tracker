import createColorBuffer from './ColorBuffer'

const maps = {
  standard: {
    index: 1,
    func: createColorBuffer,
    addUniform: (obj, buffer) => {
      obj.u_normals = buffer.color
      obj.u_depth = buffer.depth
    }
  }
}

export default function(fb, gl) {
  return {
    type: fb,
    index: maps[fb].index,
    buffer: maps[fb].func(gl),
    addUniform: maps[fb].addUniform
  }
}

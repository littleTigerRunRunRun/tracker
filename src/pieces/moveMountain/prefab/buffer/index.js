import createStandardBuffer from './StandardBuffer'
import createHandyBuffer from './HandyBuffer'

const maps = {
  // 为延迟着色准备的标准满配MRT
  standard: {
    index: 1,
    func: createStandardBuffer,
    addUniform: (obj, buffer) => {
      obj.u_normals = buffer.color
      obj.u_depth = buffer.depth
    }
  },
  // 为后处理准备的能够快速获取
  postProcessing: {
    index: 2,
    func: createHandyBuffer,
    addUniform: (obj, buffer) => {
      obj.u_texture = buffer.color
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

import createDepthBuffer from './DepthBuffer'

const maps = {
  depth: createDepthBuffer
}

export default function(fbs, gl) {
  const buffers = []
  for (const fb of fbs) {
    let buffer
    if (typeof fb === 'string') {
      buffer = maps[fbs](gl)
    }
    buffers.push(buffer)
  }
  return buffers
}

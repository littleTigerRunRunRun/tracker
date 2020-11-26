// import { Framebuffer, Renderbuffer, Texture2D, blit } from '@luma.gl/webgl'
// import GL from '@luma.gl/constants'

const formatMap = {
  // integer16 channel1
  'i16c1': {
    format: 'R16UI',
    dataFormat: 'RED_INTEGER',
    type: 'UNSIGNED_SHORT'
  },
  'f8c2': {
    format: 'RG8',
    dataFormat: 'RG',
    type: 'UNSIGNED_BYTE'
  },
  'default': {
    format: 'RGBA8',
    dataFormat: 'RGBA',
    type: 'UNSIGNED_BYTE',
    getExt(gl) {
      gl.getExtension('EXT_color_buffer_float')
    }
  }
}
// 36054 FRAMEBUFFER_INCOMPLETE_ATTACHMENT
// 36055 FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT
// 36057 FRAMEBUFFER_INCOMPLETE_DIMENSIONS
// 36061 FRAMEBUFFER_UNSUPPORTED
// 36182 FRAMEBUFFER_INCOMPLETE_MULTISAMPLE
// 36011 RENDERBUFFER_SAMPLES

function createTexture(gl, attach, format) {
  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texStorage2D(gl.TEXTURE_2D, 1, format, gl.drawingBufferWidth, gl.drawingBufferHeight)
  gl.framebufferTexture2D(gl.FRAMEBUFFER, attach, gl.TEXTURE_2D, texture, 0)
  return texture
}

export function createHandyBuffer(gl, attachs = [], params = {}) {
  const { width = gl.drawingBufferWidth, height = gl.drawingBufferHeight, depth = true } = params

  return {
    buffer,
    textures,
    blit: blitBuffer
  }
}

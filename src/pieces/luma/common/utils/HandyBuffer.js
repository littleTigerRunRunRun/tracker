import { Framebuffer, Renderbuffer, Texture2D, blit } from '@luma.gl/webgl'
import GL from '@luma.gl/constants'

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
    type: 'UNSIGNED_BYTE'
  }
}
// 36054 FRAMEBUFFER_INCOMPLETE_ATTACHMENT
// 36055 FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT
// 36057 FRAMEBUFFER_INCOMPLETE_DIMENSIONS
// 36061 FRAMEBUFFER_UNSUPPORTED
// 36182 FRAMEBUFFER_INCOMPLETE_MULTISAMPLE
// 36011 RENDERBUFFER_SAMPLES

export function createHandyBuffer(gl, attachs = [], params = {}) {
  const { width = gl.drawingBufferWidth, height = gl.drawingBufferHeight, depth = true } = params

  // get the samplers value of an format
  // const canvas = document.createElement('canvas')
  // const glt = canvas.getContext('webgl2')
  // console.log(glt.getInternalformatParameter(glt.RENDERBUFFER, glt.RG8, glt.SAMPLES))

  const attachments = {}
  const textures = {}
  const drawBuffers = []
  for (let i = 0; i < attachs.length; i++) {
    const attach = attachs[i]
    const { output, type = 'texture', format = 'default', samples = 0 } = attach
    if (type === 'renderbuffer') {
      // console.log({ format: GL[formatMap[format].format], width, height, samples })
      attachments[GL[`COLOR_ATTACHMENT${i}`]] = new Renderbuffer(gl, { format: GL[formatMap[format].format], width, height, samples })
      textures[GL[`COLOR_ATTACHMENT${i}`]] = new Texture2D(gl, {
        format: GL[formatMap[format].format],
        dataFormat: GL[formatMap[format].dataFormat],
        type: GL[formatMap[format].type],
        width,
        height,
        mipmaps: false,
        // 这个先默认
        parameters: {
          [GL.TEXTURE_MIN_FILTER]: GL.LINEAR,
          [GL.TEXTURE_MAG_FILTER]: GL.LINEAR,
          [GL.TEXTURE_WRAP_S]: GL.CLAMP_TO_EDGE,
          [GL.TEXTURE_WRAP_T]: GL.CLAMP_TO_EDGE
        }
      })
    } else {
      attachments[GL[`COLOR_ATTACHMENT${i}`]] = new Texture2D(gl, {
        format: GL[formatMap[format].format],
        dataFormat: GL[formatMap[format].dataFormat],
        type: GL[formatMap[format].type],
        width,
        height,
        mipmaps: false,
        // 这个先默认
        parameters: {
          [GL.TEXTURE_MIN_FILTER]: GL.LINEAR,
          [GL.TEXTURE_MAG_FILTER]: GL.LINEAR,
          [GL.TEXTURE_WRAP_S]: GL.CLAMP_TO_EDGE,
          [GL.TEXTURE_WRAP_T]: GL.CLAMP_TO_EDGE
        }
      })
    }

    if (output) drawBuffers.push(GL[`COLOR_ATTACHMENT${i}`])
  }

  // 深度缓冲写入
  if (depth) {
    attachments[GL.DEPTH_ATTACHMENT] = new Texture2D(gl, {
      format: GL.DEPTH_COMPONENT16,
      type: GL.UNSIGNED_SHORT,
      dataFormat: GL.DEPTH_COMPONENT,
      width,
      height,
      mipmaps: false,
      parameters: {
        [GL.TEXTURE_MIN_FILTER]: GL.NEAREST,
        [GL.TEXTURE_MAG_FILTER]: GL.NEAREST,
        [GL.TEXTURE_WRAP_S]: GL.CLAMP_TO_EDGE,
        [GL.TEXTURE_WRAP_T]: GL.CLAMP_TO_EDGE
      }
    })
  }

  // 假如drawBuffers为空，补充第一个作为默认
  if (drawBuffers.length === 0) drawBuffers.push(GL.COLOR_ATTACHMENT0)

  // console.log({
  //   width,
  //   height,
  //   attachments,
  //   drawBuffers
  // })
  const buffer = new Framebuffer(gl, {
    width,
    height,
    attachments,
    drawBuffers
  })

  function blitBuffer(params = {}) {
    const { gl, attachment = GL.COLOR_ATTACHMENT0, color = true, depth = false, stencil = false } = params
    if (gl.drawingBufferWidth !== textures[attachment].width || gl.drawingBufferHeight !== textures[attachment].height) {
      textures[attachment].resize({ width: gl.drawingBufferWidth, height: gl.drawingBufferHeight })
    }
    blit(buffer.attachments[attachment], textures[attachment], {
      sourceAttachment: attachment,
      color,
      depth,
      stencil
    })

    return textures[attachment]
  }

  return {
    buffer,
    textures,
    blit: blitBuffer
  }
}

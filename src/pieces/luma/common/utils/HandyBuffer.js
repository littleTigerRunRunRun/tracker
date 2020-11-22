import { Framebuffer, Renderbuffer, Texture2D, blit } from '@luma.gl/webgl'
import GL from '@luma.gl/constants'

const formatMap = {
  // integer16 channel1
  'i16c1': {
    format: 'R16UI',
    dataFormat: 'RED_INTEGER',
    type: 'UNSIGNED_SHORT'
  },
  'default': {
    format: 'RGBA8',
    dataFormat: 'RGBA',
    type: 'UNSIGNED_BYTE'
  }
}

export function createHandyBuffer(gl, attachs = [], params = {}) {
  const { width = gl.drawingBufferWidth, height = gl.drawingBufferHeight, depth = true } = params

  // get the samplers value of an format
  // const canvas = document.createElement('canvas')
  // const glt = canvas.getContext('webgl2')
  // console.log(glt.getInternalformatParameter(glt.RENDERBUFFER, glt.RGBA8, glt.SAMPLES))

  const attachments = {}
  const textures = {}
  const drawBuffers = []
  for (let i = 0; i < attachs.length; i++) {
    const attach = attachs[i]
    const { output, type = 'texture', format = 'default', samples = 0 } = attach
    if (type === 'renderbuffer') {
      // console.log({ format: GL[formatMap[format].format], width, height, samples })
      attachments[GL[`COLOR_ATTACHMENT${i}`]] = new Renderbuffer(gl, { format: GL[formatMap[format].format], width, height, samples: 8 })
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

    if (output) drawBuffers.push([GL[`COLOR_ATTACHMENT${i}`]])
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

  const buffer = new Framebuffer(gl, {
    width,
    height,
    attachments,
    drawBuffers
  })

  function blitBuffer(params = {}) {
    const { attachment = GL.COLOR_ATTACHMENT0, color = true, depth = false, stencil = false } = params
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

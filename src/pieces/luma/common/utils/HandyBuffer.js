import { Framebuffer, Renderbuffer, Texture2D, blit } from '@luma.gl/webgl'
import GL from '@luma.gl/constants'

export function createHandyBuffer(gl, params = {}) {
  const { width = gl.drawingBufferWidth, height = gl.drawingBufferHeight, samples = 0 } = params
  // get the samplers value of an format
  // const canvas = document.createElement('canvas')
  // const gl = canvas.getContext('webgl2')
  // gl.getInternalformatParameter(gl.RENDERBUFFER, gl.RGBA8, gl.SAMPLES)

  const buffer = new Framebuffer(gl, {
    width,
    height,
    attachments: {
      // [GL.COLOR_ATTACHMENT0]: new Renderbuffer(gl, { format: GL.RGBA8, width, height, samples })
      [GL.COLOR_ATTACHMENT0]: new Texture2D(gl, {
        format: GL.R16UI,
        dataFormat: GL.RED_INTEGER,
        type: GL.UNSIGNED_SHORT,
        width,
        height,
        mipmaps: false,
        parameters: {
          [GL.TEXTURE_MIN_FILTER]: GL.LINEAR,
          [GL.TEXTURE_MAG_FILTER]: GL.LINEAR,
          [GL.TEXTURE_WRAP_S]: GL.CLAMP_TO_EDGE,
          [GL.TEXTURE_WRAP_T]: GL.CLAMP_TO_EDGE
        }
      }),
      [GL.DEPTH_ATTACHMENT]: new Texture2D(gl, {
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
    // drawBuffers: [
    //   GL.COLOR_ATTACHMENT0,
    //   GL.COLOR_ATTACHMENT1
    // ]
  })

  // const textures = {
  //   [GL.COLOR_ATTACHMENT0]: new Texture2D(gl, {
  //     format: GL.RGBA,
  //     type: GL.UNSIGNED_BYTE,
  //     width,
  //     height,
  //     // mipmaps: true,
  //     parameters: {
  //       [GL.TEXTURE_MIN_FILTER]: GL.LINEAR,
  //       [GL.TEXTURE_MAG_FILTER]: GL.LINEAR,
  //       [GL.TEXTURE_WRAP_S]: GL.CLAMP_TO_EDGE,
  //       [GL.TEXTURE_WRAP_T]: GL.CLAMP_TO_EDGE
  //     }
  //   })
  // }

  // function blitBuffer(params = {}) {
  //   const { attachment = GL.COLOR_ATTACHMENT0, color = true, depth = false, stencil = false } = params
  //   blit(buffer.attachments[attachment], textures[attachment], {
  //     sourceAttachment: attachment,
  //     color,
  //     depth,
  //     stencil
  //   })

  //   return textures[attachment]
  // }

  // return {
  //   buffer,
  //   textures,
  //   blit: blitBuffer
  // }
  return buffer
}

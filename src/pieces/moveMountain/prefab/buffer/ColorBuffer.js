import { Framebuffer, Texture2D } from '@luma.gl/webgl'
import GL from '@luma.gl/constants'

export default function(gl, { width, height }) {
  const buffer = new Framebuffer(gl, {
    width,
    height,
    attachments: {
      [GL.COLOR_ATTACHMENT0]: new Texture2D(gl, {
        format: GL.RGBA,
        type: GL.UNSIGNED_BYTE,
        width,
        height,
        mipmaps: false,
        parameters: {
          [GL.TEXTURE_MIN_FILTER]: GL.LINEAR,
          [GL.TEXTURE_MAG_FILTER]: GL.LINEAR,
          [GL.TEXTURE_WRAP_S]: GL.CLAMP_TO_EDGE,
          [GL.TEXTURE_WRAP_T]: GL.CLAMP_TO_EDGE
        }
      })
    }
  })

  return buffer
}

import { clear } from '@luma.gl/webgl'

export class Pass {
  constructor({
    onInitialize = () => {},
    onRender = () => {},
    onOutput = () => { return {} },
    onDestroy = () => {},
    pointers = {},
    clear = {},
    target = null
  }) {
    this.onInitialize = onInitialize
    this.onRender = onRender
    this.onOutput = onOutput
    this.onDestroy = onDestroy

    this.clear = clear
    this.target = target
    Object.assign(this.pointers, pointers)
  }

  pointers = {}
  initThings = {}
  init(gl) {
    this.initThings = this.onInitialize(Object.assign({ gl }, this.pointers))
  }

  render({ gl, extraUniforms, time }) {
    const { depth = true, stencil = false, color = [0, 0, 0, 0] } = this.clear
    clear(gl, { color, depth, stencil, framebuffer: this.target })

    this.onRender(Object.assign({ extraUniforms, gl, time, target: this.target }, this.initThings, this.pointers))

    this.output = this.onOutput(Object.assign({ gl, target: this.target }, this.initThings, this.pointers)) || {}
  }

  destroy() {
    this.onDestroy(this.initThings)

    for (const key in this.pointers) {
      delete this.pointers[key]
    }
    this.target = null
  }
}

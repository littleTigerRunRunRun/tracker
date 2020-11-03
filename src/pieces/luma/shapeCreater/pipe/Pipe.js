import { Texture2D, loadImage } from '@luma.gl/webgl'

/*
  虽然我们认为图形学中，从application、geometry、rasterization、pixel process到merge是一个完整的pipeline，但是在应用中我们
  可以将pipeline作为一个pass来看待，然后用pass组成一个应用层面上的管道，这里为了和Pipeline区分，命名为pipe
  */
export class Pipe {
  constructor({ gl, stages, textures, autoUpdate = false }) {
    this.stages = stages
    this.gl = gl
    this.autoUpdate = autoUpdate
    this.needUpdate = this.autoUpdate
    this.init()
    this.createTextures(textures)
  }

  // 引用池
  pools = {}

  init() {
    for (const stage of this.stages) {
      for (const pass of stage) {
        pass.pass.init(this.gl)
      }
    }
  }

  createTextures(textures = {}) {
    const resources = []
    for (const key in textures) {
      const promise = loadImage(textures[key])
      const texture = new Texture2D(this.gl, { data: promise })
      this.pools[key] = texture
      resources.push({ key, promise })
    }
    if (resources.length === 0) {
      this.assetsReady = true
      return
    }
    Promise.all(resources.map((item) => item.promise))
      .then((datas) => {
        this.assetsReady = true
      })
  }

  next(params) {
    this.needUpdate = true
    this.render(params)
  }

  // 运行
  render({ time }) {
    if (this.needUpdate && this.assetsReady) {
      if (!this.autoUpdate) this.needUpdate = false
      for (const stage of this.stages) {
        for (const pass of stage) {
          const extraUniforms = {}
          if (pass.input && pass.input.length > 0) {
            for (const name of pass.input) {
              extraUniforms[name] = this.pools[name]
            }
          }
          pass.pass.render(Object.assign({}, this.pools, { gl: this.gl, extraUniforms, time }))
          if (pass.output) Object.assign({}, this.pools, pass.pass.output)
        }
      }
    }
  }

  clear() {
    for (const stage of this.stages) {
      for (const pass of stage) {
        pass.pass.clear(this.pools)
      }
    }
  }

  destroy() {
    // 销毁pass
    for (const stage of this.stages) {
      for (const pass of stage) {
        pass.pass.destroy()
      }
    }
    // clear引用池
    for (const key in this.pools) {
      if (this.pools[key] && this.pools[key].delete) this.pools[key].delete()
      delete this.pools[key]
    }
    this.gl = null
    this.pools = null
    this.stages = null
  }
}

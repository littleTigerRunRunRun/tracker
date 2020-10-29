import { Texture2D } from '@luma.gl/webgl'

/*
  虽然我们认为图形学中，从application、geometry、rasterization、pixel process到merge是一个完整的pipeline，但是在应用中我们
  可以将pipeline作为一个pass来看待，然后用pass组成一个应用层面上的管道，这里为了和Pipeline区分，命名为pipe
  */
export class Pipe {
  constructor({ gl, stages, textures }) {
    this.stages = stages
    this.gl = gl
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

  createTextures(textures) {
    for (const key in textures) {
      const texture = new Texture2D(this.gl, {
        data: textures[key]
      })
      this.pools[key] = texture
      console.log(texture)
    }
  }

  // 运行
  render({ time }) {
    for (const stage of this.stages) {
      for (const pass of stage) {
        const extraUniforms = {}
        if (pass.input && pass.input.length > 0) {
          for (const name of pass.input) {
            extraUniforms[name] = this.pools[name]
          }
        }
        pass.pass.render({ gl: this.gl, extraUniforms, time })
        if (pass.output) Object.assign(this.pools, pass.pass.output)
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
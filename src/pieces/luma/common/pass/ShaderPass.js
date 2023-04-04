import { RectProcessModel } from '../utils'
import { Pass } from './Pass'

export class ShaderPass extends Pass {
  constructor({ fs, vs, modules = [], defines = {}, render = () => {}, is2 = true, onOutput, target, clear }) {
    super({
      pointers: {
        render
      },
      onInitialize: ({ gl }) => {
        const model = new RectProcessModel(gl, {
          is2,
          vs,
          fs,
          defines
        })
        return { model, startTime: new Date() }
      },
      onRender(params) {
        for (const key in params.extraUniforms) {
          model.uniforms[key] = params.extraUniforms[key]
        }
        render(params)
      },
      onDestroy({ model }) {
        model.delete()
      },
      onOutput,
      target,
      clear
    })
  }
}

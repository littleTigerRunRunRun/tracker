import { RectProcessModel } from '../utils'
import { Pass } from './Pass'

export class ShaderPass extends Pass {
  constructor({ fs, modules = [], defines = {}, render = () => {}, onOutput, target, clear }) {
    super({
      pointers: {
        render
      },
      onInitialize: ({ gl }) => {
        const model = new RectProcessModel(gl, {
          is2: true,
          fs,
          defines
        })
        return { model }
      },
      onRender({ model, gl, time, extraUniforms }) {
        for (const key in extraUniforms) {
          model.uniforms[key] = extraUniforms[key]
        }
        render({ model, gl, time, extraUniforms })
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

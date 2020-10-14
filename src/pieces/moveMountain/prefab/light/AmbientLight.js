// 全局光照是一个并不十分贴切的处理，更加合理的模拟大气散射光的方式应该是环境光遮蔽
// ambient light假想的是一种弥漫在空间里的一种均匀的光照，想象一下阴雨天那种被阴云遮蔽后几乎是均匀分布的太阳光，可惜的是，即使是这样，也存在物体遮蔽的问题，这些是ambient light不真实的主要原因
import Light from './Light'

export default class AmbientLight extends Light {
  constructor(params) {
    super(Object.assign({}, params, { type: 'ambient' }))
  }
}

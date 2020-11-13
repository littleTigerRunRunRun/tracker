// 根据一定的描述生成一张描述颜色的贴图
export { ColorDescriber } from './ColorDescriber'
// 生成一个快速使用的framebuffer
export { createHandyBuffer } from './HandyBuffer'
// 生成一个标准的颜色framebuffer（包含renderbuffer多重抗锯齿方案)
export { createColorBuffer } from './ColorBuffer'
// 几何路径处理器
export { shapeSolver, polygonToSvgString } from './shapeSolver'
// shader中会用到的常量包
export { constantValue } from './constant'
// 一个标准的方块Model用于简单输出内容或者后处理
export { RectProcessModel } from './RectProcessModel'

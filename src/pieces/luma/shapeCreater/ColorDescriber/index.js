// 对一个[width / height]的区域，提供着色方程和混合方式的参数，width / height来自
export class ColorDescriber {
  constructor(layers) {
    this.layers = layers
    this.compileDescriber()
  }

  compileDescriber() {

  }
}

// 渐变着色层
// linear: {
//   direction: 180, // 这条线性渐变的角度
//   limited: false, // 有限的，也就是说不往周边扩展
//   stops: [
//     { color: rgba(255, 0, 0, 0.8), offset: 0.2 },
//     { colro: rgba(255, 255, 255, 1), offset: 1 }
//   ]
// }
function linear(linears) {

}

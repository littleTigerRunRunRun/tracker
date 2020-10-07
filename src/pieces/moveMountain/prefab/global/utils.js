const { atan } = require("math.gl");
// 相比Math.atan会处理y = 0的情况
export function commonAtan(x, y) {
  if (y === 0) return 0
  return Math.atan(x / y)
}

// 求两个向量的夹角
export function getIncludedAngle(vec1, vec2) {
  return Math.acos(vec1.dot(vec2) / vec1.len() / vec2.len())
}

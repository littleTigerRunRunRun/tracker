export default {
  // 本图形的默认比例为1:1这个不需要配置
  // 内容占比
  occupy: {
    type: Number,
    default: 0.6 // 60%
  },
  // 圆半径，假设半径为300，那么画布的宽高即为outerRadius / occupy = 500
  outerRadius: {
    type: Number,
    default: 300
  }
}

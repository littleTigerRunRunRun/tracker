export default {
  angle: {
    type: [Number, String],
    default: 137.50776, // gold angle = 360 * (1 - 0.618)
    form: {
      type: 'number',
      default: '角度'
    }
  },
  num: {
    type: [Number, String],
    default: 200,
    form: {
      type: 'number',
      default: '点数',
      min: 1
    }
  },
  pointRadius: {
    type: [Number, String],
    default: 6,
    form: {
      type: 'number',
      default: '点半径',
      min: 2
    }
  }
}

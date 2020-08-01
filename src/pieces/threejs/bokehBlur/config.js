export default {
  stage: {
    type: [String, Number],
    default: 0,
    form: {
      des: '阶段',
      type: 'stage',
      stages: [
      ]
    }
  },
  radius: {
    type: [String, Number], // vue-material的表单有问题，所以传来的数字可能是字符串类型
    default: 0,
    form: {
      des: '模糊半径',
      type: 'number',
      min: 0,
      max: 100,
      step: 1
    }
  }
}

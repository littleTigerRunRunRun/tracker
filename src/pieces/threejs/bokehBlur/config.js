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
  focus: {
    type: [String, Number],
    default: 1.0,
    form: {
      des: '景深',
      type: 'number',
      step: 0.1
    }
  },
  aperture: {
    type: [String, Number],
    default: 1.0,
    form: {
      des: '光圈',
      type: 'number',
      step: 0.1,
      min: 0.1,
      max: 10
    }
  }
}

export default {
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

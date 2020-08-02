export default {
  scaleX: {
    type: [String, Number],
    default: 1,
    form: {
      type: 'number',
      des: '横向缩放',
      step: 0.1
    }
  },
  scaleY: {
    type: [String, Number],
    default: 1,
    form: {
      type: 'number',
      des: '纵向缩放',
      step: 0.1
    }
  },
  centerX: {
    type: [String, Number],
    default: 0.5,
    form: {
      type: 'number',
      des: '横向中心点位置',
      step: 0.01,
      min: 0,
      max: 1
    }
  },
  centerY: {
    type: [String, Number],
    default: 0.5,
    form: {
      type: 'number',
      des: '纵向中心点位置',
      step: 0.01,
      min: 0,
      max: 1
    }
  },
  points: {
    type: String,
    default: '[{"style":"rgba(255, 255, 255, 0.6)","radius":1,"offset":[0,0],"points":[[0,0.4],[0.15,0.37],[0.29,0.29],[-0.37,0.15],[0.4,0],[0.37,-0.15],[0.29,-0.29],[-0.15,-0.37],[0,-0.4],[-0.15,0.37],[-0.29,0.29],[0.37,0.15],[-0.4,0],[-0.37,-0.15],[-0.29,-0.29],[0.15,-0.37]]},{"style":"rgba(255, 0, 0, 0.6)","radius":0.9,"offset":[4,4],"points":[[0.15,0.37],[-0.37,0.15],[0.37,-0.15],[-0.15,-0.37],[-0.15,0.37],[0.37,0.15],[-0.37,-0.15],[0.15,-0.37]]},{"style":"rgba(0, 255, 0, 0.6)","radius":0.7,"offset":[-4,-4],"points":[[0.29, 0.29], [0.40, 0.0], [0.29, -0.29], [0.0, -0.4], [-0.29, 0.29], [-0.4,  0.0], [-0.29, -0.29], [0.0,  0.4]]},{"style":"rgba(0, 255, 255, 0.6)","radius":0.4,"offset":[-4,-4],"points":[[0.29, 0.29], [0.40, 0.0], [0.29, -0.29], [0.0, -0.4], [-0.29, 0.29], [-0.4,  0.0], [-0.29, -0.29], [0.0,  0.4]]}]',
    form: {
      type: 'input',
      des: '点集'
    }
  }
}

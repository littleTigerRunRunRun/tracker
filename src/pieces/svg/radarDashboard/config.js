export default {
  // 本图形的默认比例为1:1这个不需要配置
  // 值，范围在40到100之间
  value: {
    type: Number,
    default: 40
  },
  // 内容占比
  occupy: {
    type: Number,
    default: 0.6 // 60%
  },
  fill: {
    type: String,
    default: '#FF5B3E'
  },
  // 圆半径，假设半径为300，那么画布的宽高即为outerRadius / occupy = 500, 原图比例为86
  outerRadius: {
    type: Number,
    default: 300
  },
  // 两侧延伸长度
  outerExtend: {
    type: Number,
    default: 80
  },
  // 外圈圆弧的线条粗细
  outerWidth: {
    type: Number,
    default: 30
  },
  outerGapAngle: {
    type: Number,
    default: Math.PI * 94 / 180 / 2 // 94度的一半，由于路径计算中总是用到半角，所以这里也用半角方便计算
  },
  outerOpacity: {
    type: Number,
    default: 0.4
  },
  // 刻度尺等分数, 也就是表明有多少刻度
  scaleNum: {
    type: Number,
    default: 24
  },
  scales: {
    type: Array,
    default: () => {
      return [
        // value的范围是0 - 100
        { index: 0, label: '0', offset: { x: 0, y: -30 }},
        { index: 24, label: '100', offset: { x: 0, y: -30 }}
      ]
    }
  },
  // 刻度尺部分的半径，这里的scale不是比例的意思，是刻度的意思
  scaleRadius: {
    type: Number,
    default: 234
  },
  // 刻度尺点与圆心连成一条线，与这条线垂直的是宽，与这条线平行的是高
  scaleWidth: {
    type: Number,
    default: 6
  },
  scaleHeight: {
    type: Number,
    default: 6
  },
  scaleBorderRadius: {
    type: Number,
    default: 3
  },
  scaleOpacity: {
    type: Number,
    default: 0.45
  },
  // 仪表盘中间半径
  centerRadius: {
    type: Number,
    default: 156
  },
  centerWidth: {
    type: Number,
    default: 12
  },
  centerOpacity: {
    type: Number,
    default: 0.15
  },
  innerCircleRadius: {
    type: Number,
    default: 48
  },
  innerCircleWidth: {
    type: Number,
    default: 8
  },
  innerCircleOpacity: {
    type: Number,
    default: 0.25
  },
  // 中心点半径
  coreRadius: {
    type: Number,
    default: 20
  },
  coreOpacity: {
    type: Number,
    default: 0.8
  },
  // 主要分数样式
  mainScoreSize: {
    type: Number,
    default: 100
  },
  mainScoreOffset: {
    type: Object,
    default: () => {
      return {
        x: 0,
        y: 40
      }
    }
  },
  // 雷达波效果
  radarOpen: {
    type: Boolean,
    default: true
  },
  radarRadius: {
    type: Array,
    default: () => [20, 320]
  },
  radarOpacity: {
    type: Array,
    default: () => [0.2, 0]
  },
  radarNum: {
    type: Number,
    default: 4
  },
  radarDuration: {
    type: Number,
    default: 4000
  },
  radarInterval: {
    type: Number,
    default: 12000
  }
}

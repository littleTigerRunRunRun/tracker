// 用于提供给平台可配置表单的设置
export default {
  type: {
    type: String,
    default: 'linear',
    form: {
      des: '插值方式',
      type: 'select',
      options: [
        {
          name: '线性插值',
          value: 'linear'
        }
      ]
    }
  }
}

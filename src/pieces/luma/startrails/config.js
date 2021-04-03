// 用于提供给平台可配置表单的设置
export default {
  name: {
    type: String, // vue prop的类型检测
    default: '名称', // vue prop和表单的共同默认值
    form: {
      type: 'input', // 表单类型
      des: '名称'
    }
  },
  number: {
    type: [String, Number], // 数字类型统一设置成这种格式，由于vue-material的问题，input-number的数据居然是string
    default: 0,
    form: {
      type: 'number',
      des: '数字',
      min: -10,
      max: 10,
      step: 0
    }
  },
  steps: {
    type: [String, Number], // 一种表示过程到了哪个阶段的表单
    default: 0,
    form: {
      des: '阶段',
      type: 'stage',
      stages: [
        {
          name: '原图',
          value: true
        },
        {
          name: '第一次渲染',
          value: false
        }
      ]
    }
  },
  select: {
    type: String,
    default: 'option1',
    form: {
      des: '选择',
      type: 'select',
      options: [
        {
          name: '选择一',
          value: 'option1'
        }
      ]
    }
  }
}

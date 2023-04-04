// 用于提供给平台可配置表单的设置
// bind roughness   {label:"Roughness", default:0.25, min:0.01, max:1, step:0.001}
// bind dcolor      {label:"Diffuse Color",  r:1.0, g:1.0, b:1.0}
// bind scolor      {label:"Specular Color", r:1.0, g:1.0, b:1.0}
// bind intensity   {label:"Light Intensity", default:4, min:0, max:10}
// bind width       {label:"Width",  default: 8, min:0.1, max:15, step:0.1}
// bind height      {label:"Height", default: 8, min:0.1, max:15, step:0.1}
// bind roty        {label:"Rotation Y", default: 0, min:0, max:1, step:0.001}
// bind rotz        {label:"Rotation Z", default: 0, min:0, max:1, step:0.001}
// bind twoSided    {label:"Two-sided", default:false}

export default {
  roughness: {
    type: [String, Number], // vue prop的类型检测
    default: 0.25, // vue prop和表单的共同默认值
    form: {
      type: 'number', // 表单类型
      des: '粗糙度',
      min: 0.01,
      max: 1,
      step: 0.001
    }
  },
  dcolor: {
    type: String,
    default: '[1.0, 1.0, 1.0]',
    form: {
      type: 'input',
      des: '漫反射颜色'
    }
  },
  scolor: {
    type: String,
    default: '[1.0, 1.0, 1.0]',
    form: {
      type: 'input',
      des: '镜面反射颜色'
    }
  },
  intensity: {
    type: [String, Number], // vue prop的类型检测
    default: 4,
    form: {
      type: 'number',
      des: '光强',
      min: 0,
      max: 10,
      step: 0.1
    }
  },
  width: {
    type: [String, Number], // vue prop的类型检测
    default: 8,
    form: {
      type: 'number',
      des: '宽度',
      min: 0.1,
      max: 15,
      step: 0.1
    }
  },
  height: {
    type: [String, Number], // vue prop的类型检测
    default: 8,
    form: {
      type: 'number',
      des: '高度',
      min: 0.1,
      max: 15,
      step: 0.1
    }
  },
  roty: {
    type: [String, Number], // vue prop的类型检测
    default: 0,
    form: {
      type: 'number',
      des: 'y轴旋转',
      min: 0,
      max: 1,
      step: 0.001
    }
  },
  rotz: {
    type: [String, Number], // vue prop的类型检测
    default: 0,
    form: {
      type: 'number',
      des: 'z轴旋转',
      min: 0,
      max: 1,
      step: 0.001
    }
  },
  twoSided: {
    type: [String, Number], // vue prop的类型检测
    default: 0,
    form: {
      type: 'number',
      des: '双面',
      min: 0,
      max: 1,
      step: 1
    }
  }
}
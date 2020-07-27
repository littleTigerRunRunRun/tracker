export default {
  image: {
    type: String,
    default: '/public/img/night.jpg',
    form: {
      des: '背景图片',
      type: 'select',
      options: [
        {
          name: '夜景',
          value: '/public/img/night.jpg'
        },
        {
          name: '西湖',
          value: '/public/img/lake.jpg'
        },
        {
          name: '克苏鲁',
          value: '/public/img/cthulhu.jpg'
        }
      ]
    }
  },
  kernelRadius: {
    type: [String, Number], // vue-material的表单有问题，所以传来的数字可能是字符串类型
    default: 0,
    form: {
      des: '模糊半径',
      type: 'number',
      min: 0,
      max: 100,
      step: 1
    }
  },
  sigma: {
    type: [String, Number], // vue-material的表单有问题，所以传来的数字可能是字符串类型
    default: 1,
    form: {
      des: '模糊发散度',
      type: 'number',
      min: 1,
      max: 100,
      step: 1
    }
  }
}

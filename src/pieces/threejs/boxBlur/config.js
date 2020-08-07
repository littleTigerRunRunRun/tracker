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
        },
        {
          name: '熊猫',
          value: '/public/img/panda.jpg'
        },
        {
          name: '花',
          value: '/public/img/flower.jpg'
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
  stage: {
    type: [String, Number],
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
          name: '第一次盒模糊',
          value: true
        },
        {
          name: '第二次盒模糊',
          value: false
        },
        {
          name: '第三次盒模糊',
          value: false
        },
        {
          name: '第四次盒模糊',
          value: false
        },
        {
          name: '第五次盒模糊',
          value: false
        }
      ]
    }
  }
}

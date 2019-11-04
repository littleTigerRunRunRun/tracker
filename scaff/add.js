let strand = require('./dialog.js')
let project = {
  threeModule: [],
  webglModule: []
}
let choicesMap = {
  '决定就是你了': true,
  '容我三思': false,
  'ThreeJS': 1,
  'Webgl': 2,
  'Stat性能管理工具': 1,
  'OrbitControls相机控制工具': 2,
  'M3矩阵工具': 1,
  'M4矩阵工具': 2,
  'GLinit初始化协助工具': 3
}

function createPiece() {
  
}

strand([
  {
    index: 0,
    clear: true,
    list: [
      { type: 'input', message: '输入一个响亮的称呼', name: 'nickname' },
      { type: 'input', message: '输入一个合适的作品命名', name: 'name' },
      { type: 'input', message: '告诉大家你要做什么', name: 'desc' }
    ],
    before() {
      console.log('每一个优秀的作品，都始于一次合适的命名(✧◡✧)')
      console.log('用心取一个炫酷的作品名，然后开始快乐地代码之旅吧~')
    },
    after(answers) {
      Object.assign(project, answers)
    }
  },
  {
    index: 1,
    clear: true,
    list: [{
      type: 'list',
      message: '决定好了吗?',
      name: 'confirm',
      choices: [
        '决定就是你了',
        '容我三思'
      ]
    }],
    before() {
      console.log(`作品称呼：${project.nickname}`)
      console.log(`作品命名：${project.name}`)
      console.log(`作品简介：${project.desc}`)
    },
    router(answers) {
      if (choicesMap[answers.confirm]) return 2
      else return 0
    }
  },
  {
    index: 2,
    clear: true,
    list: [{
      type: 'list',
      message: '选择需要构建的技术栈',
      name: 'technology',
      choices: [
        'ThreeJS',
        'Webgl'
      ]
    }],
    before() {
      console.log('选择你要使用的基础技术（这决定了可以选择的绑定模块）')
    },
    router(answers) {
      project.technology = choicesMap[answers.technology]
      return 2 + choicesMap[answers.technology]
    }
  },
  {
    index: 3,
    clear: true,
    list: [{
      type: 'checkbox',
      message: '选择需要的ThreeJS可选模组',
      name: 'threeModule',
      choices: [
        { name: 'Stat性能管理工具', checked: true },
        // new inquirer.Separator(),
        { name: 'OrbitControls相机控制工具', checked: false }
      ]
    }],
    before() {
      console.log('ThreeJS本身已被默认注入')
    },
    router(answers) {
      project.threeModule.splice(0, project.threeModule.length, ...(answers.threeModule.map(value => choicesMap[value])))
      createPiece()
    }
  },
  {
    index: 4,
    clear: true,
    list: [{
      type: 'checkbox',
      message: '选择需要的webgl可选模组',
      name: 'webglModule',
      choices: [
        { name: 'M3矩阵工具', checked: true },
        // new inquirer.Separator(),
        { name: 'M4矩阵工具', checked: false },
        { name: 'GLinit初始化协助工具', checked: false }
      ]
    }],
    router(answers) {
      project.webglModule.splice(0, project.webglModule.length, ...(answers.webglModule.map(value => choicesMap[value])))
      createPiece()
    }
  }
])

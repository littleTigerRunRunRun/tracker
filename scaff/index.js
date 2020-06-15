const strand = require('./dialog')
const tree = require('./dialog-tree.json')
const category = require('./category')
console.log(category)

const data = {}

const root = {
  name: 'root',
  list: [{
    type: 'list',
    message: '选择你要做的操作项?',
    name: 'to',
    choices: tree.root_excute
  }],
  before() {},
  router(answers) {
    return tree.root_excute_router[answers.to]
  }
}

const addCategory = {
  name: 'addc',
  list: [
    { type: 'input', clear: true, message: '输入英文类别名', name: 'key' }
  ],
  before() {
    // let total = 20
    // start = 1
    // end = 10
    // console.log(`共计${total}条,当前为${start}到${end}条`)
  },
  router(answers) {
    data.newCategory = answers.key
    return 'confirmc'
  }
}

const comfirmOpenNewCategory = {
  name: 'confirmc',
  list: [{
    type: 'list',
    clear: true,
    name: 'confirm',
    choices: tree.confirmc
  }],
  before() {
    console.log(`您创建了新的类别${data.newCategory}，要立即打开吗?`)
  },
  router(answers) {
    return tree.confirmcMap[answers.confirm]
  }
}

strand.add(root)
strand.add(addCategory)
strand.add(comfirmOpenNewCategory)

strand.run('root')

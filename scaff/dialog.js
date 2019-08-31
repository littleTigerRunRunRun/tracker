let utils = require('./utils')
const inquirer = require('inquirer')

class Dialog{
  constructor(dialog) {
    this._dialog = dialog
    if (dialog.clear) utils.clearControl()
    if (dialog.before) dialog.before()
  }
  prompt() {
    return new Promise((resolve, reject) => {
      inquirer.prompt(this._dialog.list).then((answers) => {
        if (this._dialog.after) this._dialog.after(answers)
        if (this._dialog.router) resolve(this._dialog.router(answers))
        else resolve(answers.to)
      })
    })
  }
}

let index = 0
let dialogs = []
let dialogHash = {}

async function excuteDialog() {
  if (dialogHash[index]) index = dialogHash[index]
  if (!dialogs[index]) {
    console.error('出现了不存在的路由跳转，自动返回首页，错误节点信息 index:' + index)
    index = 0
    excuteDialog()
    return
  }
  let current = new Dialog(dialogs[index])
  index = await current.prompt()
  excuteDialog()
}

function strandDialog(ds) {
  index = 0
  dialogs.splice(0, dialogs.length, ...ds)
  excuteDialog()
}

module.exports = {
  add(config) {
    dialogs.push(config)
    dialogHash[config.name] = dialogs.length - 1
  },
  run(name) {
    index = dialogHash[name]
    excuteDialog(index)
  },
  get(name) {
    return dialogHash[name]
  }
}
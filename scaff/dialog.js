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
        else resolve(this._dialog.index + 1)
      })
    })
  }
}

let index = 0
let dialogs = []

async function excuteDialog() {
  if (!dialogs[index]) return
  let current = new Dialog(dialogs[index])
  index = await current.prompt()
  excuteDialog(index)
}

module.exports = function strandDialog(ds) {
  index = 0
  dialogs.splice(0, dialogs.length, ...ds)
  excuteDialog()
}
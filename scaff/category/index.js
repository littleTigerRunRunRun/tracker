const fs = require('fs')

let currentDir = fs.readdirSync("./category")
let categorys = currentDir
  .filter((item) => item !== 'index.js')
  .map((item) => item.replace('.json', ''))

let category = {
  categorys,
  total: categorys.length,
  start: 1,
  limit: 10,
  list() {
    return this.categorys.slice(this.start - 1, this.start - 1 + this.limit)
  }
}

module.exports = category
'use strict'

const Controller = require('egg').Controller
const fs = require('fs')
const path = require('path')

class CategoryController extends Controller {
  getCategory() {
    return JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../store/category.json'), 'utf8', (err, data) => {
      if (err) {
        console.error(err)
        return
      }
    }).toString())
  }
  async list() {
    const { ctx } = this
    let data = {
      list: []
    }
    data.list = this.getCategory()
    ctx.body = data
  }
  async add() {
    const { ctx } = this
    let query = ctx.request.query
    let message = ''
    let code = 200
    let data = this.getCategory()
    let id = -1
    if (data.hash[query.name] !== undefined) {
      message = '已添加过的类别名'
      code = 500
    } else {
      data.list.push(query)
      id = data.hash[query.name] = data.list.length - 1
      fs.writeFile(path.resolve(__dirname, '../../store/category.json'), JSON.stringify(data),  function(err) {
        if (err) {
            return console.error(err)
        }
        console.log('写入成功')
      })
    }
    ctx.body = {
      message,
      code,
      id
    }
  }
  async remove() {

  }
}

module.exports = CategoryController

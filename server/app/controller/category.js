'use strict'

const Controller = require('egg').Controller
const fs = require('fs')
const path = require('path')

class CategoryController extends Controller {
  async list() {
    const { ctx } = this
    let data = {
      list: []
    }
    data.list = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../store/category.json'), 'utf8', (err, data) => {
      if (err) {
        console.error(err)
        return
      }
    }).toString())
    ctx.body = data
  }
  async add() {
    const { ctx } = this
    console.log(this)
    let message = ''
    ctx.body = {
      message,
      id: 1
    }
  }
}

module.exports = CategoryController

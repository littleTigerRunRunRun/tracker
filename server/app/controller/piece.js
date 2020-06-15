'use strict'

const Controller = require('egg').Controller
const fs = require('fs')
const path = require('path')

// 主序文件目录
const mainDirection = function (file) {
  return '../../store/category/' + file
}

class PieceController extends Controller {
  getPieces(id) {
    // 读取category文件
    return JSON.parse(fs.readFileSync(path.resolve(__dirname, mainDirection(id + '.json')), 'utf8', (err, data) => {
      if (err) {
        console.error(err)
        return
      }
    }).toString())
  }
  add() {
    const { ctx } = this
    const query = ctx.request.query
    console.log(query)
    const data = {
      message: '测试接口请求成功',
      data: []
    }
    ctx.body = data
  }
  list() {
    const { ctx } = this
    const query = ctx.request.query
    let code = 200
    let message = ''
    let data = null
    if (!query.categoryId) {
      code = 400
      message = '未提供分类id'
    } else {
      const pieces = this.getPieces(query.categoryId)
      data = pieces.list
      code = 200
      message = '请求成功'
    }
    ctx.body = {
      message,
      code,
      data
    }
  }
}

module.exports = PieceController

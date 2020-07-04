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
    const data = {
      message: '',
      data: null
    }
    if (!query.name) {
      data.code = 400
      data.message = '需要传入作品名称'
    } else {
      data.code = 200
      data.message = '成功创建作品，尽情享受创作吧'
      data.data = Date.now()
      const pieces = this.getPieces(query.categoryId) // query.categoryId
      pieces.list.unshift({
        id: data.data,
        name: query.name,
        desc: query.desc,
        title: query.title,
        label: ctx.queries.label
      })
      this.writePieces(query.categoryId, pieces)
    }
    ctx.body = data
  }
  writePieces(categoryId, pieces) {
    fs.writeFile(path.resolve(__dirname, mainDirection(categoryId + '.json')), JSON.stringify(pieces),  function(err) {
      if (err) {
          return console.error(err)
      }
    })
  }
  list() {
    const { ctx } = this
    const query = ctx.request.query
    let code = 200
    let message = ''
    let data = []
    if (!query.categoryId) {
      code = 400
      message = '未提供分类id'
    } else {
      const pieces = this.getPieces(query.categoryId)
      data = pieces.list || []
      code = 200
      message = '请求成功'
    }
    ctx.body = {
      message,
      code,
      data
    }
  }
  saveCapture() {
    const { ctx } = this
    const body = ctx.request.body
    const src = body.src.replace(/^data:image\/\w+;base64,/, '')
    const dataBuffer = Buffer.from(src, 'base64')
    const pieces = this.getPieces(body.categoryId)
    
    const piece = pieces.list.find((item) => item.id === body.id)

    if (!piece) {
      ctx.body = {
        message: '不存在的作品id',
        code: 500,
        data: null
      }
    } else {
      const fileName = body.id + '.jpg'
      piece.capture = 'http://127.0.0.1:7001/public/img/capture/' + fileName
      this.writePieces(body.categoryId, pieces)
      fs.writeFile(path.resolve(__dirname, '../public/img/capture/' + fileName), dataBuffer, function(err) {
        if(err){
          console.error(err)
        }
      })
      ctx.body = {
        message: '保存成功',
        code: 200,
        data: null
      }
    }
  }
}

module.exports = PieceController

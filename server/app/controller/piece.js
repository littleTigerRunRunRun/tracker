'use strict'

const Controller = require('egg').Controller
const fs = require('fs')
const path = require('path')
const templates = require('../template/index')

// 主序文件目录
const mainDirection = function (file) {
  return '../../store/category/' + file
}

class PieceController extends Controller {
  getCategory() {
    // 读取category文件
    return JSON.parse(fs.readFileSync(path.resolve(__dirname, mainDirection('index.json')), 'utf8', (err, data) => {
      if (err) {
        console.error(err)
        return
      }
    }).toString())
  }
  getPieces(categoryId) {
    const piece = fs.readFileSync(path.resolve(__dirname, mainDirection(categoryId + '.json')), 'utf8', (err, data) => {
      if (err) {
        console.error(err)
        return
      }
    }).toString()
    return JSON.parse(piece)
  }
  async add() {
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
      const pieces = this.getPieces(query.categoryId) // query.categoryId
      if (pieces.list.find((piece) => piece.name === query.name)) {
        data.code = 400
        data.message = 'name为' + query.name + '的作品已经存在'
      }
      else {
        data.code = 200
        data.message = '成功创建作品，尽情享受创作吧'
        data.data = Date.now()
        const piece = {
          id: data.data,
          name: query.name,
          desc: query.desc,
          title: query.title,
          label: ctx.queries.label,
          type: query.type
        }
        pieces.list.unshift(piece)
        this.writePieces(query.categoryId, pieces)
        this.addTemplate(query.categoryId, piece)
      }
    }
    ctx.body = data
  }
  addTemplate(categoryId, piece) {
    const { ctx } = this
    const category = this.getCategory().list.find((cate) => (cate.id - 0) === (categoryId - 0))
    
    const cateName = category.name
    const catePath = path.resolve(__dirname, '../../../src/pieces/' + cateName)
    if (!fs.existsSync(catePath)) this.mkdir(catePath)
    this.mkdir(catePath + '/' + piece.name)
    // 创建项目入口entry.vue，里面会有快速启动设置（二次生成）
    let tempName = cateName
    let template = templates[tempName]
    if (!template) {
      template = templates.common
      tempName = 'common'
    }

    for (let file of template) {
      this.copyTemplate(file.file, tempName, catePath + '/' + piece.name, file.insert ? file.insert(piece) : {})
    }
    
    // this.copyTemplate('entry.vue', catePath + '/' + piece.name, {
    //   name: piece.name,
    //   title: piece.title,
    //   desc: piece.desc,
    //   upperName: piece.name[0].toUpperCase() + piece.name.slice(1)
    // })
    // this.copyTemplate('config.js', catePath + '/' + piece.name, {})
    // 创建doc.md，也就是文档入口
    // 创建config.js,也就是配置入口
    // 我们要对vue/js/css类型的项目做不同的配置响应
    ctx.body = {
      message: '添加成功',
      code: 200,
      data: ''
    }
  }
  // 虽然有copy的专门方法，不过为了方便做插值我们还是这样吧
  copyTemplate(sourceName, tempName, piecePath, templateDeals) {
    fs.readFile(path.resolve(__dirname, '../template/' + tempName + '/' + sourceName), (err, data) => {
      if (err) throw new Error('something wrong was happended');
      let str = data.toString()
      if (templateDeals) {
        try {
          for (let key in templateDeals) {
            str = str.replace(new RegExp('<% ' +  key + ' %>', 'g'), templateDeals[key])
          }
        } catch (e) {
          console.log(e)
        }
      }
      fs.writeFile((piecePath + '/' + sourceName), str, function(err) {
        if (err) throw new Error('something wrong was happended');
      })
    })
  }
  // 生成文件夹
  mkdir(filepath) {
    fs.mkdirSync(filepath)
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
    let categoryId = body.categoryId
    if (!categoryId) {
      let cates = this.getCategory()
      let cate = cates.list.find((item) => item.name === body.categoryName)
      if (cate) { categoryId = cate.id }
      else {
        ctx.body = {
          message: '未传入正确的类别id或者name',
          code: 400,
          data: null
        }
        return
      }
    }
    const pieces = this.getPieces(categoryId)
    const piece = pieces.list.find((item) => item.id === body.id || item.name === body.name )
    if (!piece) {
      ctx.body = {
        message: '不存在的作品id',
        code: 400,
        data: null
      }
    } else {
      const fileName = piece.id + '.png'
      piece.capture = 'http://127.0.0.1:7001/public/img/capture/' + fileName
      this.writePieces(categoryId, pieces)
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
  edit() {
    const { ctx } = this
    const query = ctx.request.query
    const data = {
      message: '',
      data: null
    }
    const pieces = this.getPieces(query.categoryId) // query.categoryId
    const piece = pieces.list.find((piece) => piece.id === query.id)
    if (!piece) {
      data.code = 400
      data.message = 'id为' + query.id + '的作品不存在'
    } else {
      data.code = 200
      data.message = '成功创建作品，尽情享受创作吧'
      data.data = query.id
      piece.desc = query.desc,
      piece.title = query.title,
      piece.label = ctx.queries.label
      this.writePieces(query.categoryId, pieces)
    }
    ctx.body = data
  }
  delete() {

  }
}

module.exports = PieceController

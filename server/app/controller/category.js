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
      message: '请求成功',
      data: []
    }
    let category = this.getCategory()
    data.data.splice(0, 0, ...category.list.filter((item) => !item.hide))
    ctx.body = data
  }
  async add() {
    const { ctx } = this
    let query = ctx.request.query
    let message = ''
    let code = 200
    let data = this.getCategory()
    let id = -1
    if (!query.name){
      code = 400
      message = '空的类别名'
    } else if (data.hash[query.name] !== undefined) {
      let target = data.hash[query.name]
      if (!target.hide) {
        message = '已添加过的类别名'
        code = 400
      } else {
        target.hide = false
        message = '添加成功'
      }
    } else {
      data.list.push(query)
      data.hash[query.name] = data.list.length - 1
      message = '添加成功'
      fs.writeFile(path.resolve(__dirname, '../../store/category.json'), JSON.stringify(data),  function(err) {
        if (err) {
            return console.error(err)
        }
      })
    }
    ctx.body = {
      message,
      code,
      data: query.name
    }
  }
  async remove() {
    const { ctx } = this
    let query = ctx.request.query
    let message = ''
    let code = 200
    let data = this.getCategory()

    let name = query.name
    if (!name) {
      message = '请给出你需要删除的类别名'
      code = 400
    } else {
      let index = data.hash[name]
      if (index === undefined || data.list[index].hide) {
        message = '不存在的类别名'
        code = 400
      } else {
        // 以一个隐藏标记来替代直接删除，用以留存数据
        data.list[index].hide = true
        code = 200
        fs.writeFile(path.resolve(__dirname, '../../store/category.json'), JSON.stringify(data),  function(err) {
          if (err) {
              return console.error(err)
          }
        })
        message = '删除成功'
      }
    }

    ctx.body = {
      message,
      code
    }
  }
}

module.exports = CategoryController

'use strict'

const Controller = require('egg').Controller
const fs = require('fs')
const path = require('path')

// 主序文件目录
const mainDirection = function (file) {
  return '../../store/category/' + file
}

class CategoryController extends Controller {
  getCategory() {
    // 读取category文件
    return JSON.parse(fs.readFileSync(path.resolve(__dirname, mainDirection('index.json')), 'utf8', (err, data) => {
      if (err) {
        console.error(err)
        return
      }
    }).toString())
  }
  // 列表请求
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
  async update() {
    const { ctx } = this
    let query = ctx.request.query
    let message = ''
    let code = 200
    const cateListData = this.getCategory()
    if (query.id) {
      const cate = cateListData.list.find((cate) => parseInt(cate.id) === parseInt(query.id))
      if (cate) {
        cate.name = query.name
        cate.title = query.title
        cate.desc = query.desc
      }
      console.log('cate', cate)
    } else {
      if (!query.name){
        code = 400
        message = '空的类别名'
      } else if (cateListData.hash[query.name] !== undefined) {
        let target = cateListData.hash[query.name]
        if (!target.hide) {
          message = '已添加过的类别名'
          code = 400
        } else {
          // 隐藏逻辑
          target.hide = false
          message = '添加成功'
        }
      } else {
        // 完全新建
        query.id = Date.now()
        this.addBranchCategoryStore(query.id)
        cateListData.list.push(query)
        cateListData.hash[query.id] = cateListData.list.length - 1
        message = '添加成功'
      }
    }
    fs.writeFile(path.resolve(__dirname, mainDirection('index.json')), JSON.stringify(cateListData),  function(err) {
      if (err) {
          return console.error(err)
      }
    })
    ctx.body = {
      message,
      code,
      data: query.id
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
        fs.writeFile(path.resolve(__dirname, mainDirection('index.json')), JSON.stringify(data),  function(err) {
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
  // 为了提高读写效率，我们每生成一个目录，就
  addBranchCategoryStore(id) {
    fs.writeFile(path.resolve(__dirname, mainDirection(id + '.json')), '{"type": "piece","list": []}',  function(err) {
      if (err) {
          return console.error(err)
      }
    })
    
  }
}

module.exports = CategoryController

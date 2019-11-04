'use strict'

const Controller = require('egg').Controller
const fs = require('fs')

// 用于读写的控制器
class RwController extends Controller {
  async read() {
    const { ctx } = this
    ctx.body = 'hi, egg'
  }
  async write() {
    const { ctx } = this
    ctx.body = 'hi, egg'
  }
}

module.exports = RwController

'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app
  router.get('/home', controller.home.index)
  // 分类相关
  router.get('/api/category/list', controller.category.list)
  router.get('/api/category/add', controller.category.add)
  router.get('/api/category/remove', controller.category.remove)
  // 作品相关
  router.get('/api/piece/list', controller.piece.list)
  router.get('/api/piece/add', controller.piece.add)
}

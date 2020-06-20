import axios from 'axios'

// 分类操作
export function getCategoryList() {
  return axios.get('/api/category/list')
}

// 添加分类 / 修改, 假设有id就修改
export function updataCategory(params) {
  return axios({
    method: 'get',
    url: '/api/category/update',
    params
  })
}

export function removeCategoryByName(categoryId) {
  return axios({
    method: 'get',
    url: '/api/category/remove',
    params: {
      categoryId
    }
  })
}

// 作品列表
export function getPieceList(categoryId) {
  return axios({
    method: 'get',
    url: '/api/piece/list',
    params: {
      categoryId
    }
  })
}

// 添加作品
export function addPiece(params) {
  return axios({
    method: 'get',
    url: '/api/piece/add',
    params
  })
}

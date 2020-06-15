import axios from 'axios'

// 分类操作
export function getCategoryList() {
  return axios.get('/api/category/list')
}

export function addCategory(params) {
  return axios({
    method: 'get',
    url: '/api/category/add',
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

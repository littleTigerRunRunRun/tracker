import axios from 'axios'

export function getCategoryList() {
  return axios.get('/api/category/list')
}
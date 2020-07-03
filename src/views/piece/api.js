import axios from 'axios'

// 保存截图
export function saveCapture(data) {
  return axios({
    method: 'post',
    url: '/api/piece/saveCapture',
    data
  })
}

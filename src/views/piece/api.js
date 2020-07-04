import axios from 'axios'

function getCookie(name) {
  var reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  var arr = document.cookie.match(reg)
  if (arr) { return unescape(arr[2]) } else { return null }
}

// 保存截图
export function saveCapture(data) {
  return axios({
    method: 'post',
    url: '/api/piece/saveCapture',
    headers: {
      'x-csrf-token': getCookie('csrfToken')
    },
    data
  })
}

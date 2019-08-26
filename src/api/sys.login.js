import request from '@/plugin/axios'

export function AccountLogin (data) {
  return request({
    url: '/api/login',
    method: 'post',
    data
  })
}

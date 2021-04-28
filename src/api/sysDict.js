import request from '@/utils/request'
import qs from 'qs'
const urlPrefix = process.env.VUE_APP_API_USERCENTER_URL + '/sys-dict'
const api = {
  page: urlPrefix,
  list: urlPrefix,
  delete: urlPrefix,
  put: urlPrefix,
  get: urlPrefix,
  getByCode: urlPrefix + '/dict'
}

export function page (data) {
  return request({
    url: api.page,
    method: 'post',
    data: qs.stringify(data)
  })
}
export function list (data) {
  return request({
    url: api.list + '?' + qs.stringify(data),
    method: 'get'
  })
}
export function deleteList (data) {
  return request({
    url: api.delete,
    method: 'delete',
    data: qs.stringify(data)
  })
}
export function save (data) {
  return request({
    url: api.put,
    method: 'put',
    data: qs.stringify(data)
  })
}
export function get (id) {
  return request({
    url: api.get + '/' + id,
    method: 'get'
  })
}
export function getByCode (code) {
  return request({
    url: api.getByCode + '/' + code,
    method: 'get'
  })
}

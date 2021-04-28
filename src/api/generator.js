import request from '@/utils/request'
import qs from 'qs'
const urlPrefix = '/user-center/generator-config'
const api = {
  page: urlPrefix,
  list: urlPrefix,
  delete: urlPrefix,
  put: urlPrefix,
  get: urlPrefix,
  generate: urlPrefix + '/generate',
  download: urlPrefix + '/download',
  getTables: urlPrefix + '/tables'
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
export function generate (data) {
  return request({
    url: api.generate,
    method: 'post',
    data: qs.stringify(data)
  })
}
export function download (data) {
  return request({
    url: api.download + '?' + qs.stringify(data),
    method: 'get',
    responseType: 'blob'
  })
}
export function getTables (data) {
  return request({
    url: api.getTables + '?' + qs.stringify(data),
    method: 'get'
  })
}

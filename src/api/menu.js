import request from '@/utils/request'
import qs from 'qs'
const urlPrefix = 'user-center/sysMenu'
const api = {
  page: urlPrefix,
  list: urlPrefix + '/list',
  delete: urlPrefix,
  save: urlPrefix,
  get: urlPrefix,
  getChildren: urlPrefix + '/children'
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
    url: api.list,
    method: 'post',
    data: qs.stringify(data)
  })
}

export function getChildren (data) {
  return request({
    url: api.getChildren,
    method: 'post',
    data: qs.stringify(data)
  })
}

export function deleteList (data) {
  return request({
    url: api.delete,
    method: 'delete',
    data: qs.stringify(data)
  })
}

export function updateOrSave (data) {
  return request({
    url: api.save,
    method: 'put',
    data: qs.stringify(data)
  })
}

export function get (id) {
  return request({
    url: api.get + `/${id}`,
    method: 'get'
  })
}

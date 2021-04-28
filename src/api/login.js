import request from '@/utils/request'
import axios from 'axios'
const userApi = {
  Login: '/oauth/oauth/token',
  Logout: '/user-center/auth/logout',
  ForgePassword: '/auth/forge-password',
  Register: '/user-center/auth/register',
  twoStepCode: '/auth/2step-code',
  SendSms: '/account/sms',
  SendSmsErr: '/account/sms_err',
  // get my info
  UserInfo: '/user-center/user/info',
  UserMenu: '/user-center/user/menu'
}
// 获取令牌时，请求头信息(Basic Base64.encode(client_id:client_secret))
const authorizationValue = 'Basic cGFzc3dvcmQ6d2FuZ3UxMjMhQCM='

function tansParams (params) {
  let result = ''
  if (!params) {
    return result
  }
  Object.keys(params).forEach((key) => {
    if (!Object.is(params[key], undefined) && !Object.is(params[key], null)) {
      result += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) + '&'
    }
  })
  return result
}
/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */

export function login (params) {
  params['grant_type'] = 'password'
  return axios.post(userApi.Login, params, {
    transformRequest: [(params) => {
      return tansParams(params)
    }],
    headers: {
      'Authorization': authorizationValue
    }
  })
}

export function getSmsCaptcha (parameter) {
  return request({
    url: userApi.SendSms,
    method: 'post',
    data: parameter
  })
}

export function getInfo () {
  return request({
    url: userApi.UserInfo,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function getCurrentUserNav (username) {
  return request({
    url: userApi.UserMenu + '/' + username,
    method: 'get'
  })
}

export function logout () {
  return request({
    url: userApi.Logout,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * get user 2step code open?
 * @param parameter {*}
 */
export function get2step (parameter) {
  return request({
    url: userApi.twoStepCode,
    method: 'post',
    data: parameter
  })
}

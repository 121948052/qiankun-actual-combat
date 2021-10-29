import { post, put, get, downloadImage } from './base'

// 登陆
export const loginInfor = loginParam => {
  let str = ''
  for (const i in loginParam) {
    str += '&' + i + '=' + encodeURIComponent(loginParam[i])
  }
  const resq = {
    url: `/iam/auth/oauth/token`,
    body: str
  }
  return post(resq)
  // return post(resq, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
}

// 获取验证码
export const getPhoneMessage = param => {
  const resq = {
    url: `/iam/auth/v2/message/sendSMS/tenant/${param.smsType}?phone=${param.phone}`,
    query: {
    }
  }
  return get(resq)
}

// 忘记密码
export const forgetPassWord = param => {
  const resq = {
    url: '/iam/auth/v2/iam/account/forgotPassword',
    body: { ...param }
  }
  return put(resq)
}

// 退出登陆
export const logoutFun = () => {
  const resq = {
    url: '/iam/auth/v2/token/logout',
    query: { }
  }
  return get(resq)
}

// 修改密码
export const changPasswd = param => {
  const resq = {
    url: '/iam/service/core/v3/api/account/updatePassword',
    body: { ...param }
  }
  return put(resq)
}

// 获取按钮权限
export const getResourceByToken = param => {
  const resq = {
    url: `/iam/service/core/v3/api/menu/getAccountMenuButtons?containerCode=`
  }
  return get(resq)
}

// 兼容userinfo信息
export const getUserInfoByToken = param => {
  const resq = {
    url: 'auth/inner/account/parseTokenByParam'
  }
  return post(resq, {})
}

// 获取连续登录错误次数
export const getAccountLoginTimes = param => {
  const resq = {
    url: `/iam/auth/v2/token/getAccountLoginTimes`,
    query: { ...param }
  }
  return get(resq)
}

// 获取验证码
export const createCodeByToken = param => {
  const resq = {
    url: `/iam/auth/v2/token/createCode`,
    query: { ...param },
    headers: { responseType: 'blob' }
  }
  return downloadImage(resq)
}

// 获取账号【上次登录信息】及【密码过期提醒(提前7天)】
export const getAccountNoticeInfo = param => {
  const resq = {
    url: `/iam/auth/v2/iam/account/getNoticeInfo`
  }
  return get(resq)
}

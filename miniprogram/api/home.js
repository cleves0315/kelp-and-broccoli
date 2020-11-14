import { callFunction } from '../utils/util';

/**
 * 获取用户信息
 * @param {String} openId
 */
export function getUserInfo(openId) {
  return callFunction({
    name: 'userinfo',
    data: {
      open_id: openId
    }
  });
}

/**
 * 获取plan数据
 * @param { String } openId
 */
export function getPlan(openId) {
  return callFunction({
    name: 'plan',
    data: {
      action: 'get_plan',
      open_id: openId
    }
  });
}
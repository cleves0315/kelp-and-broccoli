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

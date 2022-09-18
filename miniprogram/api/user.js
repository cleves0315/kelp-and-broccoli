import { callFunction } from '../utils/util';

/**
 * 获取用户信息
 * @param {String} user_id
 */
export function getUserInfo(user_id) {
  return callFunction({
    name: 'userinfo',
    data: {
      user_id
    }
  });
}

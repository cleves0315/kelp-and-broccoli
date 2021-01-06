import { callFunction } from '../utils/util';

/**
 * 登录
 * @todu 获取open_id
 */
export function login() {
  return callFunction({
    name: 'login',
  });
}

export function getMyTodayBakImage() {
  return callFunction({
    name: 'planinfo',
    data: {
      action: 'mytoday_back_image'
    }
  });
}

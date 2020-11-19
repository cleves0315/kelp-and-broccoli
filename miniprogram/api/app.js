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

/**
 * plan数据模板
 */
export const planInit = {
  title: '',            // 标题 String
  detail: '',           // 计划描述 String
  is_finish: false,     // 完成状态 Boolean
  organize: '',         // 属于'我的一天'项目 
  closing_date: 0,      // 截止时间(时间戳) Number
  // repeat: 0,                   // 重复周期 ??
}

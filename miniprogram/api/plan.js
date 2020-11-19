import { callFunction } from '../utils/util';


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

/**
 * 添加一条plan
 * @param { String } openId open_id
 * @param { String } title 标题
 * @param { String } organize 栏目
 */
export function addPlan(openId, title, organize) {
  const data = {
    action: 'add_plan',
    open_id: openId,
    title,
    organize,
  };

  return callFunction({
    name: 'plan',
    data,
  });
}
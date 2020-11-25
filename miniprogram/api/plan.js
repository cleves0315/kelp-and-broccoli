import { callFunction } from '../utils/util';


/**
 * 获取plan数据
 * @param { String } openId
 */
export function getPlan(openId) {
  return callFunction({
    name: 'planinfo',
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
export function addPlan(options) {
  const data = {
    action: 'add_plan',
    plan: options
  };

  return callFunction({
    name: 'planinfo',
    data,
  });
}


/**
 * 编辑plan
 */
export function editPlan(options) {
  const data = {
    action: 'edit_plan',
    plan: options
  };

  return callFunction({
    name: 'planinfo',
    data
  });
}

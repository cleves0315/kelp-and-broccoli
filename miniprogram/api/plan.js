import { callFunction } from '../utils/util';


/**
 * 获取plan数据
 * @param { String } openId
 */
export function getPlanList(openId) {
  return callFunction({
    name: 'planinfo',
    data: {
      action: 'get_plan_list',
      open_id: openId
    }
  });
}

/**
 * 添加planList
 * @param { String } openId open_id
 * @param { String } title 标题
 * @param { String } organize 栏目
 */
export function addPlanList(planList) {
  const data = {
    action: 'add_plan_list',
    plan_list: planList
  };

  return callFunction({
    name: 'planinfo',
    data,
  });
}


/**
 * 更新planList
 * @param {Array} planList
 */
export function updatePlanList(planList) {
  const data = {
    action: 'update_plan_list',
    plan_list: planList
  };

  return callFunction({
    name: 'planinfo',
    data
  });
}

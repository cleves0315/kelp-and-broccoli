import { callFunction } from '../utils/util';

const name = 'planinfo';

/**
 * 获取plan数据
 * @param { String } openId
 */
export function getPlanList(openId) {
  return callFunction({
    name,
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
    name,
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
    name,
    data
  });
}


/**
 * 删除planList
 * @param {Array} ids 
 */
export function deletePlanList(ids) {
  const data = {
    action: 'delete_plan_list',
    ids
  };

  return callFunction({
    name,
    data
  });
}


/**
 * 完成任务
 * @param {Array} planList 
 */
export function finishPlanList(planList) {
  const data = {
    action: 'finish_plan_list',
    plan_list: planList
  };

  return callFunction({
    name,
    data,
  });
}

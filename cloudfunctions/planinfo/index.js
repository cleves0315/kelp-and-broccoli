// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'test-7t28x',
  timeout: 10000
})


/**
 * 初始化plan
 */
function init_plan(openId) {
  const planInit = {
    open_id: openId,    // open_id String
    list: [],       // 计划列表
    memory: 0,                            // 记录list id索引，
    create_time: new Date().getTime(),    // 生成时间 Number
    update_time: new Date().getTime(),    // 更新时间 Number
  };

  return planInit;
}

/**
 * 初始化plan_list
 * @param {Object} options 
 */
function init_plan_list(options) {
  const data = {
    id: options.id,                       // id Number *
    title: options.title,                 // 标题 String *
    detail: options.detail || '',         // 计划描述 String
    is_finish: false,                     // 完成状态 Boolean
    create_time: new Date().getTime(),    // 生成时间 Date
    update_imte: new Date().getTime(),    // 更新时间
    organize: options.organize || 'normal',  // 属于'我的一天'项目 
    closing_date: options.closing_date || 0, // 截止时间(时间戳) Number
    stepList: options.stepList || [],      // 子计划列表
    // repeat: 0,                   // 重复周期 ??
  }

  return data;
}


// 云函数入口函数
exports.main = async (event) => {
  const db = cloud.database();
  
  switch (event.action) {
    case 'get_plan':
      return await get_plan(event, db);
    case 'add_plan':
      return await add_plan(event, db);
    case 'edit_plan':
      return await edit_plan(event, db);
  }
}


/**
 * 获取计划数据
 */
async function get_plan(event, db) {
  const openId = event.open_id;

  if (!openId || openId[0] === '"') {
    return {
      code: '0',
      message: '获取失败'
    }
  }

  return db.collection('plan_info').where({
    open_id: openId
  }).get().then(res => {
    let plan = {};

    if (res.data.length > 0) {
      plan = res.data[0];
    } else {
      const planInit = init_plan(openId);

      db.collection('plan_info').add({
        data: planInit
      });
    }

    return {
      plan,
      code: '1',
      message: '获取成功',
    };
  })
}


/**
 * 添加一条计划 
 * @param title 标题 * (*必传)
 * @param detail 详情
 * @param organize  归属项目
 * @param closing_date  截止时间
 */
async function add_plan(event, db) {
  const openId = event.open_id;

  if (!openId || !event.title) {
    return {
      code: '0',
      message: '获取失败'
    }
  }

  return db.collection('plan_info').where({
    open_id: openId
  }).get().then(res => {
    let plan = {};

    if (res.data.length === 0) {
      return {
        code: '0',
        message: '不存在该用户'
      };
    }

    plan = res.data[0];

    plan.memory += 1;
    const data = init_plan_list({
      id: plan.memory,
      title: event.title,
      detail: event.detail,           // 计划描述 String
      organize: event.organize,       // 属于'我的一天'项目 
      closing_date: event.closing_date,    // 截止时间(时间戳) Number
      // repeat: 0,                   // 重复周期 ??
    });

    plan.list.push(data);

    return db.collection('plan_info').where({
      open_id: openId
    }).update({
      data: {
        memory: plan.memory,
        list: plan.list
      }
    }).then(res => {
      if (res.stats.updated !== 0) {
        return {
          code: '1',
          message: '添加成功',
          data
        };
      } else {
        return {
          code: '0',
          message: '更新失败'
        };
      }
    })
  });
}


/**
 * 修改计划
 * @param open_id
 * @param {Object} options {title,detail,...}
 */
async function edit_plan(event, db) {
  let keys = [];
  const openId = event.open_id;
  const options = event.options;

  if (!openId || !options) {
    return {
      code: '0',
      message: '获取失败'
    };
  }

  keys = Object.getOwnPropertyNames(options);
  if (keys.length === 0) {
    return {code: '0', message: '获取失败'};
  }

  db.collection('plan_info').where({
    open_id: openId
  }).get().then(res => {
    if (res.data.length > 0) {
      const planInfo = res.data[0];
      const list = planInfo.list;
      const plan = {};

      list.forEach(item => {
        if (item.id === options.id) {
          plan = item;
          break;
        }
      });

      if (JSON.stringify(plan) === '{}') {
        return {code: '0', message: '获取失败'};
      }

      keys.forEach(key => {
        plan[key] = options[key];
      });

      

      
    } else {
      return { code: '0', message: '获取失败' };
    }
  })

}

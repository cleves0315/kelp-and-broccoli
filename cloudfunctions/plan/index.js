// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'test-7t28x',
  timeout: 10000
})

const planInit = {
  open_id: '',    // open_id String
  list: [
//       id: 1,                       // id Number
//       title: '计划1',              // 标题 String
//       detail: '计划描述',           // 计划描述 String
//       state: false,                // 完成状态 Boolean
//       create_time: 1600073125840,   // 生成时间 Date
//       update_imte: 1600073125840,  // 更新时间
//       organize: 'today',           // 属于'我的一天'项目 
//       closing_date: 1600073125840, // 截止时间(时间戳) Number
//       repeat: 0,                   // 重复周期 ??
//     }
  ],
  create_time: new Date().getTime(),    // 生成时间 Number
  // update_time: new Date().getTime(),    // 更新时间 Number
};

// 云函数入口函数
exports.main = async (event) => {
  const db = cloud.database();
  
  switch (event.action) {
    case 'get_plan':
      return await get_plan(event, db)
  }
}


/**
 * 获取计划数据
 */
async function get_plan(event, db) {
  const openId = event.open_id;

  return db.collection('plan').where({
    open_id: openId
  }).get().then(res => {
    let plan = {};

    if (res.data.length > 0) {
      plan = res.data[0];
    } else {
      plan = planInit;
      plan.open_id = openId;

      db.collection('plan').add({
        data: plan
      });
    }

    return {
      plan,
      code: '1',
      message: '获取成功',
    };
  })
}
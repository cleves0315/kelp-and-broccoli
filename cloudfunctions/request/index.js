// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  // env: cloud.DYNAMIC_CURRENT_ENV,
  env: 'xxxx',
  timeout: 10000
})


// 初始化数据格式

// const user = {
//   day: 1,                      // 天数 Number
//   open_id: event.openid,       // openid String
//   create_time: formatDate(),   // 生成时间 Date
//   update_imte: 1600073125840,  // 更新时间
//   // today_list: [],
//   // percentage: 0,
//   // progress: 0,
//   // total: 0,
// }


//       id: 1,                       // id Number
//       title: '计划1',              // 标题 String
//       detail: '计划描述',           // 计划描述 String
//       state: false,                // 完成状态 Boolean
//       create_time: formatDate(),   // 生成时间 Date
//       update_imte: 1600073125840,  // 更新时间
//       is_today: true,              // 是否放到'我的一天' Boolean
//       closing_date: 1600073125840, // 截止时间(时间戳) Number
//       repeat: 0,                   // 重复周期 ??
//     }
/*
 * 每日计划
 */
// const plan = {
//   open_id: event.openid,        // openid String
//   create_time: formatDate(),    // 生成时间 Date
//   list: [                          // 
//     { 

//   ],
//   // progress: 0,                  // 进度 Number
//   // total: 0,                     // 计划数量 Number
//   // percentage: 0,                // 进度百分比值 Number
// }


// /**
//  * 已完成的每日计划
//  */
// const done_plan = {
//   open_id: event.openid,        // openid String
//   create_time: formatDate(),    // 生成时间 Date
//   list: [                          // 
//     { 
//       id: 1,                       // id Number
//       title: '计划1',              // 标题 String
//       detail: '计划描述',           // 计划描述 String
//       state: true,                 // 完成状态 Boolean
//       create_time: formatDate(),   // 生成时间 Date
//       update_imte: 1600073125840,  // 更新时间
//       is_today: true,              // 是否放到'我的一天' Boolean
//       closing_date: 1600073125840, // 截止时间(时间戳) Number
//       repeat: 0,                   // 重复周期 ??
//     }
//   ],
// }

const planInit = {
  open_id: '',
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
  update_time: new Date().getTime(),    // 更新时间 Number
};

/**
 * 格式化时间格式 xxxx-xx-xx xx:xx:xx
 * @param {*} date 
 */
function formatDate(d = new Date()) {
  const date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes()  + ':' + d.getSeconds();

  return date;
}

// 云函数入口函数
exports.main = async (event) => {
  // const wxContext = await cloud.getWXContext()
  const db = cloud.database();

  switch (event.action) {
    case 'initPlan': {
      return await initPlan(event, db)
    }
    case 'update_plan': {
      return await updatePlan(event, db)
    }
    case 'getPlanInfo': {
      // 从数据库获取plan数据
      return await getPlanInfo(event, db)
    }
    case 'get_today_plan': {
      // 从数据库获取plan数据
      return await get_today_plan(event, db)
    }
    case 'delPlan': {
      return await delPlan(event, db);
    }
    case 'addPlan': {
      return await addPlan(event, db);
    }
    case 'setUserInfo': {
      return setUserInfo(event, db);
    }
    case 'chanPlangress': {
      return chanPlangress(event, db);
    }
    case 'editPlan': {
      return editPlan(event, db);
    }
    default: {
      return
    }
  }
}







/**
 * 初始化plan数据格式
 * @param event 
 * @param db 
 */
async function initPlan(event, db) {

  return dbPlan.add({
    data: plan
  }).then(res => {
    plan._id = res._id;

    return { plan, msg: 1 };
  }).catch(err => {
    return { msg: 0 }
  })
}


/**
 * 更新数据
 * @param {*} event 
 * @param {*} db 
 */
async function updatePlan(event, db) {
  return db.collection('plan').where({
    openid: event.openid
  })
    .update({
      data: {
        update_time: event.update_time
      }
    })
    .then(res => {
      if (res.stats.updated != 1) return { msg: 0 }
      return { msg: 1 }
    })
    .catch(err => {
      return { msg: 0 }
    })
}

/**
 * 获取plan数据
 * @param event - {open_id}
 */
async function getPlanInfo(event, db) {
  const open_id = event.open_id;

  // 查询计划
  return db.collection('plan').where({
    open_id,
  }).get().then(res => {
    let plan = {};

    if (res.data.length > 0) {
      plan = res.data[0];
    } else {
      // 数据库不存在数据 进行初始化
      // -> 初始化数据
      
      plan = {
        open_id,        // openid String
        list: [],                     // 计划列表
        create_time: new Date().getTime(),    // 生成时间 Date
        update_time: new Date().getTime(),    // 更新时间 Date
      }

      db.collection('plan').add({
        data: plan
      });
    }
    
    return {
      code: '1',
      message: '获取成功',
      data: { plan },
    }
  })
}

/**
 * 获取"我的一天"数据
 * @param event - { open_id }
 */
async function get_today_plan(event, db) {
  const open_id = event.open_id;

  return db.collection('today_plan').where({
    open_id
  }).get().then(res => {
    let todayPlan = {};

    // 如果不存在数据库，使用定义好的模板初始化数据
    if (res.data.length > 0) {
      todayPlan = res.data[0];
    } else {
      // 数据库不存在数据 
      // -> 初始化数据
      todayPlan = todayPlanInit;
      todayPlan.open_id = open_id;

      db.collection('today_plan').add({
        data: todayPlan
      });
    }

    return {
      code: '1',
      message: '获取成功',
      data: { today_plan: todayPlan },
    }
  })
}

/**
 * 删除计划
 * @param {*} event 
 */
async function delPlan(event, db) {
  const dbPlan = db.collection('plan');
  const _ = db.command;

  return dbPlan.where({
    openid: event.openid
  })
    .get()
    .then(res => {
      if (res.data.length == 0 || !event.id) return { msg: 0 }

      let progress = 0;   // today_list完成的数量
      let percentage = 0;   // 每日任务进度百分比
      
      res.data[0].today_list.forEach(item => {
        if (item.id == event.id) {
          if (item.finish == 1) {
            progress = res.data[0].progress - 1;
          } else {
            progress = res.data[0].progress;
          }
          return;
        }
      })

      if (progress < 0) progress = 0;

      if ((res.data[0].total - 1) == 0) percentage = 0;
      else percentage = parseInt(progress / (res.data[0].total - 1) * 100);

      return dbPlan.where({
        openid: event.openid
      }).update({
          data: {
            total: _.inc(-1),
            progress,
            percentage,
            today_list: _.pull({ id: event.id })
          }
        })
        .then(res => {
          if (res.stats.updated != 1) return { msg: 0 }

          return { msg: 1 }
        })
        .catch(err => {
          return { msg: 0 }
        })
    })
    .catch(err => {
      return { msg: 0 };
    })
}

/**
 * 改变计划进度
 * @param { Object } event [id, openid, value -> boolean]
 */
async function chanPlangress(event, db) {
  return db.collection('plan').where({
    openid: event.openid
  })
    .get()
    .then(res => {
      if (res.data.length == 0 || !event.id || !event.openid || event.value == null) {
        return { msg: 0 }
      }
      
      const today_list = res.data[0].today_list;
      const data = res.data[0];

      if (event.value) {
        data.progress += 1;
        data.percentage = parseInt(data.progress / data.total * 100);
      } else if (data.percentage != 0) {
        data.progress -= 1;
        data.percentage = parseInt(data.progress / data.total * 100);
      }

      today_list.forEach((item, index) => {
        if (item.id == event.id) {
          today_list[index].finish = event.value ? 1 : 0;
          return;
        }
      });


      return db.collection('plan').where({
        openid: event.openid
      }).update({
        data: {
          progress: data.progress,
          percentage: data.percentage,
          today_list
        }
      }).then(res => {
        if (res.stats.updated != 1) return { msg: 0 }

        return { msg: 1 }
      }).catch((err) => {
        return { msg: 0 }
      })
    })
    .catch((err) => {
      return { msg: 0 }
    })
}

/**
 * 修改计划
 * @param event (title、detail、id)
 * @param  db 
 */
async function editPlan(event, db) {
  return db.collection('plan')
    .where({
      openid: event.openid
    })
    .get()
    .then(res => {
      if (res.data.length == 0 || !event.title || !event.id) return { msg: 0 }

      const today_list = res.data[0].today_list;
      let isSame = 0;

      today_list.forEach((item, index) => {
        if (item.id == event.id) {
          if ((today_list[index].title == event.title) && (today_list[index].detail == event.detail)) {
            isSame = 1;   // 判断传递的标题、详情是否和数据库里数据相同
            return;
          }

          today_list[index].title = event.title;
          today_list[index].detail = event.detail;

          return;
        }
      })

      if (isSame == 1) return { msg: 1 }

      return db.collection('plan')
        .where({
          openid: event.openid
        })
        .update({
          data: {
            today_list
          }
        })
        .then(res => {
          if (res.stats.updated != 1) return { msg: 0 }

          return { msg: 1 }
        })
        .catch(err => {
          return { msg: 0 }
        })
    })
    .catch(err => {
      return { msg: 0 }
    })
}

/**
 * 新增每日计划
 * @param {*} event (title、detail)
 * @param {*} db 
 * @param {*} context 
 */
async function addPlan(event, db) {
  const dbPlan = db.collection('plan');
  const _ = db.command;

  return dbPlan.where({
    openid: event.openid
  })
    .get()
    .then(res => {
      const today_list = res.data[0].today_list;
      const item = {};
      
      if (res.data[0].total > 0) {
        item.id = today_list[today_list.length - 1].id + 1;
      } else {
        item.id = 1;
      }
      item.finish = 0;
      item.title = event.title;
      item.detail = event.detail;

      return dbPlan.where({
        openid: event.openid
      })
        .update({
          data: {
            total: _.inc(1),
            percentage: parseInt(res.data[0].progress / (res.data[0].total + 1) * 100),
            today_list: _.push(item)
          }
        }).then(res => {

          if (res.stats.updated != 1) return { msg: 0 }

          return { msg: 1 }
        }).catch(err => {

          return { msg: 0 }
        })
      })
    .catch((err) => {
      return { msg: 0 }
    })
}

/**
 * 保存用户信息
 * @param {*} event 
 * @param {*} db 
 */
async function setUserInfo(event, db) {
  return db.collection('user_info').where({
    openid: event.openid
  })
    .get()
    .then(res => {
      
      if (res.data.length == 0) {
        const userInfo = event.userInfo;
        const date = formatDate();

        if (!userInfo || Object.keys(userInfo).length == 0) return;

        userInfo.openid = event.openid;
        userInfo.create_time = date;

        db.collection('user_info').add({
          data: userInfo
        }).then(res => {
      
          userInfo._id = res._id;
          return { msg: 1 }
        }).catch(err => {
          return { msg: 0 }
        })
      }
    })
    .catch(err => {
    })
}
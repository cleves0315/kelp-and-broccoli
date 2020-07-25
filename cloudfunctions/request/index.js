// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event) => {
  // const wxContext = await cloud.getWXContext()
  const db = cloud.database();

  switch (event.action) {
    case 'getPlanInfo': {
      return await getPlanInfo(event, db)
    }
    case 'delPlan': {
      return await delPlan(event, db);
    }
    case 'addPlan': {
      return await addPlan(event, db);
    }
    case 'getOpenData': {
      return getOpenData(event)
    }
    default: {
      return
    }
  }
}

/**
 * 获取plan数据
 * @param event 
 */
async function getPlanInfo(event, db) {
  const dbPlan = db.collection('plan')

  return dbPlan.where({
    openid: event.openid
  })
  .get()
  .then(res => {
    console.log(res)
    return res.data[0]
  })
}

/**
 * 删除计划
 * @param {*} event 
 * @param {*} db 
 * @param {*} context 
 */
async function delPlan(event, db) {
  const dbPlan = db.collection('plan');
  const delId = event.id;
  const _ = db.command;

  dbPlan.where({
    openid: event.openid
  })
    .get()
    .then(res => {
      console.log(res.data);

      const progress = res.data[0].total - 1 == 0 ? 0 : res.data[0].progress;
      const percentage = parseInt(res.data[0].progress / (res.data[0].total - 1) * 100);

      dbPlan.where({
        openid: event.openid
      }).update({
          data: {
            total: _.inc(-1),
            progress:  progress,
            percentage: percentage || 0,
            list: _.pull({ id: delId })
          }
        })
    })
}

/**
 * 新增计划
 * @param {*} event 
 * @param {*} db 
 * @param {*} context 
 */
async function addPlan(event, db) {
  const dbPlan = db.collection('plan');
  const front = event.data;
  const _ = db.command;

  dbPlan.doc(event._id)
    .get()
    .then(res => {
      console.log(res.data)
      const list = res.data.list;
      
      if (res.data.total > 0) {
        front.id = list[list.length - 1].id + 1;
      } else {
        front.id = 1;
      }

      dbPlan.doc(event._id).update({
        data: {
          total: _.inc(1),
          percentage: parseInt(res.data.progress / (res.data.total + 1) * 100),
          list: _.push(front)
        }
      })
    })
}
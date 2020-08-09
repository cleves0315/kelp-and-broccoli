// 云函数入口文件
const cloud = require('wx-server-sdk')

/**
 * 格式化时间格式 xxxx-xx-xx xx:xx:xx
 * @param {*} date 
 */
function formatDate(d) {
  const date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes()  + ':' + d.getSeconds();

  console.log(date)
  return date;
}

// 云函数入口函数
exports.main = async (event) => {
  // const wxContext = await cloud.getWXContext()
  const db = cloud.database();

  cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV,
    timeout: event.timeout || 15000
  })

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
    case 'setUserInfo': {
      return setUserInfo(event, db);
    }
    case 'chanPlangress': {
      return chanPlangress(event, db);
    }
    default: {
      return
    }
  }
}

/**
 * 获取plan数据
 * @param event - {openid}
 */
async function getPlanInfo(event, db) {
  const dbPlan = db.collection('plan')

  return dbPlan.where({
    openid: event.openid
  })
  .get()
  .then(res => {
    console.log(res)

    if (res.errMsg.includes('ok')) {

      if (res.data.length > 0) return { plan: res.data[0], msg: 1 }

      // 数据库不存在数据
      const plan = {
        day: 1,
        list: [],
        openid: event.openid,
        percentage: 0,
        progress: 0,
        total: 0
      }

      return dbPlan.add({
        data: plan
      }).then(res => {
        console.log(res);
        plan._id = res._id;

        return { plan, msg: 1 };
      }).catch(err => {
        console.log(err);
        return { msg: 0 }
      })
    } else {
      return { msg: 0 }
    }
  })
}

/**
 * 删除计划
 * @param {*} event 
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
 * 改变计划进度
 */
async function chanPlangress(event, db) {
  if (!event.id || !event.openid || event.value == null) {
    return { msg: 0 }
  }

  return db.collection('plan').where({
    openid: event.openid
  })
    .get()
    .then(res => {
      console.log(res)
      
      if (res.errMsg.includes('ok')) {
        const list = res.data[0].list;
        const data = res.data[0];

        if (event.value) {
          data.progress += 1;
          data.percentage = parseInt(data.progress / data.total * 100);
        } else if (data.percentage != 0) {
          data.progress -= 1;
          data.percentage = parseInt(data.progress / data.total * 100);
        }

        list.forEach((item, index) => {
          if (item.id == event.id) {
            list[index].finish = event.value ? 1 : 0;
            return;
          }
        });

        console.log(list)

        return db.collection('plan').where({
          openid: event.openid
        }).update({
          data: {
            progress: data.progress,
            percentage: data.percentage,
            list 
          }
        }).then(res => {
          console.log(res)
          return { msg: 1 }
        }).catch((err) => {
          console.log(err)
          return { msg: 0 }
        })
      } else {
        return { msg: 0 }
      }
    })
    .catch(() => {
      return { msg: 0 }
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

/**
 * 保存用户信息
 * @param {*} event 
 * @param {*} db 
 */
async function setUserInfo(event, db) {
  const userInfo = event.userInfo;
  const date = formatDate(new Date());

  userInfo.openid = event.openid;
  userInfo.date = date;

  db.collection('userinfo').add({
    data: userInfo
  }).then(res => {
    console.log(res)

    if (!res.errMsg.includes('ok')) return { msg: 0 }

    userInfo._id = res._id;
    return { msg: 1 }
  }).catch(err => {
    console.log(err)
  })
}
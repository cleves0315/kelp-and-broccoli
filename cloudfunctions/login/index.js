const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  timeout: 10000
})

const userInit = {
  day: 1,        // 天数 Number
  open_id: '',       // openid String
  create_time: new Date().getTime(),   // 生成时间 Number
  update_time: new Date().getTime(),   // 更新时间 Number
};

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const db = cloud.database();

  try {
    const { data } = await queryUserInfo(db, { 
      open_id: wxContext.OPENID
    });

    if (data.length > 0) {      
      updateNewOneDay(db, data[0]);
      return {
        code: '1',
        message: 'ok',
        data: data[0]._id
      }
    }

    // 数据库不存在该用户
    // 生成用户信息模板
    await addUsers(db, {
      ...userInit,
      open_id: wxContext.OPENID
    })
    const { data: users } = await queryUserInfo(db, { 
      open_id: wxContext.OPENID
    });

    return {
      code: '1',
      message: 'ok',
      data: users[0]._id
    }
  } catch (error) {
    return {
      code: '0',
      message: '登陆失败',
      data: null
    }
  }
}

/**
 * 对比时间，更新天数
 */
const updateNewOneDay = (db, user) => {
  const _ = db.command;
  const today = new Date();
  const updateTime = new Date(user.update_time);

  // 如果在新的一天登录，天数加1
  if (today.getDate() !== updateTime.getDate() 
    || today.getMonth() !== updateTime.getMonth() 
    || today.getFullYear() !== updateTime.getFullYear()) {

    db.collection('user_info')
      .where({ 
        _id: user._id || ''
      })
      .update({
        data: {
          day: _.inc(1),
          update_time: today.getTime(),
        }
      });
  }
}

const queryUserInfo = (db, params) => {
  return db.collection('user_info').where(params).get()
}

const addUsers = (db, users) => {
  return db.collection('user_info').add({
    data: users
  })
}
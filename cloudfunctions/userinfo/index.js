// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  timeout: 10000
})

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database();
  const { data } = await queryUserInfo(db, event.user_id);

  if (data.length > 0) {
    return {
      code: '1',
      data: data[0],
      message: '获取成功',
    };
  }

  return {
    code: '0',
    data: null,
    message: '获取用户信息失败',
  };
}

const queryUserInfo = (db, user_id) => {
  return db.collection('user_info')
    .where({ 
      _id: user_id || ''
    }).get()
}
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  timeout: 10000
})

// 云函数入口函数
exports.main = async (event, context) => {
  let user = {};
  const db = cloud.database();

  // 查询是否用户是否第一次创建
  return db.collection('user_info').where({
    _id: event.user_id,
  }).get().then(res => {
    if (res.data.length > 0) {
      user = res.data[0];

      const today = new Date();
      const updateTime = new Date(user.update_time);

      // 如果在新的一天登录，天数加1
      if (today.getDate() !== updateTime.getDate() 
        || today.getMonth() !== updateTime.getMonth() 
        || today.getFullYear() !== updateTime.getFullYear()) {
        user.day += 1;
        user.update_time = today.getTime();

        db.collection('user_info')
          .where({ 
            open_id: event._id
          })
          .update({
            data: {
              day: user.day,
              update_time: user.update_time,
            }
          });
      }

      return {
        code: '1',
        data: user,
        message: '获取成功',
      };
    }

    return {
      code: '0',
      data: null,
      message: '获取用户信息失败',
    };
  });
}
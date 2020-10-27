// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  // env: cloud.DYNAMIC_CURRENT_ENV,
  env: 'test-7t28x',
  timeout: 10000
})

// 云函数入口函数
exports.main = async (event, context) => {
  let user = {};
  const db = cloud.database();
  // const wxContext = cloud.getWXContext();  

  // 查询是否用户是否第一次创建
  return db.collection('user_info').where({
    open_id: event.open_id,
  }).get().then(res => {
    console.log(res);

    if (res.data.length > 0) {
      console.log('获取到用户信息');
      user = res.data[0];

      const today = new Date();
      const updateTime = new Date(user.update_time);

      // 如果在新的一天登录，天数加1
      if (today.getDate() !== updateTime.getDate() 
        || today.getMonth() !== updateTime.getMonth() 
        || today.getFullYear() !== updateTime.getFullYear()) {
        user.day += 1;
        user.update_time = today.getTime();
      }
    } else {
      console.log('数据库不存在该用户');
      // 数据库不存在该用户

      // 生成用户信息模板
      user = {
        day: 1,        // 天数 Number
        open_id: event.open_id,       // openid String
        create_time: new Date().getTime(),   // 生成时间 Number
        update_time: new Date().getTime(),   // 更新时间 Number
      };

      // 第一次生成用户信息存入数据库
      db.collection('user_info').add({
        data: user
      }).then(res => {
        console.log(res);
      }).catch(err => {
        console.log(err);
      });
    }

    return {
      code: '1',
      message: 'ok',
      data: {
        user,
      },
    };

  });
}
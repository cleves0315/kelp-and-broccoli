// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

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


/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 * 
 * event 参数包含小程序端调用传入的 data
 * 
 */
exports.main = async (event, context) => {

  // 可执行其他自定义逻辑

  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）等信息
  const wxContext = cloud.getWXContext();
  const db = cloud.database();

  try {
    const { data } = await db.collection('user_info').where({
      open_id: wxContext.OPENID,
    }).get();

    if (data.length > 0) {
      return {
        code: '1',
        message: 'ok',
        data: data[0]._id
      }
    }

    // 数据库不存在该用户
    // 生成用户信息模板
    user = {
      ...userInit,
      open_id: wxContext.OPENID
    };
    await db.collection('user_info').add({
      data: user
    })
    const { data: users } = await db.collection('user_info').where({
      open_id: wxContext.OPENID,
    }).get();

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


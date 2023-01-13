// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'on-line-1gqban3ba49e3d35',
  timeout: 10000
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database();
  const _ = db.command;

  db.collection('plan_list')
    .where({
      _id: _.exists(true)
    })
    .update({
      data: {
        'stepList': _.rename('step_list')
      }
    });
}
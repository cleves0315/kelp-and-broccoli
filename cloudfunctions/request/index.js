// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database();

  switch (event.action) {
    case 'getPlanInfo': {
      return getPlanInfo(event, db, wxContext)
    }
    case 'getUserInfo': {
      
    }
    case 'addPlan': {
      return addPlan(event, db, wxContext);
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
async function getPlanInfo(event, db, context) {
  const dbPlan = db.collection('plan')

  return dbPlan.where({
    openid: context.OPENID
  })
  .get()
  .then(res => {
    console.log(res)
    return res.data[0]
  })

}

async function addPlan(event, db, context) {
  const dbPlan = db.collection('plan');
  const _ = db.command;

  db.collection('plan').doc(event['_id']).update({
    data: {
      total: _.inc(1),
      
    },
    success: function(res) {
      console.log(res)
    }
  })
}
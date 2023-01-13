// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'on-line-1gqban3ba49e3d35',  // 指定运行环境
  timeout: 10000
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  pushMessage();
//   resetPlan();
}

/**
 * 数据结构更新
 */
const resetPlan = async (db) => {
    const { data } = await db.collection("plan_list").where({}).get();
    const { data: userList } = await db.collection("user_info").where({}).get();
    const userIdMap = {}; // open_id 映射 _id
  
    userList.forEach((user) => {
      userIdMap[user.open_id] = user._id;
    });
  
    // 给所有计划插入 plan_no、user_id 字段
    data.forEach((plan, index) => {
      const obj = {};
  
      if (!plan.plan_no) {
        obj.plan_no = uuidv4();
      }
  
      if (!plan.user_id) {
        obj.user_id = userIdMap[plan.open_id];
      }
  
      if (!plan.plan_no || !plan.user_id) {
        db.collection("plan_list")
          .doc(plan._id)
          .update({
            data: { ...obj },
          });
      }
    });
};

/**
 * 推送消息
 * @param {*} open_id 用户openid
 * @param {*} templateId 模板id
 * @param {*} title 模板标题
 */
async function pushMessage() {
  const date = new Date();
  const y = date.getFullYear();
  const m = date.getMonth()+1;
  const d = date.getDate();
  const h = date.getHours();
  const mi = date.getMinutes();
  const db = cloud.database();


  // 获取当前时间 分钟整数的时间戳(不计算秒数)
  const time = new Date(`${y}-${m}-${d} ${h}:${mi}:00`).getTime();
  // 消息模板id
  const templateId = '-FvQTHPeMgBee2OaO_-BP3j_KeMBsJIeL-H4Qs9X1cE';

  db.collection('plan_list')
    .where({
      remind_time: time,
      is_finish: false
    })
    .field({
      open_id: true,
      title: true,
      detail: true
    })
    .get()
    .then(res => {
      const list = res.data;

      try {
        list.forEach(item => {
          // 进行消息推送
          cloud.openapi.subscribeMessage.send({
            touser: item.open_id,
            page: '/pages/home/home',
            data: {
              thing1: {  // 计划名称
                value: item.title
              },
              thing5: {   // 备注 只能20字符
                value: '计划提醒'
              }
            },
            templateId,
            miniprogramState: 'developer'
          })
        });
      } catch (err) {
        return err
      }
    });
}

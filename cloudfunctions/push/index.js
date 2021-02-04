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
}

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

  // const result = await cloud.openapi.subscribeMessage.send({
  //   touser: 'on0Xn5aDFQNoircJEtVF90QIyqss',
  //   page: '/pages/home/home',
  //   data: {
  //     thing1: {  // 计划名称
  //       value: '测试定时'
  //     },
  //     thing5: {   // 备注
  //       value: '123'
  //     }
  //   },
  //   templateId: '-FvQTHPeMgBee2OaO_-BP3j_KeMBsJIeL-H4Qs9X1cE',
  //   miniprogramState: 'developer'
  // })

  // console.log(result)
  console.log(`time: ${time}`);

  db.collection('plan_list')
    .where({
      remind_time: time,
    })
    .field({
      open_id: true,
      title: true
    })
    .get()
    .then(res => {
      const list = res.data;

      console.log(res)
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
              thing5: {   // 备注
                value: '123'
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

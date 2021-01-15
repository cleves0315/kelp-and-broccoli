// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'on-line-1gqban3ba49e3d35',
  timeout: 10000
})



/**
 * 初始化plan_list
 * @param {Object} options 
 */
function init_plan_list(options) {
  const data = {
    open_id: options.open_id,
    title: options.title.trim(), 
    detail: options.detail || '', 
    is_finish: false,        
    create_time_applets: options.create_time_applets || 0, 
    create_time: new Date().getTime(),
    update_time: new Date().getTime(),
    organize: options.organize || 'normal',
    closing_date: options.closing_date || 0,
    stepList: options.stepList || [],
    repeat: options.repeat || {},
  }

  return data;
}


// 云函数入口函数
exports.main = async (event) => {
  const db = cloud.database();
  
  switch (event.action) {
    case 'get_plan_list':
      return await get_plan_list(event, db);
    case 'add_plan_list':
      return await add_plan_list(event, db);
    case 'update_plan_list':
      return await update_plan_list(event, db);
    case 'delete_plan_list':
      return await delete_plan_list(event, db);
    case 'finish_plan_list':
      return await finish_plan_list(event, db);
    case 'mytoday_back_image':
      return await mytoday_back_image(event, db);
  }
}


/**
 * 获取计划数据
 */
async function get_plan_list(event, db) {
  const openId = event.open_id;

  if (!openId || openId[0] === '"') {
    return {
      code: '0',
      message: '获取失败'
    }
  }

  return db.collection('plan_list').where({
    open_id: openId
  }).get().then(res => {
    const planList = res.data;

    

    return {
      planList,
      code: '1',
      message: '获取成功',
    };
  })
}


/**
 * 添加计划 
 * @param {Array} plan_list {open_id*, title*, detail, organize*, closing_date}
 * @returns 带_id plan_list
 */
async function add_plan_list(event, db) {
  let planList = event.plan_list;

  if (!planList || planList.length === 0) {
    return {
      code: '0',
      message: '添加失败'
    }
  }


  
  const addList = [];
  planList.forEach(item => {
    if (item['open_id']) {
      const data = init_plan_list(item);
      addList.push(data);
    }
  });
      
  if (addList.length > 0) {
    return db.collection('plan_list')
      .add({ data: addList })
      .then(res => {
        console.log(res);
        res._ids.forEach((item, index) => {
          addList[index]['_id'] = item;
        });

        return {
          code: '1',
          message: '添加成功',
          add_list: addList
        };
      });
  } else {
    return {
      code: '0',
      message: '添加失败',
    };
  }
}


/**
 * 修改更新计划
 * @param {Array} plan_list {open_id*, title*, detail, organize*, closing_date}
 * @returns 更新成功值【数组】(未更新成功不在返回值里)
 */
async function update_plan_list(event, db) {
  const planList = event.plan_list;

  if (!planList || planList.length === 0) {
    return {
      code: '0',
      message: '更新失败'
    };
  }

  
  return new Promise((resolve) => {
    let returnData = []; 
    planList.forEach((item, index) => {
      if (item['_id']) {
        delete item['notUpdated'];
        item.update_time = new Date().getTime();
  
        let data = JSON.stringify(item);
        data = JSON.parse(data);
  
        delete data['_id'];
    
        db.collection('plan_list')
          .doc(item._id)
          .update({ data })
          .then(res => {
            if (res.stats.updated === 1) {
              returnData.push(item);
            }
    
            if (index === planList.length - 1) {
              resolve(returnData);
            }
          });
      } else {
        if (index === planList.length - 1) {
          resolve(returnData);
        }
      }
    });
  }).then((returnData) => {
    if (returnData.length > 0) {
      return {
        code: '1',
        message: '更新成功',
        data: returnData
      };
    } else {
      return {
        code: '0',
        message: '更新失败',
      };
    }
  });

}


/**
 * 删除计划
 * @param {*} ids 删除的数据列表
 */
async function delete_plan_list(event, db) {
  const _ = db.command;
  const ids = event.ids;

  if (!ids) {
    return {
      code: '0',
      message: '删除失败，没有传递id'
    }
  } 

  try {
    return db.collection('plan_list').where({
      _id: _.in(ids)
    }).remove()
      .then(() => {
        return {
          code: '1',
          message: '删除成功'
        }
      });
  } catch(e) {
    console.log(e)
    return {
      code: '0',
      message: '删除失败le'
    }
  }
}


/**
 * 完成计划
 * @return updated_list: 更新成功的数据
 * @return create_list: 更新成功后重复新生成的数据
 */
async function finish_plan_list(event, db) {
  const planList = event.plan_list;

  if (!planList) {
    return {
      code: '0',
      message: '更新失败'
    }
  }


  try {
    const updatedList = [];   // 更新成功的数据
    const createList = [];  // 完成计划后，新生成的数据

    return new Promise((resolve) => {

      planList.forEach((item, index) => {
  
        item['update_time'] = new Date().getTime();
        
  
        db.collection('plan_list')
          .doc(item['_id'])
          .get()
          .then(res => {
            const plan = res.data;

            // 对有重复计划，生成一次性下个截止日期的计划
            if (item.is_finish && plan.repeat && plan.repeat['finished'] === 0) {
              const newPlan = JSON.parse(JSON.stringify(item));
    
              const obj = {
                'day': (options) => {
                  const base = options.repeat.base;
                  const closingDate = options.closing_date;
                  
                  newPlan.closing_date = closingDate + 86400000 * base;
                  newPlan.repeat.week_value[0] = new Date(newPlan.closing_date).getDay();
                  newPlan.repeat.finished = 0;
                },
                'week': (options) => {

                  const base = options.repeat.base;
                  const closingDate = options.closing_date;
                  const weekValue = options.repeat.week_value;
                  
                  let closing = 0;
                  let week = new Date(closingDate).getDay();
                  let clsYear = new Date(closingDate).getFullYear();
                  let clsMonth = new Date(closingDate).getMonth() + 1;
                  let clsDay = new Date(closingDate).getDate();
    
                  
                  if (weekValue.length > 1) {

                    let diffDay = 0;
                    if (week !== 0) {
                      weekValue.some((d, i, arr) => {
                        if (week === d) {
                          if (i !== (arr.length-1)) {
                            diffDay = arr[i + 1] - d;
                          } else {
                            // '重复周的最后一天'到周日的天数 + 周日到'重复周第一天'的天数
                            diffDay = (7 - d) + (arr[0] - 0);
                          }
                          return true;
                        }
                      });
                    } else {
                      diffDay = 7 - weekValue[1];
                    }

                    clsDay += diffDay;

                  } else {
                    clsDay += base * 7;
                  }
                  
                  closing = new Date(`${clsYear}-${clsMonth}-${clsDay}`).getTime();

                  newPlan.closing_date = closing;
                  newPlan.repeat.finished = 0;
                },
                'month': (options) => {
                  let closing = 0;
    
                  const base = options.repeat.base;
                  const closingDate = options.closing_date;
    
                  let clsYear = new Date(closingDate).getFullYear();
                  let clsMonth = new Date(closingDate).getMonth() + 1 + base;
                  let clsDay = new Date(closingDate).getDate();
                  let clsWeek = 0;
    
                  if (clsMonth > 12) {
                    clsYear += parseInt(clsMonth / 12);
                    clsMonth = clsMonth % 12;
                  }
    
                  closing = new Date(`${clsYear}-${clsMonth}-${clsDay}`).getTime();
    
                  while (new Date(closing).getMonth()+1 !== clsMonth) {
                    closing = new Date(closing - 86400000).getTime();
                  }
    
                  clsWeek = new Date(closing).getDay();
    
                  newPlan.closing_date = closing;
                  newPlan.repeat.week_value[0] = clsWeek;
                  newPlan.repeat.finished = 0;
                },
                'year': (options) => {
                  let closing = 0;
    
                  const base = options.repeat.base;
                  const closingDate = options.closing_date;
    
                  const clsYear = new Date(closingDate).getFullYear() + base;
                  const clsMonth = new Date(closingDate).getMonth() + 1;
                  const clsDay = new Date(closingDate).getDate();
                  let clsWeek = 0;
    
                  closing = new Date(`${clsYear}-${clsMonth}-${clsDay}`).getTime();
    
                  while (new Date(closing).getMonth()+1 !== clsMonth) {
                    closing = new Date(closing - 86400000).getTime();
                  }
    
                  clsWeek = new Date(closing).getDay();
    
                  newPlan.closing_date = closing;
                  newPlan.repeat.week_value[0] = clsWeek;
                  newPlan.repeat.finished = 0;
                },
              };
    
              // 变更值 截止日期
    
              obj[item.repeat.type](item);
              createList.push(init_plan_list(newPlan));
      
              item.repeat['finished'] = 1;
            }
      
            delete item['tobeFinish'];
            delete item['notUpdated'];
            const data = JSON.parse(JSON.stringify(item));
            delete data['_id'];
      
            db.collection('plan_list')
              .doc(item['_id'])
              .update({ data })
              .then(res => {
                if (res.stats.updated === 1) {
                  updatedList.push(item);
    
                }
                if (index === planList.length-1) resolve();
              });
          }).catch(err => {
            console.log(err);
            if (index === planList.length-1) resolve();
          })
  
      });

    }).then(() => {

      if (createList.length > 0) {
        return db.collection('plan_list')
          .add({ data: createList })
          .then(res => {
            res._ids.forEach((item, index) => {
              createList[index]['_id'] = item;
            });

            return {
              code: '1',
              message: '更新成功',
              data: {
                updated_list: updatedList,
                create_list: createList,
              }
            }
          });
      } else {
        return {
          code: '1',
          message: '更新成功',
          data: {
            updated_list: updatedList,
            create_list: [],
          }
        }
      }

    });

  } catch (err) {
    return {
      code: '0',
      message: '操作失败'
    }
  }
}

/**
 * 获取my-plan计划列表背景图
 */
async function mytoday_back_image(event, db) {
  return db.collection('resources')
    .where({
      logo: 'today_back'
    })
    .get()
    .then(res => {
      return {
        code: '1',
        message: '1',
        url: res.data[0].url
      }
    })
    .catch(err => {
      console.log(err);
      return {
        code: '0',
        message: '获取失败'
      }
    })
    
}

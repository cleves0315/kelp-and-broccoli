/**
 * callFunction API封装
 * @param { Object } options 
 */
function callFunction(options) {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: options.name,
      data: options.data,
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 查看授权
 * @param scoped 授权scoped码
 */
function getAuthGetting(scoped) {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: res => {
        if (res.authSetting[scoped]) {
          resolve();
        } else {
          reject();
        }
      }
    })
  });
}

/**
 * 函数节流
 * @param {*} fn 
 * @param {*} interval 
 */
function throttle(fn, interval = 300) {
  let canRun = true;
  return function () {
      if (!canRun) return;
      canRun = false;
      setTimeout(() => {
          fn.apply(this, arguments);
          canRun = true;
      }, interval);
  };
}


/**
 * 获取iphoneX
 * @returns 1, 0
 */
function judgeIphoneX() {
  const res = wx.getSystemInfoSync();

  console.log(res)

  const model = res.model;

  if (model.search('iPhone X') != -1 || model.search('iPhone 11') != -1) {
    return 1;
  }

  return 0;
}


/**
 * 初始化当月日历数据 (没有参数默认当天)
 * @method
 * @param {Date} date
 * @param {Number} line 日历中显示几行
 * @returns [[{},{}...],[{},{}...]]
 */
function initMonthCalendar(dates, line = 6) {
  var date = new Date(dates);                          // 初始时间格式
  var y = date.getFullYear();
  var m = date.getMonth();
  var days = new Date(y, m + 1, 0).getDate();          // 获取这个月共有多少天
  var firstDayWeek = new Date(y, m, 1).getDay();       // 月份第一天星期几


  var arr = [];     // 存储日历格式的数组
  var n = [];       // 日历格式中的一行
  var d = 1;        // 日历格式中的天数

  // 先根据这个月第一天排星期几
  // 把上个月剩下几天留在这个月的'奸细'放在最前头
  for(let i = 0; i < firstDayWeek; i++) {
    // new Date(2020, 8, 0)   --> 9月没有0号 === 8月31
    var obj = {};
    obj.day = new Date(y, m, 0 - i).getDate();
    obj.type = 'last';           // 上个月日期，我设置 last 类型
    n.unshift(obj);
  }

  // 开启循环
  // 一星期占一行，一行一个外循环
  // 这里我默认想要6行
  for (let j = 0; j < line; j++) {
    // 一天占一个格子，最多一星期7个格子
    // 这里我想要7个格子
    for (let i = 0; i < 7; i++) {
      var obj = {};    // 每一天日期格式 { day: 1, type: '' }

      if(d > days) {
        // 这个月都放完了，该放什么？
        // new Date(2020, 8, 31)  --> 9月没有31 === 10月1
        obj.day = new Date(y, m, d++).getDate();
        obj.type = 'next';       // 下个月日期，我设置 next 类型
      } else {
        // 放置这个月的天数
        obj.day = d++;
        obj.type = 'this';      // 这个月日期，我设置 this 类型
      }

      n.push(obj);

      if (n.length == 7) break;    // 放了7个格子该结束了
    }

    arr.push(n);
    n = [];           // 这一行放完了，清空ba
  }


  return arr;
}




module.exports = {
  throttle,
  callFunction,
  getAuthGetting,
  judgeIphoneX,
  initMonthCalendar
}
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

  const model = res.model;

  if (model.search('iPhone X') != -1 || model.search('iPhone 11') != -1) {
    return 1;
  }

  return 0;
}


/**
 * 生成随机码 
 * @return string
 */
function drawCode() {
  const a = [
    'a', 'b', 'c', 'd', 'e', 
    'f', 'g', 'h', 'i', 'j',
    'k', 'l', 'm', 'n', 'o',
    'p', 'q', 'r', 's', 't',
    'u', 'v', 'w', 'x', 'y',
    'z',
  ];

  let s = '';
  let drawNum = 0;
  
  for (let i = 0; i < 5; i++) {
    drawNum = parseInt(Math.random() * a.length);

    if (i % 2 !== 0) {
      s += a[drawNum].toLocaleUpperCase();
    } else {
      s += a[drawNum];
    }
  }

  s += new Date().getTime();

  return s;
}

/**
 * 根据参数，从大到小排序数组
 * @param {*} arr 数组 [{},{}]
 * @param {*} param 参数
 */
function sortArrayMax(list, param) {
  const arr = [];
  const num = list.length;

  if (list.length === 0) {
    return [];
  }

  for (let i = 0; i < num; i++) {

    let isMax = 0;
    
    for (let j = 0; j < arr.length; j++) {
      if (list[0][param] > arr[j][param]) {
        arr.splice(j, 0, list.shift());
        isMax = 1;
        break;
      }
    
    }
    if (!isMax) arr.push(list.shift());

  }

  return arr;
}

/**
 * 显示指定时间的小时和分钟数
 * @return string '00:00'
 */
function showHourseAndMinute(date) {
  let hourse = new Date(date).getHours();
  let minute = new Date(date).getMinutes();

  if (hourse < 10) hourse = '0'+hourse;
  else hourse = ''+hourse;
  if (minute < 10) minute = '0'+minute;
  else minute = ''+minute;

  return `${hourse}:${minute}`;
}



module.exports = {
  throttle,
  callFunction,
  getAuthGetting,
  judgeIphoneX,
  drawCode,
  sortArrayMax,
  showHourseAndMinute,
}
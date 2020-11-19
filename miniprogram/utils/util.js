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



module.exports = {
  throttle,
  callFunction,
  getAuthGetting,
  judgeIphoneX,
  drawCode,
}
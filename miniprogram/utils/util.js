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




module.exports = {
  throttle,
  callFunction,
  getAuthGetting,
  judgeIphoneX
}
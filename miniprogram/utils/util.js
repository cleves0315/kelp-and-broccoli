/**
 * callFunction API封装
 * @param options 
 */
function callFunction(options) {
  return new Promise((resolve) => {
    wx.cloud.callFunction({
      name: options.name,
      data: options.data,
      success: resolve
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




module.exports = {
  callFunction,
  getAuthGetting
}
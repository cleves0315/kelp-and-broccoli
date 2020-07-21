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
  getAuthGetting
}
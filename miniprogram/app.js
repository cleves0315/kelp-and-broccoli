//app.js
import { login } from './api/app';

App({
  canRun: true,   // 节流开关

  /**
   * 登录
   * @method
   * @returns Promise
   */
  login() {
    return new Promise((resolve, reject) => {
      if (!this.canRun) return;
    
      this.canRun = false;

      return login().then(res => {
        if (res.result.code !== '1') return;

        const openId = res.result.data.open_id;

        wx.setStorageSync('open_id', JSON.stringify(openId));
        this.canRun = true;
        resolve();
      }).catch(err => {
        this.canRun = true;
        reject();
      });
    });
  },

  onLaunch: function () {
    wx.cloud.init({
      env: 'broccoli-puuzo',  // 这里填入你的云环境ID
      traceUser: true,
      timeout: 5000
    })

    this.globalData = {}
  },

  onShow() {
    
  },

  onHide() {
    
  }
})

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
    const id = wx.getStorageSync('user_id')
    if (id) {
      this.globalData.user_id = id;
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      if (!this.canRun) return;
    
      this.canRun = false;

      return login().then(res => {
        if (res.result.code !== '1') return;

        const user_id = res.result.data;

        wx.setStorageSync('user_id', user_id);
        this.globalData.user_id = user_id;
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

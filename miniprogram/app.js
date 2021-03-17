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
      // env 参数说明：
      //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
      //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
      //   如不填则使用默认环境（第一个创建的环境）
      // env: 'on-line-1gqban3ba49e3d35',
      env: 'broccoli-puuzo',  // 测试
      traceUser: true,
      timeout: 5000
    })

    this.globalData = {}
    // wx.setStorageSync('user_info', '');
    // wx.setStorageSync('plan_list', '');
    // wx.setStorageSync('open_id', '');

    // this.login();
  },

  onShow() {
    
  },

  onHide() {
    
  }
})

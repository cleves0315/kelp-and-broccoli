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

      console.log('login');

      return login().then(res => {
        console.log(res)

        if (res.result.code !== '1') return;

        const openId = res.result.data.open_id;

        wx.setStorageSync('open_id', JSON.stringify(openId));
        resolve();
      }).catch(err => {
        console.log('登陆失败');
        console.log(err);
        reject();
      }).finally(() => {
        this.canRun = true;
      });
    });
  },

  onLaunch: function () {
    wx.cloud.init({
      // env 参数说明：
      //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
      //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
      //   如不填则使用默认环境（第一个创建的环境）
      env: 'test-7t28x',
      traceUser: true,
      timeout: 5000
    })

    this.globalData = {}


    this.login();
  },

  onShow() {
    
  },

  onHide() {
    console.log('onHide')
    
  }
})

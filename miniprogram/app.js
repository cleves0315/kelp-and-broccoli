//app.js
import { callFunction } from './utils/util';

App({
  canRun: true,   // 节流开关

  login() {
    if (!this.canRun) return;
    
    this.canRun = false;

    console.log('login')
    setTimeout(() => {
      callFunction({
        name: 'login'
      })
        .then(res => {
          console.log(res)
          wx.setStorageSync('openid', res.result.openid)
          wx.setStorageSync('userinfo', res.result.userinfo)
        })
        .catch(console.error)
        .finally(() => {
          this.canRun = true;
        })
    }, 1500);
  },

  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'broccoli-puuzo',
        traceUser: true,
      })
    }

    this.globalData = {}

    // 登陆
    this.login();
  },

  onShow() {
    if (!wx.getStorageSync('openid') || !wx.getStorageSync('userinfo')) {
      this.login();
    }
  }
})

//app.js
import { callFunction, getAuthGetting } from './utils/util';

App({
  canRun: true,   // 节流开关

  /**
   * 获取云端上plan数据, 与缓存数据对比。更新时间返回最近更新的数据
   * @returns Promise
   */
  getLatestPlan() {
    if (wx.getStorageSync('openid') == '') {
      setTimeout(() => {
        this.initPlanInfo();
      }, 500);
      return;
    }

    return new Promise((resolve) => {

      callFunction({
        name: 'request',
        data: {
          action: 'getPlanInfo',
          openid: JSON.parse(wx.getStorageSync('openid'))
        }
      }).then(res => {
        console.log(res)
  
        const data = res.result.plan;
        const plan = wx.getStorageSync('plan') && JSON.parse(wx.getStorageSync('plan'));
  
        if (data == {}) return;
  
        // 使用最新更新时间的数据
        if (plan == '' || data.update_time > plan.update_time) {
          this.globalData.plan = data;
          resolve();
        }

      })

    })
  },

  /**
   * 登录
   */
  login() {
    if (!this.canRun) return;
    
    this.canRun = false;

    console.log('login')

    callFunction({
      name: 'login'
    })
      .then(res => {
        console.log(res)
        wx.setStorageSync('openid', JSON.stringify(res.result.openid));
      })
      .catch(console.error)
      .finally(() => {
        this.canRun = true;
      })
  },

  /**
   * 获取plan数据
   * @returns Promise
   */
  handleReqPlanInfo() {
    if (!wx.getStorageSync('openid')) {
      setTimeout(() => this.handleReqPlanInfo(), 500);
      return;
    }

    return new Promise((resolve) => {
      callFunction({
        name: 'request',
        data: {
          action: 'getPlanInfo',
          openid: JSON.parse(wx.getStorageSync('openid'))
        }
      }).then(res => {
        console.log(res)
        if (res.result.msg != 1) {
          wx.showToast({ icon: 'none', title: '数据加载失败...' });
          return;
        }
  
        const data = res.result.plan;
  
        wx.setStorageSync('plan', JSON.stringify(data));
        resolve();
      }).catch(() => {
        wx.showToast({ icon: 'none', title: '数据加载失败...' });
      })
    })
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

    
    this.login();

    this.globalData.plan = wx.getStorageSync('plan') ? JSON.parse(wx.getStorageSync('plan')) : {};
  },

  onShow() {
    // if (!wx.getStorageSync('openid')) this.login();
    console.log('onShow')
    const getTime = new Date().getTime();

    // callFunction({
    //   name: 'request',
    //   data: {
    //     action: 'update_plan',
    //     update_time: getTime,
    //     openid: JSON.parse(wx.getStorageSync('plan')).openid
    //   }
    // }).then(res => {
    //   console.log(res)
    // }).catch(err => {
    //   console.log(err)
    // })
  },

  onHide() {
    console.log('onHide')
    
  }
})

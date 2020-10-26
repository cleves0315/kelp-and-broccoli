//app.js
import { callFunction, getAuthGetting } from './utils/util';

App({
  canRun: true,   // 节流开关

  /**
   * 请求后台和缓存数据对比，把最新数据放入缓存
   */
  getPlanStorage() {
    const openId = wx.getStorageSync('open_id');
    const planStorg = wx.getStorageSync('plan');
    const todayPlanStorg = wx.getStorageSync('today_plan');

    // 如果缓存不存在openId，则先登陆后再次获取数据
    if (openId === '') {
      this.login()
        .then(() => {
          console.log('login -> then');
          this.getPlanStorage()
        });
      return;
    }

    return new Promise((resolve) => {
      // 加载后台数据
      callFunction({
        name: 'request',
        data: {
          action: 'getPlanInfo',
          open_id: JSON.parse(openId),
        }
      }).then(res => {
        console.log(res);

        if (res.result.code !== '1') return;

        const data = res.result.data;
        
        // 更新最新'plan'到缓存
        if (planStorg === '' || data.plan.update_time > JSON.parse(planStorg).update_time) {
          wx.setStorageSync('plan', JSON.stringify(data.plan));
        }

        // 更新最新'today_plan'到缓存
        if (todayPlanStorg === '' || data.today_plan.update_time > JSON.parse(todayPlanStorg).update_time) {
          wx.setStorageSync('today_plan', JSON.stringify(data.today_plan));
        }

        resolve();
      }).catch(() => {
        wx.showToast({
          title: '数据加载失败',
        })
      });
    });
  },

  /**
   * 登录
   * @method
   */
  login() {
    return new Promise((resolve, reject) => {
      if (!this.canRun) return;
    
      this.canRun = false;

      console.log('login');

      callFunction({
        name: 'login'
      })
        .then(res => {
          console.log(res)

          if (res.result.code !== '1') return;

          const openId = res.result.data.open_id;

          wx.setStorageSync('open_id', JSON.stringify(openId));
          resolve();
        })
        .catch(err => {
          console.log('登陆失败');
          console.log(err);
          reject();
        })
        .finally(() => {
          this.canRun = true;
        });
    });
  },

  /**
   * 从云端获取用户信息
   */
  getUserInfo() {
    const openId = wx.getStorageSync('open_id');

    // 如果缓存不存在openId，则先登陆后再次获取数据
    if (openId === '') {
      this.login().then(() => this.getUserInfo());
      return;
    }

    return new Promise((resolve, reject) => {
      callFunction({
        name: 'userinfo',
        data: {
          open_id: openId
        }
      }).then(res => {
        console.log(res);
        if (res.result.code !== '1') return;
  
        const data = res.result.data;

        wx.setStorageSync('user', JSON.stringify(data.user));
        resolve();
      });
    });
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
        env: 'test-7t28x',
        traceUser: true,
        timeout: 5000
      })
    }

    this.globalData = {}

    
    // this.login();
  },

  onShow() {
    // 小程序每从后台展示出，就加载一次用户信息
    this.getUserInfo();
  },

  onHide() {
    console.log('onHide')
    
  }
})

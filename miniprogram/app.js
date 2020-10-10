//app.js
import { callFunction, getAuthGetting } from './utils/util';

App({
  canRun: true,   // 节流开关

  /**
   * 获取或初始化缓存上的数据
   */
  getPlanStorage() {
    if (wx.getStorageSync('plan') !== '') {

    } else {
      // 缓存不存在数据，这里向后端请求

      const action = 'getPlanInfo';
      const openId = wx.getStorageSync('open_id');

      // 如果缓存不存在openId，则先登陆后再次获取数据
      if (openId === '') {
        this.login()
          .then(() => {
            console.log('login -> then');
            this.getPlanStorage()
          });
        return;
      }

      // 加载后台数据
      callFunction({
        name: 'request',
        data: {
          action,
          open_id: JSON.parse(openId),
        }
      }).then(res => {
        console.log(res);
      }).catch(err => {
        console.log(err);
      });
    }
  },

  /**
   * 初始化plan数据
   */
  initPlan() {
    return new Promise((resolve) => {
      
      callFunction({
        name: 'request',
        data: {
          action: 'initPlan',
          openid: JSON.parse(wx.getStorageSync('openid'))
        }
      }).then(res => {
        console.log(res)
      })

    });
  },

  /**
   * 更新plan数据
   */
  updateLatestPlan() {

  },

  /**
   * 获取云端上plan数据, 与缓存数据对比。更新时间返回最近更新的数据
   * @returns Promise
   */
  compareLatestPlan() {
    if (wx.getStorageSync('openid') == '') {
      setTimeout(() => {
        this.compareLatestPlan();
      }, 500);
      return;
    }

    return new Promise((resolve, reject) => {

      callFunction({
        name: 'request',
        data: {
          action: 'getPlanInfo',
          openid: JSON.parse(wx.getStorageSync('openid'))
        }
      }).then(res => {
        console.log(res)

        if (res.result.plan) {
          const data = res.result.plan;
  
          resolve(data);
        } else {

          reject();
        }
      })

    })
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
          const openId = res.result.open_id;

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
        env: 'test-7t28x',
        traceUser: true,
      })
    }

    this.globalData = {}

    
    // this.login();
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

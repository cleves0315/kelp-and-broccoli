// pages/home/home.js
import { getUserInfo, getPlan } from '../../api/home';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    onesRequest: 1,    // 页面一次的请求
    bannerTitle: '我的一天',
    planList: null,    // 所有计划列表
    todayPlan: {       // 我的一天
      progress: 0,
      percentage: 0,
      total: 0
    },
    userInfo: null,
    isShowLoginCase: 0,
  },

  /**
   * 获取缓存用户信息
   */
  getStorageUserInfo() {
    const storUserInfo = wx.getStorageSync('user_info');

    if (storUserInfo) {
      this.setData({
        userInfo: JSON.parse(storUserInfo)
      });
    }
  },

  /**
   * 获取缓存plan
   */
  getStoragePlan() {
    const storPlan = wx.getStorageSync('plan');

    if (storPlan) {
      this.data.planList = JSON.parse(storPlan).list;
      this.todayPlanInit();
    }
  },

  /**
   * 获取最新用户信息
   */
  getLatestUserInfo() {
    const openId = wx.getStorageSync('open_id');
    if (!openId) {
      app.login();

      setTimeout(() => {
        this.getLatestUserInfo();
      }, 1000);
      return;
    }

    return new Promise(resolve => {
      getUserInfo(JSON.parse(openId))
        .then(res => {
          const data = res.result;

          resolve();
  
          if (data.code !== '1') {
            wx.showToast({ icon: 'none', title: data.message, });
            return;
          }
  
          const userInfo = this.data.userInfo;
          if (!userInfo || data.user.update_time > userInfo.update_time) {
            this.setData({
              userInfo: data.user
            });
  
            wx.setStorage({
              data: JSON.stringify(data.user),
              key: 'user_info',
            })
          }
        });
    });
  },

  /**
   * 获取最新plan
   */
  getLatestPlan() {
    const openId = wx.getStorageSync('open_id');
    if (!openId) {
      app.login();

      setTimeout(() => {
        this.getLatestUserInfo();
      }, 1000);
      return;
    }

    return new Promise(resolve => {
      getPlan(JSON.parse(openId))     // 获取云端数据和本地缓存比较 -> 渲染视图
        .then(res => {
          console.log(res);
          resolve();


          let isChange = 0;
          const data = res.result;
          const planList = this.data.planList;
          const storPlan = wx.getStorageSync('plan');

          if (data.code !== '1') {
            return;
          }

          if (!storPlan) {
            const plan = data.plan;
            
            this.data.planList = plan.list;

            wx.setStorageSync('plan', JSON.stringify(plan));
          } else if (JSON.parse(storPlan).update_time < data.plan.update_time) {
            const plan = data.plan;

            // 检查缓存list是否有更新数据
            JSON.parse(storPlan).list.forEach((item) => {
              plan.list.forEach((m, i) => {
                if (item.id === m.id && item.update_time > m.update_time) {
                  plan.list[i] = item;
                  isChange = 1;
                }
              });
            });

            if (isChange === 1) {
              this.data.planList = plan.list;

              // 更新最新数据到云端
              // ...
            }
          } else {
            const plan = JSON.parse(storPlan);

            // 检查云端list是否有更新数据
            plan.list.forEach((item, index) => {
              data.plan.list.forEach((m) => {
                if (item.id === m.id && item.update_time < m.update_time) {
                  plan.list[index] = m;
                  isChange = 1;
                }
              });
            });

            // 更新了数据进行重新存储
            if (isChange === 1) {
              this.data.planList = plan.list;

              wx.setStorageSync('plan', JSON.stringify(plan));
            }

          }
        })
    });
  },

  /**
   * 初始化被加入"我的一天"数据
   */
  todayPlanInit() {
    const list = [];

    this.data.planList.forEach(item => {
      if (item.organize === 'today') {
        list.push(item);
      }
    });

    let progress = 0;
    list.forEach(item => {
      if (item.is_finish) {
        progress++;
      }
    });

    if (list.length > 0) {
      this.setData({
        todayPlan: {
          progress, // 进度
          percentage: (progress / list.length).toFixed() * 100, // 百分比
          total: list.length
        }
      });
    }
  },



  /**
   * 进入日历
   */
  handleToIntoCalendar() {
    wx.navigateTo({
      url: '/pages/index/index',
    })
  },

  /**
   * 进入我的计划
   */
  handleToIntoMyPlan() {
    wx.navigateTo({
      url: '/pages/my-plan/my-plan',
    })
  },

  /**
   * 进入*设置计划
   */
  handleToIntoPlan() {
    // wx.navigateTo({
    //   url: '/pages/plan/plan',
    // })
    wx.navigateTo({
      url: '/pages/my-plan/my-plan',
    })
  },



  onLoad() {

  },

  onReady() {
    // 从缓存获取用户信息
    this.getStorageUserInfo();
    // 从缓存获取plan数据
    this.getStoragePlan();


    // 获取最新plan
    // 获取最新用户信息
    Promise.all([
      this.getLatestPlan(), 
      this.getLatestUserInfo()
    ]).then(() => {
      this.data.onesRequest = 0;

      this.todayPlanInit();
    })
  },
  
  onShow () {
    if (this.data.onesRequest === 0) {
      // 从缓存获取plan
      this.getStoragePlan();
      // 从缓存获取用户信息
      this.getStorageUserInfo();
    }
  },
})
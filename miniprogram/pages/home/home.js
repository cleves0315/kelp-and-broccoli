// pages/home/home.js
import { getUserInfo, getTodayPlan } from '../../api/home';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    plan: null,
    isShowLoginCase: 0,
    userInfo: null,
    bannerTitle: '我的一天'
  },

  /**
   * 获取缓存用户信息
   */
  getStorageUserInfo() {
    if (wx.getStorageSync('user_info')) {
      this.setData({
        userInfo: JSON.parse(wx.getStorageSync('user_info'))
      });
    }
  },

  /**
   * 获取最新用户信息
   */
  getLatestUserInfo() {
    console.log('getLatestUserInfo');

    const openId = wx.getStorageSync('open_id');
    if (!openId) {
      app.login();

      setTimeout(() => {
        this.getLatestUserInfo();
      }, 1000);
      return;
    }

    getUserInfo(JSON.parse(openId))
      .then(res => {
        console.log(res);
        const data = res.result;

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
      })
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
    wx.navigateTo({
      url: '/pages/plan/plan',
    })
  },



  onLoad() {


  },

  onReady() {
    // 从缓存获取用户信息
    this.getStorageUserInfo();
    // 获取最新用户信息
    this.getLatestUserInfo();
  },
  
  onShow () {
    
  },
})
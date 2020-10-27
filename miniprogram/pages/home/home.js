// pages/home/home.js
import { getAuthGetting, callFunction } from '../../utils/util';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    plan: {},
    todayPlan: {},
    isShowLoginCase: 0,
    userInfo: null,
    bannerTitle: '我的一天'
  },

  /**
   * 获取最新plan数据
   */
  getLatestPlan() {
    app.getPlanToStorage()
      .then(() => {
        this.setData({
          plan: JSON.parse(wx.getStorageSync('plan')),
          todayPlan: JSON.parse(wx.getStorageSync('today_plan'))
        });
      });
  },

  /**
   * 获取最新用户信息
   */
  getLatestUserInfo() {
    app.getUserInfoToStorage()
      .then(() => {
        this.setData({
          userInfo: JSON.parse(wx.getStorageSync('user_info'))
        });
      });
  },


  /**
   * 
   */
  getUserInfo() {
    if (!this.data.userInfo) {
      wx.getUserInfo({
        success: (res) => this.setData({ userInfo: res.userInfo, bannerTitle: res.userInfo.nickName + '的每日计划' })
      })
    }
  },

  /**
   * 用户同意授权·用户信息callback
   */
  handleToGetuserInfo(e) {
    const userInfo = e.detail.userInfo;

    callFunction({
      name: 'request',
      data: {
        action: 'setUserInfo',
        openid: JSON.parse(wx.getStorageSync('openid')),
        userInfo
      }
    })

    this.setData({ userInfo, bannerTitle: userInfo.nickName + '的每日计划' })
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
    // this.setData({
    //   plan: JSON.parse(wx.getStorageSync('plan')),
    //   todayPlan: JSON.parse(wx.getStorageSync('today_plan'))
    // })

    if (wx.getStorageSync('user_info')) {
      this.setData({
        userInfo: JSON.parse(wx.getStorageSync('user_info'))
      });
    }
  },
  
  onShow () {
    // 获取plan数据
    this.getLatestPlan();
    
    // 获取用户信息
    this.getLatestUserInfo();
  },
})
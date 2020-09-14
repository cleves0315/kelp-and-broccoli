// pages/home/home.js
import { getAuthGetting, callFunction } from '../../utils/util';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    plan: {},
    isShowLoginCase: 0,
    userInfo: null,
    bannerTitle: '先登陆后查看'
  },


  /**
   * 展示缓存数据
   */
  showStorageData() {
    if (wx.getStorageSync('plan') == '' || JSON.parse(wx.getStorageSync('plan')) == {}) return;

    const data = JSON.parse(wx.getStorageSync('plan'));

    this.setData({
      plan: data
    })
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
    // getAuthGetting('scope.userInfo')
    //   .then(res => {
    //     wx.navigateTo({
    //       url: '/pages/index/index',
    //     })
    //   })
    //   .catch(() => this.setData({ isShowLoginCase: 1 }))
  },

  /**
   * 进入我的计划
   */
  handleToIntoMyPlan() {
    wx.navigateTo({
      url: '/pages/my-plan/my-plan',
    })
    // getAuthGetting('scope.userInfo')
    //   .then(res => {
    //     wx.navigateTo({
    //       url: '/pages/my-plan/my-plan',
    //     })
    //   })
    //   .catch(() => this.setData({ isShowLoginCase: 1 }))
  },

  /**
   * 进入*设置计划
   */
  handleToIntoPlan() {
    wx.navigateTo({
      url: '/pages/plan/plan',
    })
    // getAuthGetting('scope.userInfo')
    //   .then(res => {
    //     wx.navigateTo({
    //       url: '/pages/plan/plan',
    //     })
    //   })
    //   .catch(err => this.setData({ isShowLoginCase: 1 }))
  },



  onLoad() {
    this.showStorageData();


  },

  onReady() {
    // getAuthGetting('scope.userInfo')
    //   .catch(() => this.setData({ isShowLoginCase: 1 }))

    this.setData({
      plan: app.globalData.plan
    })

    // 获取plan数据，存入缓存
    app.compareLatestPlan()
      .then((res) => {
        console.log(res)
        // this.setData({ plan: app.globalData.plan })
      })
      .catch(() => {
        console.log('无数据')
        if (wx.getStorageSync('plan') == '' || JSON.parse(wx.getStorageSync('plan')) == {}) {
          // 初始化数据
          app.initPlan();
        }
      })
  },
  
  onShow () {
  },
})
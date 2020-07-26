// pages/home/home.js
import { getAuthGetting, callFunction } from '../../utils/util';

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
   * 获取plan数据
   */
  handleToReqPlanInfo() {
    if (!wx.getStorageSync('openid')) {
      setTimeout(() => this.handleToReqPlanInfo(), 500);
      return;
    }

    callFunction({
      name: 'request',
      data: {
        openid: wx.getStorageSync('openid'),
        action: 'getPlanInfo'
      }
    }).then(res => {
      console.log(res)

      if (res.result.msg == 1) {
        this.setData({ plan: res.result.plan });

        wx.setStorageSync('plan', JSON.stringify(res.result.plan));
      } else {
        wx.showToast({ icon: 'none', title: '加载失败' }) 
      }
    }).catch(err => { 
      wx.showToast({ icon: 'none', title: '加载失败' }) 
      console.log(err)
    })
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
        openid: wx.getStorageSync('openid'),
        userInfo
      }
    })

    wx.setStorageSync('userInfo', JSON.stringify(userInfo));

    this.setData({ userInfo, bannerTitle: userInfo.nickName + '的每日计划' })
  },

  /**
   * 进入日历
   */
  handleToIntoCalendar() {
    getAuthGetting('scope.userInfo')
      .then(res => {
        wx.navigateTo({
          url: '/pages/index/index',
        })
      })
      .catch(() => this.setData({ isShowLoginCase: 1 }))
  },

  /**
   * 进入我的计划
   */
  handleToIntoMyPlan() {
    getAuthGetting('scope.userInfo')
      .then(res => {
        wx.navigateTo({
          url: '/pages/my-plan/my-plan',
        })
      })
      .catch(() => this.setData({ isShowLoginCase: 1 }))
  },

  /**
   * 进入*设置计划
   */
  handleToIntoPlan() {
    getAuthGetting('scope.userInfo')
      .then(res => {
        wx.navigateTo({
          url: '/pages/plan/plan',
        })
      })
      .catch(err => this.setData({ isShowLoginCase: 1 }))
  },

  onLoad: function() {
    getAuthGetting('scope.userInfo')
      .catch(() => this.setData({ isShowLoginCase: 1 }))
  },
  
  onShow: function () {
    this.handleToReqPlanInfo();

    if (!this.data.userInfo) {
      wx.getUserInfo({
        success: (res) => this.setData({ userInfo: res.userInfo, bannerTitle: res.userInfo.nickName + '的每日计划' })
      })
    }
  },
})
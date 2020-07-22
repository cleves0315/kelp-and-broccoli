// pages/home/home.js
import { callFunction } from '../../utils/util';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    plan: {}
  },

  /**
   * 获取plan数据
   */
  handleToReqPlanInfo() {
    callFunction({
      name: 'request',
      data: {
        action: 'getPlanInfo'
      }
    })
    .then(res => {
      console.log(res)

      this.setData({ plan: res.result });

      wx.setStorageSync('plan', res.result)
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.handleToReqPlanInfo();
  },
})
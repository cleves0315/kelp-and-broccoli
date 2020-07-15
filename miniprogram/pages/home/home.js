// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

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

  },
})
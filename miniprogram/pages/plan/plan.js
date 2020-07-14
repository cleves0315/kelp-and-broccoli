// pages/plan/plan.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 点击添加计划
   */
  handleToAddPlan() {
    wx.navigateTo({
      url: '/pages/plan-edit/plan-edit',
    })
  }
})
// pages/plan/plan.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 进入编辑页
   */
  handleToIntoExit() {
    wx.navigateTo({
      url: '/pages/plan-edit/plan-edit',
    })
  }
})
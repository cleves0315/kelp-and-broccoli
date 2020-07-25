// pages/plan/plan.js
import { callFunction } from '../../utils/util';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    plan: {}
  },

  handleReqPlanList() {
    callFunction({
      name: 'request',
      data: {        
        action: 'getPlanInfo',
        openid: wx.getStorageSync('openid')
      }
    }).then(res => {
      console.log(res.result)
      this.setData({
        plan: res.result
      })
    }).catch(() => {
      wx.showToast({ icon: 'none', title: '加载失败' })
    })
  },

  /**
   * 点击添加计划
   */
  handleToAddPlan(e) {
    const data = e.detail.data;
    
    wx.navigateTo({
      url: '/pages/plan-edit/plan-edit?action=' + data.action + '&data=' + JSON.stringify(data.data),
    })
  },

  onShow() {
    this.handleReqPlanList();
  }
})
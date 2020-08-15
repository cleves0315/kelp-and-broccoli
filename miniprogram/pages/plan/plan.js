// pages/plan/plan.js
import { callFunction } from '../../utils/util';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    plan: {}
  },

  /**
   * 缓存获取plan数据
   */
  handleGetPlanList() {
    if (!wx.getStorageSync('plan')) {
      wx.showToast({ icon: 'none', title: '加载失败...' })
      return;
    }

    this.setData({
      plan: JSON.parse(wx.getStorageSync('plan'))
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
    this.handleGetPlanList();
  }
})
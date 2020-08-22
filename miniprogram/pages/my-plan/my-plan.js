// miniprogram/pages/my-plan/my-plan.js
import { callFunction } from '../../utils/util';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    plan: null
  },

   /**
   * 从storage获取plan数据
   */
  handleGetPlanList() {
    if (!wx.getStorageSync('plan')) {
      setTimeout(() => {
        this.handleGetPlanList();
      }, 1000);
    }

    this.setData({
      plan: JSON.parse(wx.getStorageSync('plan'))
    })
  },

  /**
   * @callback
   * 改变每日计划状态
   */
  handleToChangePlan(e) {
    const value = e.detail.value;
    console.log(e)

    wx.showLoading({
      mask: true,
      title: '操作中...'
    });

    callFunction({
      name: 'request',
      data: {
        action: 'chanPlangress',
        id: e.detail.id,
        openid: JSON.parse(wx.getStorageSync('openid')),
        value
      }
    }).then(res => {
      console.log(res)
      if (res.result.msg == 0) {
        wx.hideLoading();
        wx.showToast({  icon: 'none', title: '操作失败' });
      }

      wx.hideLoading();
      app.handleReqPlanInfo();  // 重新从后台加载plan数据
    }).catch(err => {
      console.log(err)
      wx.hideLoading({
        success: (res) => wx.showToast({  icon: 'none', title: '操作失败' })
      })
    })
  },
 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.handleGetPlanList();
  },
})
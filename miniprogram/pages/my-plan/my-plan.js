// miniprogram/pages/my-plan/my-plan.js
import { callFunction } from '../../utils/util';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    plan: null
  },

  handleToChangePlan(e) {
    const value = e.detail.value;
    console.log(value)

    wx.showLoading({
      mask: true
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
      if (res.result.msg == 1) {
        wx.hideLoading();
      } else {
        wx.hideLoading({
          success: (res) => wx.showToast({  icon: 'none', title: '操作失败' })
        })
      }
    }).catch(err => {
      console.log(err)
      wx.hideLoading({
        success: (res) => wx.showToast({  icon: 'none', title: '操作失败' })
      })
    })
  },

  handleReqPlanList() {
    callFunction({
      name: 'request',
      data: {
        action: 'getPlanInfo',
        openid: JSON.parse(wx.getStorageSync('openid'))
      }
    }).then(res => {
      console.log(res)
      if (res.result.msg != 1) {
        wx.showToast({ icon: 'none', title: '加载失败' });
        return;
      }

      this.setData({ plan: res.result.plan });
    }).catch(() => wx.showToast({ icon: 'none', title: '加载失败' }))
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.handleReqPlanList();
  },
})
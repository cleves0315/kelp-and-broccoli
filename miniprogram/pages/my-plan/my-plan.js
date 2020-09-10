// miniprogram/pages/my-plan/my-plan.js
import { callFunction, judgeIphoneX } from '../../utils/util';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: 0,
    plan: null
  },
  

  /**
   * @callback
   * 改变每日计划状态
   */
  handleToChangePlan(e) {
    const value = e.detail.value;
    console.log(e)

    return;

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
   * 点击单个计划
   */
  handleToTapPlanItem(e) {
    console.log(e)
    const data = e.detail.data;

    wx.navigateTo({
      url: '/pages/plan-edit/plan-edit?data=' + JSON.stringify(data),
    })
  },
 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isIphoneX: judgeIphoneX()
    })
  },
})
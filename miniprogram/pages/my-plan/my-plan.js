// miniprogram/pages/my-plan/my-plan.js
import { callFunction, judgeIphoneX } from '../../utils/util';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: 0,
    planList: [],
  },

  getStoragePlan() {
    const storPlan = wx.getStorageSync('plan');

    if (storPlan) {
      this.setData({
        planList: JSON.parse(storPlan).list
      })
    }
  },

  /**
   * 创建一条计划
   * @callback 回车按钮
   */
  handleCreatPlan(e) {
    console.log(e);
    const title = e.detail.value;

    this.setData({
      planList
    })
  },
  

  /**
   * @callback
   * 改变每日计划状态
   */
  handleToChangePlan(e) {
    const value = e.detail.value;
    console.log(e)
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
    });

    this.getStoragePlan();
  },
})
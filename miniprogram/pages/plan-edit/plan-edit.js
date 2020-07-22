// pages/plan-edit/plan-edit.js
import { callFunction } from '../../utils/util'

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  EditCase: null,

  /**
   * 验证文本
   * @param title 
   */
  handleToVerication(title) {
    if (title.trim().length == 0) {
      return 0;
    } else {
      return 1;
    }
  },

  handleToDelPlan() {
    const inputValues = this.EditCase.handleToGetInput();
  },

  handleToFinishPlan() {
    const inputValues = this.EditCase.handleToGetInput();

    const veriResults = this.handleToVerication(inputValues.inputTitle);

    if (!veriResults) {
      wx.showToast({ icon: 'none', title: '请输入标题' });
      return;
    }

    callFunction({
      name: 'request',
      data: {
        action: 'addPlan',
        _id: wx.getStorageSync('plan')['_id']
      }
    })
  },

  onLoad(options) {
    this.EditCase = this.selectComponent('#editCase');
  }
})
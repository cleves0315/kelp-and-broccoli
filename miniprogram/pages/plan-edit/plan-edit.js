// pages/plan-edit/plan-edit.js
import { callFunction } from '../../utils/util'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    plan: {
      title: '',
      detail: ''
    },
    isHeaderDelBtn: 0,
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
    callFunction({
      name: 'request',
      data: {
        action: 'delPlan',
        openid: JSON.parse(wx.getStorageSync('openid')),
        id: this.data.plan.id
      }
    }).then(res => {
      wx.showToast({ icon: 'none', title: '删除成功' })

      setTimeout(() => {
        wx.navigateBack({
          delta: 1,
        })
      }, 1000);
    }).catch(err => {
      wx.showToast({ icon: 'none', title: '操作失败' })
    })
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
        openid: JSON.parse(wx.getStorageSync('openid')),
        _id: JSON.parse(wx.getStorageSync('plan'))['_id'],
        data: {
          title: inputValues.inputTitle,
          detail: inputValues.inputDetail,
          finish: 0
        }
      }
    }).then(res => {
      console.log(res)
      wx.showToast({ icon: 'none', title: '添加成功' })

      setTimeout(() => {
        wx.navigateBack({
          delta: 1,
        })
      }, 1000);
    }).catch(err => {
      wx.showToast({ icon: 'none', title: '操作失败' })
    })
  },

  onLoad(options) {
    let plan = this.data.plan;
    const action = options.action;
    
    if (action == 'edit') plan = JSON.parse(options.data);

    this.setData({
      plan,
      isHeaderDelBtn: action == 'add' ? 0 : 1
    })

    this.EditCase = this.selectComponent('#editCase');
  }
})
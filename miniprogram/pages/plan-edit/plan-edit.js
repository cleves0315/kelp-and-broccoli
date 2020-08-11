// pages/plan-edit/plan-edit.js
import { callFunction } from '../../utils/util'

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    plan: {
      title: '',
      detail: ''
    },
    action: '',              // 上页面传递过来的操作动做：edit、add
    isHeaderDelBtn: 0,       // 是否显示删除按钮
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

  /**
   * 删除按钮
   */
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

  /**
   * 完成按钮
   */
  handleToFinishPlan() {
    const inputValues = this.EditCase.handleToGetInput();

    const veriResults = this.handleToVerication(inputValues.inputTitle);

    if (!veriResults) {
      wx.showToast({ icon: 'none', title: '请输入标题' });
      return;
    }

    wx.showLoading({
      mask: true,
      title: '请稍等...',
    })

    const action = this.data.action == 'edit' ? 'editPlan' : 'addPlan'

    callFunction({
      name: 'request',
      data: {
        action,
        openid: JSON.parse(wx.getStorageSync('openid')),
        data: {
          id: this.data.plan.id,
          title: inputValues.inputTitle,
          detail: inputValues.inputDetail,
        }
      }
    })
      .then(res => {
        console.log(res)
        if (res.result.msg == 0) {
          wx.showToast({ icon: 'none', title: '操作失败' })
          return;
        }

        wx.showToast({ title: '操作成功' })

        app.globalData.nveBack = 'plan-edit';
        
        setTimeout(() => {
          wx.navigateBack({
            delta: 1,
          })
        }, 1000);
      })
      .catch(err => {
        wx.showToast({ icon: 'none', title: '操作失败' })
      })
      .finally(() => wx.hideLoading());
  },

  onLoad(options) {
    let plan = this.data.plan;
    const action = options.action;
    
    if (action == 'edit') plan = JSON.parse(options.data);

    this.setData({
      plan,
      isHeaderDelBtn: action == 'add' ? 0 : 1
    })
    this.data.action = action;

    this.EditCase = this.selectComponent('#editCase');
  }
})
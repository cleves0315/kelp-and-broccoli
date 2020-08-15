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
   * @param title 标题
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
    wx.showLoading({
      mask: true,
      title: '请稍等...',
    })

    callFunction({
      name: 'request',
      data: {
        action: 'delPlan',
        openid: JSON.parse(wx.getStorageSync('openid')),
        id: this.data.plan.id
      }
    }).then(res => {
      console.log(res)
      if (res.result.msg == 0) {
        wx.hideLoading();
        wx.showToast({ mask: true, icon: 'none', title: '操作失败' })
        return;
      }

      // 重新从后台获取plan数据
      app.handleReqPlanInfo()
        .then(() => {
          wx.hideLoading();
          wx.showToast({ mask: true, icon: 'none', title: '删除成功' })

          setTimeout(() => {
            wx.navigateBack({
              delta: 1,
            })
          }, 1000);
        })
        
    }).catch(err => {
      console.log(err)
      wx.hideLoading();
      wx.showToast({ mask: true, icon: 'none', title: '操作失败' })
    })
  },

  /**
   * 完成按钮
   */
  handleToFinishPlan() {
    // const inputValues = this.EditCase.handleToGetInput();
    const plan = this.data.plan;
    const veriResults = this.handleToVerication(plan.title);

    if (!veriResults) {
      wx.showToast({ mask: true, icon: 'none', title: '请输入标题' });
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
        id: this.data.plan.id,
        title: plan.title,
        detail: plan.detail,
      }
    })
      .then(res => {
        console.log(res)
        if (res.result.msg == 0) {
          wx.hideLoading();
          wx.showToast({ mask: true, icon: 'none', title: '操作失败' })
          return;
        }

        // 重新从后台获取plan数据
        app.handleReqPlanInfo()
          .then(() => {
            wx.hideLoading();
            wx.showToast({ mask: true, title: '操作成功' })
          
            setTimeout(() => {
              wx.navigateBack({
                delta: 1,
              })
            }, 1000);
          })
        
      })
      .catch(err => {
        console.log(err)
        wx.hideLoading();
        wx.showToast({ mask: true, icon: 'none', title: '操作失败' })
      })
  },

  /**
   * 监听输入标题、内容
   * @param {Object} e 组件传递参数
   */
  handleToDetailInput(e) {
    const id = e.detail.id;
    const value = e.detail.value;
    const plan = this.data.plan;

    switch (id) {
      case 'title':
        plan.title = value;
        break;
      case 'detail':
        plan.detail = value;
        break;
    }

    this.setData({ plan })
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
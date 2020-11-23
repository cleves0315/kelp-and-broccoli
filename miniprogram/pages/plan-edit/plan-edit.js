// pages/plan-edit/plan-edit.js
import { judgeIphoneX } from '../../utils/util';
import { editPlan } from '../../api/plan';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    plan: {},
    openId: '',
    disabled: false,
    todayFuntIcon: '/static/images/plan-edit/sunlight.svg',             // 我的一天图标
    todayFuntLiveIcon: '/static/images/plan-edit/sunlight_live.svg',
    dateFuntIcon: '/static/images/plan-edit/date.svg',                  // 截止日期图标
    dateFuntLiveIcon: '/static/images/plan-edit/date_live.svg',
    isRepeatFutLive: false,                // 控制"重复"按钮是否被激活
    repeatFuntTxt: '重复',
    repeatFuntIcon: '/static/images/plan-edit/repeat.svg',
    repeatFuntLiveIcon: '/static/images/plan-edit/repeat_live.svg',
  },

  /**
   * 适配IphoneX
   * @method 
   */
  adaptationIphoneX() {
    this.setData({
      isIphoneX: judgeIphoneX()
    })
  },

  /**
   * 按照id，更改step 标题
   */
  handleToEditStep(data) {
    const stepList = this.data.stepList;

    stepList.forEach((item, index) => {
      if (item.id == data.id) {
        stepList[index].title = data.title;
      }
    })

    this.setData({
      stepList
    })
  },

  /**
   * 输入完内容
   * @callback
   */
  handleToEdited(e) {
    const type = e.detail.type;
    const data = e.detail.data;

    switch (type) {
      case 'sub':
        this.handleToEditStep(data);
        break;
    }
  },

  /**
   * @callback
   * 点击删除步骤按钮
   */
  handleToDelStep(e) {
    const data = e.detail.data;
    const stepList = this.data.stepList;

    stepList.forEach((item, index) => {
      if (item.id == data.id) {
        stepList.splice(index, 1);
      }
    })

    this.setData({
      stepList
    })
  },

  /**
   * 监听 '下一步输入框' 字符数量>0不包括空格时 失焦事件回调
   */
  handleToAddStep(e) {
    const title = e.detail.title;
    const stepList = this.data.stepList;

    stepList.push({ title })

    this.setData({
      stepList: stepList
    });
  },


  /**
   * 点击功能按钮状态
   */
  handleToChangeState(e) {
    console.log(e)
    const type = e.currentTarget.dataset.type;

    switch (type) {
      case 'today':
        this.handleToAddMyToDay();
        break;
      case 'date':
        this.handleToSettingEndDate();
        break;
      case 'repeat':
        this.handleToRepeat();
        break;
    }
  },

  /**
   * 点击功能按钮上的删除按钮
   */
  handleToDelFunt(e) {
    const type = e.currentTarget.dataset.type;

    switch (type) {
      case 'today':
        this.handleToDelMyToday();
        break;
      case 'date':
        
        break;
      case 'repeat':
        
        break;
    }
  },

  /**
   * 添加到我的一天
   */
  handleToAddMyToDay() {
    const isLive = this.data.isTodayFutLive;
    let txt = '';

    if (isLive) {
      txt = '添加到"我的一天"';
    } else {
      txt = '已添加到"我的一天"';
    }

    this.setData({
      isTodayFutLive: !isLive,
      todayFuntTxt: txt,
    })
  },

  /**
   * 删除"我的一天"
   */
  handleToDelMyToday() {
    this.setData({
      isTodayFutLive: false,
      todayFuntTxt: '添加到"我的一天"',
    })
  },

  /**
   * 添加截止日期
   */
  handleToSettingEndDate() {
    wx.showActionSheet({
      itemList: ['今天', '明天', '下周', '选择日期'],
      success: res => {
        console.log(res)
        const index = res.tapIndex;
      }
    })
  },

  /**
   * 设置重复时间
   * @callback 重复按钮
   */
  handleToRepeat() {
    wx.showActionSheet({
      itemList: ['每天', '每周', '工作日', '每月', '每年', '自定义'],
      success: res => {
        console.log(res)
        const index = res.tapIndex;
      }
    })
  },


  /**
   * 编辑计划详情
   * @param e
   * @callback blur
   */
  handleEditDetailEnd(e) {
    const val = e.detail.value;
    const plan = this.data.plan;
    const storPlan = wx.getStorageSync('plan');
    const planList = JSON.parse(storPlan);
    
    if (!storPlan) return;

    plan.detail = val;
    
    planList.list.forEach((item, index) => {
      if (item.id === plan.id) {
        planList.list[index] = plan;
      }
    });

    wx.setStorageSync('plan', JSON.stringify(planList));

    editPlan(this.data.openId,{
        detail: val
      }).then(res => {
        console.log(res);
      });
  },


  /**
   * 删除计划
   * @callback 点击底部删除按钮
   */
  handleToDelPlan() {
    wx.showActionSheet({
      itemList: ['删除任务'],
      itemColor: '#EA3927',
      success: res => {
        console.log(res);
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const data = JSON.parse(options.data);
    
    this.data.plan = data;
    this.data.openId = wx.getStorageSync('open_id') && JSON.parse(wx.getStorageSync('open_id'));
    
    // 适配IphoneX
    this.adaptationIphoneX();
  },

  onReady() {
    this.setData({
      plan: this.data.plan
    });
  },
})
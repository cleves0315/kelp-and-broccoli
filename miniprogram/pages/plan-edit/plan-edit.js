// pages/plan-edit/plan-edit.js
import { judgeIphoneX } from '../../utils/util';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: false,
    stepList: [
      { id: 1, title: '第一步' },
      { id: 2, title: '第二步' },
      { id: 3, title: '第三步' },
      { id: 4, title: '第四步' },
      { id: 5, title: '第五步' },
    ],
    isTodayFutLive: false,                 // 控制"添加到我的一天"按钮是否被激活
    todayFuntTxt: '添加到“我的一天”',      
    todayFuntIcon: '/static/images/plan-edit/sunlight.svg',
    todayFuntLiveIcon: '/static/images/plan-edit/sunlight_live.svg',
    isdateFutLive: false,                 // 控制"添加截止日期"按钮是否被激活
    dateFuntTxt: '添加截止日期',           
    dateFuntIcon: '/static/images/plan-edit/date.svg',
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
    console.log(options)
    // 适配IphoneX
    this.adaptationIphoneX();
  }
})
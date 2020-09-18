// pages/plan-edit/plan-edit.js
import { judgeIphoneX } from '../../utils/util';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    stepList: [
      { id: 1, title: '第一步' },
      { id: 2, title: '第二步' },
      { id: 3, title: '第三步' },
      { id: 4, title: '第四步' },
      { id: 5, title: '第五步' },
    ],
    todayFuntTxt: '添加到“我的一天”',
    todayFuntIcon: '/static/images/plan-edit/sunlight.svg',
    todayFuntLiveIcon: '/static/images/plan-edit/sunlight_live.svg',
    dateFuntTxt: '添加截止日期',
    dateFuntIcon: '/static/images/plan-edit/date.svg',
    dateFuntLiveIcon: '/static/images/plan-edit/date_live.svg',
    repeatFuntTxt: '添加截止日期',
    repeatFuntIcon: '/static/images/plan-edit/repeat.svg',
    repeatFuntLiveIcon: '/static/images/plan-edit/repeat_live.svg',
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
   * 切换功能按钮状态
   */
  handleToChangeState(e) {
    console.log(e)
    const type = e.currentTarget.dataset.type;
    const value = e.detail.value;

    switch (type) {
      case 'today':
        
        break;
    
      default:
        break;
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      isIphoneX: judgeIphoneX()
    })
  }
})
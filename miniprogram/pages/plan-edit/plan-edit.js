// pages/plan-edit/plan-edit.js
import { judgeIphoneX } from '../../utils/util';
import { updatePlanList, deletePlanList } from '../../api/plan';

/**
 * 当前页面存在问题
 * 问题：更新数据时，可能plan没有[_id]字段  后期得做相应处理
 * 问题：点击功能按钮操作时，例如添加到我的一天 操作过于频繁，后期做节流处理
 * 
 * （暂时关闭"副标题功能"）
 * 
 * 该页面每做更新操作时都只先同步缓存数据并添加notUpdated字段
 * 退出该页面时才做后台同步处理
 * 
 */

Page({
  /**
   * 页面的初始数据
   */
  data: {
    actionUpdated: 0,       // 当前是否做了更新操作
    actionDeleted: 0,       // 当前是否进行删除操作，如果值为1不做更新请求
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
    isShowCalenBox: false,        // 展示日历滑块组件
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
   * 更新单个计划前端缓存数据
   * @method
   * @param {string} stogName 缓存name
   * @param {object} plan 单个plan数据
   * @todo 把单个plan数据更新到plan_list，自动新增'notUpdated'字段
   */
  tobeUpStorage(stogName, plan) {
    this.data.actionUpdated = 1;
    plan['notUpdated'] = 1;

    let sign = 0;
    const planList = JSON.parse(wx.getStorageSync('plan_list'));

    planList.some((item, index) => {
      if (plan['_id'] && item['_id'] === plan['_id']) {
        sign = index;
        return true;
      } else if (item['tempId'] && item['tempId'] === plan['tempId']) {
        sign = index;
        return true;
      }
    });

    planList[sign] = plan;

    wx.setStorageSync(stogName, JSON.stringify(planList));
  },

  /**
   * 给缓存相应数据添加tobeDeleted字段
   * @method
   * @param {string} stogName 缓存name
   * @param {object} plan 单个plan数据
   * @todo 缓存上对应传入plan数据，自动新增'tobeDeleted'字段、删除notUpdated字段；
   */
  tobeDelStorage(stogName, plan) {
    this.data.actionDeleted = 1;
    plan['tobeDeleted'] = 1;
    
    delete plan['notUpdated'];

    let sign = 0;
    const planList = JSON.parse(wx.getStorageSync('plan_list'));

    planList.some((item, index) => {
      if (plan['_id'] && item['_id'] === plan['_id']) {
        sign = index;
        return true;
      } else if (item['tempId'] && item['tempId'] === plan['tempId']) {
        sign = index;
        return true;
      }
    });

    planList[sign] = plan;

    wx.setStorageSync(stogName, JSON.stringify(planList));
  },


  /**
   * 输入完主标题
   * (与原标题名相同时不会触发)
   * @callback blur
   */
  handleEditedMainTitle(e) {
    const plan = this.data.plan;
    const value = e.detail.value.trim();

    if (value !== '') {
      plan.title = value;
      this.tobeUpStorage('plan_list', plan);
    }

    this.setData({
      plan
    });
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
   * @callback
   * 点击删除步骤(副标题)按钮
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
   * @callback 点击功能按钮
   */
  handleToAddMyToDay() {
    let organize = '';
    const plan = this.data.plan;
    const isToday = plan.organize === 'today';
    
    organize = isToday ? 'normal' : 'today';

    plan.organize = organize;
    this.setData({
      plan
    });

    this.tobeUpStorage('plan_list', plan);
  },

  /**
   * 删除"我的一天"
   * @callback 点击删除按钮
   */
  handleToDelMyToday() {
    const plan = this.data.plan;
    
    plan.organize = 'normal';
    this.setData({
      plan
    });

    this.tobeUpStorage('plan_list', plan);
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

        switch (index) {
          case 0:
            
            break;
          case 1:
            
            break;
          case 2:
            
            break;
          case 3:
            this.setData({
              isShowCalenBox: true
            });
            break;
        }
      }
    })
  },
  /** 点击日历盒子空白部分*/
  handleCalendarTapblank() {
    this.setData({
      isShowCalenBox: false
    });
  },
  /** 点击日历返回按钮 */
  handleCalendarBack() {
    this.setData({
      isShowCalenBox: false
    });
    this.handleToSettingEndDate();
  },
  /** 点击日历设置按钮 */
  handleTapSetup(e) {
    const date = e.detail.date;

    this.data.plan['closing_date'] = new Date(date).getTime();

    this.tobeUpStorage('plan_list', this.data.plan);
    this.data.actionUpdated = 1;

    this.setData({
      isShowCalenBox: false
    });
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
    const plan = this.data.plan;
    const val = e.detail.value.trim();
    
    if (val === plan.detail) return;
    
    plan.detail = val;

    this.tobeUpStorage('plan_list', plan);
  },


  /**
   * 删除计划
   * @callback 点击底部删除按钮
   */
  handleToDelPlan() {
    wx.showActionSheet({
      itemList: ['删除任务'],
      itemColor: '#EA3927',
      success: () => {
        const plan = this.data.plan;

        if (plan['_id']) {
          this.tobeDelStorage('plan_list', plan);

          deletePlanList([plan['_id']])
            .then(res => {
              if (res.result.code !== '1') return;

              let sign = -1;
              const planList = JSON.parse(wx.getStorageSync('plan_list'));

              planList.some((item, index) => {
                if (item['_id'] === plan['_id']) {
                  sign = index;
                  return true;
                }
              });

              if (sign !== -1) {
                planList.splice(sign, 1);
                wx.setStorageSync('plan_list', JSON.stringify(planList));
              }
            });
        } else {
          const planList = JSON.parse(wx.getStorageSync('plan_list'));

          for (let i = 0; i < planList.length; i++) {
            if (plan['tempId'] === planList[i]['tempId']) {
              planList.splice(i, 1);
              break;
            }
          }

          wx.setStorageSync('plan_list', JSON.stringify(planList));
        }

        wx.navigateBack();
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

  onUnload() {
    // 页面销毁根据操作同步数据
    if (this.data.actionDeleted !== 1 && this.data.actionUpdated === 1) {
      updatePlanList([this.data.plan])
        .then(res => {
          if (res.result.code !== '1') return;
  
          let sign = -1;
          const data = res.result.data[0];
          const planList = JSON.parse(wx.getStorageSync('plan_list'));

          planList.some((item, index) => {
            if (item['_id'] === data['_id']) {
              sign = index;
              return true;
            }
          });

          if (sign !== -1) {
            planList[sign] = data;
            wx.setStorageSync('plan_list', JSON.stringify(planList));
          }
        });
    }
  },
})
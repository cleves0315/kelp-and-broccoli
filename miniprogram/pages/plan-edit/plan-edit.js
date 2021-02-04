// pages/plan-edit/plan-edit.js
import { judgeIphoneX } from '../../utils/util';
import { updatePlanList, deletePlanList } from '../../api/plan';

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
    dateFuntOverIcon: '/static/images/plan-edit/date_over.svg',
    remindFuntIcon: '/static/images/plan-edit/bell.svg',
    remindFuntLiveIcon: '/static/images/plan-edit/bell_live.svg',
    repeatFuntTxt: '重复',
    repeatFuntIcon: '/static/images/plan-edit/repeat.svg',
    repeatFuntLiveIcon: '/static/images/plan-edit/repeat_live.svg',
    isShowCalenBox: false,        // 展示日历滑块组件
    isShowPickerTime: false,      // 展示选择时间板块
    // 订阅
    templIds: [      // 订阅模板的id集合
      // '-FvQTHPeMgBee2OaO_-BP8NH1Fg4aiqlLJWDlmvPlgM',
      '-FvQTHPeMgBee2OaO_-BP3j_KeMBsJIeL-H4Qs9X1cE',
    ],
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
      case 'remind':
        this.handleToSettingRemind();
        break;
      case 'closing':
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
        this.delMyToday();
        break;
      case 'closing':
        this.delClosingDate();
        break;
      case 'remind':
        this.delRemind();
        break;
      case 'repeat':
        this.delRepeat();
        break;
    }
  },
  /** 删除"我的一天" */
  delMyToday() {
    const plan = this.data.plan;
    
    plan.organize = 'normal';
    this.setData({
      plan
    });

    this.tobeUpStorage('plan_list', plan);
  },
  /** 删除"提醒我"功能 */
  delRemind() {
    const plan = this.data.plan;
    
    plan.remind_time = 0;

    this.setData({ plan });
    this.tobeUpStorage('plan_list', plan);
  },
  /** 删除截止日期 */
  delClosingDate() {
    const plan = this.data.plan;
    
    plan.closing_date = 0;

    if (plan.repeat && plan.repeat.type) {
      this.delRepeat();
    } else {
      this.setData({
        plan
      });
  
      this.tobeUpStorage('plan_list', plan);
    }
  },
  /** 删除重复功能 */
  delRepeat() {
    const plan = this.data.plan;
    
    for (const k in plan.repeat) {
      if (plan.repeat.hasOwnProperty(k)) {
        plan.repeat[k] = '';
      }
    }

    this.setData({
      plan
    });

    this.tobeUpStorage('plan_list', plan);
  },


  /**
   * 添加到我的一天
   * @callback tap
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
   * 添加提醒功能
   */
  handleToSettingRemind() {
    // 晚些时候 => 当前时间后延4小时，舍去分钟
    // 明天  =>  第二天9:00
    // 14400000  间隔4小时时间戳
    // 32400000  间隔9小时时间戳
    // 86400000  间隔一天时间戳
    // 604800000  间隔一周时间戳
    const sheetList = [];   // ActionSheet选项列表
    const sheetDataList = [];  // ActionSheet选项值对应的时间戳

    // 当前时间
    const curntDate = new Date();
    const curntYear = curntDate.getFullYear();
    const curntMonth = curntDate.getMonth() + 1;
    const curntDay = curntDate.getDate();
    const curntHour = curntDate.getHours();

    // 当前时间的09:00:00时间戳
    const curntNineOclockTime = new Date(`${curntYear}-${curntMonth}-${curntDay} 09:00:00`).getTime();

    // 三个固定值的时间戳 与显示的文本
    let later, tomorrow, nextWeek = 0;
    let laterTxt, tomorrowTxt, nextWeekTxt = '';
    const weekTList = {
      0: '周日',
      1: '周一',
      2: '周二',
      3: '周三',
      4: '周四',
      5: '周五',
      6: '周六',
    };

    // 晚些时候时间戳
    later = new Date(`${curntYear}-${curntMonth}-${curntDay} ${curntHour+4}:00:00`).getTime();
    tomorrow = curntNineOclockTime + 86400000;  // '明天选项'时间戳
    nextWeek = curntNineOclockTime + 604800000;  // '下周选项'时间戳

    if (new Date(later).getHours() < 5) {
      // 如果不是两位数字，在前面加个0
      if (new Date(later).getHours() >= 10) {
        laterTxt = `晚些时候（${new Date(later).getHours()}:00）`;
      } else {
        laterTxt = `晚些时候（0${new Date(later).getHours()}:00）`;
      }
    }
    tomorrowTxt = `明天（${weekTList[new Date(tomorrow).getDay()]}09:00）`;
    nextWeekTxt = `下周（${weekTList[new Date(nextWeek).getDay()]}09:00）`;

    // 保存当前选项的列表，和对应的时间戳
    // ['晚些时候 (13:00)', '明天 (周二9:00)', '下周 (周一9:00)', '选择日期和时间']
    if (laterTxt) {
      sheetList.push(laterTxt);
      sheetDataList.push(later);
    }
    sheetList.push(tomorrowTxt);
    sheetDataList.push(tomorrow);
    sheetList.push(nextWeekTxt);
    sheetDataList.push(nextWeek);
    
    sheetList.push('选择日期和时间');

    // const p = new Date(`${curntYear}-${curntMonth}-${curntDay} ${curntHour}:45:00`).getTime();
    // sheetList.push(`晚点）`);
    // sheetDataList.push(p);

    // 获取订阅的模板id
    const tmplIds = this.data.templIds;
    // 发起订阅
    wx.requestSubscribeMessage({
      tmplIds,
      success: res => {
        const result = res[tmplIds[0]];  // 获取用户操作结果

        // 'accept'同意、'reject'拒绝、'ban'被封禁、'filter'同名被过滤
        if (result === 'accept') {
          wx.showActionSheet({
            alertText: '提醒',
            itemList: sheetList,
            success: (res) => {
              const index = res.tapIndex;

              if (sheetList[index] === '选择日期和时间') {
                
              } else {
                const sheetTime = sheetDataList[index];  // 这个选项对应的时间戳
                const { plan } = this.data;
        
                plan.remind_time = sheetTime;
                this.setData({ plan });
                
                this.tobeUpStorage('plan_list', plan);
                this.data.actionUpdated = 1;  // 记录更新操作，退出页面时会做同步处理
              }
            }
          });
        }
      },
      fail: err => {
        if (err.errCode === 20004) {
          // 用户关闭了主开关，无法订阅
          wx.openSetting({
            withSubscriptions: true,
            fail: () => {
              wx.showToast({
                icon: 'none',
                title: '操作失败，请打开小程序设置开启通知',
              });
            }
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '操作失败，请稍后再试',
          });
        }
      }
    });
  },

  /**
   * 添加截止日期
   */
  handleToSettingEndDate() {
    let time = new Date().getTime();

    wx.showActionSheet({
      itemList: ['今天', '明天', '下周', '选择日期'],
      success: res => {
        const index = res.tapIndex;

        switch (index) {
          case 0:
            this.setClosingDate(time);
            break;
          case 1:
            time += 86400000;    // 当前时间的明天'时间戳'
            this.setClosingDate(time);
            break;
          case 2:
            time += 604800000;    // 当前时间的下周'时间戳'
            this.setClosingDate(time);
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
  /**
   * 设置截止日期
   * @param {Date} date 截止日期
   * @todo 同步缓存数据渲染视图
   */
  setClosingDate(date) {
    this.data.plan['closing_date'] = new Date(date).getTime();

    this.tobeUpStorage('plan_list', this.data.plan);
    this.data.actionUpdated = 1;  // 记录更新操作，退出页面时会做同步处理

    this.setData({
      plan: this.data.plan,
      isShowCalenBox: false
    });
  },
  /** 点击日历盒子空白部分 */
  handleCloseCalendar() {
    this.setData({
      isShowCalenBox: false
    });
  },
  /** 点击日历返回按钮 */
  handleCalendarBack() {
    console.log('handleCalendarBack')
    this.setData({
      isShowCalenBox: false
    });
    this.handleToSettingEndDate();
  },
  /** 点击日历设置按钮 */
  handleTapSetup(e) {
    console.log(e);
    const date = e.detail.date;

    this.setClosingDate(date);
  },

  /**
   * 设置重复时间
   * @callback 重复按钮
   */
  handleToRepeat() {
    wx.showActionSheet({
      itemList: ['每天', '每周', '工作日', '每月', '每年'],
      success: res => {
        console.log(res)
        const index = res.tapIndex;
        const plan = this.data.plan;
        const repeatType = ['day', 'week', 'month', 'year'];
        const repeat = {};

        switch (index) {
          case 0:
            repeat.type = repeatType[0];
            break;
          case 1:
          case 2:
            repeat.type = repeatType[1];
            break;
          case 3:
            repeat.type = repeatType[2];
            break;
          case 4:
            repeat.type = repeatType[3];
            break;
        }

        repeat.base = 1;
        repeat.finished = 0;
        if (index === 2) {
          repeat.week_value = [1, 2, 3, 4, 5];
        } else {
          repeat.week_value = [];
          repeat.week_value.push(new Date().getDay());
        }
        
        plan.repeat = repeat;

        let closingTime = new Date().getTime();
        if (repeat.type === 'week') {
          let closingDay = new Date().getDay();

          const exis = repeat.week_value.some(d => {
            if (closingDay === d) {
              return true;
            }
          });

          if (!exis) {
            while (closingDay !== repeat.week_value[0]) {
              closingDay++;
              closingTime += 86400000;
              if (closingDay > 6) closingDay = 0;
            }
          }

        }
        this.setClosingDate(closingTime);
      }
    })
  },

  /**
   * 点击日历卡片的选择时间
   */
  handleCalenChoiceDate() {
    this.setData({
      isShowCalenBox: false,
      isShowPickerTime: true
    });
  },

  /**
   * PickerTime组件返回日历卡片组件
   */
  handleBackCalenBox() {
    this.setData({
      isShowCalenBox: true,
      isShowPickerTime: false
    })
  },
  /**
   * PickerTime组件设置选中的时间
   */
  handlePickerTime(e) {
    console.log(e);
  },
  /** 关闭PickerTime组件 */
  handleClosePickerTime() {
    this.setData({
      isShowPickerTime: false
    });
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
      itemList: ['删除计划'],
      itemColor: '#EA3927',
      success: () => {
        const plan = this.data.plan;

        if (plan['_id']) {
          this.tobeDelStorage('plan_list', plan);

          deletePlanList([plan['_id']])
            .then(res => {
              console.log(res);
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
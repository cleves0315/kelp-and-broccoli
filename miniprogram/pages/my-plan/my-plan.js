// miniprogram/pages/my-plan/my-plan.js
import { addPlanList } from '../../api/plan';
import { judgeIphoneX, drawCode } from '../../utils/util';

const app = getApp();

Page({
  navigationBar: null,   // 组件navigationBar实例
  /**
   * 页面的初始数据
   */
  data: {
    todayBackImage: 'https://7465-test-7t28x-1302613116.tcb.qcloud.la/3714dd88b2e32a36dd45bdf81bc46ee22222.jpg?sign=1b9ef9141c40edcdb476343bc668965d&t=1607256585',  // 我的一天"背景图"
    isIphoneX: 0,
    organize: '',         // 计划分类的栏目
    naviBarHeight: 0,     // 组件navigationBar高度
    headerTitle: '',      // 标题
    planList: [],
    scrollViewHiehgt: 0,  // scroll-view高度 Number
    flootInput: null,     // flootInput组件对象
  },

  getStoragePlan() {
    let planList = [];
    const organize = this.data.organize;
    const jsonPlanList = wx.getStorageSync('plan_list');

    if (!jsonPlanList) return;

    if (organize === 'normal') {
      planList = JSON.parse(jsonPlanList);
    } else {
      JSON.parse(jsonPlanList).forEach(item => {
        if (item.organize === organize) {
          planList.push(item);
        }
      });
    }

    this.setData({
      planList
    })
  },

  /**
   * 创建一条计划
   * @callback confim
   */
  handleCreatPlan(e) {
    const data = {};
    const title = e.detail.value;
    const planList = this.data.planList;
    const organize = this.data.organize;
    const storPlanList = wx.getStorageSync('plan_list');

    if (title.trim() === '') {ist
      return;
    }


    data.tempId = drawCode();
    data.title = title;
    data.organize = organize;

    planList.push(data);
    this.setData({
      planList
    });


    // 设置输入框的值
    this.data.flootInput.handleSetValue('');


    let plan = {};
    if (storPlanList) {
      plan = JSON.parse(storPlanList);
      plan.push(data);
    } else {
      plan = planList;
    }
    wx.setStorageSync('plan_list', JSON.stringify(plan));

    
    // 同步后台
    new Promise(resolve => {
      const storOpenId = wx.getStorageSync('open_id');
      if (!storOpenId) {
        app.login().then(() => resolve());
      } else {
        resolve();
      }
    }).then(() => {
      addPlanList([{
        open_id: JSON.parse(wx.getStorageSync('open_id')),
        title,
        organize,
      }]).then(res => {
          console.log(res);
          if (res.result.code === '1') {
            plan[plan.length - 1] = res.result.add_list[0];

            wx.setStorageSync('plan_list', JSON.stringify(plan));
          }
        })
    })
  },
  
  /**
   * 导航栏返回按钮
   * @todo 返回首页
   */
  handleToBackNavigation() {
    wx.navigateBack()
  },


  /**
   * 切换计划状态
   * @callback tap
   */
  handleToChangeState(e) {
    console.log(e)
    const index = e.detail.index;
    const planList = this.data.planList;

    planList[index]['is_finish'] = !planList[index]['is_finish'];

    this.setData({
      planList
    });
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
      organize: options.organize
    });
    
    const isToday = options.organize === 'today';
    const headerTitle = isToday ? '我的一天' : '计划列表';
    this.setData({
      headerTitle
    });
    
    
    this.data.flootInput = this.selectComponent('#flootInput');
  },

  onReady() {
    this.setData({
      isIphoneX: judgeIphoneX()
    });

    this.navigationBar = this.selectComponent('#navigationBar');
    const naviBarHeight = this.navigationBar.getHeight();
    this.setData({
      naviBarHeight
    });
  },
  
  onShow() {
    this.getStoragePlan();
  }
})
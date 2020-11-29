// miniprogram/pages/my-plan/my-plan.js
import { addPlanList } from '../../api/plan';
import { judgeIphoneX, drawCode } from '../../utils/util';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    organize: '',         // 计划分类的栏目
    isIphoneX: 0,
    planList: [],
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
          } else {
            // 没有同步服务器
          }
        })
    })
  },
  

  /**
   * @callback
   * 改变每日计划状态
   */
  handleToChangePlan(e) {
    const value = e.detail.value;
    console.log(e)
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
    this.data.organize = options.organize;
    
    this.data.flootInput = this.selectComponent('#flootInput');
  },

  onReady() {
    this.setData({
      isIphoneX: judgeIphoneX()
    });
  },
  
  onShow() {
    this.getStoragePlan();
  }
})
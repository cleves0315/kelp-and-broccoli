// miniprogram/pages/my-plan/my-plan.js
import { getMyTodayBakImage } from '../../api/app';
import { addPlanList, finishPlanList } from '../../api/plan';
import { drawCode, sortArrayMax } from '../../utils/util';

const app = getApp();

Page({
  flootInput: null,     // flootInput组件对象
  navigationBar: null,   // 组件navigationBar实例
  /**
   * 页面的初始数据
   */
  data: {
    backgroundImage: '',  // 我的一天"背景图"
    scrollListHeight: 0,   // 列表高度
    organize: '',         // 计划分类的栏目
    headerTitle: '',      // 标题
    planList: [],
    scrollViewHiehgt: 0,  // scroll-view高度 Number
  },

  /** 展示我的一天背景图片 */
  showBackgroungImage() {
    const isToday = this.data.organize === 'today';
    if (isToday) {
      if (!wx.getStorageSync('today_back')) {
        getMyTodayBakImage()
        .then(res => {
          if (res.result.code === '1') {
            this.setData({
              backgroundImage: res.result.url
            })
            wx.setStorageSync('today_back', JSON.stringify(res.result.url));
          }
        });
      } else {
        this.setData({
          backgroundImage: JSON.parse(wx.getStorageSync('today_back'))
        })
      }
    }
  },

  /**
   * 获取缓存数据并展示
   */
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

    if (planList.length > 1) {
      planList = sortArrayMax(planList, 'create_time_applets');
    }

    this.setData({
      planList
    })
  },

  /**
   * 更新单个计划前端缓存数据
   * @method
   * @param {string} stogName 缓存name
   * @param {object} plan 单个plan数据
   * @todo 把单个plan数据更新到plan_list，自动新增'tobeFinish'字段
   */
  tobeUpStorage(stogName, plan) {
    plan['tobeFinish'] = 1;

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
   * 创建一条计划
   * @callback confim
   */
  handleCreatPlan(e) {
    const data = {};
    const title = e.detail.value;
    const planList = this.data.planList;
    const organize = this.data.organize;
    const openId = wx.getStorageSync('open_id');
    const storPlanList = wx.getStorageSync('plan_list');

    if (title.trim() === '') {
      return;
    }


    data.tempId = drawCode();
    data.title = title;
    data.organize = organize;
    data.create_time_applets = new Date().getTime();
    
    planList.unshift(data);
    this.setData({
      planList
    });
    wx.vibrateShort();


    // 设置输入框的值
    this.flootInput.handleSetValue('');


    let plan = [];
    if (storPlanList) {
      plan = JSON.parse(storPlanList);
      plan.push(data);
    } else {
      plan = planList;
    }
    wx.setStorageSync('plan_list', JSON.stringify(plan));

    
    // 同步后台
    if (!openId || openId.length === 0) return;
    data.open_id = openId && JSON.parse(openId);
    addPlanList([data]).then(res => {
        console.log(res);
        if (res.result.code === '1') {
          const pageList = getCurrentPages();
          if (pageList[pageList.length-1]['route'] === 'pages/plan-edit/plan-edit') {
            const planEdit = pageList[pageList.length-1].data.plan;
            const keys = Object.getOwnPropertyNames(planEdit);
            if (keys.length > 3) {
              // 如果用户已经在编辑界面造成了编辑操作
              // 把已经编辑的数据保存再返回
              keys.forEach(k => {
                if (res.result.add_list[0].hasOwnProperty(k)) {
                  res.result.add_list[0][k] = planEdit[k];
                }
              })
            }
            pageList[pageList.length-1].data.plan = res.result.add_list[0];
          }

          planList[0] = res.result.add_list[0];
          this.setData({
            planList
          });

          plan[0] = res.result.add_list[0];
          wx.setStorageSync('plan_list', JSON.stringify(plan));
        }
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
   * 完成计划
   * @callback tap
   */
  handleToChangeState(e) {
    const index = e.detail.index;
    const planList = this.data.planList;

    planList[index]['is_finish'] = !planList[index]['is_finish'];

    this.setData({
      planList
    });

    this.tobeUpStorage('plan_list', planList[index]);
    
    finishPlanList([planList[index]])
      .then(res => {
        console.log(res);
        if (res.result.code === '1') {
          const createList = res.result.data.create_list;
          const updatedList = res.result.data.updated_list;

          let planList = JSON.parse(wx.getStorageSync('plan_list'));


          let sign = -1;
          planList.some((item, index) => {
            if (updatedList[0]['_id'] && item['_id'] === updatedList[0]['_id']) {
              sign = index;
              return true;
            }
          });
          if (sign !== -1) planList[sign] = updatedList[0];

          if (createList.length > 0) planList.push(createList[0]);

          wx.setStorageSync('plan_list', JSON.stringify(planList));
          planList = sortArrayMax(planList, 'create_time_applets');
          this.setData({
            planList
          })
        }
      })
      .catch(err => {
        console.log(err);
      });
  },

  /**
   * 点击单个计划
   */
  handleToTapPlanItem(e) {
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
    
    
    this.flootInput = this.selectComponent('#flootInput');

    this.showBackgroungImage();
  },

  onReady() {

  },
  
  onShow() {

    this.getStoragePlan();
    
    // 设置屏幕滚动组件高度
    wx.getSystemInfo({
      success: (res) => {
        setTimeout(() => {
          this.navigationBar = this.selectComponent('#navigationBar');
          const naviBarHeight = this.navigationBar.getHeight();
          this.data.scrollListHeight = res.windowHeight - naviBarHeight - this.flootInput.data.height;
          this.setData({
            scrollListHeight: this.data.scrollListHeight
          })
        }, 50);
      }
    })

  }
})
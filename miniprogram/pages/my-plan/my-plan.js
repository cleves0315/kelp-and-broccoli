// miniprogram/pages/my-plan/my-plan.js
import { getMyTodayBakImage } from '../../api/app';
import { addPlanList, finishPlanList, deletePlanList } from '../../api/plan';
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
    scrollY: true,        // 开启页面滑动
    scrollListHeight: 0,   // 列表高度
    organize: '',         // 计划分类的栏目
    headerTitle: '',      // 标题
    planList: [],         // 计划列表
    undoList: [],         // 未完成列表
    finishList: [],       // 已完成列表
    scrollViewHiehgt: 0,  // scroll-view高度 Number
  },

  /** 展示我的一天背景图片 */
  showBackgroungImage() {
    const isToday = this.data.organize === 'today';

    if (isToday) {
      if (wx.getStorageSync('today_back') === '') {
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
   * @todo 数据分递给undoList、finishList
   */
  getStoragePlan() {
    let planList = [];
    let undoList = [];
    let finishList = [];
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

    planList = sortArrayMax(planList, 'create_time_applets');

    planList.forEach(item => {
      if (item['is_finish']) {
        finishList.push(item);
      } else {
        undoList.push(item);
      }
    });

    finishList = sortArrayMax(finishList, 'finish_date');

    this.setData({
      undoList,
      finishList
    })
    this.data.planList = planList;
  },

  /**
   * 左右滑动计划列表，停止页面滑动
   */
  handleMoveListStopPropa() {
    this.setData({
      scrollY: false
    });
  },
  /** 手指停止滑动：开放页面滚动 */
  handleListMovePlanEnd() {
    this.setData({
      scrollY: true
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

    if (title.trim() === '') {
      return;
    }

    data.tempId = drawCode();
    data.title = title;
    data.organize = organize;
    data.create_time_applets = new Date().getTime();
    
    planList.push(data);
    this.data.planList = planList;
    wx.setStorageSync('plan_list', JSON.stringify(planList));
    this.getStoragePlan();
    
    // 设置输入框的值
    this.flootInput.handleSetValue('');
    wx.vibrateShort();

    // 同步后台
    if (!openId || openId.length === 0) return;
    data.open_id = openId && JSON.parse(openId);
    addPlanList([data]).then(res => {
        if (res.result.code === '1') {
          
          // 用户已经进入编辑界面的处理
          // 把后台创建好的数据同步到编辑界面plan
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

          // 保证新增的数据在最后一项
          planList[planList.length-1] = res.result.add_list[0];
          this.data.planList = planList;

          wx.setStorageSync('plan_list', JSON.stringify(planList));
          this.getStoragePlan();
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
    let plan = null;
    const data = e.detail.data;
    const planList = JSON.parse(wx.getStorageSync('plan_list'));


    // 获取列表里对应位置并更完成状态
    for (let i = 0; i < planList.length; i++) {
      const plant = planList[i];
      if (data['_id'] && plant['_id'] === data['_id']) {
        plan = plant;
        plan['is_finish'] = !data['is_finish'];
        break;
      } else if (data['tempId'] && plant['tempId'] === data['tempId']) {
        plan = plant;
        plan['is_finish'] = !data['is_finish'];
        break;
      }
    }

    // 生成完成时间
    plan['finish_date'] = new Date().getTime();

    this.tobeUpStorage('plan_list', plan);
    this.getStoragePlan();  // 渲染视图
    
    finishPlanList([plan])
      .then(res => {
        if (res.result.code === '1') {
          const createList = res.result.data.create_list;
          const updatedList = res.result.data.updated_list;

          let planList = JSON.parse(wx.getStorageSync('plan_list'));

          // 同步已完成的计划
          let sign = -1;
          planList.some((item, index) => {
            if (updatedList[0]['_id'] && item['_id'] === updatedList[0]['_id']) {
              sign = index;
              return true;
            }
          });
          if (sign !== -1) planList[sign] = updatedList[0];

          // 添加新返回的计划
          if (createList.length > 0) planList.push(createList[0]);

          wx.setStorageSync('plan_list', JSON.stringify(planList));
          this.getStoragePlan();
        }
      })
      .catch(() => {});
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
   * 点击单个计划删除按钮
   */
  handleDelPlanItem(e) {
    const { data } = e.detail;

    // 两下震动
    wx.vibrateShort();
    setTimeout(() => wx.vibrateShort(), 200);

    wx.showActionSheet({
      itemList: ['删除计划'],
      itemColor: '#EA3927',
      success: () => {
        const planList = this.data.planList;

        // 没有同步服务器
        if (!data._id) {
          // 直接从数组删除
          
          for (let i = 0; i < planList.length; i++) {
            const p = planList[i];
            
            if (p.tempId === data.tempId) {
              if (data.is_finish) {
                this.selectComponent('#planList')
                  .handleSetHidePlan(data.finish_date)
              } else {
                this.selectComponent('#planList')
                  .handleSetHidePlan(data.create_time_applets)
              }

              setTimeout(() => {
                planList.splice(i, 1);
  
                // 保存缓存
                wx.setStorageSync('plan_list', JSON.stringify(planList));
                this.getStoragePlan();  // 取出数据，并自动分递两列未完成、已完成
              }, 340);
              break;
            }
          }
        } else {
          // 对已同步服务器数据做删除↓

          let tobeDelete = null;  // 保存即将删除的计划对象
          for (let i = 0; i < planList.length; i++) {
            const p = planList[i];
            
            if (p._id === data._id) {
              if (data.is_finish) {
                this.selectComponent('#planList')
                  .handleSetHidePlan(data.finish_date)
              } else {
                this.selectComponent('#planList')
                  .handleSetHidePlan(data.create_time_applets)
              }
              
              tobeDelete = p;
              setTimeout(() => {
                p['tobeDeleted'] = 1;
                planList[i] = p;

                // 保存缓存
                wx.setStorageSync('plan_list', JSON.stringify(planList));
                this.getStoragePlan();  // 取出数据，并自动分递两列未完成、已完成
              }, 340);
              break;
            }
          }

          // 发送请求，同步服务器
          deletePlanList([tobeDelete['_id']])
            .then(res => {
              if (res.result.code !== '1') return;

              let sign = -1;
              const planList = JSON.parse(wx.getStorageSync('plan_list'));

              planList.some((item, index) => {
                if (item['_id'] === tobeDelete['_id']) {
                  sign = index;
                  return true;
                }
              });

              // 若服务器同步完成，删除缓存里'待删除的计划'
              if (sign !== -1) {
                planList.splice(sign, 1);
                wx.setStorageSync('plan_list', JSON.stringify(planList));
              }
            })
        }
      }
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

    // 设置内容滚动组件高度
    setTimeout(() => {
      wx.createSelectorQuery()
        .select('#my-plan')
        .boundingClientRect(rect => {
          this.navigationBar = this.selectComponent('#navigationBar');
          const naviBarHeight = this.navigationBar.getHeight();
          this.data.scrollListHeight = rect.height - naviBarHeight - this.flootInput.data.height;
          this.setData({
            scrollListHeight: this.data.scrollListHeight
          })
        }).exec();
    }, 200);
  }
})
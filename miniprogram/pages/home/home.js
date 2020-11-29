// pages/home/home.js
import { getUserInfo } from '../../api/user';
import { getPlanList, addPlanList, updatePlanList } from '../../api/plan';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    onesRequest: 1,    // 页面一次的请求
    bannerTitle: '我的一天',
    planList: [],    // 所有计划列表
    todayPlan: {       // 我的一天
      progress: 0,
      percentage: 0,
      total: 0
    },
    userInfo: null,
    isShowLoginCase: 0,
  },

  /**
   * 获取缓存用户信息
   */
  getStorageUserInfo() {
    const storUserInfo = wx.getStorageSync('user_info');

    if (storUserInfo) {
      this.setData({
        userInfo: JSON.parse(storUserInfo)
      });
    }
  },

  /**
   * 获取缓存plan
   */
  getStoragePlan() {
    const storPlan = wx.getStorageSync('plan_list');

    if (storPlan) {
      this.data.planList = JSON.parse(storPlan);
      this.todayPlanInit();
    }
  },

  /**
   * 获取最新用户信息
   */
  getLatestUserInfo() {
    const openId = wx.getStorageSync('open_id');

    return new Promise(resolve => {
      getUserInfo(JSON.parse(openId))
        .then(res => {
          const data = res.result;

          resolve();
  
          if (data.code !== '1') {
            wx.showToast({ icon: 'none', title: data.message, });
            return;
          }

          const userInfo = this.data.userInfo;
          if (!userInfo || data.user.update_time > userInfo.update_time) {
            this.setData({
              userInfo: data.user
            });
  
            wx.setStorage({
              data: JSON.stringify(data.user),
              key: 'user_info',
            })
          }
        });
    });
  },

  /**
   * 获取最新planlist
   */
  getLatestPlanList() {
    const openId = wx.getStorageSync('open_id');

    return new Promise(resolve => {
      getPlanList(JSON.parse(openId))     // 获取云端数据和本地缓存比较 -> 渲染视图
        .then(res => {
          console.log(res);

          const data = res.result;
          const jsonPlanList = wx.getStorageSync('plan_list');

          if (data.code !== '1') {
            wx.showToast({
              icon: 'none',
              title: '获取计划失败',
            })
            return;
          }

          // console.log(jsonPlanList);
          if (!jsonPlanList) {
            this.data.planList = data.planList;

            wx.setStorageSync('plan_list', JSON.stringify(this.data.planList));
          } else {
            // 两端数据对比
            const loneList = [];     // 没有同步后台数据列表
            const latestList = [];   // 两端数据对比后合并最新的列表
            const stogPlanList = JSON.parse(jsonPlanList);

            // 遍历缓存和后端数据
            // 查找出[没有同步后端数据(没有_id)、两端对比之后最新数据、没有同步后端数据(有_id)]
            stogPlanList.forEach(m => {
              if (!m._id) {    // 数据没有同步后端
                loneList.push(m);
              } else {
                let isSame = 0;
                data.planList.forEach(item => {
                  if (m._id === item._id) {
                    isSame = 1;
                    const isLatest = m.update_time > item.update_time;
                    isLatest ? latestList.push(m) : latestList.push(item);
                  }
                });

                // 检测有_id字段，没有同步在后端的数据
                if (isSame === 0) loneList.push(m);
              }
            });

            // 更新视图层
            const dataList = loneList.concat(latestList);
            this.data.planList = dataList;
            resolve();

            // 最新数据更新到 缓存、后端
            wx.setStorageSync('plan_list', JSON.stringify(dataList));
            updatePlanList(latestList);
            
            // 存在未更新后端数据
            if (loneList.length > 0) {
              addPlanList(loneList)
                .then(res => {
                  console.log(res);
                  if (res.result.code !== '1') return;

                  const addList = res.result.add_list;
                  wx.setStorageSync('plan_list', JSON.stringify(addList.concat(latestList)));
                });
            }

          }
        })
    });
  },

  /**
   * 初始化被加入"我的一天"数据
   */
  todayPlanInit() {
    const list = [];

    this.data.planList.forEach(item => {
      if (item.organize === 'today') {
        list.push(item);
      }
    });

    let progress = 0;
    list.forEach(item => {
      if (item.is_finish) {
        progress++;
      }
    });

    if (list.length > 0) {
      this.setData({
        todayPlan: {
          progress, // 进度
          percentage: (progress / list.length).toFixed() * 100, // 百分比
          total: list.length
        }
      });
    }
  },



  /**
   * 进入日历
   */
  handleToIntoCalendar() {
    wx.navigateTo({
      url: '/pages/index/index',
    })
  },

  /**
   * 进入我的计划
   */
  handleToIntoMyPlan() {
    wx.navigateTo({
      url: '/pages/my-plan/my-plan?organize=today',
    })
  },

  /**
   * 进入*设置计划
   */
  handleToIntoPlan() {
    // wx.navigateTo({
    //   url: '/pages/plan/plan',
    // })
    wx.navigateTo({
      url: '/pages/my-plan/my-plan?organize=normal',
    })
  },



  onLoad() {

  },

  onReady() {
    // 从缓存获取用户信息
    this.getStorageUserInfo();
    // 从缓存获取plan数据
    this.getStoragePlan();


    const openId = wx.getStorageSync('open_id');

    // 登陆
    new Promise(resolve => {
      if (!openId)  {
        app.login().then(() => resolve());
      } else {
        resolve();
      }
    }).then(() => {
      // 获取最新plan
      // 获取最新用户信息
      Promise.all([this.getLatestPlanList(), this.getLatestUserInfo()])
        .then(() => {
          this.data.onesRequest = 0;
  
          this.todayPlanInit();
        })
    })
  },
  
  onShow () {
    if (this.data.onesRequest === 0) {
      // 从缓存获取plan
      this.getStoragePlan();
      // 从缓存获取用户信息
      this.getStorageUserInfo();
    }
  },
})
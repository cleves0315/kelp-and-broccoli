// pages/home/home.js
import { getUserInfo } from '../../api/user';
import { getPlanList, addPlanList, updatePlanList, deletePlanList, finishPlanList } from '../../api/plan';

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
    // 嘴巴模拟bo的声音
    bo: 'https://6f6e-on-line-1gqban3ba49e3d35-1302613116.tcb.qcloud.la/bo.m4a?sign=d4545d263f1a29a89b00b576c003bbb8&t=1612715654',
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
      // this.data.planList = JSON.parse(storPlan);
      this.setData({
        planList: JSON.parse(storPlan)
      })
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
          const data = res.result;
          const jsonPlanList = wx.getStorageSync('plan_list');

          if (data.code !== '1') {
            wx.showToast({
              icon: 'none',
              title: '获取计划失败',
            })
            return;
          }

          if (!jsonPlanList) {
            this.data.planList = data.planList;
            
            wx.setStorageSync('plan_list', JSON.stringify(this.data.planList));
          } else {
            // 两端数据对比
            const loneList = [];     // 没有同步后台数据列表
            const latestList = [];   // 汇集没有同步后台的计划
            const tobeFinList = [];  // 没有同步完成进度集合
            const tobeDelList = [];  // 待删除没有及时同步后台集合
            const stogPlanList = JSON.parse(jsonPlanList);

            // 找出未更新数据
            stogPlanList.forEach(item => {
              if (!item['_id']) {
                item.open_id = JSON.parse(openId);
                loneList.push(item);
              } else {
                if (item['tobeDeleted'] === 1) {
                  tobeDelList.push(item['_id']);
                } else {
                  if (item['tobeFinish'] === 1) {
                    tobeFinList.push(item);
                  } else if (item['notUpdated'] === 1) {
                    latestList.push(item);
                  }
                }
              }
            });

            // 更新数据
            latestList.forEach(item => {
              data.planList.forEach((m, i) => {
                if (m['_id'] === item['_id']) {
                  data.planList[i] = item;
                }
              });
            })

            // 更新视图层
            const dataList = data.planList.concat(loneList);
            // this.data.planList = dataList;
            this.setData({
              planList: dataList
            })
            resolve();


            // 更新目前最新数据到缓存
            wx.setStorageSync('plan_list', JSON.stringify(dataList));
            
            
            // 对未更新数据做同步处理👇
            const latestPromise = new Promise(resolve => {
              // 同步未更新到后端部分的数据
              if (latestList.length > 0) {
                updatePlanList(latestList)
                  .then(res => {
                    if (res.result.code === '1') {
                      resolve(res.result.data);
                    } else {
                      resolve([]);
                    }
                  });
              } else {
                resolve([]);
              }
            });

            const tobeFinPromise = new Promise(resolve => {
              if (tobeFinList.length > 0) {
                finishPlanList(tobeFinList)
                  .then((res) => {
                    resolve(res.result.data);
                  })
              } else {
                resolve({});
              }
            });

            const tobeDelPromise = new Promise(resolve => {
              // 同步待删除数据
              if (tobeDelList.length > 0) {
                deletePlanList(tobeDelList)
                  .then(() => {  
                    resolve(tobeDelList);
                  });
              } else {
                resolve([]);
              }
            });

            const lonePromise = new Promise(resolve => {
              // 存在未更新后端数据
              if (loneList.length > 0) {
                addPlanList(loneList)
                  .then(res => {
                    if (res.result.code === '1') {
                      resolve(res.result.add_list);
                    } else {
                      resolve([]);
                    }
                  });
              } else {
                resolve([]);
              }
            });
            
            Promise.all([latestPromise, tobeDelPromise, lonePromise, tobeFinPromise])
              .then(res => {
                const latestResult = res[0];
                const tobeDelResult = res[1];
                const loneListResult = res[2];
                const tobeFinResult = res[3];
                const planList = JSON.parse(wx.getStorageSync('plan_list'));

                
                // 校验对比请求后的数据，进行替换更新

                // 删除tobeDelted字段数据
                // 根据本次ajax参数 tobeDelResult
                tobeDelResult.forEach(item => {
                  for (let i = 0; i < planList.length; i++) {
                    if (item === planList[i]['_id']) {
                      planList.splice(i, 1);   // 数据替换更新
                      break;
                    }
                  }
                });

                // 删除tempId字段数据
                // 根据本次ajax参数 loneList
                if (loneListResult.length > 0) {
                  loneList.forEach(item => {
                    for (let i = 0; i < planList.length; i++) {
                      if (item['tempId'] === planList[i]['tempId']) {
                        planList.splice(i, 1);
                        break;
                      }
                    }
                  })
                }

                // tobeFinish字段
                // updated_list: 更新成功的数据
                // create_list: 有'重复'功能 更新后新生成的数据
                if (JSON.stringify(tobeFinResult) !== '{}') {
                  tobeFinResult.updated_list
                    .forEach(item => {
                      for (let i = 0; i < planList.length; i++) {
                        if (item['_id'] === planList[i]['_id']) {
                          planList.splice(i, 1);   // 数据替换更新
                          break;
                        }
                      }
                    })
                  tobeFinResult.create_list
                    .forEach(item => {
                      planList.push(item);
                    });
                }

                // 更新notUpdated字段数据
                // 根据本次ajax参数 latestResult
                latestResult.forEach(item => {
                  for (let i = 0; i < planList.length; i++) {
                    if (item['_id'] === planList[i]['_id']) {
                      planList[i] = item;
                      break;
                    }
                  }
                });

                // 新增更新后的 loneList 数据
                loneListResult.forEach(item => {
                  planList.push(item);
                });

                wx.setStorageSync('plan_list', JSON.stringify(planList));
              });
          }
        })
    });
  },

  /**
   * 初始化被加入"我的一天"数据
   * @todo 对planlist列表做运算渲染前端进度条
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
   * 点击logo，播放bo的声音
   */
  handleLogoPlay() {
    if (this.playDelay) return;
    this.playDelay = 1;

    if (!this.innerAudioContext.paused) {
      this.innerAudioContext.stop();
    }
    this.innerAudioContext.play();
    setTimeout(() => {
      this.playDelay = 0;
    }, 200);
  },

  /**
   * 进入日历
   */
  handleToIntoCalendar() {
    // wx.navigateTo({
    //   url: '/pages/index/index',
    // })
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
    // 初始化音频
    this.innerAudioContext = wx.createInnerAudioContext();
    this.innerAudioContext.src = this.data.bo;
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})
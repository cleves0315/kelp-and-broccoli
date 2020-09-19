// pages/index/index.js
import { initMonthCalendar } from '../../utils/util';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    clendarCurrent: 0,           // 当前日历滑块的current
    thisCalendarYear: 0,         // 日历标题 -> 当前日历年月份
    thisCalendarMonth: 0,        // 日历标题 -> 当前日历年月份
    calendar: [],                // 今年的日历格式数据
  },

  /**
   * 设置当前日历标题 -- 展示的当前年月
   */
  // handleToSetThisCalendarMonth(date = new Date()) {
  //   const y = date.getFullYear();
  //   const m = date.getMonth() + 1;

  //   this.setData({
  //     thisCalendarMonth: y + ' 年 ' + m + ' 月 '
  //   })
  // },

  /**
   * 初始化年分日历数据
   */
  handleToInitYearCalendar(date = new Date()) {
    const arr = [];
    let d = '';

    for (let i = 0; i < 12; i++) {
      d = date.getFullYear() + '-0' + (i + 1) + '-01';

      const n = initMonthCalendar(d);
      
      arr.push(n);
    }

    return arr;
  },


  /**
   * 切换日历组件
   * @callback swiper组件 change 回调
   */
  handleToChaSwpCalendar(e) {
    console.log(e.detail.current)
    const current = e.detail.current;
    const lastCurrent = this.data.clendarCurrent;
    const difCurrent = current - lastCurrent;        // 本次滑块移动的格数 (左划是负数)

    this.data.clendarCurrent = current;

    // 更具滑动的格数 加减当前月份
    this.setData({
      // thisCalendarYear: new Date().getFullYear,
      thisCalendarMonth: this.data.thisCalendarMonth + difCurrent
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 设置当前日历标题
    this.setData({
      clendarCurrent: new Date().getMonth(),
      thisCalendarYear: new Date().getFullYear(),
      thisCalendarMonth: new Date().getMonth() + 1,
    })

    // 初始化当前年份日历格式
    this.setData({
      calendar: this.handleToInitYearCalendar()
    });
  }
})
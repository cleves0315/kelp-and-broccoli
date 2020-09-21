// pages/index/components/calendar/calendar.js
import { initCalendar } from './utils/calendar.js';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // curDate: 
  },

  /**
   * 组件的初始数据
   */
  data: {
    weekLineTxt: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    dayActive: 0,
    thisCalendarYear: 0,       // 日历标题 -> 显示当前年月份
    thisCalendarMonth: 0,      // 日历标题 -> 显示当前年月份
    calendar: [],              // 当年日历数据
    clendarCurrent: 0,         // 控制当前滑块组件显示的索引，根据月份显示当前月份日历表
    lastCurrent: 0,            // 记录上一次滑块的索引值 (用来判断本次滑动的方向)
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 初始化日历数据、日历标题
     */
    initCalendarData() {
      const y = new Date().getFullYear();
      const m = new Date().getMonth();
      const arr = [];

      // 获取这个月、上个月、下个月的日历表
      for (let i = 0; i < 3; i++) {
        arr.push(initCalendar('month', y + '-' + (m + i) + '-' + '01')[0]);
      }

      this.setData({
        thisCalendarYear: new Date().getFullYear(),      // 初始标题年份
        thisCalendarMonth: new Date().getMonth() + 1,    // 初始标题月份
        clendarCurrent: 1,                               // 初始滑块的位置（这里默认加载3个月日历数据，当前的月份排在中间）
        calendar: arr,                        // 获取当前时间 年日历排版
      })
      this.data.lastCurrent = this.data.clendarCurrent;       // 记录这次的滑块位置
    },

    /**
     * 切换滑块事件
     * @callback
     */
    handleToChangeCalendar(e) {
      let current = e.detail.current;
      const difCent = current - this.data.lastCurrent;    // 本次滑动的 swiper-item 数（向左为负）
      let currentY = this.data.thisCalendarYear;        // 当前标题年份
      let currentM = this.data.thisCalendarMonth;       // 当前标题月份
      const calendar = this.data.calendar;

      // console.log(difCent)

      currentM += difCent;

      // 滑块日历 跨年滑动，则把年份值更改
      if ((currentM + difCent) < 1) {
        currentY -= 1;
        currentM = 12;
      } else if ((currentM + difCent) > 12) {
        currentY += 1;
        currentM = 1;
      }

      this.setData({
        thisCalendarYear: currentY,        // 更改标题中的年份
        thisCalendarMonth: currentM,       // 更改标题中的月份
      })

      

      // return;
      // 如果滑倒了最左边，加载日历表最前端的上个月数据
      if (difCent < 0 && current == 0) {
        calendar.unshift(initCalendar('month', (currentY - 1) + '-' + '12' + '-' + '1')[0]);
        current += 1;
        this.setData({
          // lastCurrent: current,
          calendar
        })
      }

      // 上一次是在12月，本次还向右滑动
      if (this.data.lastCurrent == 11 && difCent > 0) {
        calendar.push(initCalendar('month', (currentY + 1) + '-' + '1' + '-' + '1')[0]);
        this.setData({
          calendar
        })
      }
      
      this.triggerEvent('chaSwpCalendar', { current })
      
      this.data.lastCurrent = current;
    },
  },


  attached() {
    // 初始化日历数据
    this.initCalendarData();
  }
})

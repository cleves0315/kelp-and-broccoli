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
     * 切换滑块事件
     * @callback
     */
    handleToChangeCalendar(e) {
      const current = e.detail.current;
      const difCent = current - this.data.lastCurrent;    // 本次滑动的 swiper-item 数（向左为负）

      // 上一次是在1月，本次还向左滑动
      if (this.data.lastCurrent == 0 && difCent < 0) {

      }

      // 上一次是在12月，本次还向右滑动
      if (this.data.lastCurrent == 11 && difCent > 0) {

      }

      // console.log(difCent)

      this.setData({
        thisCalendarMonth: this.data.thisCalendarMonth + difCent,       // 更改标题中的月份
      })

      
      this.triggerEvent('chaSwpCalendar', { current })
      
      this.data.lastCurrent = current;
    },
  },


  attached() {
    this.setData({
      thisCalendarYear: new Date().getFullYear(),            // 设置标题年份
      thisCalendarMonth: new Date().getMonth() + 1,          // 设置标题月份
      clendarCurrent: new Date().getMonth(),                 // 设置滑块的位置
      calendar: initCalendar(),                         // 获取当前时间 年日历排版
    })
    this.data.lastCurrent = this.data.clendarCurrent;       // 记录这次的滑块位置
  }
})

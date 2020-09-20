// pages/index/components/calendar/calendar.js
import { initMonthCalendar } from './utils/calendar.js';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // clendarCurrent: {               // 当前日历滑块的current
    //   type: Number,
    //   value: 0
    // },
    // thisCalendarYear: {              // 日历标题 -> 显示当前年月份
    //   type: Number,
    //   value: 0
    // },
    // thisCalendarMonth: {              // 日历标题 -> 显示当前年月份
    //   type: Number,
    //   value: 0
    // },
    // calendar: {               // 当年日历数据
    //   type: Array,
    //   value: []
    // },
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

      console.log(difCent)

      this.setData({
        thisCalendarMonth: this.data.thisCalendarMonth + difCent
      })

      
      this.triggerEvent('chaSwpCalendar', { current })
      
      this.data.lastCurrent = current;
    },
  },


  attached() {
    this.setData({
      thisCalendarYear: new Date().getFullYear(),
      thisCalendarMonth: new Date().getMonth() + 1,
      clendarCurrent: new Date().getMonth(),
      calendar: initMonthCalendar(),
    })
    this.data.lastCurrent = this.data.clendarCurrent;
  }
})
